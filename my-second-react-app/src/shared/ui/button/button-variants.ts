import { cva } from "class-variance-authority";

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-lg border border-transparent px-4 py-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-primary text-white shadow-sm hover:bg-primary/90 focus-visible:ring-primary/60",
        secondary: "bg-slate-100 text-slate-800 shadow-sm hover:bg-slate-200 focus-visible:ring-slate-400/50 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700",
        outline: "border-slate-300 bg-transparent text-slate-700 hover:bg-slate-100 focus-visible:ring-slate-400/50 dark:border-slate-600 dark:text-slate-100 dark:hover:bg-slate-800",
        ghost: "bg-transparent text-slate-600 hover:bg-slate-100 focus-visible:ring-slate-400/40 dark:text-slate-300 dark:hover:bg-slate-800",
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
