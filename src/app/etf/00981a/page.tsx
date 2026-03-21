import type { Metadata } from "next";
import { etf00981a } from "@/data/config";
import ETF00981AClient from "./client";
import Disclaimer from "@/components/Disclaimer";

export const metadata: Metadata = {
  title: "00981A 野村臺灣創新科技50 ETF 持股明細",
  description:
    "00981A 野村臺灣創新科技50 ETF 最新持股比重、成分股名單，含台積電、台光電、台達電等科技股權重排名。",
};

export default function ETF00981APage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <Disclaimer />
      <div className="mb-6">
        <h1 className="text-2xl font-bold md:text-3xl">
          {etf00981a.etfCode} {etf00981a.etfName}
        </h1>
        <p className="mt-2 text-sm text-tw-dark-muted dark:text-tw-dark-muted text-tw-light-muted">
          持股明細 / 最後更新：{etf00981a.lastUpdated}
          {etf00981a.source && <span className="ml-2">/ 資料來源：{etf00981a.source}</span>}
        </p>
      </div>

      {/* Summary bar */}
      <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-4">
        <MiniStat label="成分股數" value={`${etf00981a.holdings.length}`} />
        <MiniStat label="前十大權重" value={`${etf00981a.holdings.slice(0, 10).reduce((s, h) => s + h.weight, 0).toFixed(2)}%`} />
        <MiniStat label="最大權重" value={`${etf00981a.holdings[0]?.name} ${etf00981a.holdings[0]?.weight}%`} />
        <MiniStat label="資料日期" value={etf00981a.lastUpdated} />
      </div>

      <ETF00981AClient holdings={etf00981a.holdings} />
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-tw-dark-border dark:border-tw-dark-border border-tw-light-border p-3">
      <div className="text-xs text-tw-dark-muted dark:text-tw-dark-muted text-tw-light-muted">{label}</div>
      <div className="mt-0.5 text-sm font-semibold">{value}</div>
    </div>
  );
}
