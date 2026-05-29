import type { Metadata } from "next";
import { Barlow, Instrument_Serif } from "next/font/google";
import { Providers } from "@/app/providers";
import "./globals.css";

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  variable: "--font-heading",
  weight: ["400"],
  style: ["normal", "italic"]
});

const barlow = Barlow({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["300", "400", "500", "600", "700"]
});

export const metadata: Metadata = {
  title: "WalProof | Proof before payout.",
  description: "Walrus-stored milestone evidence and Tatum-powered Sui proof records for Web3 grants."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${instrumentSerif.variable} ${barlow.variable} font-[var(--font-body)]`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
