import type { Metadata } from "next";
import { dividends } from "@/data/config";
import DividendsClient from "./client";
import Disclaimer from "@/components/Disclaimer";

export const metadata: Metadata = {
  title: "除權息日曆 — 台股殖利率排行",
  description:
    "台股除權除息日程表，含現金股利、股票股利、殖利率資訊。依月份篩選，掌握配息時程。",
};

export default function DividendsPage() {
  // JSON-LD Dataset schema：讓搜尋引擎把這頁當每日更新的資料集收錄
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: "台股除權除息日曆",
    description:
      "台灣上市公司除權除息預告，含除息日、現金股利、無償配股率與事件殖利率，每日自動更新自台灣證券交易所公開端點。",
    dateModified: dividends.lastUpdated,
    creator: { "@type": "Organization", name: "台股雷達 TWScan" },
    license: "https://www.twse.com.tw/",
    isBasedOn: "https://www.twse.com.tw/zh/exRight/TWT48U",
    keywords: ["除權息", "除息日", "現金股利", "殖利率", "台股"],
  };
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Disclaimer />
      <div className="mb-6">
        <h1 className="text-2xl font-bold md:text-3xl">除權息日曆</h1>
        <p className="mt-2 text-sm text-tw-dark-muted dark:text-tw-dark-muted text-tw-light-muted">
          {dividends.title} / 最後更新：{dividends.lastUpdated} / 資料來源：{dividends.source}
        </p>
        {dividends.disclaimer && (
          <p className="mt-2 rounded-md bg-amber-500/10 border border-amber-500/30 px-3 py-2 text-xs text-amber-600 dark:text-amber-400">
            {dividends.disclaimer}
          </p>
        )}
        {dividends.note && (
          <p className="mt-1 text-xs text-tw-dark-muted dark:text-tw-dark-muted text-tw-light-muted italic">
            {dividends.note}
          </p>
        )}
      </div>
      <DividendsClient stocks={dividends.stocks} />
    </div>
  );
}
