"use client";

import Image from "next/image";
import type { MarketIndexId, MarketResponse } from "@/lib/market/types";
import { useCallback, useEffect, useState } from "react";

const POLL_MS = 60_000;
const LOGO_DEV_PK = "pk_Uk18GJ7nTDiyyivSIkKe6w";

const CARD_DECOR: Record<
  MarketIndexId,
  Array<{ src: string; alt: string; title: string }>
> = {
  nikkei225: [
    {
      src: `https://img.logo.dev/nikkei.com?token=${LOGO_DEV_PK}`,
      alt: "Nikkei logo",
      title: "Nikkei",
    },
    {
      src: "https://flagcdn.com/w40/jp.png",
      alt: "Japan flag",
      title: "Japan",
    },
  ],
  topixEtf: [
    {
      src: `https://img.logo.dev/jpx.co.jp?token=${LOGO_DEV_PK}`,
      alt: "JPX logo",
      title: "JPX",
    },
    {
      src: "https://flagcdn.com/w40/jp.png",
      alt: "Japan flag",
      title: "Japan",
    },
  ],
  usdjpy: [
    {
      src: "https://flagcdn.com/w40/us.png",
      alt: "US flag",
      title: "USD",
    },
    {
      src: "https://flagcdn.com/w40/jp.png",
      alt: "Japan flag",
      title: "JPY",
    },
  ],
  metaplanet3350: [
    {
      src: `https://img.logo.dev/metaplanet.jp?token=${LOGO_DEV_PK}`,
      alt: "Metaplanet logo",
      title: "Metaplanet",
    },
    {
      src: "https://flagcdn.com/w40/jp.png",
      alt: "Japan flag",
      title: "Japan",
    },
  ],
};

function formatPrice(
  value: number | null,
  currency: string | null,
  id: string,
): string {
  if (value == null) return "—";
  if (id === "usdjpy") {
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 4,
    }).format(value);
  }
  if (currency === "JPY" || currency == null) {
    return new Intl.NumberFormat("en-US", {
      maximumFractionDigits: 2,
    }).format(value);
  }
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 2,
  }).format(value);
}

function formatChange(value: number | null): string {
  if (value == null) return "—";
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(2)}`;
}

function formatPct(value: number | null): string {
  if (value == null) return "—";
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(2)}%`;
}

