"use client";

import Link from "next/link";
import { ConnectButton, useCurrentAccount } from "@mysten/dapp-kit";
import { Activity, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { truncateMiddle } from "@/lib/format";

export function TopNav() {
  const account = useCurrentAccount();

  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-navy/78 px-4 py-3 backdrop-blur-2xl xl:px-8">
      <div className="flex items-center justify-between gap-4">
        <Link href="/status" className="hidden items-center gap-2 text-sm font-semibold text-mist sm:flex">
          <Activity size={17} />
          Tatum RPC and Walrus status
          <ExternalLink size={14} />
        </Link>
        <div className="ml-auto flex items-center gap-3">
          {account ? <Badge className="mono">{truncateMiddle(account.address, 6)}</Badge> : null}
          <ConnectButton />
        </div>
      </div>
    </header>
  );
}
