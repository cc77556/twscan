#!/usr/bin/env python3
"""Refresh twscan static data JSONs from official TWSE endpoints.

Regenerates (schema defined in src/data/config.ts — keep in sync):
  - src/data/attention-stocks.json   (注意股票, TWSE rwd notice, 近 5 個營業日)
  - src/data/disposition-stocks.json (處置股票, TWSE rwd punish, 當日仍在處置中)
  - src/data/dividends.json          (除權除息預告, TWSE rwd TWT48U 快照)

Endpoints and their quirks are the ones already battle-tested by the
~/dev/apify-actors suite (taiwan-stock-alerts / taiwan-dividend-calendar):
  - rwd notice/punish take startDate/endDate (YYYYMMDD); punish filters by
    "處置期間 overlaps query range", so a single-day query = currently disposed
  - fields embed HTML (<font>, <a>, <br>) that must be stripped
  - dates are 民國年 (115/08/11 or 115年08月14日)
  - TWCA root cert lacks Subject Key Identifier → clear VERIFY_X509_STRICT
    on Python 3.13+/OpenSSL 3.x (cert chain is still fully verified)

Run:  python3 scripts/refresh_data.py   (from repo root or anywhere)
Exit: 0 on success (whether or not data changed), 1 on any fetch/parse error —
      the wrapper only commits when git sees a diff, so failures never publish.
"""
import json
import re
import ssl
import sys
import urllib.request
from datetime import date, datetime, timedelta
from pathlib import Path
from zoneinfo import ZoneInfo

REPO = Path(__file__).resolve().parent.parent
DATA = REPO / "src" / "data"
TPE = ZoneInfo("Asia/Taipei")

CTX = ssl.create_default_context()
CTX.verify_flags &= ~ssl.VERIFY_X509_STRICT

TAG_RE = re.compile(r"<[^>]+>")


def get_json(url: str) -> dict:
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 (twscan data refresh)"})
    with urllib.request.urlopen(req, timeout=30, context=CTX) as r:
        return json.load(r)


def strip_html(s: str) -> str:
    return TAG_RE.sub("", s or "").strip()


def roc_to_iso(s: str) -> str:
    """'115/08/11', '115.08.13' or '115年08月14日' → '2026-08-11'. Raises on garbage."""
    m = re.match(r"(\d{2,3})[/.年](\d{1,2})[/.月](\d{1,2})", s.strip())
    if not m:
        raise ValueError(f"unparseable ROC date: {s!r}")
    y, mo, d = int(m.group(1)) + 1911, int(m.group(2)), int(m.group(3))
    return f"{y:04d}-{mo:02d}-{d:02d}"


def to_num(s, default=None):
    s = str(s).replace(",", "").strip()
    if s in ("", "-", "--", "N/A"):
        return default
    try:
        return float(s)
    except ValueError:
        return default


def now_meta():
    now = datetime.now(TPE)
    return now.strftime("%Y-%m-%d"), now.strftime("%Y-%m-%dT%H:%M:%S+08:00")


def fetch_attention() -> dict:
    today = date.today()
    start = (today - timedelta(days=7)).strftime("%Y%m%d")
    end = today.strftime("%Y%m%d")
    raw = get_json(
        f"https://www.twse.com.tw/rwd/zh/announcement/notice?startDate={start}&endDate={end}&response=json")
    if raw.get("stat") != "OK":
        raise RuntimeError(f"notice stat={raw.get('stat')}")
    fields = raw["fields"]
    idx = {name: i for i, name in enumerate(fields)}
    # 一檔多列（每日一列）；保留最新一列，count = 區間內列數（等於官方累計次數語意）
    per_code: dict[str, list] = {}
    for row in raw.get("data", []):
        code = strip_html(str(row[idx["證券代號"]]))
        per_code.setdefault(code, []).append(row)
    stocks = []
    all_dates = []
    for code, rows in per_code.items():
        rows.sort(key=lambda r: roc_to_iso(strip_html(str(r[idx["日期"]]))))
        latest = rows[-1]
        d_iso = roc_to_iso(strip_html(str(latest[idx["日期"]])))
        all_dates.extend(roc_to_iso(strip_html(str(r[idx["日期"]]))) for r in rows)
        price = to_num(latest[idx["收盤價"]])
        stocks.append({
            "code": code,
            "name": strip_html(str(latest[idx["證券名稱"]])),
            "count": len(rows),
            "reason": strip_html(str(latest[idx["注意交易資訊"]])),
            "date": d_iso,
            "price": price if price is not None else "-",
            "pe": to_num(latest[idx["本益比"]]),
        })
    stocks.sort(key=lambda s: (s["date"], s["code"]), reverse=True)
    last_updated, fetched_at = now_meta()
    return {
        "title": "注意股票",
        "lastUpdated": last_updated,
        "dateRange": f"{min(all_dates)} ~ {max(all_dates)}" if all_dates else "",
        "source": "TWSE",
        "fetchedAt": fetched_at,
        "isSampleData": False,
        "stocks": stocks,
    }


