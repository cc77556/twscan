import Link from "next/link";
import { marketData, attentionStocks, dispositionStocks } from "@/data/config";
import DashboardClient from "./dashboard-client";

const features = [
  {
    href: "/alert",
    title: "注意 / 處置股",
    desc: `${attentionStocks.stocks.length} 檔注意 · ${dispositionStocks.stocks.length} 檔處置`,
    icon: "⚠️",
    color: "from-red-500/20 to-red-600/5",
  },
  {
    href: "/etf/00981a",
    title: "00981A ETF",
    desc: "野村臺灣創新科技50 持股追蹤",
    icon: "📊",
    color: "from-blue-500/20 to-blue-600/5",
  },
  {
    href: "/podcast",
    title: "Podcast 投資摘要",
    desc: "股癌、財報狗等熱門節目重點整理",
    icon: "🎧",
    color: "from-purple-500/20 to-purple-600/5",
  },
];

export default function Home() {
  return (
    <>
      <DashboardClient data={marketData} />

      {/* Feature Navigation */}
      <div className="mx-auto max-w-5xl px-4 pb-10">
        <h2 className="mb-4 text-sm font-semibold text-tw-dark-muted dark:text-tw-dark-muted">
          更多功能
        </h2>
        <div className="grid gap-3 sm:grid-cols-3">
          {features.map((f) => (
            <Link
              key={f.href}
              href={f.href}
              className="group relative overflow-hidden rounded-xl border border-tw-dark-border dark:border-tw-dark-border p-4 transition-all hover:border-tw-accent/50 hover:shadow-lg hover:shadow-tw-accent/5"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${f.color} opacity-0 transition-opacity group-hover:opacity-100`}
              />
              <div className="relative flex items-start gap-3">
                <span className="text-2xl">{f.icon}</span>
                <div>
                  <h3 className="text-sm font-semibold">{f.title}</h3>
                  <p className="mt-0.5 text-xs text-tw-dark-muted dark:text-tw-dark-muted">
                    {f.desc}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
