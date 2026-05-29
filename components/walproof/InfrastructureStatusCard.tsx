import { SuiStatusCard } from "@/components/walproof/SuiStatusCard";
import { TatumStatusCard } from "@/components/walproof/TatumStatusCard";
import { WalrusStatusCard } from "@/components/walproof/WalrusStatusCard";

export function InfrastructureStatusCard() {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <TatumStatusCard />
      <WalrusStatusCard />
      <SuiStatusCard />
    </div>
  );
}