def fetch_disposition() -> dict:
    today = date.today().strftime("%Y%m%d")
    raw = get_json(
        f"https://www.twse.com.tw/rwd/zh/announcement/punish?startDate={today}&endDate={today}&response=json")
    if raw.get("stat") != "OK":
        raise RuntimeError(f"punish stat={raw.get('stat')}")
    idx = {name: i for i, name in enumerate(raw["fields"])}
    stocks = []
    for row in raw.get("data", []):
        code = strip_html(str(row[idx["證券代號"]]))
        if len(code) > 5:  # 排除權證（6 碼），頁面語意是「處置股票」
            continue
        content = strip_html(str(row[idx["處置內容"]]))
        # 原因：處置內容的「１處置原因：...」段；措施：優先抓人工管制描述
        m = re.search(r"[1１]\s*處置原因[:：]\s*(.*?)(?=[\n2２]|$)", content, re.S)
        reason = (m.group(1).strip() if m else content).strip()
        mm = re.search(r"(人工管制之?撮合[^\n ａｂｃ]*)", content)
        measure = "人工管制撮合" if mm else strip_html(str(row[idx["處置措施"]]))
        stocks.append({
            "code": code,
            "name": strip_html(str(row[idx["證券名稱"]])),
            "publishDate": roc_to_iso(strip_html(str(row[idx["公布日期"]]))),
            "count": int(to_num(row[idx["累計"]], 0) or 0),
            "condition": strip_html(str(row[idx["處置條件"]])),
            "period": strip_html(str(row[idx["處置起迄時間"]])),
            "measure": measure,
            "reason": reason,
        })
    stocks.sort(key=lambda s: (s["publishDate"], s["code"]), reverse=True)
    last_updated, fetched_at = now_meta()
    return {
        "title": "處置股票",
        "lastUpdated": last_updated,
        "source": "TWSE",
        "fetchedAt": fetched_at,
        "isSampleData": False,
        "stocks": stocks,
    }


def fetch_dividends() -> dict:
    raw = get_json("https://www.twse.com.tw/rwd/zh/exRight/TWT48U?response=json")
    if raw.get("stat") != "OK":
        raise RuntimeError(f"TWT48U stat={raw.get('stat')}")
    idx = {name: i for i, name in enumerate(raw["fields"])}
    # 殖利率分母：官方收盤價（STOCK_DAY_ALL 含個股與 ETF）
    closes = {}
    try:
        for r in get_json("https://openapi.twse.com.tw/v1/exchangeReport/STOCK_DAY_ALL"):
            c = to_num(r.get("ClosingPrice"))
            if c:
                closes[r.get("Code")] = c
    except Exception as e:
        print(f"WARN: STOCK_DAY_ALL unavailable ({e}); yields will be null", file=sys.stderr)
    stocks = []
    for row in raw.get("data", []):
        code = strip_html(str(row[idx["股票代號"]]))
        cash = to_num(row[idx["現金股利"]], 0.0) or 0.0
        stock_ratio = to_num(row[idx["無償配股率"]], 0.0) or 0.0
        close = closes.get(code)
        # 事件殖利率 = 本次現金股利 ÷ 最近收盤價（官方值計算，非年度殖利率）
        y = round(cash / close * 100, 2) if (close and cash) else None
        stocks.append({
            "code": code,
            "name": strip_html(str(row[idx["名稱"]])),
            "exDate": roc_to_iso(strip_html(str(row[idx["除權除息日期"]]))),
            "cashDividend": cash,
            "stockDividend": stock_ratio,
            "dividendYield": y,
        })
    stocks.sort(key=lambda s: (s["exDate"], s["code"]))
    last_updated, fetched_at = now_meta()
    return {
        "title": "除權除息預告",
        "lastUpdated": last_updated,
        "fetchedAt": fetched_at,
        "source": "TWSE（TWT48U 除權除息預告表）",
        "isSampleData": False,
        "disclaimer": "殖利率為本次現金股利除以最近收盤價之單次事件殖利率，非年化值；股票股利欄為無償配股率（新股/舊股）。",
        "note": "資料每日自動更新自台灣證券交易所公開端點。",
        "stocks": stocks,
    }


