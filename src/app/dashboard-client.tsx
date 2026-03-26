"use client";

import { useEffect, useRef } from "react";
import type { MarketData } from "@/data/config";

// ── Source Link ──────────────────────────────────────────────────
function SourceLink({ label, url }: { label: string; url: string }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 text-[10px] text-tw-dark-muted hover:text-tw-accent transition-colors"
    >
      <span>資料來源: {label}</span>
      <svg className="h-2.5 w-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
      </svg>
    </a>
  );
}

// ── Section Header with source ───────────────────────────────────
function SectionHeader({ title, source, sourceUrl }: { title: string; source: string; sourceUrl: string }) {
  return (
    <div className="mb-3 flex items-end justify-between">
      <h2 className="text-sm font-semibold text-tw-dark-muted">{title}</h2>
      <SourceLink label={source} url={sourceUrl} />
    </div>
  );
}

// ── Clickable Card Wrapper ───────────────────────────────────────
function CardLink({ href, children, className = "" }: { href: string; children: React.ReactNode; className?: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`group block rounded-xl border border-tw-dark-border dark:border-tw-dark-border p-4 transition-all hover:border-tw-accent/40 hover:bg-tw-accent/5 ${className}`}
    >
      {children}
    </a>
  );
}

// ── Gauge Component ──────────────────────────────────────────────
function GaugeBar({ value, max, color }: { value: number; max: number; color: string }) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  const fillRef = useRef<HTMLDivElement>(null);
  const markerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = setTimeout(() => {
      if (fillRef.current) fillRef.current.style.width = `${pct}%`;
      if (markerRef.current) markerRef.current.style.left = `${pct}%`;
    }, 200);
    return () => clearTimeout(t);
  }, [pct]);

  return (
    <div className="gauge-bar bg-tw-dark-border/50 dark:bg-tw-dark-border/50">
      <div ref={fillRef} className="gauge-fill" style={{ width: 0, backgroundColor: color }} />
      <div ref={markerRef} className="gauge-marker" style={{ left: 0, backgroundColor: "#fff" }} />
    </div>
  );
}

// ── Fade-in observer ─────────────────────────────────────────────
function FadeSection({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => el.classList.add("visible"), delay);
          obs.unobserve(el);
        }
      },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [delay]);

  return (
    <div ref={ref} className={`fade-up ${className}`}>
      {children}
    </div>
  );
}

// ── Yahoo Finance URL helper ─────────────────────────────────────
function yahooUrl(symbol: string) {
  return `https://finance.yahoo.com/quote/${encodeURIComponent(symbol)}/`;
}

