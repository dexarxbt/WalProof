import { ReactNode } from "react";
import { Card } from "@/components/ui/card";

export function MetricCard({ label, value, icon }: { label: string; value: string | number; icon?: ReactNode }) {
  return (
    <Card className="group relative overflow-hidden border-ice/20 bg-[linear-gradient(135deg,rgba(191,227,255,0.16),rgba(21,94,239,0.12)_42%,rgba(7,17,31,0.78))] shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_20px_60px_rgba(21,94,239,0.14)]">
      <div className="pointer-events-none absolute -right-8 -top-10 h-28 w-28 rounded-full bg-electric/20 blur-2xl" />
      <div className="mb-5 flex items-center justify-between text-ice/80">
        <span className="text-sm font-semibold">{label}</span>
        <span className="rounded-full border border-white/10 bg-white/5 p-2 text-ice">{icon}</span>
      </div>
      <strong className="font-[var(--font-body)] text-4xl font-semibold leading-none tracking-normal text-white tabular-nums">{value}</strong>
    </Card>
  );
}
