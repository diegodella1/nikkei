import type { MarketResponse } from "./types";

const TTL_MS = 55_000;

let cached: { body: MarketResponse; storedAt: number } | null = null;

export function getCachedMarket(): MarketResponse | null {
  if (!cached) return null;
  if (Date.now() - cached.storedAt > TTL_MS) return null;
  return {
    ...cached.body,
    cacheAgeMs: Date.now() - cached.storedAt,
  };
}

export function setCachedMarket(body: MarketResponse): void {
  cached = { body, storedAt: Date.now() };
}
