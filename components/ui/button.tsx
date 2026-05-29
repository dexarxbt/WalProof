import { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
};

export function Button({ className, variant = "primary", ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-white transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-ice disabled:pointer-events-none disabled:opacity-50",
        variant === "primary" && "liquid-glass-strong",
        variant === "secondary" && "liquid-glass",
        variant === "ghost" && "text-white/90 hover:bg-white/8",
        variant === "danger" && "border border-danger/30 bg-danger/10 text-danger",
        className
      )}
      {...props}
    />
  );
}
