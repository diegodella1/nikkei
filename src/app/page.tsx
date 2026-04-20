import { MarketDashboard } from "@/components/MarketDashboard";

export default function Home() {
  return (
    <div className="flex min-h-0 min-h-dvh w-full min-w-0 flex-1 flex-col overflow-hidden bg-[#030306] text-zinc-100">
      <MarketDashboard />
    </div>
  );
}
