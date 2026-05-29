"use client";

import { useQuery } from "@tanstack/react-query";
import { RadioTower } from "lucide-react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/walproof/StatusBadge";
import { getTatumHealth } from "@/lib/tatum";

export function TatumStatusCard() {
  const { data, isLoading, refetch } = useQuery({ queryKey: ["tatum-health"], queryFn: getTatumHealth, retry: false });
  const setupRequired = data?.error?.includes("TATUM_API_KEY");
  const state = isLoading ? "checking" : data?.connected ? "online" : setupRequired ? "setup_required" : "rpc_unavailable";
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><RadioTower size={19} /> Tatum RPC</CardTitle>
        <StatusBadge status={state} />
      </CardHeader>
      <div className="space-y-2 text-sm text-slate">
        <p>Network: <span className="text-white">{data?.network ?? "mainnet"}</span></p>
        <p>Latest checkpoint: <span className="mono text-white">{data?.latestCheckpoint ?? "Waiting for key"}</span></p>
        <p>Chain identifier: <span className="mono text-white">{data?.chainIdentifier ?? "Waiting for key"}</span></p>
        <p>Latency: <span className="text-white">{data?.latencyMs ? `${data.latencyMs}ms` : "Ready to test"}</span></p>
        {data?.error ? <p className="text-warning">{setupRequired ? "Add TATUM_API_KEY in .env.local to run mainnet RPC checks." : data.error}</p> : null}
      </div>
      <button className="mt-4 text-sm font-semibold text-ice" onClick={() => refetch()} type="button">Retry Tatum check</button>
    </Card>
  );
}
