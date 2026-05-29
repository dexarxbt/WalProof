import { CheckCircle2, CircleAlert, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";

export function VerificationCard({ title, state, detail }: { title: string; state: "success" | "warning" | "loading" | "failed"; detail: string }) {
  const Icon = state === "success" ? CheckCircle2 : state === "loading" ? Loader2 : CircleAlert;
  const color = state === "success" ? "text-success" : state === "failed" ? "text-danger" : "text-warning";
  const glow =
    state === "success"
      ? "bg-[linear-gradient(135deg,rgba(61,220,151,0.16),rgba(21,94,239,0.10),rgba(7,17,31,0.84))]"
      : state === "failed"
        ? "bg-[linear-gradient(135deg,rgba(255,92,122,0.14),rgba(21,94,239,0.08),rgba(7,17,31,0.84))]"
        : "bg-[linear-gradient(135deg,rgba(247,185,85,0.14),rgba(21,94,239,0.08),rgba(7,17,31,0.84))]";
  return (
    <Card className={`p-5 ${glow}`}>
      <div className="flex items-start justify-between gap-3">
        <Icon className={color} size={24} />
        <span className="rounded-full border border-white/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-ice/80">
          {state === "success" ? "live" : state}
        </span>
      </div>
      <h3 className="mt-5 font-[var(--font-body)] text-base font-semibold text-white">{title}</h3>
      <p className="mono mt-2 break-all text-xs leading-relaxed text-slate">{detail}</p>
    </Card>
  );
}
