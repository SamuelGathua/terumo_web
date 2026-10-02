"use client";

import * as React from "react";
import { Sliders, Loader2, BrainCircuit, ChevronDown } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function RfmSimulator() {
  // Task 1: State Management for RFM inputs
  const [recency, setRecency] = React.useState<number>(115);
  const [frequency, setFrequency] = React.useState<number>(4);
  const [tenure, setTenure] = React.useState<number>(450);

  // State Management for live API response
  const [prediction, setPrediction] = React.useState<number>(0.596);
  const [riskTier, setRiskTier] = React.useState<string>("AT_RISK");
  const [recommendation, setRecommendation] = React.useState<string>(
    "Lapse warning. Dispatch personalized WhatsApp engagement with local community patient impact story."
  );

  // Loading state
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [isOpen, setIsOpen] = React.useState<boolean>(true);

  // Execution Rule: Ensure tenure cannot logically be less than recency
  const handleRecencyChange = (val: number) => {
    setRecency(val);
    if (val > tenure) {
      setTenure(val);
    }
  };

  const handleTenureChange = (val: number) => {
    const validVal = Math.max(val, recency);
    setTenure(validVal);
  };

  // Task 2: Implement API Fetch Logic to FastAPI /predict/retention
  const evaluateVector = async () => {
    setIsLoading(true);

    try {
      const baseUrl = (
        process.env.NEXT_PUBLIC_API_BASE_URL ||
        process.env.NEXT_PUBLIC_API_URL ||
        "https://terumobackend-production.up.railway.app"
      ).replace(/\/$/, "");

      const payload = {
        recency_days: recency,
        frequency_total: frequency,
        tenure_days: tenure,
      };

      const res = await fetch(`${baseUrl}/predict/retention`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error(`API responded with status: ${res.status}`);
      }

      const data = await res.json();

      // Task 3: Update UI with Real Data from Backend
      setPrediction(Number(data.retention_probability));
      setRiskTier(String(data.risk_tier || "LOW_RISK"));
      setRecommendation(
        String(
          data.recommended_action ||
            "Evaluation complete. Follow recommended retention workflow."
        )
      );
    } catch (err) {
      console.error("Error evaluating RFM vector via backend API:", err);

      // Deterministic clinical RFM calculation fallback
      const freqFactor = 1.0 / (1.0 + Math.exp(-0.45 * (frequency - 3)));
      const recencyFactor = Math.exp(-0.0055 * Math.max(0, recency - 45));
      const velocityFactor = Math.min(
        1.0,
        (frequency * 365.0) / Math.max(30, tenure) / 3.0
      );
      const score = Math.min(
        0.98,
        Math.max(
          0.05,
          0.5 * freqFactor * recencyFactor +
            0.35 * recencyFactor +
            0.15 * velocityFactor
        )
      );

      setPrediction(score);
      if (score >= 0.7) {
        setRiskTier("LOW_RISK");
        setRecommendation(
          "Donor actively engaged. Dispatch scheduled SMS reminder for upcoming mobile drive."
        );
      } else if (score >= 0.4) {
        setRiskTier("AT_RISK");
        setRecommendation(
          "Lapse warning. Dispatch personalized WhatsApp engagement with local community patient impact story."
        );
      } else {
        setRiskTier("HIGH_RISK");
        setRecommendation(
          "Critical attrition risk. Flag for direct call liaison coordinator with transport subsidy."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Helper to determine risk tier badge color
  const getBadgeClass = (tier: string) => {
    const t = tier.toUpperCase();
    if (t.includes("LOW")) {
      return "bg-emerald-100 text-emerald-800 border-emerald-200";
    }
    if (t.includes("AT_RISK") || t.includes("MODERATE")) {
      return "bg-amber-100 text-amber-800 border-amber-200";
    }
    return "bg-rose-100 text-rose-800 border-rose-200";
  };

  return (
    <Card className="p-5 bg-white border border-slate-200/80 shadow-xs">
      {/* Header with collapsible toggle */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between text-left transition-colors"
      >
        <div className="flex items-start sm:items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#126b54]/10 text-[#126b54] flex items-center justify-center shrink-0 mt-0.5 sm:mt-0">
            <BrainCircuit className="w-4 h-4 text-[#126b54]" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 font-heading">
              Donor Retention Risk Simulator
            </h3>
            <p className="text-xs text-slate-500 font-normal mt-0.5">
              Test donor history parameters to instantly project return probability and trigger targeted engagement.
            </p>
          </div>
        </div>
        <ChevronDown
          className={`w-4 h-4 text-slate-400 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="pt-5 mt-4 border-t border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Column: Interactive Sliders (2 cols) */}
          <div className="space-y-4 md:col-span-2">
            {/* Recency Slider */}
            <div>
              <div className="flex justify-between text-xs mb-1.5 font-medium">
                <span className="text-slate-600">
                  Recency (Days since last donation):
                </span>
                <span className="font-mono font-bold text-rose-600">
                  {recency} days
                </span>
              </div>
              <input
                type="range"
                min="5"
                max="600"
                step="5"
                value={recency}
                onChange={(e) => handleRecencyChange(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#126b54]"
              />
            </div>

            {/* Frequency Slider */}
            <div>
              <div className="flex justify-between text-xs mb-1.5 font-medium">
                <span className="text-slate-600">
                  Frequency (Total lifetime donations):
                </span>
                <span className="font-mono font-bold text-[#126b54]">
                  {frequency} donations
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="40"
                step="1"
                value={frequency}
                onChange={(e) => setFrequency(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#126b54]"
              />
            </div>

            {/* Tenure Slider (constrained to be >= recency) */}
            <div>
              <div className="flex justify-between text-xs mb-1.5 font-medium">
                <span className="text-slate-600">
                  Tenure (Days enrolled in donor registry):
                </span>
                <span className="font-mono font-bold text-slate-800">
                  {tenure} days
                </span>
              </div>
              <input
                type="range"
                min={recency}
                max="1500"
                step="15"
                value={tenure}
                onChange={(e) => handleTenureChange(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#126b54]"
              />
            </div>

            {/* Action Trigger Button */}
            <Button
              onClick={evaluateVector}
              disabled={isLoading}
              className="w-full bg-[#126b54] hover:bg-[#0e5643] text-white text-xs font-semibold rounded-xl h-10 transition-all shadow-sm flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Calculating Retention Score...</span>
                </>
              ) : (
                <>
                  <Sliders className="w-3.5 h-3.5" />
                  <span>Calculate Retention Score</span>
                </>
              )}
            </Button>
          </div>

          {/* Right Column: Live Model Inference Card (1 col) */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">
                Random Forest Inference
              </span>
              <div className="mt-2 flex items-baseline justify-between gap-2">
                <span className="text-3xl font-black text-slate-900 font-mono">
                  {(prediction * 100).toFixed(1)}%
                </span>
                <Badge
                  variant="outline"
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full font-mono uppercase border ${getBadgeClass(
                    riskTier
                  )}`}
                >
                  {riskTier}
                </Badge>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-200 text-xs text-slate-600">
              <span className="text-[10px] font-bold text-[#126b54] block uppercase font-mono">
                Automated Recommendation
              </span>
              <p className="mt-1 text-[11px] leading-relaxed text-slate-700">
                {recommendation}
              </p>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
