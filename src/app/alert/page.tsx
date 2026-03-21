import type { Metadata } from "next";
import { attentionStocks, dispositionStocks } from "@/data/config";
import AlertClient from "./client";

export const metadata: Metadata = {
  title: "注意股 / 處置股 — TWSE 警示清單",
  description:
    "證交所公布之注意股票與處置股票最新清單，含觸發原因、處置期間、處置措施等完整資訊。",
};

export default function AlertPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold md:text-3xl">注意股 / 處置股</h1>
        <p className="mt-2 text-sm text-tw-dark-muted dark:text-tw-dark-muted text-tw-light-muted">
          資料來源：TWSE / 最後更新：{attentionStocks.lastUpdated}
        </p>
      </div>
      <AlertClient
        attentionData={attentionStocks}
        dispositionData={dispositionStocks}
      />
    </div>
  );
}
