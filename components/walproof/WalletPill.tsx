import { Wallet } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { suiAddressUrl } from "@/lib/external-links";
import { truncateMiddle } from "@/lib/format";

export function WalletPill({ address }: { address: string }) {
  return (
    <Badge className="mono gap-1 transition hover:border-ice hover:bg-ice/10">
      <a className="inline-flex items-center gap-1" href={suiAddressUrl(address)} rel="noreferrer" target="_blank" title="Open address on Sui Explorer">
        <Wallet size={13} />
        {truncateMiddle(address, 7)}
      </a>
    </Badge>
  );
}
