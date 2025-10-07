import { cva } from "class-variance-authority";

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-lg border border-transparent px-4 py-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-[color:var(--color-primary)] text-[color:var(--color-primary-foreground)] hover:bg-[color:color-mix(in srgb, var(--color-primary) 92%, white)]",
        secondary: "bg-[color:var(--nav-bg)] text-[color:var(--app-fg)] border-surface hover:bg-[color:var(--card-hover-bg)]",
        outline: "border-surface bg-transparent text-[color:var(--text-muted)] hover:bg-[color:var(--card-hover-bg)]",
        ghost: "bg-transparent text-[color:var(--text-muted)] hover:bg-[color:var(--card-hover-bg)]",
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
