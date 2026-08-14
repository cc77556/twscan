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


def main():
    jobs = {
        "attention-stocks.json": fetch_attention,
        "disposition-stocks.json": fetch_disposition,
        "dividends.json": fetch_dividends,
    }
    failed = False
    for fname, fn in jobs.items():
        try:
            data = fn()
            n = len(data["stocks"])
            if n == 0 and fname != "disposition-stocks.json":
                # 注意股/除權息空表極不尋常（處置股可為 0 屬正常），寧可不寫
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
