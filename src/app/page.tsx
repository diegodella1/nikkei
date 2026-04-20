import { MarketDashboard } from "@/components/MarketDashboard";

export default function Home() {
  return (
    <div className="flex h-dvh min-h-0 w-full flex-col overflow-hidden bg-[#030306] text-zinc-100">
      <MarketDashboard />
    </div>
  );
}
