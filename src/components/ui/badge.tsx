import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 font-mono uppercase tracking-wider",
  {
    variants: {
      variant: {
        default: "border-transparent bg-slate-900 text-white shadow-2xs",
        secondary: "border-transparent bg-slate-100 text-slate-900",
        destructive: "border-transparent bg-rose-100 text-rose-700",
        outline: "text-slate-700 border-slate-200",
        deficit: "border-rose-200 bg-rose-100 text-rose-700",
        surplus: "border-emerald-200 bg-emerald-100 text-emerald-800",
        balanced: "border-purple-200 bg-purple-100 text-purple-700",
        healthy: "border-emerald-200 bg-emerald-100 text-emerald-800",
        critical: "border-rose-200 bg-rose-100 text-rose-700",
        urgent: "border-amber-200 bg-amber-100 text-amber-800",
        stable: "border-emerald-200 bg-emerald-100 text-emerald-800",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
