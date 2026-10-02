"use client";

import React from "react";
import useSWR from "swr";
import { CloudUpload, Droplet, MapPin, RefreshCw } from "lucide-react";
import { formatDistanceToNow, parseISO, isValid } from "date-fns";
import { API_BASE_URL, fetcher } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";

export interface BatchManifestEvent {
  event_id: string;
  location: string;
  timestamp: string;
  collection_timestamp?: string;
  barcode_range?: string;
  sync_status: "PENDING_SYNC" | "SYNCED" | string;
  temperature: number;
  breach?: boolean;
  officer?: string;
  field_lead?: string;
  isOfflineUpload?: boolean;
  is_offline_upload?: boolean;
  units_count?: number;
  is_single_event?: boolean;
}

const defaultFallbackEvents: BatchManifestEvent[] = [
  {
    event_id: "EVT-MCH-9021",
    location: "Machakos Mobile Donor Drive (Site 2)",
    timestamp: "18 mins ago",
    barcode_range: "KE-BC-2026-0891 ➔ 0914 (24 Units)",
    sync_status: "PENDING_SYNC",
    temperature: 11.4,
    breach: true,
    officer: "Nurse J. Mutua",
    field_lead: "Nurse J. Mutua",
    isOfflineUpload: true,
  },
  {
    event_id: "EVT-NRB-8942",
    location: "University of Nairobi Student Center Drive",
    timestamp: "1 hour ago",
    barcode_range: "KE-BC-2026-0850 ➔ 0890 (41 Units)",
    sync_status: "SYNCED",
    temperature: 4.2,
    breach: false,
    officer: "Officer K. Ochieng",
    field_lead: "Officer K. Ochieng",
  },
  {
    event_id: "EVT-KSM-7719",
    location: "Kisumu County Transfusion Station",
    timestamp: "3 hours ago",
    barcode_range: "KE-BC-2026-0810 ➔ 0849 (40 Units)",
    sync_status: "SYNCED",
    temperature: 3.8,
    breach: false,
    officer: "Technologist A. Kiprop",
    field_lead: "Technologist A. Kiprop",
  },
  {
    event_id: "EVT-MSA-6502",
    location: "Mombasa Coastal Blood Center Depot",
    timestamp: "5 hours ago",
    barcode_range: "KE-BC-2026-0770 ➔ 0809 (40 Units)",
    sync_status: "SYNCED",
    temperature: 4.6,
    breach: false,
    officer: "Liaison F. Mwangi",
    field_lead: "Liaison F. Mwangi",
  },
];

interface EventFeedProps {
  initialEvents?: BatchManifestEvent[];
  className?: string;
}

