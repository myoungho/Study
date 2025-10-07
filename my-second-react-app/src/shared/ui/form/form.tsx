import type { HTMLAttributes, LabelHTMLAttributes } from "react";
import { Slot } from "@radix-ui/react-slot";
import type { FieldError } from "react-hook-form";
import { cn } from "@/shared/lib/cn";

export function FormField({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("space-y-2", className)} {...props} />;
}

export function FormLabel({ className, ...props }: LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={cn("text-sm font-medium text-slate-700 dark:text-slate-200", className)}
      {...props}
    />
  );
}

export function FormDescription({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn("text-xs text-slate-500 dark:text-slate-400", className)} {...props} />
  );
}

type FormMessageProps = HTMLAttributes<HTMLParagraphElement> & {
  error?: string | FieldError;
};

export function FormMessage({ error, className, ...props }: FormMessageProps) {
  if (!error) return null;

  const message = typeof error === "string" ? error : error.message;
  if (!message) return null;

  return (
    <p className={cn("text-xs font-medium text-rose-500", className)} {...props}>
      {message}
    </p>
  );
}

export function FormControl({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex flex-col", className)} {...props} />;
}

export function FormItem({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("space-y-1.5", className)} {...props} />;
}

export const FormSlot = Slot;
