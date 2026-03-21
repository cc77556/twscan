import type { Metadata } from "next";
import { shareholderGifts } from "@/data/config";
import GiftsClient from "./client";

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
      <div className="mb-6">
        <h1 className="text-2xl font-bold md:text-3xl">股東會紀念品</h1>
        <p className="mt-2 text-sm text-tw-dark-muted dark:text-tw-dark-muted text-tw-light-muted">
          {sorted[0]?.year} 年股東會紀念品 / 最後買進日倒數
        </p>
      </div>
      <GiftsClient gifts={sorted} />
    </div>
  );
}
