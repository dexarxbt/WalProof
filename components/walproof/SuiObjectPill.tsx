import { Boxes } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { suiObjectUrl } from "@/lib/external-links";
import { truncateMiddle } from "@/lib/format";

export function SuiObjectPill({ objectId, label = "Object" }: { objectId: string; label?: string }) {
  return (
    <Badge className="mono gap-1 border-ice/35 text-ice transition hover:border-ice hover:bg-ice/10">
      <a className="inline-flex items-center gap-1" href={suiObjectUrl(objectId)} rel="noreferrer" target="_blank" title={`Open ${label} on Sui Explorer`}>
        <Boxes size={13} />
        {label}: {truncateMiddle(objectId, 10)}
      </a>
    </Badge>
  );
}
