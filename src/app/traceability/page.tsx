"use client";

import React, { useState } from "react";
import {
  Barcode,
  CheckCircle2,
  MapPin,
  RefreshCw,
  Thermometer,
  UploadCloud,
} from "lucide-react";
import { StatusBadge } from "@/components/StatusBadge";

export default function TraceabilityPage() {
  const [syncing, setSyncing] = useState(false);
  const [syncedSuccess, setSyncedSuccess] = useState(false);

  // Mock events and inventory units representing offline-first ledger
  const [events, setEvents] = useState([
    {
      event_id: "EVT-MCH-9021",
      location: "Machakos Mobile Donor Drive (Site 2)",
      timestamp: "18 mins ago",
      barcode_range: "KE-BC-2026-0891 ➔ 0914 (24 Units)",
      sync_status: "PENDING_SYNC",
      temperature: 11.4,
      breach: true,
      officer: "Nurse J. Mutua",
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
    },
  ]);

  const inventoryLedger = [
    {
      barcode: "KE-BC-2026-0891",
      product_type: "WHOLE_BLOOD",
      blood_type: "O+",
      collection_date: "2026-09-30",
      expiry_date: "2026-11-04 (35 Days)",
      facility: "Transit Box #TB-04 (Machakos)",
      status: "IN_TRANSIT",
      temp: "11.4°C (Excursion)",
      breach: true,
    },
    {
      barcode: "KE-BC-2026-0865",
      product_type: "PLATELETS",
      blood_type: "O-",
      collection_date: "2026-09-28",
      expiry_date: "2026-10-03 (3 Days Left!)",
      facility: "Kenyatta National Referral (Cold Room 2)",
      status: "AVAILABLE",
      temp: "22.1°C (Agitated)",
      breach: false,
    },
    {
      barcode: "KE-BC-2026-0870",
      product_type: "PRBC",
      blood_type: "A+",
      collection_date: "2026-09-29",
      expiry_date: "2026-11-10 (41 Days)",
      facility: "Nairobi Regional Blood Depot",
      status: "AVAILABLE",
      temp: "4.1°C",
      breach: false,
    },
    {
      barcode: "KE-BC-2026-0830",
      product_type: "WHOLE_BLOOD",
      blood_type: "B+",
      collection_date: "2026-09-27",
      expiry_date: "2026-11-01 (32 Days)",
      facility: "Jaramogi Oginga Odinga Referral",
      status: "AVAILABLE",
      temp: "3.9°C",
      breach: false,
    },
    {
      barcode: "KE-BC-2026-0792",
      product_type: "PLATELETS",
      blood_type: "AB+",
      collection_date: "2026-09-26",
      expiry_date: "2026-10-01 (Expiring in 24h)",
      facility: "Coast General Hospital Ward",
      status: "AVAILABLE",
      temp: "22.5°C",
      breach: false,
    },
  ];

  const handleSimulateSync = () => {
    setSyncing(true);
    setTimeout(() => {
      setSyncing(false);
      setSyncedSuccess(true);
      setEvents((prev) =>
        prev.map((e) => (e.event_id === "EVT-MCH-9021" ? { ...e, sync_status: "SYNCED" } : e))
      );
    }, 1500);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
              Cold-Chain & Traceability Ledger
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-950/80 text-cyan-400 border border-cyan-800/60 font-mono">
              OFFLINE-FIRST ARCHITECTURE
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Monitoring mobile collection drives, asynchronous field synchronization, and IoT temperature telemetry.
          </p>
        </div>

        {/* Sync Trigger Action */}
        <button
          onClick={handleSimulateSync}
          disabled={syncing || syncedSuccess}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs shadow-lg transition-all ${
            syncedSuccess
              ? "bg-emerald-950 text-emerald-400 border border-emerald-800 cursor-default"
              : "bg-cyan-600 hover:bg-cyan-500 text-white shadow-cyan-600/30 hover:scale-105 active:scale-95"
          }`}
        >
          {syncing ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : syncedSuccess ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          ) : (
            <UploadCloud className="w-4 h-4" />
          )}
          <span>
            {syncing
              ? "Synchronizing Batch..."
              : syncedSuccess
              ? "Mobile Drive Synced ✓"
              : "Simulate Flutter Offline Sync"}
          </span>
        </button>
      </div>

      {/* Cold Chain Health Bar */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900/90 via-slate-900/80 to-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-cyan-950/80 border border-cyan-800 text-cyan-400">
            <Thermometer className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white">Active Cold-Chain Safety Envelope</h2>
            <p className="text-xs text-slate-400">
              Whole Blood Safety Range: <span className="font-mono text-cyan-400 font-semibold">2.0°C – 6.0°C</span> | Platelets Range: <span className="font-mono text-cyan-400 font-semibold">20.0°C – 24.0°C</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6 text-xs font-mono">
          <div>
            <span className="text-slate-500 block text-[10px] uppercase">Telemetry Compliance</span>
            <span className="text-emerald-400 font-bold text-base">99.1% Safe</span>
          </div>
          <div className="border-l border-slate-800 pl-6">
            <span className="text-slate-500 block text-[10px] uppercase">Active Excursions</span>
            <span className="text-rose-400 font-bold text-base">1 Quarantined</span>
          </div>
        </div>
      </div>

      {/* Live Event Feed from Mobile Field Apps */}
      <div className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800 backdrop-blur-md shadow-xl space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white">Live Field Collection Timeline</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Incoming chronological stream of collection batches synced from remote drives.
            </p>
          </div>
          <span className="text-xs font-mono px-3 py-1 rounded-full bg-slate-800 text-slate-300">
            4 Events Ingested
          </span>
        </div>

        <div className="space-y-3">
          {events.map((evt) => (
            <div
              key={evt.event_id}
              className={`p-4 rounded-2xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                evt.breach
                  ? "bg-rose-950/40 border-rose-800/80 shadow-[0_0_15px_rgba(244,63,94,0.1)]"
                  : "bg-slate-950/70 border-slate-800/80 hover:border-slate-700"
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div
                  className={`p-2.5 rounded-xl shrink-0 mt-0.5 ${
                    evt.breach ? "bg-rose-900/60 text-rose-400" : "bg-cyan-950 text-cyan-400"
                  }`}
                >
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-200 text-sm">{evt.location}</span>
                    <span className="text-[10px] font-mono text-slate-500">{evt.event_id}</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Barcodes: <span className="font-mono text-cyan-400 font-medium">{evt.barcode_range}</span>
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Field Lead: {evt.officer} • Collected {evt.timestamp}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between md:justify-end gap-5 pt-3 md:pt-0 border-t md:border-t-0 border-slate-800">
                <div className="text-left md:text-right">
                  <span className="text-[10px] uppercase font-semibold text-slate-500 block">
                    Transit Temperature
                  </span>
                  <span
                    className={`font-mono font-bold text-sm ${
                      evt.breach ? "text-rose-400 animate-pulse" : "text-emerald-400"
                    }`}
                  >
                    {evt.temperature}°C {evt.breach && "(EXCURSION)"}
                  </span>
                </div>

                <div>
                  <StatusBadge status={evt.sync_status} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Blood Unit Barcode Inventory Ledger */}
      <div className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800 backdrop-blur-md shadow-xl space-y-5">
        <div>
          <h2 className="text-lg font-bold text-white">Physical Barcode Blood Inventory Ledger</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Unit-level traceability tracking shelf-life decay and chain-of-custody locations.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="pb-3 font-semibold">Barcode ID</th>
                <th className="pb-3 font-semibold">Blood Group</th>
                <th className="pb-3 font-semibold">Product Type</th>
                <th className="pb-3 font-semibold">Expiry Countdown</th>
                <th className="pb-3 font-semibold">Current Storage Facility</th>
                <th className="pb-3 font-semibold">Cold Telemetry</th>
                <th className="pb-3 font-semibold text-right">Unit Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {inventoryLedger.map((u) => (
                <tr key={u.barcode} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3 font-mono font-bold text-slate-200 flex items-center gap-1.5">
                    <Barcode className="w-3.5 h-3.5 text-slate-400" />
                    <span>{u.barcode}</span>
                  </td>
                  <td className="py-3">
                    <span className="px-2 py-0.5 rounded bg-rose-950/80 text-rose-300 font-bold border border-rose-800/60 font-mono">
                      {u.blood_type}
                    </span>
                  </td>
                  <td className="py-3 font-medium text-slate-300">{u.product_type}</td>
                  <td className="py-3 font-mono text-slate-300">
                    <span
                      className={
                        u.expiry_date.includes("Left") || u.expiry_date.includes("Expiring")
                          ? "text-amber-400 font-bold"
                          : "text-slate-400"
                      }
                    >
                      {u.expiry_date}
                    </span>
                  </td>
                  <td className="py-3 text-slate-300 max-w-xs truncate">{u.facility}</td>
                  <td className="py-3 font-mono">
                    <span className={u.breach ? "text-rose-400 font-bold" : "text-emerald-400"}>
                      {u.temp}
                    </span>
                  </td>
                  <td className="py-3 text-right">
                    <StatusBadge status={u.breach ? "BREACH" : u.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