# ---------------------------------------------------------------------------
# market-data.json（首頁儀表板）
# ---------------------------------------------------------------------------

YAHOO_HDRS = {"User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36"}
CNN_HDRS = {
    **YAHOO_HDRS,
    "Accept": "application/json, text/plain, */*",
    "Origin": "https://www.cnn.com",
    "Referer": "https://www.cnn.com/markets/fear-and-greed",
}
# (name, symbol, flag) — 與舊版 market-data.json 一致
INDEX_LIST = [
    ("台灣加權", "^TWII", "🇹🇼"), ("S&P 500", "^GSPC", "🇺🇸"),
    ("NASDAQ 100", "^NDX", "🇺🇸"), ("道瓊工業", "^DJI", "🇺🇸"),
    ("費半指數", "^SOX", "🇺🇸"), ("日經 225", "^N225", "🇯🇵"),
    ("恆生指數", "^HSI", "🇭🇰"), ("USD/TWD", "USDTWD=X", "💱"),
    ("美元指數", "DX-Y.NYB", "💵"), ("黃金", "GC=F", "🥇"),
    ("原油 WTI", "CL=F", "🛢️"), ("比特幣", "BTC-USD", "₿"),
]
FG_LABELS = {"extreme fear": "極端恐懼", "fear": "恐懼", "neutral": "中性",
             "greed": "貪婪", "extreme greed": "極端貪婪"}


def _get_hdrs(url, hdrs):
    req = urllib.request.Request(url, headers=hdrs)
    with urllib.request.urlopen(req, timeout=20, context=CTX) as r:
        return json.load(r)


def _yahoo_quote(symbol, rng="5d"):
    """Return (price, prev_close, closes[]) from Yahoo chart API."""
    from urllib.parse import quote
    d = _get_hdrs(
        f"https://query1.finance.yahoo.com/v8/finance/chart/{quote(symbol)}?range={rng}&interval=1d",
        YAHOO_HDRS)
    res = d["chart"]["result"][0]
    meta = res["meta"]
    closes = [c for c in res["indicators"]["quote"][0].get("close", []) if c is not None]
    return meta["regularMarketPrice"], meta.get("chartPreviousClose"), closes


def _rsi14(closes):
    if len(closes) < 15:
        return None
    gains = losses = 0.0
    # Wilder smoothing 初始化 + 遞推
    for i in range(1, 15):
        diff = closes[i] - closes[i - 1]
        gains += max(diff, 0)
        losses += max(-diff, 0)
    ag, al = gains / 14, losses / 14
    for i in range(15, len(closes)):
        diff = closes[i] - closes[i - 1]
        ag = (ag * 13 + max(diff, 0)) / 14
        al = (al * 13 + max(-diff, 0)) / 14
    if al == 0:
        return 100.0
    return round(100 - 100 / (1 + ag / al), 1)


