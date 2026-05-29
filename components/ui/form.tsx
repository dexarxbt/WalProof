import { InputHTMLAttributes, LabelHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Label({ className, ...props }: LabelHTMLAttributes<HTMLLabelElement>) {
  return <label className={cn("text-sm font-semibold text-mist", className)} {...props} />;
}

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "min-h-12 w-full rounded-[1.25rem] border border-white/10 bg-navy/70 px-4 text-sm text-white outline-none transition placeholder:text-slateText focus:border-ice",
        className
      )}
      {...props}
    />
  );
}

export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "min-h-28 w-full rounded-[1.25rem] border border-white/10 bg-navy/70 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slateText focus:border-ice",
        className
      )}
      {...props}
    />
  );
}

export function Select({ className, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        "min-h-12 w-full rounded-[1.25rem] border border-white/10 bg-navy/70 px-4 text-sm text-white outline-none transition focus:border-ice",
        className
      )}
      {...props}
    />
  );
}
