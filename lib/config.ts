import { getPublicNetwork, getTatumEndpoint } from "@/lib/env";

export const appConfig = {
  name: process.env.NEXT_PUBLIC_APP_NAME ?? "WalProof",
  network: getPublicNetwork(),
  tatumEndpoint: getTatumEndpoint(),
  packageId: process.env.NEXT_PUBLIC_WALPROOF_PACKAGE_ID ?? "",
  registryModule: process.env.NEXT_PUBLIC_WALPROOF_REGISTRY_MODULE ?? "registry",
  walrusNetwork: process.env.NEXT_PUBLIC_WALRUS_NETWORK ?? "mainnet"
};
