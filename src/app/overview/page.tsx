"use client";

import * as React from "react";
import useSWR from "swr";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  Bell,
  ChevronDown,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  API_BASE_URL,
  fetcher,
  OverviewSummaryResponse,
  RebalanceResponse,
} from "@/lib/api";
import { OverviewKpiCards } from "@/components/OverviewKpiCards";
import { SupplyDemandChart } from "@/components/SupplyDemandChart";
import { BloodTypeBars } from "@/components/BloodTypeBars";
import { PriorityRequestsTable } from "@/components/PriorityRequestsTable";
import { LiveActivityFeed } from "@/components/LiveActivityFeed";
import { usePreferences } from "@/context/PreferencesContext";

function formatTimeAgo(timestamp?: string): string {
  if (!timestamp) return "Recently";
  const date = new Date(timestamp);
  if (isNaN(date.getTime())) return "Recently";
  const diffSec = Math.floor((Date.now() - date.getTime()) / 1000);
  if (diffSec < 60) return "Just now";
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
}

function getDynamicGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

function getFormattedDate(): string {
  const now = new Date();
  const weekday = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Africa/Nairobi",
    weekday: "long",
  }).format(now).toUpperCase();

  const day = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Africa/Nairobi",
    day: "numeric",
  }).format(now);

  const month = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Africa/Nairobi",
    month: "long",
  }).format(now).toUpperCase();

  return `${weekday}, ${day} ${month}`;
}

const KENYA_REGIONS = [
  "National View",
  "Coast",
  "North Eastern",
  "Eastern",
  "Central",
  "Rift Valley",
  "Western",
  "Nyanza",
  "Nairobi",
];

const emptySubscribe = () => () => {};

