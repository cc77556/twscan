import type { Metadata } from "next";
import ETFCompareClient from "./client";

export const metadata: Metadata = {
  title: "ETF 比較 — 0050 / 0056 / 00878 / 00981A / 006208",
  description:
    "台股熱門 ETF 比較表：0050、0056、00878、00981A、006208 的費用率、殖利率、規模、前五大持股一覽。",
};

// Inline sample data for popular ETFs
const etfCompareData = [
  {
    code: "0050",
    name: "元大台灣50",
    price: 182.5,
    yield: 2.15,
    expenseRatio: 0.43,
    aum: "3,280 億",
    topHoldings: "台積電(47.8%), 鴻海(4.9%), 聯發科(4.5%), 台達電(2.3%), 廣達(2.1%)",
  },
  {
    code: "0056",
    name: "元大高股息",
    price: 37.8,
    yield: 5.82,
    expenseRatio: 0.74,
    aum: "2,840 億",
    topHoldings: "長榮(3.2%), 聯詠(2.8%), 廣達(2.6%), 英業達(2.5%), 緯創(2.4%)",
  },
  {
    code: "00878",
    name: "國泰永續高股息",
    price: 22.4,
    yield: 5.45,
    expenseRatio: 0.57,
    aum: "2,650 億",
    topHoldings: "華碩(3.1%), 仁寶(2.9%), 大聯大(2.7%), 英業達(2.5%), 光寶科(2.4%)",
  },
  {
    code: "00981A",
    name: "野村臺灣創新科技50",
    price: 15.2,
    yield: 1.85,
    expenseRatio: 0.40,
    aum: "120 億",
    topHoldings: "台積電(8.8%), 台光電(7.5%), 台達電(7.0%), 金像電(6.1%), 旺矽(5.8%)",
  },
  {
    code: "006208",
    name: "富邦台50",
    price: 95.6,
    yield: 2.08,
    expenseRatio: 0.24,
    aum: "580 億",
    topHoldings: "台積電(47.5%), 鴻海(4.8%), 聯發科(4.4%), 台達電(2.2%), 廣達(2.0%)",
  },
];

export default function ETFComparePage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold md:text-3xl">ETF 比較</h1>
        <p className="mt-2 text-sm text-tw-dark-muted dark:text-tw-dark-muted text-tw-light-muted">
          熱門台股 ETF 費用率、殖利率、規模比較（參考數據，非即時報價）
        </p>
      </div>
      <ETFCompareClient data={etfCompareData} />
    </div>
  );
}
