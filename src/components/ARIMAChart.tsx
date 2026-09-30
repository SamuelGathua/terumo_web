"use client";

import React from "react";
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { DemandPoint } from "@/lib/api";

interface ARIMAChartProps {
  data: DemandPoint[];
  baselineMean?: number;
  facilityName?: string;
}

export function ARIMAChart({ data, baselineMean, facilityName }: ARIMAChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="h-72 flex items-center justify-center text-slate-500 border border-slate-800 rounded-xl bg-slate-950/40">
        No forecast points available.
      </div>
    );
  }

  // Format chart data for shaded area representation (upper - lower as range or direct values)
  const chartData = data.map((pt) => {
    const dateObj = new Date(pt.date);
    const label = isNaN(dateObj.getTime())
      ? pt.date
      : dateObj.toLocaleDateString("en-US", { month: "short", day: "numeric" });

    return {
      dateLabel: label,
      fullDate: pt.date,
      predicted: pt.predicted_units,
      lower: pt.confidence_lower_95,
      upper: pt.confidence_upper_95,
      // For shaded area between lower and upper
      range: [pt.confidence_lower_95, pt.confidence_upper_95],
    };
  });

  return (
    <div className="w-full bg-slate-900/60 border border-slate-800 rounded-2xl p-5 backdrop-blur-md shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold text-slate-100">
              7-Day ARIMA Quantitative Forecast
            </h3>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-400 border border-cyan-800/60">
              ARIMA(1,1,1)
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            {facilityName || "Regional Transfusion Hub"} • 95% Confidence Interval Envelopes
          </p>
        </div>

        <div className="flex items-center gap-4 text-xs font-medium">
          <div className="flex items-center gap-1.5 text-cyan-400">
            <span className="w-3 h-0.5 bg-cyan-400 rounded-full" />
            <span>Predicted Demand</span>
          </div>
          <div className="flex items-center gap-1.5 text-cyan-500/60">
            <span className="w-3 h-2 bg-cyan-500/20 border border-cyan-500/40 rounded-sm" />
            <span>95% Confidence Band</span>
          </div>
          {baselineMean !== undefined && (
            <div className="flex items-center gap-1.5 text-amber-400">
              <span className="w-3 h-0.5 border-t border-dashed border-amber-400" />
              <span>Historical Mean ({Math.round(baselineMean)}u)</span>
            </div>
          )}
        </div>
      </div>

      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
            <defs>
              <linearGradient id="confidenceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.03} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />

            <XAxis
              dataKey="dateLabel"
              stroke="#64748b"
              fontSize={12}
              tickLine={false}
              axisLine={{ stroke: "#334155" }}
            />

            <YAxis
              stroke="#64748b"
              fontSize={12}
              tickLine={false}
              axisLine={{ stroke: "#334155" }}
              tickFormatter={(v) => `${v}u`}
            />

            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const item = payload[0].payload;
                  return (
                    <div className="bg-slate-900 border border-slate-700/80 rounded-xl p-3 shadow-2xl text-xs backdrop-blur-lg">
                      <p className="font-semibold text-slate-200 mb-1.5">{item.fullDate}</p>
                      <div className="space-y-1">
                        <p className="text-cyan-400 flex justify-between gap-4">
                          <span>Predicted Units:</span>
                          <span className="font-mono font-bold text-sm">{item.predicted} units</span>
                        </p>
                        <p className="text-slate-400 flex justify-between gap-4">
                          <span>Upper 95% Bound:</span>
                          <span className="font-mono">{item.upper} units</span>
                        </p>
                        <p className="text-slate-400 flex justify-between gap-4">
                          <span>Lower 95% Bound:</span>
                          <span className="font-mono">{item.lower} units</span>
                        </p>
                        {baselineMean !== undefined && (
                          <p className="text-amber-400 flex justify-between gap-4 pt-1 border-t border-slate-800">
                            <span>Baseline Mean:</span>
                            <span className="font-mono">{Math.round(baselineMean)} units</span>
                          </p>
                        )}
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />

            {/* Shaded 95% Confidence Interval Band */}
            <Area
              type="monotone"
              dataKey="range"
              stroke="transparent"
              fill="url(#confidenceGradient)"
              fillOpacity={1}
            />

            {/* Historical Baseline Reference */}
            {baselineMean !== undefined && (
              <ReferenceLine
                y={baselineMean}
                stroke="#f59e0b"
                strokeDasharray="4 4"
                strokeWidth={1.5}
              />
            )}

            {/* Main Predicted Trajectory Line */}
            <Line
              type="monotone"
              dataKey="predicted"
              stroke="#06b6d4"
              strokeWidth={3}
              dot={{ r: 4, fill: "#0891b2", stroke: "#06b6d4", strokeWidth: 2 }}
              activeDot={{ r: 6, fill: "#22d3ee", stroke: "#fff", strokeWidth: 2 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
