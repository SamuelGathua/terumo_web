"use client";

import * as React from "react";
import { AlertTriangle, Check, Droplet, Truck } from "lucide-react";
import { LiveActivityItem } from "@/lib/api";

interface LiveActivityFeedProps {
  activities: LiveActivityItem[];
}

export function LiveActivityFeed({ activities }: LiveActivityFeedProps) {
  const items = React.useMemo(() => {
    if (activities && activities.length > 0) return activities;
    return [
      {
        id: "1",
        type: "received",
        title: "64 units",
        text: "received at Kenyatta National",
        time: "4 min ago",
      },
      {
        id: "2",
        type: "transit",
        title: "Transit TR-2048",
        text: "departed Nakuru Hub",
        time: "12 min ago",
      },
      {
        id: "3",
        type: "breach",
        title: "Cold-chain breach",
        text: "on unit BLD-88429",
        time: "18 min ago",
      },
      {
        id: "4",
        type: "mobile_sync",
        title: "38 donations",
        text: "synced from mobile drive",
        time: "27 min ago",
      },
    ];
  }, [activities]);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-bold text-slate-900 text-base font-heading">
            Live network activity
          </h3>
          <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-emerald-600">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>LIVE</span>
          </div>
        </div>
        <p className="text-xs text-slate-500 mb-5">
          Latest telemetry & logistics events across the region
        </p>

        {/* Activity Stream */}
        <div className="divide-y divide-slate-100">
          {items.map((act, i) => {
            // Task 2.6: Dynamic icons and styling based on event type
            let iconBox = "bg-emerald-50 text-emerald-600";
            let IconComponent = Check;
            let isFilled = false;

            if (act.type === "transit") {
              iconBox = "bg-purple-50 text-purple-600";
              IconComponent = Truck;
            } else if (act.type === "breach") {
              iconBox = "bg-rose-50 text-rose-600";
              IconComponent = AlertTriangle;
            } else if (act.type === "mobile_sync") {
              iconBox = "bg-rose-50 text-rose-500";
              IconComponent = Droplet;
              isFilled = true;
            }

            return (
              <div
                key={act.id || i}
                className="py-3.5 first:pt-0 last:pb-0 flex items-start gap-3 transition-colors"
              >
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${iconBox}`}
                >
                  <IconComponent className={`w-4 h-4 ${isFilled ? "fill-rose-500" : ""}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-slate-700 leading-snug">
                    <strong className="font-bold text-slate-900">{act.title}</strong>{" "}
                    {act.text}
                  </p>
                  <span className="text-[11px] text-slate-400 mt-0.5 block font-mono">
                    {act.time}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
