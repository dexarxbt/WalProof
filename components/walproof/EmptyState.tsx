import Link from "next/link";
import { FilePlus2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function EmptyState({ title, body, href, action }: { title: string; body: string; href?: string; action?: string }) {
  return (
    <Card className="grid min-h-72 place-items-center text-center">
      <div className="max-w-md">
        <FilePlus2 className="mx-auto mb-4 text-ice" size={42} />
        <h2 className="mb-2 font-[var(--font-heading)] text-2xl font-semibold">{title}</h2>
        <p className="mb-6 text-slate">{body}</p>
        {href && action ? (
          <Link href={href}>
            <Button>{action}</Button>
          </Link>
        ) : null}
      </div>
    </Card>
  );
}
