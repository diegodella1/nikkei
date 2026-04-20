export type MarketIndexId =
  | "nikkei225"
  | "topixEtf"
  | "usdjpy"
  | "metaplanet3350";

export interface IndexQuote {
  id: MarketIndexId;
  label: string;
  symbol: string;
  currency: string | null;
  price: number | null;
  change: number | null;
  changePercent: number | null;
  previousClose: number | null;
  marketTime: number | null;
  exchangeTimezone: string | null;
  longName: string | null;
  error?: string;
}

export interface MarketResponse {
  fetchedAt: string;
  cacheAgeMs: number;
  tokyoSession: TokyoSessionInfo;
  indices: IndexQuote[];
  error?: string;
}

export interface TokyoSessionInfo {
  status: "open" | "break" | "closed";
  /** Human-readable session description (English, for UI). */
  detailEn: string;
  timeInTokyo: string;
}