export function MarketDashboard() {
  const [data, setData] = useState<MarketResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setFetchError(null);
    try {
      const res = await fetch("/api/market", { cache: "no-store" });
      const json = (await res.json()) as MarketResponse;
      if (!res.ok && json.error) {
        setFetchError(json.error);
      }
      setData(json);
    } catch (e) {
      setFetchError(e instanceof Error ? e.message : "Failed to load data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const first = window.setTimeout(() => void load(), 0);
    const id = window.setInterval(() => void load(), POLL_MS);
    return () => {
      window.clearTimeout(first);
      window.clearInterval(id);
    };
  }, [load]);

  const session = data?.tokyoSession;
  const sessionAccent =
    session?.status === "open"
      ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-200"
      : session?.status === "break"
        ? "border-amber-500/40 bg-amber-500/10 text-amber-100"
        : "border-zinc-600/50 bg-zinc-800/40 text-zinc-300";

  return (
    <div className="tv-hud flex min-h-dvh w-full items-center justify-center bg-gradient-to-br from-[#020304] via-[#070a12] to-[#020205] p-[min(0.5rem,1.2vmin)]">
      <div
        className="broadcast-frame relative flex flex-col overflow-hidden rounded-lg border border-slate-300/[0.18] bg-gradient-to-b from-[#060a14] via-[#04070f] to-[#020309] shadow-[0_0_0_1px_rgba(255,255,255,0.05),0_24px_90px_rgba(0,0,0,0.82)]"
        role="region"
        aria-label="Japan markets broadcast monitor"
      >
        <div
          className="broadcast-scanlines absolute inset-0 z-10 rounded-lg opacity-[0.14]"
          aria-hidden
        />
        <div className="pointer-events-none absolute inset-0 rounded-lg bg-[radial-gradient(ellipse_at_50%_0%,rgba(59,130,246,0.12),transparent_45%)]" />
        <div className="broadcast-main-grid pointer-events-none absolute inset-0 rounded-lg opacity-[0.35]" />

        <div className="relative z-20 flex h-full min-h-0 flex-1 flex-col px-[clamp(0.75rem,2.2vmin,1.75rem)] pb-[clamp(0.5rem,1.2vmin,1rem)] pt-[clamp(0.65rem,1.6vmin,1.25rem)]">
          <header className="tv-gridline flex shrink-0 flex-col gap-2 border-b pb-3">
            <div className="flex min-w-0 flex-wrap items-end justify-between gap-x-4 gap-y-2">
              <div className="min-w-0">
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <p className="tv-neon-amber font-mono text-[clamp(0.95rem,1.8vmin,1.2rem)] font-bold uppercase tracking-[0.24em]">
                    Live monitor
                  </p>
                  <h1 className="text-[clamp(2.2rem,5.8vmin,4.8rem)] font-bold leading-none tracking-tight text-white">
                    Japan markets
                  </h1>
                </div>
              </div>
              {session && (
                <div className="flex shrink-0 flex-wrap items-center justify-end gap-x-4 gap-y-2">
                  <div
                    className={`inline-flex items-center gap-2 rounded border border-slate-400/30 px-2.5 py-1 font-mono text-[clamp(0.9rem,1.6vmin,1.1rem)] font-semibold uppercase tracking-[0.11em] ${sessionAccent}`}
                  >
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-500 shadow-[0_0_8px_#ef4444]" />
                    {session.status}
                  </div>
                  <div className="text-right">
                    <p className="font-mono text-[clamp(1.35rem,4.5vmin,3.25rem)] font-semibold tabular-nums leading-none text-white">
                      {session.timeInTokyo}
                      <span className="ml-2 text-[0.45em] font-medium text-zinc-400">
                        JST
                      </span>
                    </p>
                    <p className="mt-0.5 max-w-[28ch] text-right text-[clamp(0.75rem,1.35vmin,0.95rem)] leading-tight text-zinc-400">
                      {session.detailEn}
                    </p>
                  </div>
                </div>
              )}
            </div>
            <p className="font-mono text-[clamp(0.7rem,1.2vmin,0.8rem)] leading-snug text-zinc-400/80">
              Nikkei 225 · TOPIX (ETF 1306) · USD/JPY · Metaplanet (3350) · ~1
              min refresh · Yahoo Finance (unofficial)
            </p>
          </header>

          {loading && !data && (
            <p className="py-2 font-mono text-[clamp(0.85rem,1.5vmin,1rem)] text-zinc-400">
              Loading quotes…
            </p>
          )}

          {fetchError && (
            <p className="my-2 rounded border border-red-500/35 bg-red-950/55 px-3 py-2 font-mono text-[clamp(0.8rem,1.35vmin,0.95rem)] text-red-100">
              {fetchError}
            </p>
          )}

          <div className="relative grid min-h-0 w-full min-w-0 flex-1 grid-cols-1 gap-[clamp(0.35rem,1vmin,0.75rem)] sm:grid-cols-2 sm:[grid-template-rows:repeat(2,minmax(0,1fr))]">
            {data?.indices.map((q) => {
              const up = (q.change ?? 0) > 0;
              const down = (q.change ?? 0) < 0;
              const isMetaplanet = q.id === "metaplanet3350";
              const isUsdJpy = q.id === "usdjpy";
              const changeClass = up
                ? "tv-neon-green"
                : down
                  ? "text-red-400"
                  : "text-zinc-400";
              const priceClass = up
                ? "tv-neon-green"
                : down
                  ? "text-zinc-100"
                  : "tv-neon-amber";
              return (
                <article
                  key={q.id}
                  className={`tv-gridline broadcast-card flex h-full min-h-0 min-w-0 flex-col overflow-hidden rounded-md border bg-black/35 px-[clamp(0.75rem,2.2vmin,1.35rem)] py-[clamp(0.75rem,2vmin,1.25rem)] sm:min-h-0 ${
                    isMetaplanet
                      ? "border-2 border-white shadow-[0_0_0_1px_rgba(255,255,255,0.4)]"
                      : ""
                  }`}
                >
                  <div
                    className={`tv-gridline w-full shrink-0 border-b pb-2 ${
                      isUsdJpy ? "text-right" : ""
                    }`}
                  >
                    <div
                      className={`flex w-full items-start gap-3 ${
                        isUsdJpy ? "" : "justify-between"
                      }`}
                    >
                      <div
                        className={`min-w-0 flex-1 ${
                          isUsdJpy ? "order-2 text-right" : "order-1"
                        }`}
                      >
                        <p className="tv-neon-amber font-mono text-[clamp(1.65rem,4vmin,2.75rem)] font-bold uppercase tracking-[0.1em]">
                          {q.label}
                        </p>
                        <p className="mt-1 font-mono text-[clamp(1.2rem,2.8vmin,1.85rem)] text-slate-300/95">
                          {isUsdJpy ? "USDJPY=X" : q.symbol}
                        </p>
                      </div>
                      <div
                        className={`flex shrink-0 items-center gap-1.5 self-start ${
                          isUsdJpy ? "order-1" : "order-2"
                        }`}
                      >
                        {(CARD_DECOR[q.id] ?? []).map((item) => (
                          <span
                            key={`${q.id}-${item.alt}`}
                            className="inline-flex rounded-sm border border-slate-400/25 bg-black/45 p-0.5"
                            title={item.title}
                          >
                            <Image
                              src={item.src}
                              alt={item.alt}
                              width={40}
                              height={40}
                              className="h-10 w-10 rounded-[3px] object-cover"
                              unoptimized
                            />
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div
                    className={`flex min-h-0 w-full min-w-0 flex-1 flex-col gap-2 pt-3 ${
                      isUsdJpy
                        ? "items-end justify-start text-right"
                        : "justify-center"
                    }`}
                  >
                    <p
                      className={`text-price-fluid w-full max-w-full whitespace-nowrap font-mono font-semibold tabular-nums tracking-tight ${priceClass} ${
                        isUsdJpy ? "text-right" : "text-left"
                      }`}
                    >
                      {formatPrice(q.price, q.currency, q.id)}
                    </p>
                    <p
                      className={`text-change-fluid font-mono font-semibold tabular-nums ${changeClass}`}
                    >
                      {formatChange(q.change)} ({formatPct(q.changePercent)})
                    </p>
                    {q.previousClose != null && (
                      <p
                        className={`w-full shrink-0 font-mono text-[clamp(1.4rem,2.7cqw,1.8rem)] tabular-nums leading-normal text-zinc-400/90 ${
                          isUsdJpy ? "block pb-1 text-right" : ""
                        }`}
                      >
                        Prev. close{" "}
                        <span className="text-zinc-300">
                          {formatPrice(
                            q.previousClose,
                            q.currency,
                            q.id,
                          )}
                        </span>
                      </p>
                    )}
                  </div>

                  {(q.error || (q.longName && !isUsdJpy)) && (
                    <div
                      className={`tv-gridline mt-auto w-full shrink-0 border-t pt-2 ${
                        isUsdJpy ? "text-right" : ""
                      }`}
                    >
                      {q.error && (
                        <p className="font-mono text-[clamp(0.7rem,1.25vmin,0.85rem)] text-amber-300/95">
                          {q.error}
                        </p>
                      )}
                      {q.longName && !q.error && !isUsdJpy && (
                        <p className="line-clamp-2 font-mono text-[clamp(1.3rem,2.4cqw,1.6rem)] leading-snug text-zinc-500">
                          {q.longName}
                        </p>
                      )}
                    </div>
                  )}
                </article>
              );
            })}
          </div>

          <footer className="tv-gridline mt-auto flex shrink-0 flex-col gap-1.5 border-t bg-black/35 py-2.5 pl-1 font-mono text-[clamp(0.7rem,1.25vmin,0.85rem)] text-zinc-400 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:px-1">
            <p className="min-w-0 leading-snug">
              Delayed / unofficial · not financial advice · Tokyo hours
              approximate (holidays excluded)
            </p>
            {data && (
              <p className="shrink-0 tabular-nums text-zinc-300">
                Last fetch{" "}
                {new Date(data.fetchedAt).toLocaleString("en-GB", {
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                  hour12: false,
                })}{" "}
                · cache ~{Math.round((data.cacheAgeMs ?? 0) / 1000)}s
              </p>
            )}
          </footer>
        </div>
      </div>
    </div>
  );
}

