"use client";

import { useCurrentAccount } from "@mysten/dapp-kit";
import { AppShell } from "@/components/app/AppShell";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { InfrastructureStatusCard } from "@/components/walproof/InfrastructureStatusCard";
import { WalletPill } from "@/components/walproof/WalletPill";
import { appConfig } from "@/lib/config";

export default function StatusPage() {
  const account = useCurrentAccount();
  return (
    <AppShell>
      <h1 className="font-[var(--font-heading)] text-5xl text-white sm:text-6xl">Infrastructure Status</h1>
      <p className="mb-6 mt-2 text-slateText">Mainnet readiness for Tatum RPC, Walrus read/write configuration, Sui package configuration, and wallet role.</p>
      <InfrastructureStatusCard />
      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Tatum RPC Gateway</CardTitle></CardHeader>
          <p className="text-sm text-slateText">Endpoint: <span className="mono text-white">{appConfig.tatumEndpoint}</span></p>
          <p className="mt-2 text-sm text-slateText">API key is checked server-side only. When configured, this page verifies checkpoint and chain identifier through Tatum RPC.</p>
        </Card>
        <Card>
          <CardHeader><CardTitle>Wallet</CardTitle></CardHeader>
          {account ? <WalletPill address={account.address} /> : <p className="text-sm text-warning">Connect wallet when ready to sign mainnet transactions.</p>}
          <p className="mt-3 text-sm text-slateText">Role is inferred by comparing this address to the Grant Room builder or sponsor wallet.</p>
        </Card>
      </div>
    </AppShell>
  );
}
