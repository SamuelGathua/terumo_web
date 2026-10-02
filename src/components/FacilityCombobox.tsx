"use client";

import * as React from "react";
import { Check, ChevronsUpDown, Building2, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export interface FacilityItem {
  id: string;
  name: string;
  county: string;
  type: string;
  level?: string;
  capacity?: number;
  inventory?: number;
}

const PRIMARY_FACILITIES: FacilityItem[] = [
  { id: "HOSP-NAIROBI-01", name: "Kenyatta National Referral Hospital", county: "Nairobi", type: "National Referral", level: "Level 6" },
  { id: "HOSP-KISUMU-02", name: "Jaramogi Oginga Odinga Referral", county: "Kisumu", type: "County Referral", level: "Level 5" },
  { id: "CLINIC-MOMBASA-03", name: "Coast General Hospital", county: "Mombasa", type: "Coastal Referral", level: "Level 5" },
  { id: "REGIONAL-HUB-01", name: "Nairobi Regional Blood Depot", county: "Nairobi", type: "Transfusion Depot", level: "Blood Hub" },
  { id: "FAC-13023", name: "Moi Teaching and Referral Hospital", county: "Uasin Gishu", type: "National Referral", level: "Level 6" },
  { id: "FAC-15288", name: "Nakuru Provincial General Hospital", county: "Nakuru", type: "County Referral", level: "Level 5" },
  { id: "FAC-16201", name: "Naivasha Sub-County Hospital", county: "Nakuru", type: "Sub-County Hospital", level: "Level 4" },
  { id: "FAC-22976", name: "Radiant Umoja Health Centre", county: "Nairobi", type: "Health Centre", level: "Level 3" },
  { id: "FAC-22998", name: "Kaka Medical Clinic", county: "Nairobi", type: "Dispensary", level: "Level 2" },
];

interface FacilityComboboxProps {
  value: string;
  onChange: (facilityId: string, facilityItem?: FacilityItem) => void;
  selectedLevel?: string;
  className?: string;
}

export function FacilityCombobox({
  value,
  onChange,
  selectedLevel = "ALL",
  className,
}: FacilityComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [facilities, setFacilities] = React.useState<FacilityItem[]>(PRIMARY_FACILITIES);
  const [searchQuery, setSearchQuery] = React.useState("");

  // Load the comprehensive 8,900+ facilities dataset asynchronously
  React.useEffect(() => {
    let isMounted = true;
    async function loadAllFacilities() {
      try {
        const res = await fetch("/kenya_facilities.json");
        if (res.ok) {
          const data: FacilityItem[] = await res.json();
          if (isMounted && Array.isArray(data) && data.length > 0) {
            setFacilities(data);
          }
        }
      } catch (err) {
        console.warn("Using primary Kenyan facilities fallback:", err);
      }
    }
    loadAllFacilities();
    return () => {
      isMounted = false;
    };
  }, []);

  // Filter facilities by selected level (if not "ALL")
  const levelFilteredFacilities = React.useMemo(() => {
    if (!selectedLevel || selectedLevel === "ALL") {
      return facilities;
    }
    return facilities.filter((f) => f.level === selectedLevel);
  }, [facilities, selectedLevel]);

  // Fast virtual search filter - capped at 50 results to prevent DOM lag
  const filteredFacilities = React.useMemo(() => {
    const source = levelFilteredFacilities;
    if (!searchQuery.trim()) {
      return source.slice(0, 30);
    }
    const q = searchQuery.toLowerCase().trim();
    const matches: FacilityItem[] = [];
    for (let i = 0; i < source.length; i++) {
      const f = source[i];
      if (
        f.name.toLowerCase().includes(q) ||
        f.county.toLowerCase().includes(q) ||
        f.id.toLowerCase().includes(q)
      ) {
        matches.push(f);
        if (matches.length >= 50) break; // Performance guardrail
      }
    }
    return matches;
  }, [levelFilteredFacilities, searchQuery]);

  // Find currently selected facility metadata
  const selectedFacility = React.useMemo(() => {
    return facilities.find((f) => f.id === value) || PRIMARY_FACILITIES.find((f) => f.id === value);
  }, [facilities, value]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-64 sm:w-80 justify-between bg-white border-slate-200/90 text-slate-800 font-medium text-xs rounded-xl shadow-2xs hover:border-slate-300",
            className
          )}
        >
          <div className="flex items-center gap-2 truncate">
            <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">
              {selectedFacility ? selectedFacility.name : value}
            </span>
          </div>
          <div className="flex items-center gap-1.5 shrink-0 ml-1">
            {selectedFacility?.level && (
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-semibold border border-slate-200/60 hidden sm:inline">
                {selectedFacility.level}
              </span>
            )}
            <ChevronsUpDown className="h-3.5 w-3.5 opacity-50" />
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 sm:w-96 p-0" align="end">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder={`Search ${selectedLevel !== "ALL" ? selectedLevel : "Kenyan"} facilities...`}
            value={searchQuery}
            onValueChange={setSearchQuery}
          />
          <CommandList className="max-h-72">
            <CommandEmpty>No matching health facilities found.</CommandEmpty>
            <CommandGroup
              heading={
                selectedLevel === "ALL"
                  ? `All Kenyan Facilities (${levelFilteredFacilities.length.toLocaleString()} Total)`
                  : `${selectedLevel} Facilities (${levelFilteredFacilities.length.toLocaleString()} Total)`
              }
            >
              {filteredFacilities.map((facility) => {
                const isSelected = value === facility.id;
                return (
                  <CommandItem
                    key={facility.id}
                    value={facility.id}
                    onSelect={() => {
                      onChange(facility.id, facility);
                      setOpen(false);
                    }}
                    className="flex items-center justify-between py-2 cursor-pointer"
                  >
                    <div className="flex items-start gap-2 min-w-0 pr-2">
                      <Check
                        className={cn(
                          "mt-0.5 h-3.5 w-3.5 text-emerald-600 shrink-0",
                          isSelected ? "opacity-100" : "opacity-0"
                        )}
                      />
                      <div className="min-w-0">
                        <div className="font-semibold text-slate-800 text-xs truncate">
                          {facility.name}
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono mt-0.5">
                          {facility.county && (
                            <span className="flex items-center gap-0.5">
                              <MapPin className="w-2.5 h-2.5" />
                              {facility.county}
                            </span>
                          )}
                          <span>•</span>
                          <span>{facility.id}</span>
                          {facility.level && (
                            <>
                              <span>•</span>
                              <span className="text-emerald-700 font-semibold">{facility.level}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    {facility.type && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-medium shrink-0 max-w-28 truncate">
                        {facility.type}
                      </span>
                    )}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
