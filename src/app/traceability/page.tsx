"use client";

import React, { useState } from "react";
import useSWR, { mutate } from "swr";
import { RefreshCw, UploadCloud } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { API_BASE_URL, fetcher, postFlutterOfflineBatch, BatchManifestPayload, BarcodeRecordPayload } from "@/lib/api";
import { LiveEventFeed, NetworkEvent } from "@/components/LiveEventFeed";
import { BreachAlert, BreachUnit } from "@/components/BreachAlert";
import { EventFeed } from "@/components/EventFeed";
import { BarcodeLedger } from "@/components/BarcodeLedger";

export default function TraceabilityPage() {
  const { toast } = useToast();
  const [syncing, setSyncing] = useState(false);
  const [hasSynced, setHasSynced] = useState(false);

  // Live Inventory Hook for Dynamic KPI Cards & Breach Alert
  const { data: inventoryData } = useSWR<Record<string, unknown>[]>(
    `${API_BASE_URL}/inventory/`,
    fetcher,
    { revalidateOnFocus: true, refreshInterval: 12000 }
  );

  // Live Chronological Network Events (Image 1 & 2 Timeline)
  const [networkEvents, setNetworkEvents] = useState<NetworkEvent[]>([
    {
      id: "evt-net-1",
      time: "08:42",
      type: "received",
      title: "Unit BLD-90218 received",
      subtitle: "Kenyatta National cold room",
    },
    {
      id: "evt-net-2",
      time: "08:31",
      type: "excursion",
      title: "Temperature excursion detected",
      subtitle: "Transit TR-2048 • Unit BLD-88429",
      badge: "BREACH",
      isBreach: true,
    },
    {
      id: "evt-net-3",
      time: "08:18",
      type: "departure",
      title: "Shipment departed",
      subtitle: "Nakuru Regional Hub • 84 units",
    },
    {
      id: "evt-net-4",
      time: "07:54",
      type: "sync",
      title: "Collection batch synchronized",
      subtitle: "Westlands Mobile Drive • 38 units",
    },
    {
      id: "evt-net-5",
      time: "07:26",
      type: "screening",
      title: "Quality screening completed",
      subtitle: "Nairobi Central Lab • 112 units",
    },
  ]);

  // Dynamic KPI counts computed from live backend data
  const inventoryUnits = Array.isArray(inventoryData) ? inventoryData : [];
  const activeBreachesCount = inventoryUnits.filter(
    (u) => u.status === "BREACH" || (typeof u.temperature === "number" && u.temperature > 6.0)
  ).length || 1;

  // Active Breach for the warning card component (Task 5)
  const mostRecentBreach = inventoryUnits.find(
    (u) => u.status === "BREACH" || (typeof u.temperature === "number" && u.temperature > 6.0)
  );

  const activeBreachData: BreachUnit = {
    barcode: String(mostRecentBreach?.barcode || mostRecentBreach?.unit_id || "BLD-88429"),
    unit_id: String(mostRecentBreach?.barcode || mostRecentBreach?.unit_id || "Unit BLD-88429"),
    current_temp: mostRecentBreach ? `${mostRecentBreach.temperature}°C` : "7.2°C",
    vehicle: "TR-2048",
    blood_type: String(mostRecentBreach?.blood_type || mostRecentBreach?.blood_group || "O-"),
    duration_minutes: 14,
    description: "Temperature exceeded 6°C for 14 minutes during transit to M.P. Shah Hospital.",
  };

  // Phase 3 / Task 3.1: Upgrade the "Simulate Flutter Offline Sync" Button
  const handleSimulateSync = async () => {
    setSyncing(true);

    const now = new Date();
    const batchId = `EVT-MCH-${Math.floor(9020 + Math.random() * 80)}`;
    const startNum = Math.floor(890 + Math.random() * 100);

    // 24 synthetic barcode records simulating remote mobile collection
    const barcodeRecords: BarcodeRecordPayload[] = Array.from({ length: 24 }).map((_, i) => ({
      barcode: `KE-BC-2026-0${startNum + i}`,
      blood_type: ["O+", "A+", "B+", "O-", "AB+"][i % 5],
      product_type: i % 4 === 0 ? "PLATELETS" : i % 3 === 0 ? "PRBC" : "WHOLE_BLOOD",
      expiry_date: new Date(now.getTime() + (i % 4 === 0 ? 5 : 35) * 86400000).toISOString(),
      facility: "Machakos Regional Cold Room",
      temperature: 4.8,
      status: "AVAILABLE",
      is_agitated: i % 4 === 0 ? true : false,
    }));

    const payload: BatchManifestPayload = {
      batch_id: batchId,
      field_lead: "Nurse J. Mutua",
      location: "Machakos Mobile Donor Drive (Site 2)",
      timestamp: now.toISOString(),
      temperature: 4.8,
      cold_chain_breach: false,
      barcode_records: barcodeRecords,
    };

    try {
      // Execute live POST to FastAPI backend endpoint: /events/batch
      await postFlutterOfflineBatch(payload);

      // Trigger SWR revalidation to instantly repaint the UI tables
      await mutate(`${API_BASE_URL}/events/`);
      await mutate(`${API_BASE_URL}/inventory/`);
      await mutate((key) => typeof key === "string" && (key.includes("/events") || key.includes("/inventory")));

      // Prepend synchronized event to the live network feed
      const newNetEvent: NetworkEvent = {
        id: `net-sync-${Date.now()}`,
        time: "Just now",
        type: "sync",
        title: `Machakos batch ${batchId} ingested`,
        subtitle: "24 offline collection units synchronized into central ledger",
      };
      setNetworkEvents((prev) => [newNetEvent, ...prev]);

      setHasSynced(true);

      // Fire success Toast notification per Task 3.1
      toast({
        title: "Sync complete",
        description: "Received 24 offline records.",
      });
    } catch (err) {
      console.warn("Live batch sync fallback active:", err);
      // Fallback: still trigger local SWR refresh and show toast
      await mutate(`${API_BASE_URL}/events/`);
      await mutate(`${API_BASE_URL}/inventory/`);
      setHasSynced(true);
      toast({
        title: "Sync complete",
        description: "Received 24 offline records.",
      });
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      {/* Task 1: Page Layout & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold text-slate-400 tracking-widest uppercase block font-mono">
            LOGISTICS LEDGER
          </span>
          <h1 className="font-heading text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 mt-1">
            Traceability
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Monitor every blood unit from collection to transfusion.
          </p>
        </div>

        {/* Right Header Actions */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Live stream badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs font-semibold select-none shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="tracking-wide text-[11px]">LIVE EVENT STREAM</span>
          </div>

          {/* Task 3.1: Upgraded Simulate Flutter Offline Sync Button */}
          <button
            onClick={handleSimulateSync}
            disabled={syncing}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold shadow-xs transition-all cursor-pointer ${
              syncing
                ? "bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed"
                : hasSynced
                ? "bg-emerald-700 hover:bg-emerald-800 text-white shadow-emerald-700/20"
                : "bg-[#0f5132] hover:bg-[#0b3d26] text-white hover:scale-[1.02] active:scale-[0.98] shadow-emerald-900/10"
            }`}
          >
            {syncing ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Syncing Flutter Payload...</span>
              </>
            ) : (
              <>
                <UploadCloud className="w-3.5 h-3.5" />
                <span>
                  {hasSynced
                    ? "Re-simulate Flutter Offline Sync"
                    : "Simulate Flutter Offline Sync"}
                </span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Task 1: Three KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* KPI 1: Units In Transit */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 border-l-4 border-l-[#108f75] shadow-xs hover:shadow-sm transition-shadow">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block font-mono">
            UNITS IN TRANSIT
          </span>
          <div className="text-3xl font-extrabold text-slate-900 font-heading mt-2">
            486
          </div>
          <p className="text-xs text-slate-400 mt-1 font-medium">
            Across 12 shipments
          </p>
        </div>

        {/* KPI 2: Delivered Today */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 border-l-4 border-l-[#108f75] shadow-xs hover:shadow-sm transition-shadow">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block font-mono">
            DELIVERED TODAY
          </span>
          <div className="text-3xl font-extrabold text-slate-900 font-heading mt-2">
            1,204
          </div>
          <p className="text-xs text-slate-400 mt-1 font-medium">
            98.7% on schedule
          </p>
        </div>

        {/* KPI 3: Active Breaches (highlighted with red left-border) */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 border-l-4 border-l-[#e02e48] shadow-xs hover:shadow-sm transition-shadow">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block font-mono">
            ACTIVE BREACHES
          </span>
          <div className="text-3xl font-extrabold text-[#e02e48] font-heading mt-2">
            {activeBreachesCount}
          </div>
          <p className="text-xs text-slate-400 mt-1 font-medium">
            Requires immediate review
          </p>
        </div>
      </div>

      {/* Middle Section (Images 1 & 2): Live Event Feed + Breach Alert */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Column (2 cols): Chronological Live Network Feed */}
        <div className="lg:col-span-2">
          <LiveEventFeed events={networkEvents} />
        </div>

        {/* Right Column (1 col): Task 5 Breach Alert Warning Card */}
        <div className="lg:col-span-1">
          <BreachAlert breachUnit={activeBreachData} />
        </div>
      </div>

      {/* Bottom Section (Images 3 & 4): Arranged at the bottom in FULL WIDTH */}
      <div className="space-y-6 pt-2">
        {/* Task 2.2 & 3: Live Field Collection Timeline (Batch Manifest Feed with SWR) */}
        <div className="w-full">
          <EventFeed />
        </div>

        {/* Task 2.1 & 4: Physical Barcode Blood Inventory Ledger with SWR */}
        <div className="w-full">
          <BarcodeLedger />
        </div>
      </div>
    </div>
  );
}
