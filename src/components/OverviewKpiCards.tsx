"use client";

import * as React from "react";
import { Droplet, FileText, MoreHorizontal } from "lucide-react";
import { Line, LineChart, ResponsiveContainer } from "recharts";
import { DashboardKpis, KpiMetric } from "@/lib/api";

interface OverviewKpiCardsProps {
  kpis: DashboardKpis;
}

interface SparklineProps {
  data: number[];
  color: string;
}

function MiniSparkline({ data, color }: SparklineProps) {
  const chartData = React.useMemo(() => {
    if (!data || data.length === 0) {
      return [{ val: 10 }, { val: 20 }, { val: 15 }, { val: 25 }];
    }
    return data.map((v, i) => ({ idx: i, val: v }));
  }, [data]);

  return (
    <div className="w-24 h-7 shrink-0">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 2, right: 2, left: 2, bottom: 2 }}>
          <Line
            type="monotone"
            dataKey="val"
            stroke={color}
            strokeWidth={2.5}
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function OverviewKpiCards({ kpis }: OverviewKpiCardsProps) {
  const totalInv = kpis?.total_inventory || {
    value: 12847,
    unit: "units",
    change_pct: 4.2,
    comparison_text: "vs. yesterday",
    sparkline: [12100, 12250, 12400, 12300, 12550, 12700, 12847],
  };

  const dailyCollection = kpis?.daily_collection_rate || {
    value: 1284,
    unit: "units",
    change_pct: 8.1,
    comparison_text: "vs. 7-day avg",
    sparkline: [1100, 1150, 1200, 1180, 1220, 1250, 1284],
  };

  const pendingReqs = kpis?.pending_requests || {
    value: 386,
    unit: "requests",
    change_pct: -2.4,
    comparison_text: "vs. yesterday",
    sparkline: [410, 402, 395, 398, 390, 392, 386],
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      {/* Card 1: Total inventory */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div className="w-9 h-9 rounded-xl bg-rose-50 text-[#e02e48] flex items-center justify-center">
            <Droplet className="w-4 h-4 fill-[#e02e48]" />
          </div>
          <button
            className="text-slate-300 hover:text-slate-500 transition-colors p-1"
            title="Options"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>

        <div className="mt-4">
          <span className="text-xs font-medium text-slate-500 block">Total inventory</span>
          <div className="flex items-baseline justify-between mt-1">
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-mono">
                {totalInv.value.toLocaleString()}
              </span>
              <span className="text-xs text-slate-400 font-medium">{totalInv.unit}</span>
            </div>

            {/* Sparkline Recharts Component */}
            <MiniSparkline data={totalInv.sparkline} color="#e02e48" />
          </div>
        </div>

        <div
          className={`mt-3 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-xs font-semibold ${
            totalInv.change_pct >= 0 ? "text-emerald-600" : "text-rose-600"
          }`}
        >
          <span>
            {totalInv.change_pct >= 0 ? `+${totalInv.change_pct}%` : `${totalInv.change_pct}%`}
          </span>
          <span className="text-slate-400 font-normal">{totalInv.comparison_text}</span>
        </div>
      </div>

      {/* Card 2: Daily collection rate */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Droplet className="w-4 h-4 fill-emerald-600" />
          </div>
          <button
            className="text-slate-300 hover:text-slate-500 transition-colors p-1"
            title="Options"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>

        <div className="mt-4">
          <span className="text-xs font-medium text-slate-500 block">Daily collection rate</span>
          <div className="flex items-baseline justify-between mt-1">
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-mono">
                {dailyCollection.value.toLocaleString()}
              </span>
              <span className="text-xs text-slate-400 font-medium">{dailyCollection.unit}</span>
            </div>

            {/* Sparkline Recharts Component */}
            <MiniSparkline data={dailyCollection.sparkline} color="#10b981" />
          </div>
        </div>

        <div
          className={`mt-3 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-xs font-semibold ${
            dailyCollection.change_pct >= 0 ? "text-emerald-600" : "text-rose-600"
          }`}
        >
          <span>
            {dailyCollection.change_pct >= 0
              ? `+${dailyCollection.change_pct}%`
              : `${dailyCollection.change_pct}%`}
          </span>
          <span className="text-slate-400 font-normal">{dailyCollection.comparison_text}</span>
        </div>
      </div>

      {/* Card 3: Pending requests */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <FileText className="w-4 h-4" />
          </div>
          <button
            className="text-slate-300 hover:text-slate-500 transition-colors p-1"
            title="Options"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>

        <div className="mt-4">
          <span className="text-xs font-medium text-slate-500 block">Pending requests</span>
          <div className="flex items-baseline justify-between mt-1">
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-mono">
                {pendingReqs.value.toLocaleString()}
              </span>
              <span className="text-xs text-slate-400 font-medium">{pendingReqs.unit}</span>
            </div>

            {/* Sparkline Recharts Component */}
            <MiniSparkline data={pendingReqs.sparkline} color="#8b5cf6" />
          </div>
        </div>

        <div
          className={`mt-3 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-xs font-semibold ${
            pendingReqs.change_pct <= 0 ? "text-purple-600" : "text-amber-600"
          }`}
        >
          <span>
            {pendingReqs.change_pct > 0
              ? `+${pendingReqs.change_pct}%`
              : `${pendingReqs.change_pct}%`}
          </span>
          <span className="text-slate-400 font-normal">{pendingReqs.comparison_text}</span>
        </div>
      </div>
    </div>
  );
}
