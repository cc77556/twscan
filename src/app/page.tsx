import Link from "next/link";
import { attentionStocks, dispositionStocks } from "@/data/config";

const features = [
  {
    href: "/etf/00981a",
    title: "00981A ETF",
    desc: "野村臺灣創新科技50 持股追蹤",
    icon: "\uD83D\uDCCA",
    color: "from-blue-500/20 to-blue-600/5",
  },
  {
    href: "/alert",
    title: "注意 / 處置股",
    desc: "證交所公布之注意及處置股票",
    icon: "\u26A0\uFE0F",
    color: "from-red-500/20 to-red-600/5",
  },
  {
    href: "/podcast",
    title: "Podcast 投資摘要",
    desc: "股癌、財報狗等熱門節目重點整理",
    icon: "\uD83C\uDFA7",
    color: "from-purple-500/20 to-purple-600/5",
  },
];

export default function Home() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:py-16">
      {/* Hero */}
      <section className="mb-12 text-center md:mb-16">
        <h1 className="mb-4 text-3xl font-bold tracking-tight md:text-5xl">
          <span className="text-tw-accent">台股雷達</span>
          <span className="mx-2 text-tw-dark-muted dark:text-tw-dark-muted text-tw-light-muted">/</span>
          TWScan
        </h1>
        <p className="text-lg text-tw-dark-muted dark:text-tw-dark-muted text-tw-light-muted md:text-xl">
          散戶的每日情報站
        </p>
      </section>

      {/* Quick stats */}
      <section className="mb-12 grid grid-cols-2 gap-3 md:gap-4">
        <StatCard label="注意股" value={`${attentionStocks.stocks.length} 檔`} accent="text-tw-red" />
        <StatCard label="處置股" value={`${dispositionStocks.stocks.length} 檔`} accent="text-tw-red" />
      </section>

      {/* Feature grid */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((f) => (
          <Link
            key={f.href}
            href={f.href}
            className="group relative overflow-hidden rounded-xl border border-tw-dark-border dark:border-tw-dark-border border-tw-light-border p-5 transition-all hover:border-tw-accent/50 hover:shadow-lg hover:shadow-tw-accent/5"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${f.color} opacity-0 transition-opacity group-hover:opacity-100`} />
            <div className="relative">
              <div className="mb-3 text-2xl">{f.icon}</div>
              <h2 className="mb-1 text-base font-semibold">{f.title}</h2>
              <p className="text-sm text-tw-dark-muted dark:text-tw-dark-muted text-tw-light-muted">
                {f.desc}
              </p>
            </div>
          </Link>
        ))}
      </section>
    </div>
  );
}

function StatCard({ label, value, accent }: { label: string; value: string; accent: string }) {
  return (
    <div className="rounded-lg border border-tw-dark-border dark:border-tw-dark-border border-tw-light-border p-4">
      <div className="text-xs text-tw-dark-muted dark:text-tw-dark-muted text-tw-light-muted">{label}</div>
      <div className={`mt-1 text-xl font-bold ${accent}`}>{value}</div>
    </div>
  );
}
