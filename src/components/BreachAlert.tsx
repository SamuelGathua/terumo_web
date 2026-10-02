"use client";

import React, { useState } from "react";
import { AlertTriangle, ArrowRight, CheckCircle2, ShieldAlert } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export interface BreachUnit {
  barcode?: string;
  unit_id?: string;
  product_type?: string;
  blood_type?: string;
  facility?: string;
  temp?: string | number;
  current_temp?: string;
  vehicle?: string;
  duration_minutes?: number;
  description?: string;
}

interface BreachAlertProps {
  breachUnit?: BreachUnit | null;
  onReviewIncident?: () => void;
}

export function BreachAlert({ breachUnit, onReviewIncident }: BreachAlertProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [incidentResolved, setIncidentResolved] = useState(false);

  // Fallback defaults matching UI mockups
  const unitId = breachUnit?.unit_id || breachUnit?.barcode || "Unit BLD-88429";
  const vehicle = breachUnit?.vehicle || "TR-2048";
  const bloodType = breachUnit?.blood_type || "O-";
  const currentTemp = breachUnit?.current_temp || 
    (typeof breachUnit?.temp === "number" ? `${breachUnit.temp}°C` : breachUnit?.temp || "7.2°C");
  const duration = breachUnit?.duration_minutes || 14;
  const description = breachUnit?.description || 
    `Temperature exceeded 6°C for ${duration} minutes during transit to M.P. Shah Hospital.`;

  const handleReview = () => {
    if (onReviewIncident) {
      onReviewIncident();
    } else {
      setModalOpen(true);
    }
  };

  return (
    <>
      <div className="bg-white rounded-3xl border border-rose-200/80 p-6 md:p-7 shadow-xs relative overflow-hidden flex flex-col justify-between h-full">
        {/* Soft top gradient accent */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-linear-to-r from-rose-500 to-red-600" />

        <div>
          {/* Header Badge */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center text-[#e02e48] shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-[#c5283d] uppercase tracking-wider font-mono">
              COLD-CHAIN ALERT
            </span>
          </div>

          {/* Unit Title */}
          <h3 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight font-heading mt-6">
            {unitId.startsWith("Unit ") ? unitId : `Unit ${unitId}`}
          </h3>

          {/* Incident Description */}
          <p className="text-xs text-slate-500 mt-2.5 leading-relaxed">
            {description}
          </p>

          {/* Metrics Key-Value List */}
          <div className="mt-8 space-y-3.5 border-t border-slate-100 pt-5 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Current temp.</span>
              <span className="font-mono font-bold text-slate-800">{currentTemp}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Vehicle</span>
              <span className="font-mono font-medium text-slate-800">{vehicle}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Blood type</span>
              <span className="font-mono font-bold text-slate-800">{bloodType}</span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-8 pt-2">
          <button
            onClick={handleReview}
            className="w-full py-3 px-4 rounded-xl bg-[#c5283d] hover:bg-[#a91e31] active:scale-[0.99] text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer group"
          >
            <span>{incidentResolved ? "Incident Logged ✓" : "Review incident"}</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>

      {/* Review Incident Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-md bg-white border-slate-200">
          <DialogHeader>
            <div className="w-10 h-10 rounded-2xl bg-rose-50 text-[#c5283d] flex items-center justify-center mb-2">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <DialogTitle className="text-slate-900 font-heading">
              Cold-Chain Incident Review: {unitId}
            </DialogTitle>
            <DialogDescription className="text-slate-500 text-xs">
              Log containment protocols, verify storage container seals, and notify the receiving hematology lab.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2 text-xs">
            <div className="p-3 bg-rose-50/60 border border-rose-200 rounded-xl space-y-1">
              <span className="font-semibold text-rose-900 block">Excursion Details:</span>
              <p className="text-rose-700">
                Logged at {currentTemp} on vehicle {vehicle}. Exceeded standard threshold by +1.2°C.
              </p>
            </div>
            <div className="space-y-1 text-slate-600">
              <span className="font-semibold text-slate-800 block">Standard Protocol:</span>
              <p>1. Quarantine unit immediately upon arrival at M.P. Shah Hospital.</p>
              <p>2. Execute rapid hemolysis and bacterial culture testing.</p>
              <p>3. Notify regional cold room coordinator.</p>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3">
            <button
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                setIncidentResolved(true);
                setModalOpen(false);
              }}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#0f5132] hover:bg-[#0b3d26] text-white flex items-center gap-1.5 shadow-sm transition-all"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Acknowledge & Quarantine</span>
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
