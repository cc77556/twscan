// TWScan Site Configuration & Type Definitions

// ─── Site Metadata ───────────────────────────────────────────────

export const siteConfig = {
  name: "TWScan",
  title: "市場雷達 TWScan — 全球市場每日情報站",
  description: "全球市場即時資訊：恐慌指數、VIX、全球指數、總經數據、三大法人、注意/處置股、ETF 追蹤、Podcast 投資摘要",
  url: "https://twscan.cc",
  locale: "zh-TW",
  lastUpdated: "2026-03-24",
} as const;

// ─── Data Source Paths ───────────────────────────────────────────

export const dataPaths = {
  attentionStocks: "./attention-stocks.json",
  dispositionStocks: "./disposition-stocks.json",
  etf00981a: "./etf-00981a.json",
  dividends: "./dividends.json",
  podcasts: "./podcasts.json",
  shareholderGifts: "./shareholder-gifts.json",
  marketData: "./market-data.json",
} as const;

// ─── Type Definitions ────────────────────────────────────────────

/** TWSE attention stock (注意股票) */
export interface AttentionStock {
  code: string;
  name: string;
  count: number;
  reason: string;
  date: string;
  price: number | string;
  pe: number | null;
}

export interface AttentionStocksData {
  title: string;
  lastUpdated: string;
  dateRange: string;
  source: string;
  fetchedAt?: string;
  isSampleData?: boolean;
  stocks: AttentionStock[];
}

/** TWSE disposition stock (處置股票) */
export interface DispositionStock {
  code: string;
  name: string;
  publishDate: string;
  count: number;
  condition: string;
  period: string;
  measure: string;
  reason: string;
}

export interface DispositionStocksData {
  title: string;
  lastUpdated: string;
  source: string;
  fetchedAt?: string;
  isSampleData?: boolean;
  stocks: DispositionStock[];
}

/** ETF holding entry */
export interface ETFHolding {
  rank: number;
  code: string;
  name: string;
  weight: number;
  shares: number;
}

export interface ETFData {
  etfCode: string;
  etfName: string;
  lastUpdated: string;
  fetchedAt?: string;
  source?: string;
  isSampleData?: boolean;
  holdings: ETFHolding[];
}

/** Dividend / ex-rights data */
export interface DividendStock {
  code: string;
  name: string;
  exDate: string;
  cashDividend: number;
  stockDividend: number;
  dividendYield: number;
  year: number;
}

export interface DividendsData {
  title: string;
  lastUpdated: string;
  fetchedAt?: string;
  source: string;
  isSampleData?: boolean;
  disclaimer?: string;
  note?: string;
  stocks: DividendStock[];
}

/** Podcast summary */
export interface PodcastEntry {
  id: string;
  name: string;
  icon: string;
  latestEpisode: string;
  summary: string;
  date: string;
  spotifyUrl: string;
}

/** Market data types */
export interface MarketSentiment {
  fearGreed: { value: number; previous: number; label: string; source: string; sourceUrl: string };
  vix: { value: number; previous: number; change: number; changePercent: number; source: string; sourceUrl: string };
}

export interface ThermometerSignal {
  name: string;
  value: number;
  unit?: string;
  threshold: string;
  triggered: boolean;
  desc: string;
}

export interface MarketIndex {
  name: string;
  symbol: string;
  value: number;
  change: number;
  changePercent: number;
  flag: string;
}

export interface MacroData {
  us10y: { label: string; value: number; unit: string };
  us13w: { label: string; value: number; unit: string };
  yieldSpread: { label: string; value: number; unit: string; status: string };
  fedRate: { label: string; value: number; unit: string; note: string };
}

export interface InstitutionalData {
  date: string;
  foreign: { label: string; value: number; unit: string };
  investment: { label: string; value: number; unit: string };
  dealer: { label: string; value: number; unit: string };
  source: string;
  sourceUrl: string;
}

export interface SynthesisCheck {
  label: string;
  pass: boolean | null;
  note: string;
}

export interface MarketSynthesis {
  verdict: string;
  checks: { macro: SynthesisCheck; sentiment: SynthesisCheck; technical: SynthesisCheck };
  summary: string;
  disclaimer: string;
}

export interface MarketData {
  title: string;
  lastUpdated: string;
  fetchedAt: string;
  source: string;
  sentiment: MarketSentiment;
  thermometer: { signals: ThermometerSignal[]; triggeredCount: number; total: number; source: string; sourceUrl: string };
  indices: MarketIndex[];
  indicesSource: string;
  indicesSourceUrl: string;
  macro: MacroData;
  macroSource: string;
  macroSourceUrl: string;
  institutional: InstitutionalData;
  synthesis: MarketSynthesis;
}

/** Shareholder meeting gift */
export interface ShareholderGift {
  code: string;
  name: string;
  meetingDate: string;
  lastBuyDate: string;
  gift: string;
  giftValue: number;
  year: number;
}

export interface ShareholderGiftsData {
  title: string;
  lastUpdated: string;
  fetchedAt?: string;
  source: string;
  isSampleData: boolean;
  disclaimer?: string;
  note?: string;
  items: ShareholderGift[];
}

export interface PodcastsData {
  title: string;
  lastUpdated: string;
  fetchedAt?: string;
  source: string;
  isSampleData: boolean;
  note?: string;
  items: PodcastEntry[];
}

// ─── Data Loaders (for use in components) ────────────────────────

import attentionRaw from "./attention-stocks.json";
import dispositionRaw from "./disposition-stocks.json";
import etf00981aRaw from "./etf-00981a.json";
import dividendsRaw from "./dividends.json";
import podcastsRaw from "./podcasts.json";
import giftsRaw from "./shareholder-gifts.json";
import marketRaw from "./market-data.json";

export const attentionStocks = attentionRaw as AttentionStocksData;
export const dispositionStocks = dispositionRaw as DispositionStocksData;
export const etf00981a = etf00981aRaw as ETFData;
export const dividends = dividendsRaw as DividendsData;
const podcastsData = podcastsRaw as PodcastsData;
export const podcasts = podcastsData.items;
export const podcastsMeta = podcastsData;
const giftsData = giftsRaw as ShareholderGiftsData;
export const shareholderGifts = giftsData.items;
export const shareholderGiftsMeta = giftsData;
export const marketData = marketRaw as MarketData;
