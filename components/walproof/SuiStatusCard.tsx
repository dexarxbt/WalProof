import { Boxes } from "lucide-react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/walproof/StatusBadge";
import { appConfig } from "@/lib/config";

export function SuiStatusCard() {
  const configured = Boolean(appConfig.packageId);
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Boxes size={19} /> Sui Record</CardTitle>
        <StatusBadge status={configured ? "package_configured" : "setup_required"} />
      </CardHeader>
      <p className="text-sm text-slate">Network: <span className="text-white">{appConfig.network}</span></p>
      <p className="mono mt-2 break-all text-xs text-slate">
        Package ID: {appConfig.packageId || "Contract ready locally. Mainnet package ID appears here after publish."}
      </p>
    </Card>
  );
}
