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
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
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
