// TWScan Site Configuration & Type Definitions

// ─── Site Metadata ───────────────────────────────────────────────

export const siteConfig = {
  name: "TWScan",
  title: "TWScan — 台股投資儀表板",
  description: "台灣股市即時資訊：注意/處置股、ETF 持股、除權息、股東會紀念品、Podcast 摘要",
  url: "https://twscan.cc",
  locale: "zh-TW",
  lastUpdated: "2026-03-21",
} as const;

// ─── Data Source Paths ───────────────────────────────────────────

export const dataPaths = {
  attentionStocks: "./attention-stocks.json",
  dispositionStocks: "./disposition-stocks.json",
  etf00981a: "./etf-00981a.json",
  dividends: "./dividends.json",
  podcasts: "./podcasts.json",
  shareholderGifts: "./shareholder-gifts.json",
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
  source?: string;
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
  source: string;
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

// ─── Data Loaders (for use in components) ────────────────────────

import attentionRaw from "./attention-stocks.json";
import dispositionRaw from "./disposition-stocks.json";
import etf00981aRaw from "./etf-00981a.json";
import dividendsRaw from "./dividends.json";
import podcastsRaw from "./podcasts.json";
import giftsRaw from "./shareholder-gifts.json";

export const attentionStocks = attentionRaw as AttentionStocksData;
export const dispositionStocks = dispositionRaw as DispositionStocksData;
export const etf00981a = etf00981aRaw as ETFData;
export const dividends = dividendsRaw as DividendsData;
export const podcasts = podcastsRaw as PodcastEntry[];
export const shareholderGifts = giftsRaw as ShareholderGift[];
