import { NextResponse } from "next/server";
import { getCachedMarket, setCachedMarket } from "@/lib/market/cache";
import type { MarketResponse } from "@/lib/market/types";
import { getTokyoSessionInfo } from "@/lib/market/tokyo-session";
import { fetchYahooQuotes } from "@/lib/market/yahoo-chart";

export const dynamic = "force-dynamic";

export async function GET() {
  const hit = getCachedMarket();
  if (hit) {
    return NextResponse.json(hit, {
      headers: { "Cache-Control": "public, max-age=0, s-maxage=55" },
    });
  }

  try {
    const indices = await fetchYahooQuotes();
    const body: MarketResponse = {
      fetchedAt: new Date().toISOString(),
      cacheAgeMs: 0,
      tokyoSession: getTokyoSessionInfo(),
      indices,
    };
    setCachedMarket(body);
    return NextResponse.json(
      { ...body, cacheAgeMs: 0 },
      { headers: { "Cache-Control": "public, max-age=0, s-maxage=55" } },
    );
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    const errBody: MarketResponse = {
      fetchedAt: new Date().toISOString(),
      cacheAgeMs: 0,
      tokyoSession: getTokyoSessionInfo(),
      indices: [],
      error: message,
    };
    return NextResponse.json(errBody, { status: 502 });
  }
}
