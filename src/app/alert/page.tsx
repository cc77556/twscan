import type { Metadata } from "next";
import { attentionStocks, dispositionStocks } from "@/data/config";
import AlertClient from "./client";
import Disclaimer from "@/components/Disclaimer";

export const metadata: Metadata = {
  title: "注意股 / 處置股 — TWSE 警示清單",
  description:
    "證交所公布之注意股票與處置股票最新清單，含觸發原因、處置期間、處置措施等完整資訊。",
};

export default function AlertPage() {
  // JSON-LD Dataset schema：讓搜尋引擎把這頁當每日更新的資料集收錄
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: "台股注意股與處置股警示清單",
    description:
      "證交所公布之注意股票與處置股票清單，含觸發原因、處置期間與處置措施，每日自動更新自台灣證券交易所公開端點。",
    dateModified: attentionStocks.lastUpdated,
    creator: { "@type": "Organization", name: "台股雷達 TWScan" },
    isBasedOn: "https://www.twse.com.tw/zh/announcement/notice",
    keywords: ["注意股", "處置股", "警示股", "停資停券", "台股"],
  };
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Disclaimer />
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
