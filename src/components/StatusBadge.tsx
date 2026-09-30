import React from "react";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const normalized = status.toUpperCase().replace(/\s+/g, "_");

  let colorClasses = "bg-slate-800 text-slate-300 border-slate-700";

  switch (normalized) {
    case "LOW_RISK":
    case "RETAINED":
    case "AVAILABLE":
    case "SAFE":
      colorClasses = "bg-emerald-950/70 text-emerald-400 border-emerald-800/60 shadow-[0_0_10px_rgba(16,185,129,0.15)]";
      break;

    case "MODERATE_RISK":
    case "PENDING":
    case "PENDING_SYNC":
      colorClasses = "bg-amber-950/70 text-amber-400 border-amber-800/60 shadow-[0_0_10px_rgba(245,158,11,0.15)]";
      break;

    case "HIGH_RISK":
    case "CRITICAL":
    case "BREACH":
    case "LAPSED":
    case "COLD_CHAIN_BREACH":
      colorClasses = "bg-rose-950/80 text-rose-400 border-rose-800/80 shadow-[0_0_12px_rgba(244,63,94,0.25)] animate-pulse";
      break;

    case "IN_TRANSIT":
    case "SYNCED":
      colorClasses = "bg-cyan-950/70 text-cyan-400 border-cyan-800/60 shadow-[0_0_10px_rgba(6,182,212,0.15)]";
      break;

    case "TRANSFUSED":
      colorClasses = "bg-blue-950/70 text-blue-400 border-blue-800/60";
      break;

    default:
      colorClasses = "bg-slate-900 text-slate-300 border-slate-800";
  }

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide border uppercase",
        colorClasses,
        className
      )}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
      {status.replace(/_/g, " ")}
    </span>
  );
}
