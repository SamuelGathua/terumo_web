"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { PriorityRequestItem } from "@/lib/api";

interface PriorityRequestsTableProps {
  requests: PriorityRequestItem[];
}

export function PriorityRequestsTable({ requests }: PriorityRequestsTableProps) {
  const items = React.useMemo(() => {
    if (requests && requests.length > 0) return requests;
    return [
      {
        id: "1",
        code: "KE",
        code_bg: "bg-teal-50 text-teal-700",
        facility: "Kenyatta National",
        blood_type: "O-",
        amount: "42 units",
        units: 42,
        status: "CRITICAL",
      },
      {
        id: "2",
        code: "M.",
        code_bg: "bg-cyan-50 text-cyan-700",
        facility: "M.P. Shah Hospital",
        blood_type: "AB-",
        amount: "18 units",
        units: 18,
        status: "URGENT",
      },
      {
        id: "3",
        code: "AG",
        code_bg: "bg-cyan-50 text-cyan-700",
        facility: "Aga Khan Nairobi",
        blood_type: "B+",
        amount: "24 units",
        units: 24,
        status: "URGENT",
      },
      {
        id: "4",
        code: "NA",
        code_bg: "bg-emerald-50 text-emerald-700",
        facility: "Nairobi West",
        blood_type: "A+",
        amount: "16 units",
        units: 16,
        status: "STABLE",
      },
    ];
  }, [requests]);

  return (
    <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-bold text-slate-900 text-base font-heading">
            Priority requests
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Requests requiring immediate action
          </p>
        </div>

        <Link
          href="/forecasts"
          className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 group"
        >
          <span>View all</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
              <th className="pb-3 pl-1">FACILITY</th>
              <th className="pb-3">TYPE</th>
              <th className="pb-3">REQUEST</th>
              <th className="pb-3">STATUS</th>
              <th className="pb-3 text-right"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {items.map((r, i) => {
              const btype = r.bloodType || r.blood_type || "O-";
              const codeBg = r.code_bg || "bg-teal-50 text-teal-700";

              return (
                <tr
                  key={r.id || i}
                  className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                >
                  <td className="py-3.5 pl-1">
                    <div className="flex items-center gap-2.5">
                      <span
                        className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-[11px] shrink-0 ${codeBg}`}
                      >
                        {r.code}
                      </span>
                      <span className="font-semibold text-slate-800">{r.facility}</span>
                    </div>
                  </td>
                  <td className="py-3.5 font-mono font-bold text-slate-800">{btype}</td>
                  <td className="py-3.5 font-medium text-slate-600">{r.amount}</td>
                  <td className="py-3.5">
                    {/* Task 2.6: Dynamic shadcn/ui Badges */}
                    {r.status === "CRITICAL" && (
                      <Badge variant="critical">CRITICAL</Badge>
                    )}
                    {r.status === "URGENT" && (
                      <Badge variant="urgent">URGENT</Badge>
                    )}
                    {r.status === "STABLE" && (
                      <Badge variant="stable">STABLE</Badge>
                    )}
                    {!["CRITICAL", "URGENT", "STABLE"].includes(r.status) && (
                      <Badge variant="secondary">{r.status}</Badge>
                    )}
                  </td>
                  <td className="py-3.5 text-right pr-1">
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-600 transition-colors inline" />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
