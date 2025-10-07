import type { HTMLAttributes } from "react";
import { cn } from "@/shared/lib/cn";

export function PageContainer({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("mx-auto flex w-full max-w-5xl flex-col gap-8 px-6 py-16", className)}
      {...props}
    />
  );
}

export function PageHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("space-y-2", className)} {...props} />;
}

export function PageTitle({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return <h1 className={cn("text-3xl font-bold tracking-tight text-[var(--app-fg)]", className)} {...props} />;
}

export function PageSubtitle({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("text-base text-muted", className)} {...props} />;
}