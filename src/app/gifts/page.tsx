import type { Metadata } from "next";
import { shareholderGifts, shareholderGiftsMeta } from "@/data/config";
import GiftsClient from "./client";
import Disclaimer from "@/components/Disclaimer";

export const metadata: Metadata = {
  title: "股東會紀念品 — 最後買進日倒數",
  description:
    "台股股東會紀念品一覽表，含最後買進日倒數、紀念品內容與估計價值。買零股領紀念品攻略。",
};

export default function GiftsPage() {
  // Sort by lastBuyDate (soonest first)
  const sorted = [...shareholderGifts].sort(
    (a, b) => new Date(a.lastBuyDate).getTime() - new Date(b.lastBuyDate).getTime()
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <Disclaimer />
      <div className="mb-6">
        <h1 className="text-2xl font-bold md:text-3xl">股東會紀念品</h1>
        <p className="mt-2 text-sm text-tw-dark-muted dark:text-tw-dark-muted text-tw-light-muted">
          {sorted[0]?.year} 年股東會紀念品 / 最後買進日倒數
        </p>
        {shareholderGiftsMeta.disclaimer && (
          <p className="mt-2 rounded-md bg-amber-500/10 border border-amber-500/30 px-3 py-2 text-xs text-amber-600 dark:text-amber-400">
            {shareholderGiftsMeta.disclaimer}
          </p>
        )}
      </div>
      <GiftsClient gifts={sorted} />
    </div>
  );
}
