import { cva } from "class-variance-authority";

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-all duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--focus-ring-offset)] disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "bg-[var(--primary)] text-[var(--primary-foreground)] shadow-[0_18px_35px_-18px_rgba(37,99,235,0.55)] hover:bg-opacity-90 hover:shadow-[0_22px_45px_-20px_rgba(37,99,235,0.6)]",
        secondary:
          "border border-[var(--surface-border)] bg-[var(--surface-card-bg)] text-[var(--app-fg)] shadow-sm hover:bg-[var(--surface-card-hover-bg)]",
        outline:
          "border border-[var(--surface-border)] bg-transparent text-[var(--app-fg)] hover:bg-[var(--surface-card-hover-bg)]",
        ghost:
          "bg-transparent text-[var(--text-muted)] hover:bg-[var(--surface-card-hover-bg)] hover:text-[var(--text-subtle)]",
      },
      size: {
        sm: "px-3 py-1 text-xs",
        md: "px-4 py-2 text-sm",
        lg: "px-5 py-3 text-base",
        icon: "h-9 w-9 p-0",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);
