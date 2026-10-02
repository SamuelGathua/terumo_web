"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface BloodTypeBarsProps {
  inventoryByType: Record<string, number>;
}

const BLOOD_GROUPS = ["O+", "A+", "B+", "AB+", "O-", "A-", "B-", "AB-"];

export function BloodTypeBars({ inventoryByType }: BloodTypeBarsProps) {
  // Task 2.5: Calculate maximum value to dynamically set width percentages
  const maxUnits = React.useMemo(() => {
    const values = Object.values(inventoryByType || {});
    if (values.length === 0) return 3000;
    return Math.max(...values, 100);
  }, [inventoryByType]);

  const bloodTypeRows = React.useMemo(() => {
    return BLOOD_GROUPS.map((type) => {
      const units = Number(inventoryByType?.[type] ?? 0);
      const pct = Math.min(100, Math.max(8, Math.round((units / maxUnits) * 100)));

      // Task 2.5: Color coding - Green for healthy stock, Amber for low stock, Red for critical
      let color = "bg-[#10b981]";
      let statusLabel = "Healthy";
      if (units < 600 || pct < 25) {
        color = "bg-[#ef4444]";
        statusLabel = "Critical";
      } else if (units < 1800 || pct < 55) {
        color = "bg-[#f59e0b]";
        statusLabel = "Low";
      }

      return {
        type,
        units,
        pct,
        color,
        statusLabel,
      };
    });
  }, [inventoryByType, maxUnits]);

  const totalTrackedUnits = React.useMemo(() => {
    return Object.values(inventoryByType || {}).reduce((acc, curr) => acc + curr, 0);
  }, [inventoryByType]);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-bold text-slate-900 text-base font-heading">
            Inventory by blood type
          </h3>
          <Link
            href="/forecasts"
            className="w-8 h-8 rounded-xl border border-slate-200 hover:bg-slate-50 flex items-center justify-center text-slate-500 hover:text-slate-800 transition-colors"
            title="View full forecasts"
          >
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <p className="text-xs text-slate-500 mb-5">
          Available units across all regional cold rooms ({totalTrackedUnits.toLocaleString()} total)
        </p>

        {/* Dynamic Horizontal Progress Bars */}
        <div className="space-y-3.5">
          {bloodTypeRows.map((b) => (
            <div key={b.type} className="flex items-center gap-3 text-xs group">
              <span className="w-7 font-bold text-slate-700 font-mono text-[11px] shrink-0">
                {b.type}
              </span>
              <div
                className="flex-1 bg-slate-100 h-2 rounded-full overflow-hidden"
                title={`${b.type}: ${b.units.toLocaleString()} units (${b.statusLabel})`}
              >
                <div
                  className={`h-full rounded-full ${b.color} transition-all duration-500`}
                  style={{ width: `${b.pct}%` }}
                />
              </div>
              <span className="w-12 text-right font-mono font-medium text-slate-700 text-[11px] shrink-0">
                {b.units.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Legend Indicator */}
      <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#10b981]" />
            <span>Healthy</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#f59e0b]" />
            <span>Low</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#ef4444]" />
            <span>Critical</span>
          </span>
        </div>
        <span className="font-mono text-[10px]">Threshold: 600u</span>
      </div>
    </div>
  );
}
