"use client";

import * as React from "react";
import useSWR from "swr";
import Link from "next/link";
import { format } from "date-fns";
import {
  AlertTriangle,
  ArrowRight,
  ChevronDown,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { API_BASE_URL, fetcher, OverviewSummaryResponse } from "@/lib/api";
import { OverviewKpiCards } from "@/components/OverviewKpiCards";
import { SupplyDemandChart } from "@/components/SupplyDemandChart";
import { BloodTypeBars } from "@/components/BloodTypeBars";
import { PriorityRequestsTable } from "@/components/PriorityRequestsTable";
import { LiveActivityFeed } from "@/components/LiveActivityFeed";

export default function OverviewPage() {
  const [selectedRegion, setSelectedRegion] = React.useState("East Africa");
  const [regionDropdown, setRegionDropdown] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Task 2.1: Global Dashboard SWR Fetch from Redis-cached FastAPI endpoint
  const swrUrl = `${API_BASE_URL}/overview/summary`;
  const { data, error, isLoading, isValidating } = useSWR<OverviewSummaryResponse>(
    swrUrl,
    fetcher,
    {
      revalidateOnFocus: true,
      refreshInterval: 15000,
      dedupingInterval: 5000,
    }
  );

  // Task 2.2: Dynamic date formatting with date-fns
  const todayDateString = React.useMemo(() => {
    try {
      return format(new Date(), "EEEE, d MMMM").toUpperCase();
    } catch {
      return "TODAY";
    }
  }, []);

  // Full-page loading skeleton mimicking layout while initial fetch occurs
  if (isLoading && !data) {
    return (
      <div className="space-y-6 animate-pulse">
        {/* Header Skeleton */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <Skeleton className="h-3 w-32 bg-slate-200" />
            <Skeleton className="h-8 w-64 bg-slate-200" />
            <Skeleton className="h-4 w-72 bg-slate-200" />
          </div>
          <Skeleton className="h-9 w-32 rounded-xl bg-slate-200" />
        </div>

        {/* Alert Banner Skeleton */}
        <Skeleton className="h-20 w-full rounded-2xl bg-rose-50 border border-rose-100" />

        {/* 3 KPI Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <Skeleton className="h-40 rounded-2xl bg-slate-100" />
          <Skeleton className="h-40 rounded-2xl bg-slate-100" />
          <Skeleton className="h-40 rounded-2xl bg-slate-100" />
        </div>

        {/* Middle Row Skeletons */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <Skeleton className="lg:col-span-2 h-96 rounded-2xl bg-slate-100" />
          <Skeleton className="h-96 rounded-2xl bg-slate-100" />
        </div>

        {/* Bottom Row Skeletons */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <Skeleton className="lg:col-span-2 h-80 rounded-2xl bg-slate-100" />
          <Skeleton className="h-80 rounded-2xl bg-slate-100" />
        </div>
      </div>
    );
  }

  const headerAlerts = data?.header_alerts || {
    critical_shortages: 2,
    active_breaches: 1,
    total_alerts: 3,
    summary:
      "Two facilities face projected shortages within 48 hours. One cold-chain breach detected in transit.",
  };

  const isAlertActive = headerAlerts.total_alerts > 0;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* 1. Page Header Greeting */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span
              suppressHydrationWarning
              className="text-[11px] font-bold text-slate-400 tracking-widest uppercase block font-mono"
            >
              {mounted ? todayDateString : "TODAY"}
            </span>
            {isValidating && (
              <span title="Validating live dashboard with Redis" className="inline-flex">
                <RefreshCw className="w-3 h-3 text-slate-400 animate-spin" />
              </span>
            )}
            {data?.cached && (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold">
                REDIS CACHED
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-heading mt-0.5">
            Good morning, Amina
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Here&apos;s what is happening across your regional blood infrastructure today.
          </p>
        </div>

        {/* Region Selector */}
        <div className="flex items-center gap-2 relative">
          <span className="text-xs text-slate-400 font-medium">Region</span>
          <div className="relative">
            <button
              onClick={() => setRegionDropdown(!regionDropdown)}
              className="bg-white border border-slate-200/90 rounded-xl px-3.5 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs flex items-center gap-2 hover:border-slate-300 transition-colors cursor-pointer"
            >
              <span>{selectedRegion}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>
            {regionDropdown && (
              <div className="absolute right-0 mt-1.5 w-36 bg-white border border-slate-200 rounded-xl shadow-lg p-1 z-30 text-xs">
                {["East Africa", "Central Hub", "Coastal Region", "Rift Valley"].map((r) => (
                  <button
                    key={r}
                    onClick={() => {
                      setSelectedRegion(r);
                      setRegionDropdown(false);
                    }}
                    className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-slate-50 font-medium text-slate-700 cursor-pointer"
                  >
                    {r}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 2. Dynamic Header & Critical Alert Banner (Task 2.2) */}
      {isAlertActive ? (
        <div className="bg-[#fff1f2] border border-[#ffe4e6] rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="p-2.5 rounded-xl bg-rose-100/90 text-[#e02e48] shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-rose-950 text-sm">
                {headerAlerts.total_alerts} critical alert
                {headerAlerts.total_alerts === 1 ? "" : "s"} require attention
              </h4>
              <p className="text-xs text-rose-800/80 mt-0.5">
                {headerAlerts.summary}
              </p>
            </div>
          </div>

          <Link
            href="/forecasts"
            className="text-xs font-bold text-[#e02e48] hover:text-rose-700 flex items-center gap-1.5 shrink-0 self-end sm:self-auto group transition-colors"
          >
            <span>Review alerts</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      ) : (
        <div className="bg-emerald-50/80 border border-emerald-200/80 rounded-2xl p-4 flex items-center justify-between gap-4 shadow-2xs">
          <div className="flex items-center gap-3.5">
            <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-700 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-emerald-950 text-sm">
                All regional cold-chain buffers healthy
              </h4>
              <p className="text-xs text-emerald-800/80 mt-0.5">
                No active temperature excursions or emergency blood shortages reported.
              </p>
            </div>
          </div>
          <Link
            href="/traceability"
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
          >
            <span>View ledger</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* 3. Three KPI Metric Cards with Recharts Mini Sparklines (Task 2.3) */}
      <OverviewKpiCards kpis={data?.kpis!} />

      {/* 4. Middle Row: Supply vs. Demand Chart & Inventory by Blood Type (Tasks 2.4 & 2.5) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          <SupplyDemandChart data={data?.supply_vs_demand || []} />
        </div>
        <div>
          <BloodTypeBars inventoryByType={data?.inventory_by_type || {}} />
        </div>
      </div>

      {/* 5. Bottom Row: Priority Requests & Live Network Activity (Task 2.6) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <PriorityRequestsTable requests={data?.priority_requests || []} />
        <LiveActivityFeed activities={data?.live_activity || []} />
      </div>
    </div>
  );
}
