import type { Metadata } from "next";
import { dividends } from "@/data/config";
import DividendsClient from "./client";

export const metadata: Metadata = {
  title: "除權息日曆 — 台股殖利率排行",
  description:
    "台股除權除息日程表，含現金股利、股票股利、殖利率資訊。依月份篩選，掌握配息時程。",
};

export default function DividendsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold md:text-3xl">除權息日曆</h1>
        <p className="mt-2 text-sm text-tw-dark-muted dark:text-tw-dark-muted text-tw-light-muted">
          {dividends.title} / 最後更新：{dividends.lastUpdated} / 資料來源：{dividends.source}
        </p>
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
