import { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Badge({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-white/12 bg-white/[.055] px-2.5 py-1 text-xs font-semibold text-mist",
        className
      )}
      {...props}
    />
  );
}
