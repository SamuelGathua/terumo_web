"use client";

import * as React from "react";
import { Layers } from "lucide-react";
import { FacilityCombobox } from "@/components/FacilityCombobox";
import { ArimaChart } from "@/components/ArimaChart";
import { RebalancingMatrix } from "@/components/RebalancingMatrix";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ForecastsPage() {
  const [selectedLevel, setSelectedLevel] = React.useState<string>("ALL");
  const [selectedFacility, setSelectedFacility] = React.useState<string>("HOSP-NAIROBI-01");
  const [selectedFacilityName, setSelectedFacilityName] = React.useState<string>(
    "Kenyatta National Referral Hospital"
  );
  const [selectedHorizon, setSelectedHorizon] = React.useState<number>(7);

  // Handle Level Selector change with automatic flagship facility selection
  const handleLevelChange = (newLevel: string) => {
    setSelectedLevel(newLevel);
    if (newLevel === "Level 6") {
      setSelectedFacility("HOSP-NAIROBI-01");
      setSelectedFacilityName("Kenyatta National Referral Hospital");
    } else if (newLevel === "Level 5") {
      setSelectedFacility("HOSP-KISUMU-02");
      setSelectedFacilityName("Jaramogi Oginga Odinga Referral");
    } else if (newLevel === "Level 4") {
      setSelectedFacility("FAC-16201");
      setSelectedFacilityName("Naivasha Sub-County Hospital");
    } else if (newLevel === "Level 3") {
      setSelectedFacility("FAC-22976");
      setSelectedFacilityName("Radiant Umoja Health Centre");
    } else if (newLevel === "Level 2") {
      setSelectedFacility("FAC-22998");
      setSelectedFacilityName("Kaka Medical Clinic");
    } else if (newLevel === "Blood Hub") {
      setSelectedFacility("REGIONAL-HUB-01");
      setSelectedFacilityName("Nairobi Regional Blood Depot");
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* 1. Header with Facility Level Selector & Searchable Combobox */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold text-slate-400 tracking-widest uppercase block font-mono">
            DEMAND INTELLIGENCE
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-heading mt-0.5">
            Forecasts & liquidity
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {selectedHorizon}-day demand projection across regional healthcare facilities.
          </p>
        </div>

        {/* Facility Level Selector next to Facility Combobox */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Level Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-medium hidden sm:inline">Level</span>
            <Select value={selectedLevel} onValueChange={handleLevelChange}>
              <SelectTrigger className="w-36 sm:w-44 h-9 bg-white border-slate-200/90 text-slate-800 font-medium text-xs rounded-xl shadow-2xs hover:border-slate-300">
                <div className="flex items-center gap-1.5 truncate">
                  <Layers className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <SelectValue placeholder="All Levels" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Levels</SelectItem>
                <SelectItem value="Level 6">Level 6 (National)</SelectItem>
                <SelectItem value="Level 5">Level 5 (County)</SelectItem>
                <SelectItem value="Level 4">Level 4 (Sub-County)</SelectItem>
                <SelectItem value="Level 3">Level 3 (Health Centre)</SelectItem>
                <SelectItem value="Level 2">Level 2 (Dispensary)</SelectItem>
                <SelectItem value="Blood Hub">Blood Hub (RBTC)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Searchable Facility Combobox */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-medium hidden sm:inline">Facility</span>
            <FacilityCombobox
              value={selectedFacility}
              selectedLevel={selectedLevel}
              onChange={(facId, facItem) => {
                setSelectedFacility(facId);
                if (facItem?.name) {
                  setSelectedFacilityName(facItem.name);
                }
                if (facItem?.level && selectedLevel !== "ALL" && facItem.level !== selectedLevel) {
                  setSelectedLevel(facItem.level);
                }
              }}
            />
          </div>
        </div>
      </div>

      {/* 2. Main Horizon ARIMA Chart Card (Client-side SWR with Redis Cache) */}
      <ArimaChart
        selectedFacility={selectedFacility}
        facilityName={selectedFacilityName}
        horizonDays={selectedHorizon}
        onHorizonChange={setSelectedHorizon}
      />

      {/* 3. Decentralized Rebalancing Matrix Table (Client-side SWR with Redis Cache) */}
      <RebalancingMatrix
        horizonDays={selectedHorizon}
        selectedLevel={selectedLevel}
      />
    </div>
  );
}
