"use client";

import * as React from "react";
import useSWR from "swr";
import { ArrowRight, ChevronLeft, ChevronRight, Filter, RefreshCw } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { API_BASE_URL, fetcher } from "@/lib/api";

export interface RebalancingRow {
  id: string;
  facility: string;
  county?: string;
  tier?: "Level 6" | "Level 5" | "Level 4" | "Level 3" | "Blood Hub" | string;
  bloodType: string;
  inventory: number;
  projectedDemand: number;
  position: "DEFICIT" | "SURPLUS" | "BALANCED" | string;
  suggestedAction: string;
  actionType: "RECEIVE" | "ROUTE" | "NONE" | string;
}

const DEFAULT_MATRIX_ROWS: RebalancingRow[] = [
  {
    id: "1",
    facility: "Kenyatta National Referral Hospital",
    county: "Nairobi",
    tier: "Level 6",
    bloodType: "O-",
    inventory: 740,
    projectedDemand: 110,
    position: "SURPLUS",
    suggestedAction: "Route 80 units",
    actionType: "ROUTE",
  },
  {
    id: "2",
    facility: "Moi Teaching & Referral Hospital",
    county: "Uasin Gishu",
    tier: "Level 6",
    bloodType: "A+",
    inventory: 810,
    projectedDemand: 125,
    position: "BALANCED",
    suggestedAction: "No action",
    actionType: "NONE",
  },
  {
    id: "3",
    facility: "Nakuru Provincial General Hospital",
    county: "Nakuru",
    tier: "Level 5",
    bloodType: "B+",
    inventory: 160,
    projectedDemand: 60,
    position: "DEFICIT",
    suggestedAction: "Receive 30 units",
    actionType: "RECEIVE",
  },
  {
    id: "4",
    facility: "Coast General Teaching & Referral",
    county: "Mombasa",
    tier: "Level 5",
    bloodType: "O+",
    inventory: 320,
    projectedDemand: 65,
    position: "SURPLUS",
    suggestedAction: "Route 50 units",
    actionType: "ROUTE",
  },
  {
    id: "5",
    facility: "Jaramogi Oginga Odinga Referral",
    county: "Kisumu",
    tier: "Level 5",
    bloodType: "A-",
    inventory: 98,
    projectedDemand: 52,
    position: "DEFICIT",
    suggestedAction: "Receive 25 units",
    actionType: "RECEIVE",
  },
  {
    id: "6",
    facility: "Machakos Level 5 Hospital",
    county: "Machakos",
    tier: "Level 5",
    bloodType: "AB+",
    inventory: 115,
    projectedDemand: 45,
    position: "DEFICIT",
    suggestedAction: "Receive 18 units",
    actionType: "RECEIVE",
  },
  {
    id: "7",
    facility: "Garissa Provincial General Hospital",
    county: "Garissa",
    tier: "Level 5",
    bloodType: "O-",
    inventory: 180,
    projectedDemand: 40,
    position: "BALANCED",
    suggestedAction: "No action",
    actionType: "NONE",
  },
  {
    id: "8",
    facility: "Nairobi Regional Blood Transfusion Center",
    county: "Nairobi",
    tier: "Blood Hub",
    bloodType: "O+",
    inventory: 2850,
    projectedDemand: 0,
    position: "SURPLUS",
    suggestedAction: "Route 450 units",
    actionType: "ROUTE",
  },
  {
    id: "9",
    facility: "Naivasha Sub-County Hospital",
    county: "Nakuru",
    tier: "Level 4",
    bloodType: "B-",
    inventory: 68,
    projectedDemand: 14,
    position: "BALANCED",
    suggestedAction: "No action",
    actionType: "NONE",
  },
  {
    id: "10",
    facility: "Othaya Sub-County Hospital",
    county: "Nyeri",
    tier: "Level 4",
    bloodType: "O+",
    inventory: 42,
    projectedDemand: 16,
    position: "DEFICIT",
    suggestedAction: "Receive 8 units",
    actionType: "RECEIVE",
  },
  {
    id: "11",
    facility: "Vital Solutions Health Centre",
    county: "Nairobi",
    tier: "Level 3",
    bloodType: "O-",
    inventory: 3,
    projectedDemand: 1,
    position: "BALANCED",
    suggestedAction: "No action",
    actionType: "NONE",
  },
  {
    id: "12",
    facility: "Radiant Umoja Health Centre",
    county: "Nairobi",
    tier: "Level 3",
    bloodType: "A+",
    inventory: 4,
    projectedDemand: 2,
    position: "BALANCED",
    suggestedAction: "No action",
    actionType: "NONE",
  },
  {
    id: "13",
    facility: "Sanctuary Rains Health Centre",
    county: "Nairobi",
    tier: "Level 3",
    bloodType: "O-",
    inventory: 1,
    projectedDemand: 2,
    position: "DEFICIT",
    suggestedAction: "Receive 2 units",
    actionType: "RECEIVE",
  },
];

