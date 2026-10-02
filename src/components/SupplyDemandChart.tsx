"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { SupplyDemandPoint } from "@/lib/api";

interface SupplyDemandChartProps {
  data: SupplyDemandPoint[];
}

export function SupplyDemandChart({ data }: SupplyDemandChartProps) {
  const [selectedRange, setSelectedRange] = React.useState("Last 7 days");
  const [rangeDropdown, setRangeDropdown] = React.useState(false);

  // Fallback default points if empty
  const chartData = React.useMemo(() => {
    if (data && data.length > 0) {
      return data.map((d) => ({
        ...d,
        supply: d.supply_units ?? d.supply ?? 0,
        demand: d.demand_units ?? d.demand ?? 0,
      }));
    }
    return [
      { date: "Day 1", supply: 940, demand: 810 },
      { date: "Day 2", supply: 1080, demand: 920 },
      { date: "Day 3", supply: 1120, demand: 980 },
      { date: "Day 4", supply: 1250, demand: 1050 },
      { date: "Day 5", supply: 1200, demand: 1140 },
      { date: "Day 6", supply: 1320, demand: 1220 },
      { date: "Day 7", supply: 1420, demand: 1240 },
    ];
  }, [data]);

  const totalSupply = React.useMemo(
    () => chartData.reduce((acc, curr) => acc + curr.supply, 0),
    [chartData]
  );
  const totalDemand = React.useMemo(
    () => chartData.reduce((acc, curr) => acc + curr.demand, 0),
    [chartData]
  );
  const netBalance = totalSupply - totalDemand;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-col justify-between">
      {/* Header with Title and Range Picker */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h3 className="font-bold text-slate-900 text-base font-heading">
            Supply vs. demand
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Network-wide movement over the last 7 days
          </p>
        </div>

        {/* Time Filter Dropdown */}
        <div className="relative">
          <button
            onClick={() => setRangeDropdown(!rangeDropdown)}
            className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-medium text-slate-700 shadow-2xs flex items-center gap-2 hover:border-slate-300 transition-colors cursor-pointer"
          >
            <span>{selectedRange}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>
          {rangeDropdown && (
            <div className="absolute right-0 mt-1.5 w-32 bg-white border border-slate-200 rounded-xl shadow-lg p-1 z-30 text-xs">
              {["Last 7 days", "Last 14 days", "Last 30 days"].map((range) => (
                <button
                  key={range}
                  onClick={() => {
                    setSelectedRange(range);
                    setRangeDropdown(false);
                  }}
                  className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-slate-50 font-medium text-slate-700"
                >
                  {range}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Composed Chart Canvas (Task 2.4) */}
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData} margin={{ top: 10, right: 15, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="overviewSupplyFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.18} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.01} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />

            <XAxis
              dataKey="date"
              stroke="#94a3b8"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              dy={10}
            />

            <YAxis
              stroke="#94a3b8"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              domain={["auto", "auto"]}
              tickFormatter={(v: number) => v.toLocaleString()}
            />

            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const pt = payload[0]?.payload;
                  return (
                    <div className="bg-slate-900 text-white rounded-xl p-2.5 text-xs shadow-xl space-y-1 border border-slate-800">
                      <p className="font-semibold text-slate-200">{pt.date}</p>
                      <p className="text-emerald-400 font-mono font-medium">
                        Supply: {pt.supply?.toLocaleString()} units
                      </p>
                      <p className="text-rose-400 font-mono font-medium">
                        Demand: {pt.demand?.toLocaleString()} units
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />

            {/* Subtle green Area fill beneath Supply */}
            <Area
              type="monotone"
              dataKey="supply"
              stroke="none"
              fill="url(#overviewSupplyFill)"
              fillOpacity={1}
            />

            {/* Dashed red Demand Line (stroke="#ef4444" strokeDasharray="5 5") */}
            <Line
              type="monotone"
              dataKey="demand"
              stroke="#ef4444"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={false}
            />

            {/* Thick solid green Supply Line (stroke="#10b981") */}
            <Line
              type="monotone"
              dataKey="supply"
              stroke="#10b981"
              strokeWidth={3}
              dot={(props) => {
                if (props.index === chartData.length - 1) {
                  return (
                    <circle
                      key={`supply-dot-${props.index}`}
                      cx={props.cx}
                      cy={props.cy}
                      r={5}
                      fill="#10b981"
                      stroke="#ffffff"
                      strokeWidth={2.5}
                    />
                  );
                }
                return <React.Fragment key={`empty-dot-${props.index}`} />;
              }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Bottom Chart Legend & Net balance */}
      <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-5">
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-1 bg-[#10b981] rounded-full" />
            <span className="text-slate-500">Supply</span>
            <span className="font-bold text-slate-800 font-mono">
              {totalSupply.toLocaleString()}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-0.5 border-t-2 border-dashed border-[#ef4444]" />
            <span className="text-slate-500">Demand</span>
            <span className="font-bold text-slate-800 font-mono">
              {totalDemand.toLocaleString()}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 font-medium">
          <span className="text-slate-400">Net balance</span>
          <span
            className={`font-bold font-mono ${
              netBalance >= 0 ? "text-emerald-600" : "text-rose-600"
            }`}
          >
            {netBalance >= 0 ? `+${netBalance.toLocaleString()}` : netBalance.toLocaleString()} units
          </span>
        </div>
      </div>
    </div>
  );
}
