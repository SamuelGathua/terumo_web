"use client";

import * as React from "react";
import useSWR from "swr";
import {
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { API_BASE_URL, fetcher, DemandForecastResponse, DemandPoint } from "@/lib/api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { RefreshCw } from "lucide-react";

interface ArimaChartProps {
  selectedFacility?: string;
  facilityName?: string;
  horizonDays: number;
  onHorizonChange: (days: number) => void;
  data?: DemandPoint[];
  initialData?: DemandPoint[];
  totalPredictedUnits?: number;
}

export function ArimaChart({
  selectedFacility = "HOSP-NAIROBI-01",
  facilityName = "Kenyatta National Referral Hospital",
  horizonDays,
  onHorizonChange,
  data,
  initialData,
}: ArimaChartProps) {
  // Task 3.1: Wire live SWR data fetching from FastAPI + Redis cache
  const swrUrl = `${API_BASE_URL}/predict/demand/${selectedFacility}?horizon_days=${horizonDays}`;
  const { data: forecastData, isLoading, isValidating } = useSWR<DemandForecastResponse>(
    swrUrl,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 30000,
    }
  );

  // Map incoming JSON to the Recharts component
  const rawPoints: DemandPoint[] = React.useMemo(() => {
    return forecastData?.forecast || data || initialData || [];
  }, [forecastData?.forecast, data, initialData]);

  const chartData = React.useMemo(() => {
    if (!rawPoints || rawPoints.length === 0) return [];
    return rawPoints.map((pt) => {
      const d = new Date(pt.date);
      const label = isNaN(d.getTime())
        ? pt.date
        : d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      return {
        date: label,
        fullDate: pt.date,
        predicted_units: Number(pt.predicted_units || 0),
        confidence_lower: Number(pt.confidence_lower_95 || 0),
        confidence_upper: Number(pt.confidence_upper_95 || 0),
      };
    });
  }, [rawPoints]);

  // Dynamic calculation of cumulative predicted units
  const cumulativeUnits = React.useMemo(() => {
    if (!chartData || chartData.length === 0) return 0;
    return Math.round(chartData.reduce((sum, d) => sum + d.predicted_units, 0));
  }, [chartData]);

  const horizonLabel =
    horizonDays === 7
      ? "7-DAY"
      : horizonDays === 14
      ? "14-DAY"
      : horizonDays === 30
      ? "1-MONTH"
      : "3-MONTH";

  // Task 3.1: Pulsing skeleton chart loading state while SWR fetches
  if (isLoading && (!forecastData || chartData.length === 0)) {
    return (
      <Card className="p-6 bg-white border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <Skeleton className="h-5 w-48 bg-slate-200/70" />
            <Skeleton className="h-3 w-64 bg-slate-200/70" />
          </div>
          <div className="flex items-center gap-3">
            <Skeleton className="h-9 w-32 rounded-xl bg-slate-200/70" />
            <Skeleton className="h-10 w-28 rounded-xl bg-slate-200/70" />
          </div>
        </div>
        <div className="h-80 w-full flex flex-col justify-end gap-3 pt-6">
          <Skeleton className="h-full w-full rounded-2xl bg-slate-100 animate-pulse" />
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-white border border-slate-200/80 shadow-xs">
      {/* Top Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-slate-900 font-heading tracking-tight">
              Predicted blood unit demand
            </h3>
            {isValidating && (
              <span title="Validating with Redis cache" className="inline-flex">
                <RefreshCw className="w-3.5 h-3.5 text-violet-500 animate-spin" />
              </span>
            )}
            {forecastData?.cached && (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-violet-50 text-violet-700 border border-violet-200 font-semibold">
                REDIS CACHED
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            {facilityName} · All blood types
          </p>
        </div>

        <div className="flex items-center gap-5 self-end md:self-auto">
          {/* Horizon State Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-medium hidden sm:inline">Horizon:</span>
            <Select
              value={String(horizonDays)}
              onValueChange={(val) => onHorizonChange(Number(val))}
            >
              <SelectTrigger className="w-32 bg-white border-slate-200 text-xs font-semibold rounded-xl">
                <SelectValue placeholder="Select Horizon" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">7 Days</SelectItem>
                <SelectItem value="14">14 Days</SelectItem>
                <SelectItem value="30">1 Month</SelectItem>
                <SelectItem value="90">3 Months</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Cumulative Total Metric - Verified Sum of Horizon Forecast */}
          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block font-mono">
              {horizonLabel} FORECAST
            </span>
            <span className="text-xl sm:text-2xl font-black font-mono text-violet-600 tracking-tight">
              {cumulativeUnits.toLocaleString()} units
            </span>
          </div>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="h-80 w-full">
        {chartData.length === 0 ? (
          <div className="h-full flex items-center justify-center text-xs text-slate-400 border border-dashed border-slate-200 rounded-xl">
            No demand forecast available for this facility.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={chartData}
              margin={{ top: 15, right: 25, left: 20, bottom: 25 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />

              <XAxis
                dataKey="date"
                stroke="#475569"
                tick={{ fill: "#0f172a", fontSize: 11, fontWeight: 600 }}
                tickLine={{ stroke: "#475569", strokeWidth: 1.5 }}
                axisLine={{ stroke: "#64748b", strokeWidth: 1.5 }}
                dy={6}
                label={{
                  value: "Forecast Timeline (Days)",
                  position: "insideBottom",
                  offset: -18,
                  style: {
                    textAnchor: "middle",
                    fill: "#0f172a",
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: "0.02em",
                  },
                }}
              />

              {/* Dynamic Y-Axis scaling to live ML payload */}
              <YAxis
                stroke="#475569"
                tick={{ fill: "#0f172a", fontSize: 11, fontWeight: 600 }}
                tickLine={{ stroke: "#475569", strokeWidth: 1.5 }}
                axisLine={{ stroke: "#64748b", strokeWidth: 1.5 }}
                tickFormatter={(v) => `${v}`}
                domain={[0, (dataMax: number) => Math.max(10, Math.ceil(dataMax * 1.15))]}
                dx={-4}
                label={{
                  value: "Predicted Blood Demand (Units)",
                  angle: -90,
                  position: "insideLeft",
                  offset: 2,
                  style: {
                    textAnchor: "middle",
                    fill: "#0f172a",
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: "0.02em",
                  },
                }}
              />

              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const item = payload[0]?.payload;
                    return (
                      <div className="bg-slate-900 text-white rounded-xl p-3 text-xs shadow-2xl space-y-1.5 border border-slate-800">
                        <p className="font-semibold text-slate-200">{item.fullDate}</p>
                        <p className="text-violet-400 font-mono font-bold flex justify-between gap-4">
                          <span>Predicted Demand:</span>
                          <span>{item.predicted_units} units</span>
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />

              {/* Primary Purple Prediction Line scaling dynamically to ML payload */}
              <Line
                type="monotone"
                dataKey="predicted_units"
                stroke="#7c3aed"
                strokeWidth={3}
                dot={{ r: 3.5, fill: "#7c3aed", stroke: "#ffffff", strokeWidth: 1.5 }}
                activeDot={{ r: 6, fill: "#5b21b6", stroke: "#ffffff", strokeWidth: 2 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Chart Legend */}
      <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="w-4 h-0.5 bg-[#7c3aed] rounded-full" />
            <span className="font-medium text-slate-700">ARIMA ML Demand Trajectory</span>
          </div>
        </div>
        <span className="text-[11px] font-mono text-slate-400">
          Source: Historical hospital orders & Ornstein-Uhlenbeck stochastic baseline
        </span>
      </div>
    </Card>
  );
}