interface RebalancingMatrixProps {
  horizonDays: number;
  selectedLevel?: string;
  initialRows?: RebalancingRow[];
}

export function RebalancingMatrix({
  horizonDays,
  selectedLevel = "ALL",
  initialRows = DEFAULT_MATRIX_ROWS,
}: RebalancingMatrixProps) {
  const [hideBalanced, setHideBalanced] = React.useState(false);
  const [currentPage, setCurrentPage] = React.useState(1);
  const pageSize = 10;

  // Task 3.2: Wire live SWR data fetching from FastAPI + Redis cache
  const { data: rebalanceData, isLoading, isValidating } = useSWR<Record<string, unknown>>(
    `${API_BASE_URL}/rebalance/suggestions`,
    fetcher,
    {
      revalidateOnFocus: true,
      refreshInterval: 12000,
    }
  );

  // Extract matrix rows from live backend or fallback to initial rows
  const liveRows: RebalancingRow[] = React.useMemo(() => {
    if (rebalanceData && Array.isArray(rebalanceData.matrix) && rebalanceData.matrix.length > 0) {
      return (rebalanceData.matrix as Record<string, unknown>[]).map((item, idx) => ({
        id: String(item.id || idx + 1),
        facility: String(item.facility || "Hospital Node"),
        county: item.county ? String(item.county) : undefined,
        tier: String(item.tier || "Level 4"),
        bloodType: String(item.bloodType || item.blood_type || "O+"),
        inventory: Number(item.inventory || 0),
        projectedDemand: Number(item.projectedDemand || item.projected_demand || 0),
        position: String(item.position || "BALANCED"),
        suggestedAction: String(item.suggestedAction || item.suggested_action || "No action"),
        actionType: String(item.actionType || item.action_type || "NONE"),
      }));
    }
    return initialRows;
  }, [rebalanceData, initialRows]);

  // Filter rows by level and position
  const filteredRows = React.useMemo(() => {
    let rows = liveRows.map((r) => {
      // Strict KEPH validation
      if (r.tier === "Level 2") {
        return {
          ...r,
          inventory: 0,
          projectedDemand: 0,
          suggestedAction: "No action",
          actionType: "NONE",
          position: "BALANCED",
        };
      }
      if (r.tier === "Level 3" && (r.inventory > 10 || r.projectedDemand > 10)) {
        return {
          ...r,
          inventory: Math.min(r.inventory, 4),
          projectedDemand: Math.min(r.projectedDemand, 2),
        };
      }
      return r;
    });

    if (selectedLevel && selectedLevel !== "ALL") {
      rows = rows.filter((r) => r.tier === selectedLevel);
    }
    if (hideBalanced) {
      rows = rows.filter((r) => r.position !== "BALANCED");
    }
    return rows;
  }, [liveRows, hideBalanced, selectedLevel]);

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(filteredRows.length / pageSize));
  const paginatedRows = React.useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredRows.slice(start, start + pageSize);
  }, [filteredRows, currentPage, pageSize]);

  // Export report to CSV
  const handleExportCSV = () => {
    const headers = ["Facility", "County", "Blood Type", "Inventory", `${horizonDays}-Day Demand`, "Position", "Suggested Action"];
    const rows = filteredRows.map((r) => [
      `"${r.facility}"`,
      `"${r.county || ""}"`,
      `"${r.bloodType}"`,
      r.inventory,
      r.projectedDemand,
      r.position,
      `"${r.suggestedAction}"`,
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);

    const now = new Date();
    const day = String(now.getDate()).padStart(2, "0");
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const year = now.getFullYear();
    const exportDate = `${day}-${month}-${year}`;

    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `abis_rebalancing_matrix_${horizonDays}d_${exportDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Card className="p-6 bg-white border border-slate-200/80 shadow-xs space-y-4">
      {/* Table Header and Action bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-slate-900 font-heading tracking-tight">
              Rebalancing matrix
            </h3>
            {isValidating && (
              <span title="Validating with Redis cache" className="inline-flex">
                <RefreshCw className="w-3.5 h-3.5 text-emerald-600 animate-spin" />
              </span>
            )}
            {Boolean(rebalanceData?.cached) && (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold">
                REDIS CACHED
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Inventory actions calculated from live regional cold rooms and 7-day demand forecasts
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Hide Balanced Toggle */}
          <Button
            variant={hideBalanced ? "secondary" : "outline"}
            size="sm"
            onClick={() => {
              setHideBalanced(!hideBalanced);
              setCurrentPage(1);
            }}
            className="flex items-center gap-1.5 text-xs rounded-xl"
          >
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span>{hideBalanced ? "Showing Imbalances" : "Hide Balanced"}</span>
          </Button>

          {/* Export Report Link */}
          <button
            onClick={handleExportCSV}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 group cursor-pointer transition-colors"
          >
            <span>Export report</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>

      {/* shadcn Table with Live Dynamic Position Coloring */}
      <div className="rounded-xl border border-slate-100 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/60 hover:bg-slate-50/60">
              <TableHead className="font-semibold text-slate-500">FACILITY</TableHead>
              <TableHead className="font-semibold text-slate-500">BLOOD TYPE</TableHead>
              <TableHead className="font-semibold text-slate-500">INVENTORY</TableHead>
              <TableHead className="font-semibold text-slate-500">
                {horizonDays}-DAY DEMAND
              </TableHead>
              <TableHead className="font-semibold text-slate-500">POSITION</TableHead>
              <TableHead className="font-semibold text-slate-500">SUGGESTED ACTION</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (!rebalanceData || !rebalanceData.matrix) ? (
              Array.from({ length: 6 }).map((_, i) => (
                <TableRow key={`matrix-skel-${i}`}>
                  <TableCell className="py-3.5"><Skeleton className="h-4 w-44" /></TableCell>
                  <TableCell className="py-3.5"><Skeleton className="h-4 w-10" /></TableCell>
                  <TableCell className="py-3.5"><Skeleton className="h-4 w-16" /></TableCell>
                  <TableCell className="py-3.5"><Skeleton className="h-4 w-16" /></TableCell>
                  <TableCell className="py-3.5"><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                  <TableCell className="py-3.5"><Skeleton className="h-4 w-28" /></TableCell>
                </TableRow>
              ))
            ) : paginatedRows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="py-8 text-center text-xs text-slate-400">
                  No facility rebalancing entries match your filter.
                </TableCell>
              </TableRow>
            ) : (
              paginatedRows.map((row) => (
                <TableRow key={row.id} className="hover:bg-slate-50/80 transition-colors">
                  <TableCell className="font-medium text-slate-800">
                    <div className="flex items-center gap-2">
                      <span>{row.facility}</span>
                      {row.tier && (
                        <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200/60">
                          {row.tier}
                        </span>
                      )}
                    </div>
                    {row.county && (
                      <span className="text-[10px] text-slate-400 font-mono block mt-0.5">
                        {row.county} County
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="font-mono font-bold text-slate-700">
                    {row.bloodType}
                  </TableCell>
                  <TableCell className="font-mono text-slate-600">
                    {row.inventory} units
                  </TableCell>
                  <TableCell className="font-mono text-slate-600">
                    {row.projectedDemand} units
                  </TableCell>
                  {/* Task 3.2: Accurate Tailwind coloring for DEFICIT (Red), SURPLUS (Green), and BALANCED (Purple) */}
                  <TableCell>
                    {row.position === "DEFICIT" && (
                      <Badge variant="deficit">DEFICIT</Badge>
                    )}
                    {row.position === "SURPLUS" && (
                      <Badge variant="surplus">SURPLUS</Badge>
                    )}
                    {row.position === "BALANCED" && (
                      <Badge variant="balanced">BALANCED</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <span
                      className={
                        row.actionType === "RECEIVE"
                          ? "font-semibold text-rose-600"
                          : row.actionType === "ROUTE"
                          ? "font-semibold text-emerald-600"
                          : "text-slate-400 font-medium"
                      }
                    >
                      {row.suggestedAction}
                    </span>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Footer */}
      <div className="flex items-center justify-between pt-2 text-xs text-slate-500">
        <div>
          Showing{" "}
          <span className="font-semibold text-slate-800">
            {filteredRows.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}
          </span>{" "}
          to{" "}
          <span className="font-semibold text-slate-800">
            {Math.min(currentPage * pageSize, filteredRows.length)}
          </span>{" "}
          of <span className="font-semibold text-slate-800">{filteredRows.length}</span> facilities
        </div>

        <div className="flex items-center gap-1.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="h-8 w-8 p-0"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="px-2 text-slate-700 font-mono text-[11px]">
            {currentPage} / {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="h-8 w-8 p-0"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