export function EventFeed({ initialEvents, className = "" }: EventFeedProps) {
  // Task 2.2: SWR Live Integration with Read-Through Redis Caching
  const { data, isLoading, isValidating } = useSWR<Record<string, unknown>[]>(
    `${API_BASE_URL}/events/`,
    fetcher,
    {
      fallbackData: initialEvents as unknown as Record<string, unknown>[],
      revalidateOnFocus: true,
      refreshInterval: 12000,
    }
  );

  const formatTimestamp = (rawTime?: string) => {
    if (!rawTime) return "Recently";
    try {
      if (rawTime.includes("ago") || rawTime.includes("Just")) return rawTime;
      const parsed = parseISO(rawTime);
      if (isValid(parsed)) {
        return formatDistanceToNow(parsed, { addSuffix: true });
      }
      return rawTime;
    } catch {
      return rawTime;
    }
  };

  const rawEvents = data && Array.isArray(data) && data.length > 0 ? data : ((initialEvents || defaultFallbackEvents) as unknown as Record<string, unknown>[]);
  const events: BatchManifestEvent[] = rawEvents.map((evt) => ({
    event_id: String(evt.event_id || "EVT-GEN-001"),
    location: String(evt.location || evt.location_id || "Mobile Collection Site"),
    timestamp: formatTimestamp(String(evt.collection_timestamp || evt.timestamp || "")),
    barcode_range: String(evt.barcode_range || "KE-BC-2026-0891 ➔ 0914 (24 Units)"),
    sync_status: String(evt.sync_status || "SYNCED"),
    temperature: typeof evt.temperature === "number" ? evt.temperature : (evt.cold_chain_breach_flag ? 11.4 : 4.2),
    breach: evt.breach !== undefined ? Boolean(evt.breach) : (Boolean(evt.cold_chain_breach_flag) || Number(evt.temperature || 0) > 6.0),
    officer: String(evt.officer || evt.field_lead || "Nurse J. Mutua"),
    field_lead: String(evt.field_lead || evt.officer || "Nurse J. Mutua"),
    isOfflineUpload: Boolean(evt.isOfflineUpload || evt.is_offline_upload || evt.sync_status === "PENDING_SYNC"),
    is_single_event: Boolean(evt.is_single_event || (!evt.barcode_range && !String(evt.event_id || "").startsWith("EVT-"))),
  }));

  return (
    <div
      className={`p-6 sm:p-7 rounded-3xl bg-[#16352b] border border-[#275344] shadow-xl space-y-5 text-white ${className}`}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg sm:text-xl font-bold font-heading text-white tracking-tight flex items-center gap-2.5">
            <span>Live Field Collection Timeline</span>
            {isValidating && (
              <span title="Refreshing events from Redis cache" className="inline-flex">
                <RefreshCw className="w-3.5 h-3.5 text-[#4ef0c9] animate-spin" />
              </span>
            )}
          </h2>
          <p className="text-xs text-[#8cb3a5] mt-0.5">
            Incoming chronological stream of collection batches synced from remote drives.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono px-3 py-1 rounded-full bg-[#108f75]/20 text-[#4ef0c9] border border-[#2daa8f]/40 font-semibold shadow-xs">
            {events.length} Events Ingested
          </span>
        </div>
      </div>

      {/* Manifest Cards Feed */}
      <div className="space-y-3.5">
        {isLoading && (!data || data.length === 0) ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={`event-skel-${i}`} className="p-5 rounded-2xl bg-[#112d24]/60 border border-[#1f4a3d] space-y-3">
              <div className="flex items-center gap-3">
                <Skeleton className="w-9 h-9 rounded-xl bg-[#1b4336]" />
                <div className="space-y-1.5 flex-1">
                  <Skeleton className="h-4 w-48 bg-[#1b4336]" />
                  <Skeleton className="h-3 w-32 bg-[#1b4336]" />
                </div>
              </div>
            </div>
          ))
        ) : (
          events.map((evt) => {
            const isPending = evt.sync_status === "PENDING_SYNC";
            const isBreach = evt.breach || evt.temperature > 6.0 || evt.temperature < 2.0;

            // Distinct rendering for Standard Single Events vs Batch Manifest Cards
            if (evt.is_single_event) {
              return (
                <div
                  key={evt.event_id}
                  className="p-4 rounded-2xl border bg-[#112d24]/70 border-[#1f4a3d] hover:border-[#2daa8f]/40 flex items-center justify-between gap-4 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-[#108f75]/20 text-[#4ef0c9]">
                      <Droplet className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-semibold text-sm text-[#f1f7f4]">{evt.location}</span>
                      <p className="text-xs text-[#8cb3a5]">Single Unit Ingest • {evt.timestamp}</p>
                    </div>
                  </div>
                  <span className="text-xs font-mono text-[#4ef0c9]">{evt.temperature.toFixed(1)}°C</span>
                </div>
              );
            }

            // Distinct "Batch Manifest" Card for Mobile Field Uploads
            return (
              <div
                key={evt.event_id}
                className={`p-4 sm:p-5 rounded-2xl border transition-all duration-200 flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                  isBreach
                    ? "bg-[#2d171d]/90 border-[#7f1d2c] shadow-[0_0_15px_rgba(224,46,72,0.12)]"
                    : "bg-[#112d24]/90 border-[#1f4a3d] hover:border-[#2daa8f]/40"
                }`}
              >
                {/* Left Column: Icon + Details */}
                <div className="flex items-start gap-3.5 min-w-0">
                  <div
                    className={`p-2.5 rounded-xl shrink-0 mt-0.5 ${
                      isBreach
                        ? "bg-[#e02e48]/20 text-rose-300 border border-[#e02e48]/30"
                        : "bg-[#108f75]/25 text-[#4ef0c9] border border-[#2daa8f]/30"
                    }`}
                  >
                    {evt.isOfflineUpload || isPending ? (
                      <CloudUpload className="w-4 h-4" />
                    ) : (
                      <MapPin className="w-4 h-4" />
                    )}
                  </div>

                  <div className="min-w-0">
                    {/* Header: Location & Sub-header: Batch ID */}
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold text-[#f1f7f4] text-sm tracking-tight">
                        {evt.location}
                      </span>
                      <span className="text-[11px] font-mono text-[#8cb3a5]/70 tracking-wider">
                        {evt.event_id}
                      </span>
                    </div>

                    {/* Body: Barcode Range */}
                    <p className="text-xs text-[#8cb3a5] mt-1">
                      Barcodes:{" "}
                      <span className="font-mono text-[#4ef0c9] font-medium">
                        {evt.barcode_range}
                      </span>
                    </p>

                    {/* Footer: Metadata */}
                    <p className="text-[11px] text-[#8cb3a5]/70 mt-1">
                      Field Lead: {evt.field_lead || evt.officer} • Collected {evt.timestamp}
                    </p>
                  </div>
                </div>

                {/* Right Column: Temperature & Sync Status */}
                <div className="flex items-center justify-between md:justify-end gap-6 pt-3 md:pt-0 border-t md:border-t-0 border-[#275344]/60">
                  <div className="text-left md:text-right">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-[#8cb3a5]/70 block font-mono">
                      TRANSIT TEMPERATURE
                    </span>
                    <span
                      className={`font-mono font-bold text-sm tracking-tight ${
                        isBreach ? "text-[#f87171] animate-pulse" : "text-[#4ef0c9]"
                      }`}
                    >
                      {evt.temperature.toFixed(1)}°C {isBreach && "(EXCURSION)"}
                    </span>
                  </div>

                  <div>
                    {isPending ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold font-mono tracking-wide bg-[#3d240e] text-[#f59e0b] border border-[#b45309]/50 shadow-[0_0_10px_rgba(245,158,11,0.2)]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#f59e0b] animate-ping" />
                        PENDING SYNC
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold font-mono tracking-wide bg-[#0c2f25] text-[#22c55e] border border-[#16654e]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e]" />
                        SYNCED
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
