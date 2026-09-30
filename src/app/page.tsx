"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Activity,
  AlertOctagon,
  ArrowRight,
  ArrowRightLeft,
  BarChart2,
  Droplet,
  HeartHandshake,
  MapPin,
  ShieldCheck,
  Thermometer,
  TrendingUp,
  Users,
} from "lucide-react";
import { StatusBadge } from "@/components/StatusBadge";
import { fetchDemandForecast, fetchRebalancingSuggestions, DemandForecastResponse, RebalanceResponse } from "@/lib/api";

export default function CommandCenterPage() {
  const [forecast, setForecast] = useState<DemandForecastResponse | null>(null);
  const [rebalanceData, setRebalanceData] = useState<RebalanceResponse | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [fData, rData] = await Promise.all([
          fetchDemandForecast("HOSP-NAIROBI-01", 7),
          fetchRebalancingSuggestions(),
        ]);
        setForecast(fData);
        setRebalanceData(rData);
      } catch (err) {
        console.error("Dashboard data load error:", err);
      }
    }
    loadData();
  }, []);

  const facilityStock = [
    { id: "REGIONAL-HUB-01", name: "Nairobi Regional Blood Depot", units: 2400, capacity: 3000, status: "SURPLUS", type: "Depot Hub" },
    { id: "HOSP-NAIROBI-01", name: "Kenyatta National Referral Hospital", units: 650, capacity: 1200, status: "OPTIMAL", type: "National Referral" },
    { id: "HOSP-KISUMU-02", name: "Jaramogi Oginga Odinga Referral", units: 280, capacity: 600, status: "OPTIMAL", type: "Level 5 Hospital" },
    { id: "CLINIC-MOMBASA-03", name: "Coast General Hospital", units: 90, capacity: 400, status: "CRITICAL", type: "Coastal Ward" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Page Title & Subtitle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
              Executive Command Center
            </h1>
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-950/80 text-emerald-400 border border-emerald-800/60 font-mono">
              REAL-TIME LEDGER
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Regional blood liquidity, predictive demand analytics, and cold-chain integrity telemetry.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/forecasts"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all hover:scale-105"
          >
            <BarChart2 className="w-4 h-4 text-cyan-400" />
            <span>ARIMA Projections</span>
          </Link>

          <Link
            href="/donors"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-lg shadow-rose-600/30 transition-all hover:scale-105"
          >
            <HeartHandshake className="w-4 h-4" />
            <span>Donor Retention AI</span>
          </Link>
        </div>
      </div>

      {/* Critical Alerts Banner */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Shortage Risk Alert */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-rose-950/80 via-slate-900/90 to-slate-900/80 border border-rose-800/80 shadow-lg shadow-rose-950/30 flex items-start gap-3.5 backdrop-blur-md">
          <div className="p-2.5 rounded-xl bg-rose-900/60 text-rose-400 shrink-0 mt-0.5">
            <AlertOctagon className="w-5 h-5 animate-pulse" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-bold text-rose-400 uppercase tracking-wider">
                Deficit Risk Warning
              </span>
              <span className="text-[10px] font-mono text-slate-400">Predicted in 48h</span>
            </div>
            <p className="text-sm font-semibold text-slate-100 mt-0.5">
              Coast General Hospital (CLINIC-MOMBASA-03) at 22.5% Capacity
            </p>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Active inventory holds 90 units against an anticipated 7-day cumulative demand of 213 units. Rebalancing from Nairobi Central Hub is authorized.
            </p>
            <Link
              href="/forecasts"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-400 hover:text-rose-300 mt-2.5 transition-colors"
            >
              <span>Execute 45-Unit Transfer Protocol</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Cold-Chain Transit Alert */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-950/80 via-slate-900/90 to-slate-900/80 border border-amber-800/80 shadow-lg shadow-amber-950/30 flex items-start gap-3.5 backdrop-blur-md">
          <div className="p-2.5 rounded-xl bg-amber-900/60 text-amber-400 shrink-0 mt-0.5">
            <Thermometer className="w-5 h-5 animate-bounce" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                Cold-Chain Excursion
              </span>
              <span className="text-[10px] font-mono text-slate-400">Mobile Drive Sync</span>
            </div>
            <p className="text-sm font-semibold text-slate-100 mt-0.5">
              Transit Box #TB-04 Logged 11.4°C Excursion
            </p>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Asynchronous telemetry from Machakos mobile drive indicates transit temperatures exceeded safe 6°C threshold for 38 minutes. Batch quarantined for serology review.
            </p>
            <Link
              href="/traceability"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-400 hover:text-amber-300 mt-2.5 transition-colors"
            >
              <span>Inspect Telemetry Timeline</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 */}
        <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800/90 backdrop-blur-md shadow-xl hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Total Blood Units
            </span>
            <div className="p-2 rounded-xl bg-rose-950/60 text-rose-400 border border-rose-800/40">
              <Droplet className="w-4 h-4 fill-rose-400" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono text-white">3,420</span>
            <span className="text-xs font-semibold text-emerald-400 flex items-center">
              <TrendingUp className="w-3.5 h-3.5 mr-0.5" /> +12.4%
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">Across 4 regional cold depots</p>
        </div>

        {/* Card 2 */}
        <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800/90 backdrop-blur-md shadow-xl hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Today Demand Orders
            </span>
            <div className="p-2 rounded-xl bg-cyan-950/60 text-cyan-400 border border-cyan-800/40">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono text-white">178</span>
            <span className="text-xs font-semibold text-cyan-400 flex items-center">
              <Activity className="w-3.5 h-3.5 mr-0.5" /> 3 Hospitals
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">Kenyatta, Kisumu & Coast General</p>
        </div>

        {/* Card 3 */}
        <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800/90 backdrop-blur-md shadow-xl hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Donor Retention Rate
            </span>
            <div className="p-2 rounded-xl bg-emerald-950/60 text-emerald-400 border border-emerald-800/40">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono text-white">87.5%</span>
            <span className="text-xs font-semibold text-emerald-400 flex items-center">
              <ShieldCheck className="w-3.5 h-3.5 mr-0.5" /> RF Scored
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">10,000 active registered cohort</p>
        </div>

        {/* Card 4 */}
        <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800/90 backdrop-blur-md shadow-xl hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Cold-Chain Compliance
            </span>
            <div className="p-2 rounded-xl bg-amber-950/60 text-amber-400 border border-amber-800/40">
              <Thermometer className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono text-white">99.1%</span>
            <span className="text-xs font-semibold text-amber-400 flex items-center">
              1 Flagged
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">IoT telemetry within 2°C - 6°C</p>
        </div>
      </div>

      {/* Network Liquidity Distribution & Regional Facility Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Facility Liquidity Table */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-slate-900/70 border border-slate-800 backdrop-blur-md shadow-xl">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-lg font-bold text-white">Regional Facility Liquidity</h2>
              <p className="text-xs text-slate-400">Current stock vs capacity across central network</p>
            </div>
            <Link
              href="/forecasts"
              className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
            >
              <span>Forecast Breakdown</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="pb-3 font-semibold">Facility Node</th>
                  <th className="pb-3 font-semibold">Classification</th>
                  <th className="pb-3 font-semibold">Stock / Capacity</th>
                  <th className="pb-3 font-semibold">Fill Ratio</th>
                  <th className="pb-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {facilityStock.map((fac) => {
                  const ratio = Math.round((fac.units / fac.capacity) * 100);
                  const isCritical = ratio < 25;
                  const isSurplus = ratio > 75;

                  return (
                    <tr key={fac.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-3 font-medium text-slate-200">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          <span>{fac.name}</span>
                        </div>
                        <span className="text-[10px] text-slate-500 font-mono ml-5.5">{fac.id}</span>
                      </td>
                      <td className="py-3 text-slate-400">{fac.type}</td>
                      <td className="py-3 font-mono font-semibold text-slate-200">
                        {fac.units} / {fac.capacity} u
                      </td>
                      <td className="py-3">
                        <div className="w-24 bg-slate-800 rounded-full h-2 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              isCritical ? "bg-rose-500" : isSurplus ? "bg-cyan-400" : "bg-emerald-500"
                            }`}
                            style={{ width: `${Math.min(100, ratio)}%` }}
                          />
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono mt-0.5 block">{ratio}%</span>
                      </td>
                      <td className="py-3">
                        <StatusBadge
                          status={isCritical ? "HIGH_RISK" : isSurplus ? "AVAILABLE" : "LOW_RISK"}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right 1 Col: Automated Rebalancing Dispatch Action */}
        <div className="p-6 rounded-2xl bg-linear-to-b from-slate-900/90 to-slate-950 border border-slate-800 backdrop-blur-md shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-rose-400">
              <ArrowRightLeft className="w-5 h-5" />
              <h2 className="text-base font-bold text-white">AI Liquidity Dispatch</h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Automated rebalancing algorithm matching regional surplus with acute shortage nodes.
            </p>

            <div className="mt-5 p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Recommended Route:</span>
                <span className="font-semibold text-cyan-400">Highway A109 Transit</span>
              </div>
              <div className="text-xs text-slate-300 leading-relaxed">
                <span className="font-bold text-slate-100">
                  {rebalanceData?.recommended_transfers?.[0]?.from_facility_name || "Nairobi Regional Blood Depot"}
                </span>{" "}
                ➔{" "}
                <span className="font-bold text-rose-400">
                  {rebalanceData?.recommended_transfers?.[0]?.to_facility_name || "Coast General Hospital"}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-800">
                <span className="text-slate-400">Volume:</span>
                <span className="font-mono font-bold text-white">
                  {rebalanceData?.recommended_transfers?.[0]?.recommended_units || 45} Units (Whole Blood)
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">7-Day Projected Need:</span>
                <span className="font-mono text-cyan-400 font-semibold">
                  {forecast ? Math.round(forecast.forecast.reduce((a, b) => a + b.predicted_units, 0)) : 662} Units
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800">
            <Link
              href="/forecasts"
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-lg shadow-rose-600/30 transition-all hover:scale-105 active:scale-95"
            >
              <ArrowRightLeft className="w-4 h-4" />
              <span>Review Rebalancing Matrix</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