// ── Main Dashboard ───────────────────────────────────────────────
export default function DashboardClient({ data }: { data: MarketData }) {
  const { sentiment, thermometer, indices, macro, institutional, synthesis } = data;

  const fgColor =
    sentiment.fearGreed.value <= 25
      ? "#ef4444"
      : sentiment.fearGreed.value <= 45
        ? "#f59e0b"
        : sentiment.fearGreed.value <= 55
          ? "#a3a3a3"
          : sentiment.fearGreed.value <= 75
            ? "#22c55e"
            : "#16a34a";

  const vixColor = sentiment.vix.value >= 30 ? "#ef4444" : sentiment.vix.value >= 20 ? "#f59e0b" : "#22c55e";

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 md:py-10">
      {/* Hero */}
      <FadeSection>
        <section className="mb-8 text-center">
          <div className="mb-2 inline-block rounded-full border border-tw-accent/30 px-3 py-1 text-xs font-medium text-tw-accent">
            市場晨報
          </div>
          <h1 className="mb-2 text-3xl font-bold tracking-tight md:text-4xl">
            市場雷達 <span className="text-tw-dark-muted dark:text-tw-dark-muted text-sm font-normal">TWScan</span>
          </h1>
          <p className="text-sm text-tw-dark-muted dark:text-tw-dark-muted">
            {data.lastUpdated} 更新 · {data.source}
          </p>
        </section>
      </FadeSection>

      {/* Sentiment Cards Row */}
      <FadeSection delay={80}>
        <section className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-4">
          {/* Fear & Greed */}
          <CardLink href={sentiment.fearGreed.sourceUrl}>
            <div className="mb-1 flex items-center justify-between">
              <span className="text-xs text-tw-dark-muted">Fear & Greed</span>
              <svg className="h-3 w-3 text-tw-dark-muted opacity-0 transition-opacity group-hover:opacity-100" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </div>
            <div className="mb-1 text-2xl font-bold font-mono" style={{ color: fgColor }}>
              {sentiment.fearGreed.value}
            </div>
            <div className="mb-2 text-xs" style={{ color: fgColor }}>{sentiment.fearGreed.label}</div>
            <GaugeBar value={sentiment.fearGreed.value} max={100} color={fgColor} />
            <div className="mt-1.5 flex items-center justify-between">
              <span className="text-[10px] text-tw-dark-muted">昨日 {sentiment.fearGreed.previous}</span>
              <span className="text-[9px] text-tw-dark-muted">CNN</span>
            </div>
          </CardLink>

          {/* VIX */}
          <CardLink href={sentiment.vix.sourceUrl}>
            <div className="mb-1 flex items-center justify-between">
              <span className="text-xs text-tw-dark-muted">VIX 波動率</span>
              <svg className="h-3 w-3 text-tw-dark-muted opacity-0 transition-opacity group-hover:opacity-100" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </div>
            <div className="mb-1 text-2xl font-bold font-mono" style={{ color: vixColor }}>
              {sentiment.vix.value}
            </div>
            <div className="mb-2 flex items-center gap-1 text-xs">
              <span style={{ color: sentiment.vix.change < 0 ? "#22c55e" : "#ef4444" }}>
                {sentiment.vix.change > 0 ? "▲" : "▼"}{Math.abs(sentiment.vix.change).toFixed(2)}
              </span>
            </div>
            <GaugeBar value={sentiment.vix.value} max={50} color={vixColor} />
            <div className="mt-1.5 flex items-center justify-between">
              <span className="text-[10px] text-tw-dark-muted">昨收 {sentiment.vix.previous}</span>
              <span className="text-[9px] text-tw-dark-muted">Yahoo Finance</span>
            </div>
          </CardLink>

          {/* Thermometer */}
          <CardLink href={thermometer.sourceUrl}>
            <div className="mb-1 flex items-center justify-between">
              <span className="text-xs text-tw-dark-muted">情緒溫度</span>
              <svg className="h-3 w-3 text-tw-dark-muted opacity-0 transition-opacity group-hover:opacity-100" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </div>
            <div className="mb-1 text-2xl font-bold font-mono">
              <span className={thermometer.triggeredCount > 0 ? "text-tw-amber" : "text-tw-green"}>
                {thermometer.triggeredCount}
              </span>
              <span className="text-tw-dark-muted text-base">/{thermometer.total}</span>
            </div>
            <div className="text-xs text-tw-dark-muted">信號觸發</div>
            <div className="mt-2 flex gap-1.5">
              {thermometer.signals.map((s) => (
                <div
                  key={s.name}
                  className={`signal-dot ${s.triggered ? "active" : ""}`}
                  style={{ backgroundColor: s.triggered ? "#f59e0b" : "#374151" }}
                  title={`${s.name}: ${s.value} (${s.threshold}) — ${s.desc}`}
                />
              ))}
            </div>
            <div className="mt-1.5 text-right">
              <span className="text-[9px] text-tw-dark-muted">綜合指標</span>
            </div>
          </CardLink>

          {/* Institutional */}
          <CardLink href={institutional.sourceUrl}>
            <div className="mb-1 flex items-center justify-between">
              <span className="text-xs text-tw-dark-muted">外資買賣超</span>
              <svg className="h-3 w-3 text-tw-dark-muted opacity-0 transition-opacity group-hover:opacity-100" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </div>
            <div className="mb-1 text-2xl font-bold font-mono" style={{ color: institutional.foreign.value < 0 ? "#ef4444" : "#22c55e" }}>
              {institutional.foreign.value > 0 ? "+" : ""}{institutional.foreign.value.toFixed(0)}
            </div>
            <div className="text-xs text-tw-dark-muted">億 · {institutional.date}</div>
            <div className="mt-2 text-right">
              <span className="text-[9px] text-tw-dark-muted">TWSE 證交所</span>
            </div>
          </CardLink>
        </section>
      </FadeSection>

      {/* Thermometer Detail */}
      <FadeSection delay={160}>
        <section className="mb-6">
          <SectionHeader title="市場溫度計" source={thermometer.source} sourceUrl={thermometer.sourceUrl} />
          <div className="grid grid-cols-5 gap-2">
            {thermometer.signals.map((s) => (
              <div
                key={s.name}
                className={`rounded-lg border p-3 text-center transition-colors ${
                  s.triggered
                    ? "border-tw-amber/50 bg-tw-amber/5"
                    : "border-tw-dark-border dark:border-tw-dark-border"
                }`}
                title={s.desc}
              >
                <div className="text-[10px] text-tw-dark-muted">{s.name}</div>
                <div className={`text-lg font-bold font-mono ${s.triggered ? "text-tw-amber" : ""}`}>
                  {s.value}{s.unit || ""}
                </div>
                <div className="text-[10px] text-tw-dark-muted">門檻 {s.threshold}</div>
              </div>
            ))}
          </div>
        </section>
      </FadeSection>

      {/* Global Indices Table */}
      <FadeSection delay={240}>
        <section className="mb-6">
          <SectionHeader title="全球市場指數" source={data.indicesSource} sourceUrl={data.indicesSourceUrl} />
          <div className="overflow-x-auto rounded-xl border border-tw-dark-border dark:border-tw-dark-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-tw-dark-border text-left text-xs text-tw-dark-muted">
                  <th className="px-4 py-2.5">指數</th>
                  <th className="px-4 py-2.5 text-right">最新</th>
                  <th className="px-4 py-2.5 text-right">漲跌</th>
                  <th className="px-4 py-2.5 text-right">幅度</th>
                </tr>
              </thead>
              <tbody>
                {indices.map((idx) => (
                  <tr key={idx.symbol} className="border-b border-tw-dark-border/50 last:border-0 hover:bg-tw-dark-border/20 transition-colors">
                    <td className="px-4 py-2.5">
                      <a
                        href={yahooUrl(idx.symbol)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 hover:text-tw-accent transition-colors"
                      >
                        <span>{idx.flag}</span>
                        <span className="font-medium">{idx.name}</span>
                        <svg className="h-2.5 w-2.5 opacity-0 transition-opacity group-hover:opacity-100" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    </td>
                    <td className="px-4 py-2.5 text-right font-mono">
                      {idx.value.toLocaleString("en-US", { minimumFractionDigits: idx.value < 100 ? 2 : 0, maximumFractionDigits: 2 })}
                    </td>
                    <td className="px-4 py-2.5 text-right font-mono" style={{ color: idx.change >= 0 ? "#22c55e" : "#ef4444" }}>
                      {idx.change >= 0 ? "+" : ""}{idx.change.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className="px-4 py-2.5 text-right font-mono" style={{ color: idx.changePercent >= 0 ? "#22c55e" : "#ef4444" }}>
                      {idx.changePercent >= 0 ? "▲" : "▼"} {Math.abs(idx.changePercent).toFixed(2)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </FadeSection>

      {/* Macro + Institutional Row */}
      <FadeSection delay={320}>
        <section className="mb-6 grid gap-4 md:grid-cols-2">
          {/* Macro */}
          <div className="rounded-xl border border-tw-dark-border dark:border-tw-dark-border p-4">
            <SectionHeader title="總經數據" source={data.macroSource} sourceUrl={data.macroSourceUrl} />
            <div className="space-y-2.5">
              {Object.values(macro).map((m) => (
                <div key={m.label} className="flex items-center justify-between">
                  <span className="text-sm text-tw-dark-muted">{m.label}</span>
                  <span className="font-mono text-sm font-semibold">
                    {m.value}{m.unit}
                    {"status" in m && (
                      <span className="ml-2 text-xs text-tw-green">({(m as typeof macro.yieldSpread).status})</span>
                    )}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* 三大法人 */}
          <div className="rounded-xl border border-tw-dark-border dark:border-tw-dark-border p-4">
            <SectionHeader title={`三大法人 · ${institutional.date}`} source={institutional.source} sourceUrl={institutional.sourceUrl} />
            <div className="space-y-3">
              {[institutional.foreign, institutional.investment, institutional.dealer].map((inst) => (
                <div key={inst.label} className="flex items-center justify-between">
                  <span className="text-sm">{inst.label}</span>
                  <span
                    className="font-mono text-sm font-bold"
                    style={{ color: inst.value >= 0 ? "#22c55e" : "#ef4444" }}
                  >
                    {inst.value > 0 ? "+" : ""}{inst.value.toFixed(2)} {inst.unit}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </FadeSection>

      {/* Synthesis */}
      <FadeSection delay={400}>
        <section className="mb-8">
          <div className="rounded-xl border-2 border-tw-accent/30 bg-tw-accent/5 p-5">
            <div className="mb-2 flex items-center gap-2">
              <span className="text-lg">📊</span>
              <h2 className="text-lg font-bold">{synthesis.verdict}</h2>
            </div>
            <div className="mb-3 flex gap-4 text-sm">
              {Object.values(synthesis.checks).map((c) => (
                <div key={c.label} className="flex items-center gap-1.5">
                  <span className={c.pass === true ? "text-tw-green" : c.pass === false ? "text-tw-red" : "text-tw-dark-muted"}>
                    {c.pass === true ? "✓" : c.pass === false ? "✕" : "—"}
                  </span>
                  <span className="text-tw-dark-muted">{c.label}</span>
                  <span className="text-[10px] text-tw-dark-muted">({c.note})</span>
                </div>
              ))}
            </div>
            <p className="text-sm leading-relaxed">{synthesis.summary}</p>
            <p className="mt-3 text-[11px] text-tw-dark-muted">{synthesis.disclaimer}</p>
          </div>
        </section>
      </FadeSection>
    </div>
  );
}
