import { ReactNode } from "react";
import { Sidebar } from "@/components/app/Sidebar";
import { TopNav } from "@/components/app/TopNav";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen lg:flex">
      <Sidebar />
      <div className="min-w-0 flex-1">
        <TopNav />
        <main className="px-4 py-8 sm:px-6 xl:px-8">{children}</main>
      </div>
    </div>
  );
}
