import { BadgeCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { suiTransactionUrl } from "@/lib/external-links";
import { truncateMiddle } from "@/lib/format";

export function TransactionPill({ digest }: { digest: string }) {
  return (
    <Badge className="mono gap-1 border-success/35 text-success transition hover:border-success hover:bg-success/10">
      <a className="inline-flex items-center gap-1" href={suiTransactionUrl(digest)} rel="noreferrer" target="_blank" title="Open transaction on Sui Explorer">
        <BadgeCheck size={13} />
        {truncateMiddle(digest, 10)}
      </a>
    </Badge>
  );
}
