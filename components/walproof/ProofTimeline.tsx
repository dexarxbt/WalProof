import { Card, CardHeader, CardTitle } from "@/components/ui/card";

export function ProofTimeline({ items }: { items: string[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Proof Timeline</CardTitle>
      </CardHeader>
      <ol className="space-y-3">
        {items.map((item, index) => (
          <li className="flex gap-3 text-sm text-slate" key={item}>
            <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-royal text-xs font-bold text-white">{index + 1}</span>
            {item}
          </li>
        ))}
      </ol>
    </Card>
  );
}
