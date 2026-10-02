"use client";

import React, { useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  Droplet,
  Truck,
} from "lucide-react";

export interface NetworkEvent {
  id: string;
  time: string;
  type: "received" | "excursion" | "departure" | "sync" | "screening";
  title: string;
  subtitle: string;
  badge?: string;
  isBreach?: boolean;
}

const defaultNetworkEvents: NetworkEvent[] = [
  {
    id: "evt-1",
    time: "08:42",
    type: "received",
    title: "Unit BLD-90218 received",
    subtitle: "Kenyatta National cold room",
  },
  {
    id: "evt-2",
    time: "08:31",
    type: "excursion",
    title: "Temperature excursion detected",
    subtitle: "Transit TR-2048 • Unit BLD-88429",
    badge: "BREACH",
    isBreach: true,
  },
  {
    id: "evt-3",
    time: "08:18",
    type: "departure",
    title: "Shipment departed",
    subtitle: "Nakuru Regional Hub • 84 units",
  },
  {
    id: "evt-4",
    time: "07:54",
    type: "sync",
    title: "Collection batch synchronized",
    subtitle: "Westlands Mobile Drive • 38 units",
  },
  {
    id: "evt-5",
    time: "07:26",
    type: "screening",
    title: "Quality screening completed",
    subtitle: "Nairobi Central Lab • 112 units",
  },
];

interface LiveEventFeedProps {
  events?: NetworkEvent[];
}

export function LiveEventFeed({ events = defaultNetworkEvents }: LiveEventFeedProps) {
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const filteredEvents = events.filter((evt) => {
    if (selectedFilter === "all") return true;
    if (selectedFilter === "breach") return evt.isBreach;
    if (selectedFilter === "transits") return evt.type === "departure" || evt.type === "received";
    return true;
  });

  const getEventIcon = (type: NetworkEvent["type"]) => {
    switch (type) {
      case "received":
      case "screening":
        return (
          <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        );
      case "excursion":
        return (
          <div className="w-8 h-8 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center text-[#e02e48] shrink-0">
            <AlertTriangle className="w-4 h-4" />
          </div>
        );
      case "departure":
        return (
          <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
            <Truck className="w-4 h-4" />
          </div>
        );
      case "sync":
        return (
          <div className="w-8 h-8 rounded-xl bg-rose-50/70 border border-rose-100 flex items-center justify-center text-rose-500 shrink-0">
            <Droplet className="w-4 h-4 fill-rose-100" />
          </div>
        );
      default:
        return (
          <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 shrink-0">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        );
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 p-6 md:p-7 shadow-xs">
      {/* Feed Header */}
      <div className="flex items-center justify-between pb-6 border-b border-slate-100 relative">
        <div>
          <h2 className="text-lg font-bold text-slate-900 font-heading">Live event feed</h2>
          <p className="text-xs text-slate-400 mt-0.5">Chronological network events</p>
        </div>

        {/* Filter Dropdown */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-medium text-slate-700 transition-colors shadow-2xs cursor-pointer"
          >
            <span>
              {selectedFilter === "all"
                ? "All event types"
                : selectedFilter === "breach"
                ? "Breaches only"
                : "Transit shipments"}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-1.5 w-44 bg-white border border-slate-200 rounded-xl shadow-lg z-20 py-1 text-xs">
              <button
                onClick={() => {
                  setSelectedFilter("all");
                  setDropdownOpen(false);
                }}
                className={`w-full text-left px-3.5 py-2 hover:bg-slate-50 transition-colors ${
                  selectedFilter === "all" ? "font-bold text-emerald-700 bg-emerald-50/50" : "text-slate-700"
                }`}
              >
                All event types
              </button>
              <button
                onClick={() => {
                  setSelectedFilter("breach");
                  setDropdownOpen(false);
                }}
                className={`w-full text-left px-3.5 py-2 hover:bg-slate-50 transition-colors ${
                  selectedFilter === "breach" ? "font-bold text-rose-700 bg-rose-50/50" : "text-slate-700"
                }`}
              >
                Breaches only
              </button>
              <button
                onClick={() => {
                  setSelectedFilter("transits");
                  setDropdownOpen(false);
                }}
                className={`w-full text-left px-3.5 py-2 hover:bg-slate-50 transition-colors ${
                  selectedFilter === "transits" ? "font-bold text-indigo-700 bg-indigo-50/50" : "text-slate-700"
                }`}
              >
                Transit shipments
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Timeline Items */}
      <div className="mt-6 space-y-6 relative">
        {/* Subtle vertical connecting line */}
        <div className="absolute left-17.5 top-4 bottom-4 w-px bg-slate-200/90 z-0 hidden sm:block" />

        {filteredEvents.map((evt) => (
          <div key={evt.id} className="flex items-center gap-4 sm:gap-6 relative z-10 group">
            {/* Timestamp */}
            <div className="w-12 text-right font-mono text-xs text-slate-400 font-medium shrink-0">
              {evt.time}
            </div>

            {/* Icon Node */}
            <div className="shrink-0 bg-white ring-4 ring-white rounded-xl">
              {getEventIcon(evt.type)}
            </div>

            {/* Event Description */}
            <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-1 min-w-0">
              <div className="min-w-0">
                <h4 className="text-xs sm:text-sm font-bold text-slate-800 tracking-tight truncate">
                  {evt.title}
                </h4>
                <p className="text-[11px] sm:text-xs text-slate-400 truncate mt-0.5">
                  {evt.subtitle}
                </p>
              </div>

              {/* Status Badge */}
              {evt.badge && (
                <div className="shrink-0 mt-1 sm:mt-0">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold font-mono tracking-wider bg-rose-50 text-[#c5283d] border border-rose-200">
                    {evt.badge}
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
