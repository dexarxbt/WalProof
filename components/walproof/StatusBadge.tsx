import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function StatusBadge({ status }: { status: string }) {
  const tone =
    status.includes("approved") || status.includes("verified") || status.includes("online") || status.includes("configured") || status.includes("ready")
      ? "border-success/40 text-success"
      : status.includes("failed") || status.includes("rejected")
        ? "border-danger/40 text-danger"
        : status.includes("review") || status.includes("pending") || status.includes("setup") || status.includes("waiting")
          ? "border-warning/40 text-warning"
          : "border-ice/30 text-ice";
  return <Badge className={cn("capitalize", tone)}>{status.replaceAll("_", " ")}</Badge>;
}
