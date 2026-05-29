"use client";

import { useQuery } from "@tanstack/react-query";
import { Database } from "lucide-react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/walproof/StatusBadge";

export function WalrusStatusCard() {
  const { data } = useQuery({
    queryKey: ["health"],
    queryFn: async () => (await fetch("/api/health")).json() as Promise<{ walrus: Record<string, boolean | string> }>
  });
  const canWrite = Boolean(data?.walrus?.publisherConfigured) || Boolean(data?.walrus?.relayConfigured);
  const hasPublisher = Boolean(data?.walrus?.publisherConfigured);
  const hasRelay = Boolean(data?.walrus?.relayConfigured);
  const canRead = Boolean(data?.walrus?.aggregatorConfigured);
  const ready = canRead && canWrite;
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Database size={19} /> Walrus Storage</CardTitle>
        <StatusBadge status={ready ? "configured" : "setup_required"} />
      </CardHeader>
      <div className="space-y-2 text-sm text-slate">
        <p>Network: <span className="text-white">{String(data?.walrus?.network ?? "mainnet")}</span></p>
        <p>Publisher: <span className="text-white">{hasPublisher ? "Configured" : hasRelay ? "Optional, using official relay" : "Add WALRUS_PUBLISHER_URL or relay"}</span></p>
        <p>Relay: <span className="text-white">{hasRelay ? "Official upload relay configured" : "Optional"}</span></p>
        <p>Aggregator: <span className="text-white">{canRead ? "Official aggregator configured" : "Add WALRUS_AGGREGATOR_URL"}</span></p>
      </div>
    </Card>
  );
}
