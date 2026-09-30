"use client";

import React, { useState, useEffect } from "react";
import {
  AlertTriangle,
  ArrowRightLeft,
  MapPin,
  Zap,
} from "lucide-react";
import { ARIMAChart } from "@/components/ARIMAChart";
import { StatusBadge } from "@/components/StatusBadge";
import {
  fetchDemandForecast,
  fetchRebalancingSuggestions,
  DemandForecastResponse,
  RebalanceResponse,
} from "@/lib/api";

const FACILITIES = [
  { id: "HOSP-NAIROBI-01", name: "Kenyatta National Referral Hospital", region: "Nairobi", mean: 95 },
  { id: "HOSP-KISUMU-02", name: "Jaramogi Oginga Odinga Referral", region: "Kisumu", mean: 52 },
  { id: "CLINIC-MOMBASA-03", name: "Coast General Hospital", region: "Mombasa", mean: 30 },
];

export default function ForecastsPage() {
  const [selectedFacility, setSelectedFacility] = useState("HOSP-NAIROBI-01");
  const [forecast, setForecast] = useState<DemandForecastResponse | null>(null);
  const [rebalance, setRebalance] = useState<RebalanceResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [transferAuthorized, setTransferAuthorized] = useState(false);

  useEffect(() => {
    async function loadForecast() {
      setLoading(true);
      try {
        const [fData, rData] = await Promise.all([
          fetchDemandForecast(selectedFacility, 7),
          fetchRebalancingSuggestions(),
        ]);
        setForecast(fData);
        setRebalance(rData);
      } catch (err) {
        console.error("Forecast load error:", err);
      } finally {
        setLoading(false);
      }
    }
    loadForecast();
  }, [selectedFacility]);

  const activeFacInfo = FACILITIES.find((f) => f.id === selectedFacility);
  const total7DayUnits = forecast
    ? Math.round(forecast.forecast.reduce((acc, curr) => acc + curr.predicted_units, 0))
    : 0;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
              Demand & Liquidity Forecasts
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-950/80 text-cyan-400 border border-cyan-800/60 font-mono">
              ARIMA(1,1,1) ENGINE
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Quantitative time-series demand projections and decentralized inventory rebalancing recommendations.
          </p>
        </div>

        {/* Facility Selector Dropdown */}
        <div className="flex items-center gap-3">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider hidden md:inline">
            Target Facility:
          </label>
          <div className="relative">
            <select
              value={selectedFacility}
              onChange={(e) => setSelectedFacility(e.target.value)}
              className="bg-slate-900 border border-slate-700 text-slate-100 text-xs font-medium rounded-xl px-4 py-2.5 pr-8 appearance-none focus:outline-none focus:ring-2 focus:ring-rose-500 cursor-pointer shadow-lg"
            >
              {FACILITIES.map((fac) => (
                <option key={fac.id} value={fac.id}>
                  {fac.name} ({fac.id})
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-slate-400">
              <MapPin className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </div>

      {/* Rebalance Shortage Alert if present */}
      {forecast?.rebalance_alert && (
        <div className="p-4 rounded-2xl bg-rose-950/80 border border-rose-800 flex items-center gap-3.5 shadow-lg shadow-rose-950/40 text-xs">
          <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
          <div className="flex-1">
            <span className="font-bold text-rose-300 uppercase tracking-wide">
              Critical Deficit Alert:
            </span>{" "}
            <span className="text-slate-200">{forecast.rebalance_alert}</span>
          </div>
          <span className="px-2 py-1 rounded bg-rose-900 text-rose-200 font-semibold font-mono shrink-0">
            Action Required
          </span>
        </div>
      )}

      {/* KPI Cards for Selected Facility */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 */}
        <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 backdrop-blur-md">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            7-Day Projected Units
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono text-cyan-400">
              {loading ? "..." : `${total7DayUnits} u`}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">Cumulative hospital order forecast</p>
        </div>

        {/* Card 2 */}
        <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 backdrop-blur-md">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Historical Daily Mean (μ)
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono text-white">
              {loading ? "..." : `${forecast?.baseline_daily_mean || activeFacInfo?.mean} u`}
            </span>
            <span className="text-xs text-slate-400">/ day</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">Calculated from 2-year demand series</p>
        </div>

        {/* Card 3 */}
        <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 backdrop-blur-md">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Stochastic Volatility (σ)
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono text-amber-400">
              {loading ? "..." : `±${forecast?.stochastic_volatility || 14.8}`}
            </span>
            <span className="text-xs text-slate-400">units</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">Weekend emergency trauma variance</p>
        </div>

        {/* Card 4 */}
        <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 backdrop-blur-md">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Redis Cache Status
          </span>
          <div className="mt-2 flex items-center gap-2">
            <Zap className="w-5 h-5 text-emerald-400" />
            <span className="text-lg font-bold font-mono text-emerald-400">
              {forecast?.cached ? "CACHE HIT" : "ARIMA COMPUTED"}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">TTL: 900s (15 min) optimization</p>
        </div>
      </div>

      {/* Main ARIMA Projection Chart Component */}
      <ARIMAChart
        data={forecast?.forecast || []}
        baselineMean={forecast?.baseline_daily_mean}
        facilityName={activeFacInfo?.name}
      />

      {/* Regional Liquidity Rebalancing Matrix */}
      <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 backdrop-blur-md shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <ArrowRightLeft className="w-5 h-5 text-rose-400" />
              <h2 className="text-lg font-bold text-white">
                Decentralized Liquidity Rebalancing Matrix
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Automated route optimization matching surplus cold room hubs with deficit wards.
            </p>
          </div>

          <span className="text-xs font-mono px-3 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
            {rebalance?.recommended_transfers.length || 1} Recommended Route
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="pb-3 font-semibold">Surplus Origin Hub</th>
                <th className="pb-3 font-semibold">Deficit Destination Node</th>
                <th className="pb-3 font-semibold">Recommended Transfer</th>
                <th className="pb-3 font-semibold">Urgency</th>
                <th className="pb-3 font-semibold">Algorithmic Rationale</th>
                <th className="pb-3 font-semibold text-right">Protocol Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {(rebalance?.recommended_transfers || []).map((t, idx) => (
                <tr key={idx} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-4 font-semibold text-slate-200">
                    <div>{t.from_facility_name}</div>
                    <span className="text-[10px] text-slate-500 font-mono">{t.from_facility_id}</span>
                  </td>
                  <td className="py-4 font-semibold text-rose-300">
                    <div>{t.to_facility_name}</div>
                    <span className="text-[10px] text-slate-500 font-mono">{t.to_facility_id}</span>
                  </td>
                  <td className="py-4 font-mono font-bold text-cyan-400 text-sm">
                    {t.recommended_units} Units
                  </td>
                  <td className="py-4">
                    <StatusBadge status={t.urgency} />
                  </td>
                  <td className="py-4 text-slate-400 max-w-xs leading-relaxed">
                    {t.reason}
                  </td>
                  <td className="py-4 text-right">
                    <button
                      onClick={() => setTransferAuthorized(true)}
                      disabled={transferAuthorized}
                      className={`px-3.5 py-1.5 rounded-xl font-semibold text-xs transition-all ${
                        transferAuthorized
                          ? "bg-emerald-950 text-emerald-400 border border-emerald-800 cursor-default"
                          : "bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/30 active:scale-95"
                      }`}
                    >
                      {transferAuthorized ? "Dispatched ✓" : "Authorize Dispatch"}
                    </button>
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
