import { Database } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { walrusBlobUrl } from "@/lib/external-links";
import { truncateMiddle } from "@/lib/format";

export function BlobIdPill({ blobId }: { blobId: string }) {
  return (
    <Badge className="mono gap-1 border-electric/35 text-ice transition hover:border-ice hover:bg-ice/10">
      <a className="inline-flex items-center gap-1" href={walrusBlobUrl(blobId)} rel="noreferrer" target="_blank" title="Open Walrus blob through the app read proxy">
        <Database size={13} />
        {truncateMiddle(blobId, 10)}
      </a>
    </Badge>
  );
}
