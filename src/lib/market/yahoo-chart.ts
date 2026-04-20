/**
 * Cotizaciones vía respuesta JSON pública usada por Yahoo Finance (chart API).
 * Sin API key; puede cambiar sin aviso — sustituir por proveedor con licencia en producción.
 */
import type { IndexQuote, MarketIndexId } from "./types";

const USER_AGENT =
  "Mozilla/5.0 (compatible; NikkeiMonitor/0.1; +https://github.com/) AppleWebKit/537.36 (KHTML, like Gecko)";

type YahooMeta = {
  currency?: string | null;
  symbol?: string;
  regularMarketPrice?: number;
  previousClose?: number;
  chartPreviousClose?: number;
  regularMarketTime?: number;
  exchangeTimezoneName?: string | null;
  longName?: string | null;
  shortName?: string | null;
};

type ChartResponse = {
  chart?: {
    error?: { description?: string };
    result?: Array<{ meta?: YahooMeta }>;
  };
};

const INDEX_DEFS: ReadonlyArray<{
  id: MarketIndexId;
  label: string;
  symbol: string;
}> = [
  { id: "nikkei225", label: "Nikkei 225", symbol: "^N225" },
  {
    id: "topixEtf",
    label: "TOPIX (ETF 1306)",
    symbol: "1306.T",
  },
  { id: "usdjpy", label: "USD/JPY", symbol: "JPY=X" },
  { id: "metaplanet3350", label: "Metaplanet", symbol: "3350.T" },
];

function mapMeta(
  id: MarketIndexId,
  label: string,
  symbol: string,
  meta: YahooMeta | undefined,
): IndexQuote {
  if (!meta || meta.regularMarketPrice == null) {
    return {
      id,
      label,
      symbol,
      currency: meta?.currency ?? null,
      price: null,
      change: null,
      changePercent: null,
      previousClose: meta?.previousClose ?? meta?.chartPreviousClose ?? null,
      marketTime: meta?.regularMarketTime ?? null,
      exchangeTimezone: meta?.exchangeTimezoneName ?? null,
      longName: meta?.longName ?? meta?.shortName ?? null,
      error: "No price in response",
    };
  }

  const price = meta.regularMarketPrice;
  const prev = meta.previousClose ?? meta.chartPreviousClose ?? null;
  const change = prev != null ? price - prev : null;
  const changePercent =
    prev != null && prev !== 0 ? (change! / prev) * 100 : null;

  return {
    id,
    label,
    symbol: meta.symbol ?? symbol,
    currency: meta.currency ?? null,
    price,
    change,
    changePercent,
    previousClose: prev,
    marketTime: meta.regularMarketTime ?? null,
    exchangeTimezone: meta.exchangeTimezoneName ?? null,
    longName: meta.longName ?? meta.shortName ?? null,
  };
}

export async function fetchYahooQuotes(): Promise<IndexQuote[]> {
  const results = await Promise.all(
    INDEX_DEFS.map(async ({ id, label, symbol }) => {
      const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?interval=1m&range=1d`;
      try {
        const res = await fetch(url, {
          headers: { "User-Agent": USER_AGENT, Accept: "application/json" },
          cache: "no-store",
        });
        if (!res.ok) {
          return {
            ...mapMeta(id, label, symbol, undefined),
            error: `HTTP ${res.status}`,
          };
        }
        const data = (await res.json()) as ChartResponse;
        const err = data.chart?.error?.description;
        if (err) {
          return {
            ...mapMeta(id, label, symbol, undefined),
            error: err,
          };
        }
        const meta = data.chart?.result?.[0]?.meta;
        return mapMeta(id, label, symbol, meta);
      } catch (e) {
        const message = e instanceof Error ? e.message : "Network error";
        return {
          ...mapMeta(id, label, symbol, undefined),
          error: message,
        };
      }
    }),
  );
  return results;
}