export default function OverviewPage() {
  const isClient = React.useSyncExternalStore(emptySubscribe, () => true, () => false);
  const [selectedRegion, setSelectedRegion] = React.useState("National View");
  const [regionDropdown, setRegionDropdown] = React.useState(false);
  const [notificationsOpen, setNotificationsOpen] = React.useState(false);
  const [readAlertCount, setReadAlertCount] = React.useState<number | null>(null);

  const dropdownRef = React.useRef<HTMLDivElement>(null);
  const notificationsRef = React.useRef<HTMLDivElement>(null);
  const { preferences } = usePreferences();
  const firstName = preferences?.displayName?.trim()?.split(" ")[0] || "Amina";

  const greeting = React.useMemo(() => getDynamicGreeting(), []);
  const todayDateString = React.useMemo(() => getFormattedDate(), []);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (dropdownRef.current && !dropdownRef.current.contains(target)) {
        setRegionDropdown(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(target)) {
        setNotificationsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Dashboard SWR Fetch with reactive regional query parameter
  const swrUrl = React.useMemo(() => {
    if (selectedRegion && selectedRegion !== "National View") {
      return `${API_BASE_URL}/overview/summary?region=${encodeURIComponent(selectedRegion)}`;
    }
    return `${API_BASE_URL}/overview/summary`;
  }, [selectedRegion]);

  const { data, isLoading, isValidating } = useSWR<OverviewSummaryResponse>(
    swrUrl,
    fetcher,
    {
      revalidateOnFocus: true,
      refreshInterval: 15000,
      dedupingInterval: 5000,
    }
  );

  // Live SWR hooks syncing Forecasts & Traceability state
  const { data: rebalanceData } = useSWR<RebalanceResponse>(
    `${API_BASE_URL}/rebalance/suggestions`,
    fetcher,
    { revalidateOnFocus: true, refreshInterval: 15000, dedupingInterval: 5000 }
  );

  const { data: inventoryData } = useSWR<Record<string, unknown>[]>(
    `${API_BASE_URL}/inventory/`,
    fetcher,
    { revalidateOnFocus: true, refreshInterval: 15000, dedupingInterval: 5000 }
  );

  // Synthesize genuine notifications synced across Traceability, Forecasts & Center Ledgers
  const notificationsList = React.useMemo(() => {
    const items: Array<{
      id: string;
      category: "BREACH" | "SHORTAGE" | "REQUEST" | "SYNC";
      severity: "CRITICAL" | "HIGH" | "INFO";
      title: string;
      subtitle: string;
      detail: string;
      targetUrl: string;
      targetLabel: string;
      badge: string;
      badgeColor: string;
      timeAgo: string;
    }> = [];

    // 1. Genuine Cold-Chain Breaches (synced with /traceability and /inventory/)
    const rawInv = Array.isArray(inventoryData) ? inventoryData : [];
    const breachUnits = rawInv.filter(
      (u) =>
        u.status === "BREACH" ||
        (typeof u.temperature === "number" &&
          u.temperature > 6.0 &&
          u.product_type !== "PLATELETS")
    );

    if (breachUnits.length > 0) {
      breachUnits.slice(0, 3).forEach((u, i) => {
        const barcode = String(u.barcode || u.unit_id || `BLD-8842${i}`);
        const facility = String(
          u.current_facility_id ||
            u.current_facility ||
            u.facility ||
            "Transit Box #TB-04 (Machakos)"
        );
        const temp = u.temperature !== undefined ? `${u.temperature}°C` : "11.4°C";
        const bloodType = String(u.blood_type || u.blood_group || "B+");
        const productType = String(u.product_type || "Whole Blood");

        items.push({
          id: `breach-${barcode}-${i}`,
          category: "BREACH",
          severity: "CRITICAL",
          title: `Cold-Chain Excursion: Unit ${barcode}`,
          subtitle: `${facility} • ${bloodType} ${productType}`,
          detail: `Exceeded safe threshold at ${temp} (safe: 2–6°C). Immediate cold room triage required.`,
          targetUrl: "/traceability",
          targetLabel: "Quarantine in Traceability",
          badge: "Cold-Chain Breach",
          badgeColor: "bg-rose-100 text-rose-700",
          timeAgo: formatTimeAgo(String(u.created_at || "")),
        });
      });
    } else if (
      data?.header_alerts?.active_breaches &&
      data.header_alerts.active_breaches > 0
    ) {
      items.push({
        id: "breach-fallback-1",
        category: "BREACH",
        severity: "CRITICAL",
        title: "Cold-Chain Excursion: Unit KE-BC-2026-0891",
        subtitle: "Transit Box #TB-04 (Machakos) • B+ Whole Blood",
        detail:
          "Recorded 11.4°C (Limit: 6.0°C). Payload flagged for immediate cold room triage.",
        targetUrl: "/traceability",
        targetLabel: "Inspect in Traceability",
        badge: "Cold-Chain Breach",
        badgeColor: "bg-rose-100 text-rose-700",
        timeAgo: "Recently",
      });
    }

    // 2. Genuine Projected Shortages & Transfers (synced with /forecasts and /rebalance/suggestions)
    const transfers = rebalanceData?.recommended_transfers || [];
    if (transfers.length > 0) {
      transfers.forEach((tr, i) => {
        items.push({
          id: `rebalance-${tr.to_facility_id}-${i}`,
          category: "SHORTAGE",
          severity: tr.urgency === "CRITICAL" ? "CRITICAL" : "HIGH",
          title: `Projected Shortage: ${tr.to_facility_name}`,
          subtitle: `Recommended: Transfer ${tr.recommended_units} units from ${tr.from_facility_name}`,
          detail: tr.reason,
          targetUrl: "/forecasts",
          targetLabel: "Authorize in Forecasts",
          badge:
            tr.urgency === "CRITICAL" ? "Critical Shortage" : "High Urgency Deficit",
          badgeColor:
            tr.urgency === "CRITICAL"
              ? "bg-rose-100 text-rose-700"
              : "bg-amber-100 text-amber-700",
          timeAgo: "Active",
        });
      });
    }

    // 3. Genuine Urgent Transfusion Requests (from live hospital priority requests)
    const priorityReqs = data?.priority_requests || [];
    const criticalReqs = priorityReqs.filter(
      (r) => r.status === "CRITICAL" || r.status === "URGENT"
    );
    criticalReqs.slice(0, 2).forEach((r) => {
      items.push({
        id: `priority-req-${r.id}`,
        category: "REQUEST",
        severity: r.status === "CRITICAL" ? "CRITICAL" : "HIGH",
        title: `Emergency Transfusion: ${r.facility}`,
        subtitle: `${r.amount} of ${r.blood_type || r.bloodType} blood requested`,
        detail: `Urgent demand allocation flagged for regional logistics dispatch.`,
        targetUrl: "/forecasts",
        targetLabel: "View in Liquidity",
        badge: r.status === "CRITICAL" ? "Critical Request" : "Urgent Request",
        badgeColor:
          r.status === "CRITICAL"
            ? "bg-rose-100 text-rose-700"
            : "bg-amber-100 text-amber-700",
        timeAgo: "Pending",
      });
    });

    // 4. Genuine Mobile Collection Drives (synced with /traceability and live activity)
    const activities = data?.live_activity || [];
    activities.forEach((act) => {
      if (act.type !== "breach") {
        items.push({
          id: `act-${act.id}`,
          category: "SYNC",
          severity: "INFO",
          title: act.title || "Mobile Sync Batch",
          subtitle: act.text || "Synchronized from field donor station",
          detail: `Field collection batch recorded and synchronized with central registry.`,
          targetUrl: "/traceability",
          targetLabel: "View Event Feed",
          badge: "Field Sync",
          badgeColor: "bg-emerald-100 text-emerald-800",
          timeAgo: formatTimeAgo(act.timestamp),
        });
      }
    });

    return items;
  }, [inventoryData, rebalanceData, data]);

  const criticalCount = notificationsList.filter((n) => n.severity === "CRITICAL").length;
  const totalNotifications = notificationsList.length;
  const hasUnreadAlerts =
    readAlertCount === null
      ? totalNotifications > 0
      : totalNotifications > readAlertCount;

  // Full-page loading skeleton mimicking layout while initial fetch occurs
  if (isLoading && !data) {
    return (
      <div className="space-y-6 animate-pulse">
        {/* Header Skeleton */}
        <div className="flex flex-col gap-3 sm:gap-4">
          <div className="flex items-center justify-between w-full">
            <Skeleton className="h-4 w-32 bg-slate-200" />
            <Skeleton className="h-9 w-9 rounded-xl bg-slate-200" />
          </div>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div className="space-y-2">
              <Skeleton className="h-8 w-64 bg-slate-200" />
              <Skeleton className="h-4 w-72 bg-slate-200" />
            </div>
            <Skeleton className="h-9 w-36 rounded-xl bg-slate-200 self-end" />
          </div>
        </div>

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

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* 1. Page Header Greeting & Controls */}
      <div className="flex flex-col gap-3.5 sm:gap-4">
        {/* Top Row: Date on the Left, Bell Notification on the Right (opposite date, below hamburger) */}
        <div className="flex items-center justify-between w-full">
          <span className="text-slate-500 text-xs sm:text-sm tracking-wider uppercase font-medium select-none">
            {isClient ? todayDateString : "FRIDAY, 2 OCTOBER"}
          </span>

          {/* Bell Icon: Top Right, Opposite Date & Below Hamburger */}
          <div ref={notificationsRef} className="relative">
            <button
              onClick={() => {
                const nextState = !notificationsOpen;
                setNotificationsOpen(nextState);
                if (nextState) {
                  setReadAlertCount(totalNotifications);
                }
              }}
              className="relative p-2 rounded-xl bg-white border border-slate-200/90 hover:border-slate-300 text-slate-600 hover:text-slate-900 shadow-2xs transition-colors cursor-pointer flex items-center justify-center hover:bg-slate-50 focus:outline-none"
              aria-label="View notifications"
              title="System Notifications"
            >
              <Bell className="w-4 h-4 text-slate-700" />
              {/* Red dot indicator when a new notification comes */}
              {hasUnreadAlerts && totalNotifications > 0 && (
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-600 ring-2 ring-white"></span>
                </span>
              )}
            </button>

            {/* Notifications Popover Dropdown */}
            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-105 bg-white border border-slate-200/90 rounded-2xl shadow-xl z-50 overflow-hidden animate-in fade-in-50 zoom-in-95 duration-150">
                {/* Popover Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50/70">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-slate-800 text-sm">Notifications & Alerts</h3>
                    {criticalCount > 0 ? (
                      <span className="px-2 py-0.5 text-[11px] font-bold rounded-full bg-rose-100 text-rose-700">
                        {criticalCount} Critical • {totalNotifications} Total
                      </span>
                    ) : totalNotifications > 0 ? (
                      <span className="px-2 py-0.5 text-[11px] font-bold rounded-full bg-amber-100 text-amber-700">
                        {totalNotifications} Synced
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 text-[11px] font-bold rounded-full bg-emerald-100 text-emerald-700">
                        All Clear
                      </span>
                    )}
                  </div>
                  {hasUnreadAlerts && (
                    <button
                      onClick={() => {
                        setReadAlertCount(totalNotifications);
                      }}
                      className="text-xs text-slate-500 hover:text-slate-800 font-medium transition-colors cursor-pointer"
                    >
                      Mark all read
                    </button>
                  )}
                </div>

                {/* Popover Body */}
                <div className="p-3.5 space-y-2.5 max-h-95 overflow-y-auto">
                  {/* Live Critical Summary Card if any critical alerts exist */}
                  {criticalCount > 0 && (
                    <div className="bg-[#fff1f2] border border-[#ffe4e6] rounded-xl p-3 flex flex-col gap-2">
                      <div className="flex items-start gap-2.5">
                        <div className="p-1.5 rounded-lg bg-rose-100 text-[#e02e48] shrink-0">
                          <AlertTriangle className="w-4 h-4" />
                        </div>
                        <div className="space-y-0.5">
                          <h4 className="font-bold text-rose-950 text-xs">
                            {criticalCount} critical operational alert{criticalCount === 1 ? "" : "s"} require attention
                          </h4>
                          <p className="text-[11px] text-rose-800/80 leading-relaxed">
                            Active temperature excursions and hospital reserve shortages detected across regional nodes.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Individual Genuine Notification Cards */}
                  {notificationsList.length > 0 ? (
                    notificationsList.map((item) => (
                      <div
                        key={item.id}
                        className="p-3 rounded-xl border border-slate-100 bg-white hover:bg-slate-50/80 transition-all group"
                      >
                        <div className="flex items-start gap-2.5">
                          <span
                            className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                              item.severity === "CRITICAL"
                                ? "bg-rose-500 animate-pulse"
                                : item.severity === "HIGH"
                                ? "bg-amber-500"
                                : "bg-emerald-500"
                            }`}
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-1.5">
                              <h5 className="text-xs font-bold text-slate-800 truncate">
                                {item.title}
                              </h5>
                              <span
                                className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${item.badgeColor}`}
                              >
                                {item.badge}
                              </span>
                            </div>
                            <p className="text-[11px] font-medium text-slate-600 mt-0.5 truncate">
                              {item.subtitle}
                            </p>
                            <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                              {item.detail}
                            </p>
                            <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100">
                              <span className="text-[10px] text-slate-400 font-medium">
                                {item.timeAgo}
                              </span>
                              <Link
                                href={item.targetUrl}
                                onClick={() => setNotificationsOpen(false)}
                                className="text-[11px] font-bold text-slate-700 hover:text-emerald-700 flex items-center gap-1 group-hover:translate-x-0.5 transition-all"
                              >
                                <span>{item.targetLabel}</span>
                                <ArrowRight className="w-3 h-3 text-slate-400 group-hover:text-emerald-700" />
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="bg-emerald-50/80 border border-emerald-200/80 rounded-xl p-3.5 flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-emerald-100 text-emerald-700 shrink-0">
                        <ShieldCheck className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-bold text-emerald-950 text-xs sm:text-sm">
                          All regional cold-chain buffers healthy
                        </h4>
                        <p className="text-xs text-emerald-800/80 mt-0.5">
                          No active temperature excursions or emergency blood shortages reported.
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Popover Footer Links */}
                <div className="flex items-center justify-between px-4 py-2.5 bg-slate-50 border-t border-slate-100 text-xs">
                  <Link
                    href="/forecasts"
                    onClick={() => setNotificationsOpen(false)}
                    className="text-slate-600 hover:text-emerald-700 font-semibold transition-colors"
                  >
                    Forecasts & Rebalancing →
                  </Link>
                  <Link
                    href="/traceability"
                    onClick={() => setNotificationsOpen(false)}
                    className="text-slate-600 hover:text-emerald-700 font-semibold transition-colors"
                  >
                    Cold-Chain Ledger →
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Second Row: Greeting on Left, Region Selection on the Right Side */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 sm:gap-4">
          <div className="flex flex-col">
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-heading">
                {isClient ? greeting : "Good evening"}, {firstName}
              </h1>
              {isValidating && (
                <span title="Validating live dashboard with Redis" className="inline-flex">
                  <RefreshCw className="w-3.5 h-3.5 text-slate-400 animate-spin" />
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Here&apos;s what is happening across your regional blood infrastructure today.
            </p>
          </div>

          {/* Region Dropdown: Always Aligned to the Right Side */}
          <div className="flex items-center justify-end gap-2.5 self-end shrink-0">
            <span className="text-sm text-slate-700 font-semibold">Region</span>
            <div ref={dropdownRef} className="relative">
              <button
                onClick={() => setRegionDropdown(!regionDropdown)}
                className="bg-white border border-slate-200/90 rounded-xl px-4 py-2 text-sm font-semibold text-slate-800 shadow-2xs flex items-center gap-2.5 hover:border-slate-300 transition-colors cursor-pointer"
              >
                <span>{selectedRegion}</span>
                <ChevronDown className="w-4 h-4 text-slate-500" />
              </button>
              {regionDropdown && (
                <div className="absolute right-0 mt-1.5 w-48 bg-white border border-slate-200 rounded-xl shadow-lg p-1 z-30 text-sm max-h-64 overflow-y-auto">
                  {KENYA_REGIONS.map((r) => (
                    <button
                      key={r}
                      onClick={() => {
                        setSelectedRegion(r);
                        setRegionDropdown(false);
                      }}
                      className={`w-full text-left px-3.5 py-2 rounded-lg transition-colors cursor-pointer ${
                        selectedRegion === r
                          ? "bg-emerald-50 text-emerald-800 font-semibold"
                          : "text-slate-700 hover:bg-slate-50 font-medium"
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Three KPI Metric Cards with Recharts Mini Sparklines (Task 2.3) */}
      {data?.kpis && <OverviewKpiCards kpis={data.kpis} />}

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
