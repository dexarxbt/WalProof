import Link from "next/link";
import Image from "next/image";
import { Gauge, Home, Layers3, ShieldCheck, SquarePen } from "lucide-react";

const nav = [
  { href: "/", label: "Home", icon: Home },
  { href: "/dashboard", label: "Dashboard", icon: Gauge },
  { href: "/grants/new", label: "Create Grant Room", icon: SquarePen },
  { href: "/review", label: "Sponsor Review", icon: ShieldCheck },
  { href: "/status", label: "Status", icon: Layers3 }
];

export function Sidebar() {
  return (
    <aside className="hidden min-h-screen w-72 border-r border-white/10 bg-navy/78 p-5 backdrop-blur-2xl lg:block">
      <Link href="/" className="logo-shell mb-10 flex h-12 w-[180px] items-center justify-center rounded-full border px-4">
        <Image
          src="/walproof-web/assets/walproof-logo-cropped.png"
          alt="WalProof"
          width={220}
          height={54}
          className="logo-img h-8 w-full object-contain"
          priority
        />
      </Link>
      <nav className="grid gap-2">
        {nav.map((item) => (
          <Link
            className="flex h-11 items-center gap-3 rounded-full px-3 text-sm font-semibold text-slateText transition hover:bg-white/[.06] hover:text-white"
            href={item.href}
            key={item.href}
          >
            <item.icon size={18} />
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="glass mt-8 rounded-[1.25rem] p-4">
        <p className="text-sm font-bold text-white">Proof before payout.</p>
        <p className="mt-1 text-xs leading-5 text-slateText">Walrus evidence, Sui Records, and Tatum RPC verification on mainnet.</p>
      </div>
    </aside>
  );
}
