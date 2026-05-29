import { Check } from "lucide-react";

export function DeliverablesChecklist({ items }: { items: string[] }) {
  return (
    <ul className="grid gap-2">
      {items.map((item) => (
        <li className="flex items-center gap-2 text-sm text-mist" key={item}>
          <Check size={16} className="text-success" />
          {item}
        </li>
      ))}
    </ul>
  );
}