def fetch_market() -> dict:
    old = json.loads((DATA / "market-data.json").read_text())

    # --- indices（核心，失敗即整檔不更新）---
    import time
    indices = []
    for name, sym, flag in INDEX_LIST:
        price, prev, _ = _yahoo_quote(sym)
        chg = round(price - prev, 2) if prev else 0.0
        pct = round(chg / prev * 100, 2) if prev else 0.0
        indices.append({"name": name, "symbol": sym, "value": round(price, 2),
                        "change": chg, "changePercent": pct, "flag": flag})
        time.sleep(0.4)

    # --- sentiment：CNN F&G（可降級沿用舊值）+ VIX ---
    try:
        fg_raw = _get_hdrs(
            "https://production.dataviz.cnn.io/index/fearandgreed/graphdata", CNN_HDRS)["fear_and_greed"]
        fear_greed = {
            "value": round(fg_raw["score"]),
            "previous": round(fg_raw["previous_close"]),
            "label": FG_LABELS.get(fg_raw.get("rating", "").lower(), fg_raw.get("rating", "")),
            "source": "CNN Fear & Greed Index",
            "sourceUrl": "https://www.cnn.com/markets/fear-and-greed",
        }
    except Exception as e:
        print(f"WARN: CNN F&G unavailable ({e}); keeping previous value", file=sys.stderr)
        fear_greed = old["sentiment"]["fearGreed"]
    vix_price, vix_prev, _ = _yahoo_quote("^VIX")
    vix = {"value": round(vix_price, 2), "previous": round(vix_prev, 2),
           "change": round(vix_price - vix_prev, 2),
           "changePercent": round((vix_price - vix_prev) / vix_prev * 100, 2),
           "source": "Yahoo Finance", "sourceUrl": "https://finance.yahoo.com/quote/%5EVIX/"}

    # --- thermometer：以 ^GSPC 1 年日線計算 ---
    spx_price, _, spx_closes = _yahoo_quote("^GSPC", rng="1y")
    rsi = _rsi14(spx_closes)
    ma200 = sum(spx_closes[-200:]) / min(len(spx_closes), 200)
    ma_dist = round((spx_price / ma200 - 1) * 100, 1)
    hi52 = max(spx_closes)
    drawdown = round((spx_price / hi52 - 1) * 100, 1)
    signals = [
        {"name": "F&G", "value": fear_greed["value"], "threshold": "<25",
         "triggered": fear_greed["value"] < 25, "desc": "恐懼貪婪指數低於 25"},
        {"name": "VIX", "value": round(vix_price, 1), "threshold": ">28",
         "triggered": vix_price > 28, "desc": "波動率指數高於 28"},
        {"name": "RSI", "value": rsi if rsi is not None else 0, "threshold": "<35",
         "triggered": bool(rsi is not None and rsi < 35), "desc": "S&P 500 RSI(14) 低於 35"},
        {"name": "200MA", "value": ma_dist, "unit": "%", "threshold": "<-5%",
         "triggered": ma_dist < -5, "desc": "距 200 日均線跌幅超過 5%"},
        {"name": "回撤", "value": drawdown, "unit": "%", "threshold": "<-12%",
         "triggered": drawdown < -12, "desc": "從 52 週高點回撤超過 12%"},
    ]

    # --- macro：^TNX/^IRX（×10 報價需除回）+ NY Fed EFFR ---
    def _yield_of(sym):
        v, _, _ = _yahoo_quote(sym)
        return round(v / 10, 2) if v > 20 else round(v, 2)
    us10y = _yield_of("^TNX")
    us13w = _yield_of("^IRX")
    spread = round(us10y - us13w, 2)
    try:
        effr_raw = _get_hdrs(
            "https://markets.newyorkfed.org/api/rates/unsecured/effr/last/1.json", YAHOO_HDRS)
        fed_rate = float(effr_raw["refRates"][0]["percentRate"])
    except Exception as e:
        print(f"WARN: EFFR unavailable ({e}); keeping previous value", file=sys.stderr)
        fed_rate = old["macro"]["fedRate"]["value"]
    macro = {
        "us10y": {"label": "美債 10Y 殖利率", "value": us10y, "unit": "%"},
        "us13w": {"label": "13W T-bill 殖利率", "value": us13w, "unit": "%"},
        "yieldSpread": {"label": "10Y−13W 利差", "value": spread, "unit": "%",
                        "status": "正常" if spread >= 0 else "倒掛"},
        "fedRate": {"label": "Fed 基準利率", "value": fed_rate, "unit": "%", "note": "EFFR 近似"},
    }

    # --- institutional：TWSE 三大法人 BFI82U ---
    bfi = get_json("https://www.twse.com.tw/rwd/zh/fund/BFI82U?response=json")
    if bfi.get("stat") != "OK":
        raise RuntimeError(f"BFI82U stat={bfi.get('stat')}")
    net = {strip_html(str(r[0])): to_num(r[3], 0.0) for r in bfi["data"]}
    to_yi = lambda v: round(v / 1e8, 2)
    foreign_net = to_yi((net.get("外資及陸資(不含外資自營商)", 0) or 0) + (net.get("外資自營商", 0) or 0))
    trust_net = to_yi(net.get("投信", 0) or 0)
    dealer_net = to_yi((net.get("自營商(自行買賣)", 0) or 0) + (net.get("自營商(避險)", 0) or 0))
    bfi_date = bfi.get("date", "")
    inst_date = f"{bfi_date[:4]}-{bfi_date[4:6]}-{bfi_date[6:]}" if len(bfi_date) == 8 else bfi_date
    institutional = {
        "date": inst_date,
        "foreign": {"label": "外資", "value": foreign_net, "unit": "億"},
        "investment": {"label": "投信", "value": trust_net, "unit": "億"},
        "dealer": {"label": "自營商", "value": dealer_net, "unit": "億"},
        "source": "TWSE 證交所",
        "sourceUrl": "https://www.twse.com.tw/zh/trading/foreign/bfi82u.html",
    }

    # --- synthesis：規則系統（頁面已有免責聲明）---
    fg_v = fear_greed["value"]
    if fg_v <= 25:
        sent_check = {"label": "情緒", "pass": False, "note": "極端恐懼"}
    elif fg_v >= 75:
        sent_check = {"label": "情緒", "pass": False, "note": "極端貪婪"}
    else:
        sent_check = {"label": "情緒", "pass": True, "note": fear_greed["label"]}
    if spread < 0:
        macro_check = {"label": "總經", "pass": False, "note": "殖利率曲線倒掛"}
    elif fed_rate >= 3.5:
        macro_check = {"label": "總經", "pass": None, "note": "高利率環境"}
    else:
        macro_check = {"label": "總經", "pass": True, "note": "利率環境中性"}
    if (rsi is not None and rsi < 35) or ma_dist < -5:
        tech_check = {"label": "技術", "pass": False, "note": "趨勢偏弱"}
    elif rsi is not None and rsi > 70:
        tech_check = {"label": "技術", "pass": None, "note": "短線過熱"}
    else:
        tech_check = {"label": "技術", "pass": True, "note": "趨勢健康"}
    fails = sum(1 for c in (sent_check, macro_check, tech_check) if c["pass"] is False)
    if fails >= 2:
        verdict = "保守防禦"
    elif fails == 1:
        verdict = "審慎觀望"
    elif any(c["pass"] is None for c in (sent_check, macro_check, tech_check)):
        verdict = "中性偏多"
    else:
        verdict = "偏多操作"
    summary = (f"F&G {fg_v}（{fear_greed['label']}），RSI {rsi}，EFFR {fed_rate}%，"
               f"殖利率曲線{macro['yieldSpread']['status']}。規則綜合判定：{verdict}。")

    last_updated, fetched_at = now_meta()
    return {
        "title": "全球市場總覽",
        "lastUpdated": last_updated,
        "fetchedAt": fetched_at,
        "source": "Yahoo Finance / CNN / TWSE",
        "sentiment": {"fearGreed": fear_greed, "vix": vix},
        "thermometer": {"signals": signals,
                        "triggeredCount": sum(1 for s in signals if s["triggered"]),
                        "total": len(signals), "source": "Yahoo Finance / CNN",
                        "sourceUrl": "https://finance.yahoo.com/quote/%5EGSPC/"},
        "indices": indices,
        "indicesSource": "Yahoo Finance",
        "indicesSourceUrl": "https://finance.yahoo.com/markets/",
        "macro": macro,
        "macroSource": "U.S. Treasury / Fed",
        "macroSourceUrl": "https://finance.yahoo.com/markets/bonds/",
        "institutional": institutional,
        "synthesis": {"verdict": verdict,
                      "checks": {"macro": macro_check, "sentiment": sent_check, "technical": tech_check},
                      "summary": summary,
                      "disclaimer": "規則系統分析，僅供參考，不構成投資建議"},
    }


def main():
    jobs = {
        "attention-stocks.json": fetch_attention,
        "disposition-stocks.json": fetch_disposition,
        "dividends.json": fetch_dividends,
        "market-data.json": fetch_market,
    }
    failed = False
    for fname, fn in jobs.items():
        try:
            data = fn()
            n = len(data.get("stocks", data.get("indices", [])))
            if n == 0 and fname != "disposition-stocks.json":
                # 注意股/除權息/指數空表極不尋常（處置股可為 0 屬正常），寧可不寫
                print(f"SKIP {fname}: 0 rows (suspicious, keeping old file)", file=sys.stderr)
                failed = True
                continue
            (DATA / fname).write_text(
                json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
            print(f"OK   {fname}: {n} rows")
        except Exception as e:
            print(f"FAIL {fname}: {e}", file=sys.stderr)
            failed = True
    sys.exit(1 if failed else 0)


if __name__ == "__main__":
    main()
