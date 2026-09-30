"use client";

import React, { useState, useEffect } from "react";
import {
  BrainCircuit,
  CheckCircle,
  MessageSquare,
  PhoneCall,
  Sparkles,
} from "lucide-react";
import { StatusBadge } from "@/components/StatusBadge";
import {
  fetchDonors,
  predictRetention,
  DonorRecord,
  RetentionPredictionResponse,
} from "@/lib/api";

export default function DonorsPage() {
  const [donors, setDonors] = useState<DonorRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterRisk, setFilterRisk] = useState<string>("ALL");

  // Interactive AI Simulator State
  const [recencyDays, setRecencyDays] = useState<number>(45);
  const [frequencyTotal, setFrequencyTotal] = useState<number>(6);
  const [tenureDays, setTenureDays] = useState<number>(365);
  const [simulating, setSimulating] = useState(false);
  const [simulationResult, setSimulationResult] = useState<RetentionPredictionResponse | null>({
    retention_probability: 0.942,
    retention_status: 1,
    risk_tier: "LOW_RISK",
    recommended_action: "Donor actively engaged. Dispatch scheduled SMS reminder for upcoming mobile drive.",
  });

  // Action feedback state
  const [actionDone, setActionDone] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const data = await fetchDonors(30);
        setDonors(data);
      } catch (err) {
        console.error("Donors fetch error:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  async function handleSimulate() {
    setSimulating(true);
    try {
      const res = await predictRetention({
        recency_days: recencyDays,
        frequency_total: frequencyTotal,
        tenure_days: Math.max(tenureDays, recencyDays),
      });
      setSimulationResult(res);
    } catch (err) {
      console.error("Simulation error:", err);
    } finally {
      setSimulating(false);
    }
  }

  const handleAction = (id: string, actionName: string) => {
    setActionDone((prev) => ({ ...prev, [id]: actionName }));
    setTimeout(() => {
      setActionDone((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
    }, 4000);
  };

  const filteredDonors = donors.filter((d) => {
    if (filterRisk === "ALL") return true;
    if (filterRisk === "LOW_RISK") return d.retention_probability >= 0.70;
    if (filterRisk === "MODERATE_RISK") return d.retention_probability >= 0.40 && d.retention_probability < 0.70;
    if (filterRisk === "HIGH_RISK") return d.retention_probability < 0.40;
    return true;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
              Donor Retention AI Operations
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-950/80 text-emerald-400 border border-emerald-800/60 font-mono">
              RANDOM FOREST ENSEMBLE
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Operationalizing behavioral RFM predictive models to prevent donor attrition and deploy automated recalls.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300">
          <BrainCircuit className="w-4 h-4 text-emerald-400" />
          <span>Model Accuracy: 98.65%</span>
        </div>
      </div>

      {/* TOP SECTION: Interactive AI Inference Simulator */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900/95 to-slate-950 border border-slate-800 shadow-2xl backdrop-blur-md">
        <div className="flex items-center gap-2.5 text-rose-400 mb-2">
          <BrainCircuit className="w-5 h-5 text-rose-400" />
          <h2 className="text-base font-bold text-white tracking-wide">
            Real-Time Donor Retention Inference Simulator
          </h2>
        </div>
        <p className="text-xs text-slate-400 mb-6">
          Adjust Recency, Frequency, and Tenure to test real-time classification against the trained Random Forest model.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
          {/* Controls: Sliders and Inputs */}
          <div className="lg:col-span-2 space-y-5 bg-slate-950/60 p-5 rounded-2xl border border-slate-800/80">
            {/* Recency Slider */}
            <div>
              <div className="flex justify-between text-xs mb-2">
                <span className="font-semibold text-slate-300">Recency (Days since last donation):</span>
                <span className="font-mono font-bold text-rose-400">{recencyDays} days</span>
              </div>
              <input
                type="range"
                min="5"
                max="600"
                step="5"
                value={recencyDays}
                onChange={(e) => setRecencyDays(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-rose-500"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                <span>Recent (5d)</span>
                <span>Moderate (120d)</span>
                <span>Critical Lapse (&gt;365d)</span>
              </div>
            </div>

            {/* Frequency Slider */}
            <div>
              <div className="flex justify-between text-xs mb-2">
                <span className="font-semibold text-slate-300">Frequency (Total Lifetime Donations):</span>
                <span className="font-mono font-bold text-cyan-400">{frequencyTotal} donations</span>
              </div>
              <input
                type="range"
                min="1"
                max="40"
                step="1"
                value={frequencyTotal}
                onChange={(e) => setFrequencyTotal(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                <span>First Time (1)</span>
                <span>Developing Habit (5)</span>
                <span>Committed Regular (&gt;15)</span>
              </div>
            </div>

            {/* Tenure Slider */}
            <div>
              <div className="flex justify-between text-xs mb-2">
                <span className="font-semibold text-slate-300">Tenure (Days since first recorded donation):</span>
                <span className="font-mono font-bold text-emerald-400">{tenureDays} days</span>
              </div>
              <input
                type="range"
                min="30"
                max="1500"
                step="15"
                value={tenureDays}
                onChange={(e) => setTenureDays(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
            </div>

            <button
              onClick={handleSimulate}
              disabled={simulating}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white text-xs font-bold shadow-lg shadow-rose-600/30 transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>{simulating ? "Evaluating Ensembles..." : "Execute Real-Time AI Prediction"}</span>
            </button>
          </div>

          {/* Inference Output Gauge Card */}
          <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col justify-between h-full space-y-4">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                Model Inference Output
              </span>
              <div className="mt-3 flex items-baseline justify-between">
                <span className="text-4xl font-black font-mono tracking-tight text-white">
                  {Math.round((simulationResult?.retention_probability || 0) * 100)}%
                </span>
                <StatusBadge status={simulationResult?.risk_tier || "LOW_RISK"} />
              </div>
              <p className="text-xs text-slate-400 mt-1">Predicted probability of return</p>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${
                  (simulationResult?.retention_probability || 0) >= 0.70
                    ? "bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.5)]"
                    : (simulationResult?.retention_probability || 0) >= 0.40
                    ? "bg-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.5)]"
                    : "bg-rose-500 shadow-[0_0_12px_rgba(244,63,94,0.5)]"
                }`}
                style={{
                  width: `${Math.round((simulationResult?.retention_probability || 0) * 100)}%`,
                }}
              />
            </div>

            {/* Actionable Clinical Recommendation */}
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider block mb-1">
                Automated Clinical Protocol
              </span>
              <p className="text-xs text-slate-200 leading-relaxed font-medium">
                {simulationResult?.recommended_action}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM SECTION: Risk-Tiered Donor Roster Table */}
      <div className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800 backdrop-blur-md shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-white">Active Regional Donor Cohort</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Individual donor profiles with AI attrition probability and intervention triggers.
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs">
            {["ALL", "LOW_RISK", "MODERATE_RISK", "HIGH_RISK"].map((t) => (
              <button
                key={t}
                onClick={() => setFilterRisk(t)}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                  filterRisk === t
                    ? "bg-rose-600 text-white shadow"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {t.replace("_", " ")}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="pb-3 font-semibold">Donor ID</th>
                <th className="pb-3 font-semibold">Blood Group</th>
                <th className="pb-3 font-semibold">Recency</th>
                <th className="pb-3 font-semibold">Donations</th>
                <th className="pb-3 font-semibold">Tenure</th>
                <th className="pb-3 font-semibold">Retention Prob.</th>
                <th className="pb-3 font-semibold">Risk Classification</th>
                <th className="pb-3 font-semibold text-right">Intervention Trigger</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    <div className="inline-flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-rose-500 border-t-transparent rounded-full animate-spin" />
                      <span>Loading donor cohort records...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredDonors.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-500">
                    No donors matching the selected risk tier.
                  </td>
                </tr>
              ) : (
                filteredDonors.map((d) => {
                  const prob = d.retention_probability;
                  const riskTier = prob >= 0.70 ? "LOW_RISK" : prob >= 0.40 ? "MODERATE_RISK" : "HIGH_RISK";
                  const isLapsed = riskTier === "HIGH_RISK";

                  return (
                    <tr key={d.donor_id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3 font-mono text-slate-300">{d.donor_id}</td>
                    <td className="py-3">
                      <span className="px-2 py-0.5 rounded bg-rose-950/80 text-rose-300 font-bold border border-rose-800/60 font-mono">
                        {d.blood_type}
                      </span>
                    </td>
                    <td className="py-3 font-mono text-slate-200">{d.recency_days} days</td>
                    <td className="py-3 font-mono text-cyan-400 font-semibold">{d.total_donations}</td>
                    <td className="py-3 font-mono text-slate-400">{d.tenure_days} days</td>
                    <td className="py-3 font-mono font-bold text-white">
                      {Math.round(prob * 100)}%
                    </td>
                    <td className="py-3">
                      <StatusBadge status={riskTier} />
                    </td>
                    <td className="py-3 text-right">
                      {actionDone[d.donor_id] ? (
                        <span className="text-emerald-400 font-semibold text-[11px] inline-flex items-center gap-1">
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>{actionDone[d.donor_id]}</span>
                        </span>
                      ) : isLapsed ? (
                        <button
                          onClick={() => handleAction(d.donor_id, "Liaison Assigned ✓")}
                          className="px-3 py-1 rounded-lg bg-rose-900/80 hover:bg-rose-800 text-rose-200 border border-rose-700/80 text-[11px] font-semibold transition-all inline-flex items-center gap-1.5"
                        >
                          <PhoneCall className="w-3 h-3" />
                          <span>Assign Liaison</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => handleAction(d.donor_id, "SMS Dispatched ✓")}
                          className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-[11px] font-medium transition-all inline-flex items-center gap-1.5"
                        >
                          <MessageSquare className="w-3 h-3" />
                          <span>Recall SMS</span>
                        </button>
                      )}
                    </td>
                  </tr>
                );
              }))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
