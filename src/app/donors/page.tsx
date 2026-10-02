"use client";

import * as React from "react";
import {
  Users,
  AlertTriangle,
  MessageSquare,
  PhoneCall,
  CheckCircle2,
} from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { OutreachModal } from "@/components/OutreachModal";
import { RfmSimulator } from "@/components/RfmSimulator";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { fetchDonors, DonorRecord } from "@/lib/api";

export interface DonorRosterItem {
  id: string;
  name: string;
  initials: string;
  bloodType: string;
  recencyDays: number;
  lastDonation: string;
  retentionProb: number;
  riskTier: "HIGH RISK" | "AT RISK" | "ENGAGED";
  totalDonations: number;
  tenureDays: number;
}

// Initial realistic roster adhering to user screenshot
const INITIAL_ROSTER: DonorRosterItem[] = [
  {
    id: "DONOR-001",
    name: "Grace Wanjiku",
    initials: "GW",
    bloodType: "O+",
    recencyDays: 425,
    lastDonation: "14 mos ago",
    retentionProb: 18,
    riskTier: "HIGH RISK",
    totalDonations: 3,
    tenureDays: 780,
  },
  {
    id: "DONOR-002",
    name: "Peter Otieno",
    initials: "PO",
    bloodType: "B+",
    recencyDays: 270,
    lastDonation: "9 mos ago",
    retentionProb: 26,
    riskTier: "HIGH RISK",
    totalDonations: 4,
    tenureDays: 920,
  },
  {
    id: "DONOR-003",
    name: "Leah Njeri",
    initials: "LN",
    bloodType: "A-",
    recencyDays: 150,
    lastDonation: "5 mos ago",
    retentionProb: 48,
    riskTier: "AT RISK",
    totalDonations: 5,
    tenureDays: 540,
  },
  {
    id: "DONOR-004",
    name: "David Kamau",
    initials: "DK",
    bloodType: "O-",
    recencyDays: 21,
    lastDonation: "3 weeks ago",
    retentionProb: 76,
    riskTier: "ENGAGED",
    totalDonations: 12,
    tenureDays: 1100,
  },
  {
    id: "DONOR-005",
    name: "Mary Achieng",
    initials: "MA",
    bloodType: "AB+",
    recencyDays: 14,
    lastDonation: "2 weeks ago",
    retentionProb: 91,
    riskTier: "ENGAGED",
    totalDonations: 18,
    tenureDays: 1420,
  },
  {
    id: "DONOR-006",
    name: "John Mwangi",
    initials: "JM",
    bloodType: "O+",
    recencyDays: 330,
    lastDonation: "11 mos ago",
    retentionProb: 32,
    riskTier: "HIGH RISK",
    totalDonations: 2,
    tenureDays: 610,
  },
  {
    id: "DONOR-007",
    name: "Sarah Kiprop",
    initials: "SK",
    bloodType: "A+",
    recencyDays: 60,
    lastDonation: "2 mos ago",
    retentionProb: 64,
    riskTier: "AT RISK",
    totalDonations: 7,
    tenureDays: 850,
  },
  {
    id: "DONOR-008",
    name: "Brian Ochieng",
    initials: "BO",
    bloodType: "B-",
    recencyDays: 28,
    lastDonation: "4 weeks ago",
    retentionProb: 85,
    riskTier: "ENGAGED",
    totalDonations: 14,
    tenureDays: 1230,
  },
  {
    id: "DONOR-009",
    name: "Faith Mutua",
    initials: "FM",
    bloodType: "O+",
    recencyDays: 390,
    lastDonation: "13 mos ago",
    retentionProb: 21,
    riskTier: "HIGH RISK",
    totalDonations: 2,
    tenureDays: 450,
  },
  {
    id: "DONOR-010",
    name: "Kevin Koech",
    initials: "KK",
    bloodType: "A-",
    recencyDays: 35,
    lastDonation: "5 weeks ago",
    retentionProb: 73,
    riskTier: "ENGAGED",
    totalDonations: 9,
    tenureDays: 980,
  },
];

// Helper to format days into clean human readable strings
function formatRecency(days: number): string {
  if (days < 7) return `${days}d ago`;
  if (days < 30) {
    const weeks = Math.round(days / 7);
    return `${weeks} ${weeks === 1 ? "week" : "weeks"} ago`;
  }
  const months = Math.round(days / 30.4);
  return `${months} ${months === 1 ? "mo" : "mos"} ago`;
}

// Donut Chart Distribution Data
const DONOR_HEALTH_DATA = [
  { name: "Engaged", value: 68, color: "#108f75" },
  { name: "At risk", value: 18, color: "#f59e0b" },
  { name: "High risk", value: 14, color: "#ef4444" },
];

export default function DonorsPage() {
  const { toast } = useToast();
  const [roster, setRoster] = React.useState<DonorRosterItem[]>(INITIAL_ROSTER);
  const [selectedBloodType, setSelectedBloodType] = React.useState<string>("ALL");

  // Non-critical safe donors = 68% Engaged + 18% At risk = 86% safe (100% - 14% High risk)
  const safePercentage = React.useMemo(() => {
    const engaged = DONOR_HEALTH_DATA.find((d) => d.name === "Engaged")?.value || 0;
    const atRisk = DONOR_HEALTH_DATA.find((d) => d.name === "At risk")?.value || 0;
    return engaged + atRisk;
  }, []);

  // Quick Action States
  const [actionStatus, setActionStatus] = React.useState<Record<string, string>>({});

  // Attempt to enrich roster from backend /donors endpoint
  React.useEffect(() => {
    let isMounted = true;
    async function loadDonors() {
      try {
        const data = await fetchDonors(30);
        if (isMounted && Array.isArray(data) && data.length > 0) {
          const kenyanNames = [
            "Grace Wanjiku", "Peter Otieno", "Leah Njeri", "David Kamau", "Mary Achieng",
            "John Mwangi", "Sarah Kiprop", "Brian Ochieng", "Faith Mutua", "Kevin Koech",
            "Mercy Cherono", "Dennis Kipkemoi", "Esther Wambui", "Samuel Maina", "Alice Nyambura"
          ];
          const enriched: DonorRosterItem[] = data.slice(0, 15).map((d: DonorRecord, i: number) => {
            const name = kenyanNames[i % kenyanNames.length];
            const parts = name.split(" ");
            const initials = `${parts[0][0]}${parts[1] ? parts[1][0] : ""}`;
            const prob = Math.round(d.retention_probability * 100);
            const riskTier = prob >= 70 ? "ENGAGED" : prob >= 40 ? "AT RISK" : "HIGH RISK";

            return {
              id: d.donor_id.slice(0, 8),
              name,
              initials,
              bloodType: d.blood_type,
              recencyDays: d.recency_days,
              lastDonation: formatRecency(d.recency_days),
              retentionProb: prob,
              riskTier,
              totalDonations: d.total_donations,
              tenureDays: d.tenure_days,
            };
          });
          setRoster(enriched);
        }
      } catch (err) {
        console.warn("Using high-fidelity realistic Kenyan donor roster:", err);
      }
    }
    loadDonors();
    return () => {
      isMounted = false;
    };
  }, []);

  // Filter roster by blood type
  const filteredRoster = React.useMemo(() => {
    if (!selectedBloodType || selectedBloodType === "ALL") {
      return roster;
    }
    return roster.filter((d) => d.bloodType === selectedBloodType);
  }, [roster, selectedBloodType]);

  // Handle Action Trigger (Call / SMS)
  const handleCall = (donor: DonorRosterItem) => {
    setActionStatus((prev) => ({ ...prev, [donor.id]: "Calling..." }));
    toast({
      title: "Connecting Voice Call",
      description: `Dialing ${donor.name} (${donor.bloodType}) via clinic telephony bridge.`,
      variant: "default",
    });
    setTimeout(() => {
      setActionStatus((prev) => {
        const next = { ...prev };
        delete next[donor.id];
        return next;
      });
    }, 3000);
  };

  const handleSMS = (donor: DonorRosterItem) => {
    setActionStatus((prev) => ({ ...prev, [donor.id]: "SMS Sent" }));
    toast({
      title: "Direct Recall Dispatched",
      description: `Queued personalized retention SMS for ${donor.name}.`,
      variant: "default",
    });
    setTimeout(() => {
      setActionStatus((prev) => {
        const next = { ...prev };
        delete next[donor.id];
        return next;
      });
    }, 3000);
  };



  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* 1. Header with Title & Outreach Modal */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold text-slate-400 tracking-widest uppercase block font-mono">
            RETENTION OPERATIONS
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-heading mt-0.5">
            Donor outreach
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Prioritize interventions using AI-predicted retention signals.
          </p>
        </div>

        {/* Modal Trigger */}
        <OutreachModal />
      </div>

      {/* 2. Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Active Donors */}
        <Card className="p-5 bg-white border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center shrink-0">
            <Users className="w-5 h-5 text-rose-500" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-medium block">Active donors</span>
            <span className="text-2xl font-black text-slate-900 tracking-tight font-heading">
              24,892
            </span>
          </div>
        </Card>

        {/* High-Risk Donors */}
        <Card className="p-5 bg-white border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5 text-rose-500" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-medium block">High-risk donors</span>
            <span className="text-2xl font-black text-slate-900 tracking-tight font-heading">
              1,248
            </span>
          </div>
        </Card>

        {/* Contacted this week */}
        <Card className="p-5 bg-white border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center shrink-0">
            <MessageSquare className="w-5 h-5 text-teal-600" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-medium block">Contacted this week</span>
            <span className="text-2xl font-black text-slate-900 tracking-tight font-heading">
              836
            </span>
          </div>
        </Card>
      </div>

      {/* 3. Main Roster Table & Donor Health Donut Chart Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Risk-tiered roster Card (8 cols) */}
        <Card className="lg:col-span-8 p-6 bg-white border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-slate-900 font-heading">
                Risk-tiered roster
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Sorted by predicted retention probability
              </p>
            </div>

            {/* Blood Type Filter Dropdown */}
            <Select value={selectedBloodType} onValueChange={setSelectedBloodType}>
              <SelectTrigger className="w-36 h-9 bg-white border-slate-200 text-xs font-medium rounded-xl">
                <SelectValue placeholder="All blood types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All blood types</SelectItem>
                <SelectItem value="O+">O+ Positive</SelectItem>
                <SelectItem value="O-">O- Universal</SelectItem>
                <SelectItem value="A+">A+ Positive</SelectItem>
                <SelectItem value="A-">A- Negative</SelectItem>
                <SelectItem value="B+">B+ Positive</SelectItem>
                <SelectItem value="B-">B- Negative</SelectItem>
                <SelectItem value="AB+">AB+ Positive</SelectItem>
                <SelectItem value="AB-">AB- Negative</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Table Component */}
          <div className="rounded-xl border border-slate-100 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50/60 hover:bg-slate-50/60">
                  <TableHead className="font-semibold text-slate-500 text-[11px]">DONOR</TableHead>
                  <TableHead className="font-semibold text-slate-500 text-[11px]">TYPE</TableHead>
                  <TableHead className="font-semibold text-slate-500 text-[11px]">
                    LAST DONATION
                  </TableHead>
                  <TableHead className="font-semibold text-slate-500 text-[11px]">
                    RETENTION
                  </TableHead>
                  <TableHead className="font-semibold text-slate-500 text-[11px]">
                    RISK TIER
                  </TableHead>
                  <TableHead className="font-semibold text-slate-500 text-[11px] text-right">
                    INTERVENTION
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRoster.map((donor) => (
                  <TableRow key={donor.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* Donor with Circle Initials Avatar */}
                    <TableCell className="py-3 font-medium text-slate-900">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-xs shrink-0 border border-slate-200/60">
                          {donor.initials}
                        </div>
                        <span className="font-medium text-xs text-slate-800">{donor.name}</span>
                      </div>
                    </TableCell>

                    {/* Blood Type */}
                    <TableCell className="py-3 font-mono font-semibold text-xs text-slate-700">
                      {donor.bloodType}
                    </TableCell>

                    {/* LAST DONATION (recency_days) - Task 1 Requirement */}
                    <TableCell className="py-3 font-mono text-xs text-slate-600">
                      {donor.lastDonation}
                    </TableCell>

                    {/* Retention % */}
                    <TableCell className="py-3 font-mono font-semibold text-xs text-slate-800">
                      {donor.retentionProb}%
                    </TableCell>

                    {/* Risk Tier Badge */}
                    <TableCell className="py-3">
                      {donor.riskTier === "HIGH RISK" ? (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-600 border border-rose-100 font-mono tracking-wide">
                          HIGH RISK
                        </span>
                      ) : donor.riskTier === "AT RISK" ? (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-600 border border-amber-100 font-mono tracking-wide">
                          AT RISK
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100 font-mono tracking-wide">
                          ENGAGED
                        </span>
                      )}
                    </TableCell>

                    {/* Intervention Action Buttons */}
                    <TableCell className="py-3 text-right">
                      {actionStatus[donor.id] ? (
                        <span className="text-xs font-mono font-semibold text-emerald-600 inline-flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          {actionStatus[donor.id]}
                        </span>
                      ) : (
                        <div className="inline-flex items-center gap-1.5">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleCall(donor)}
                            className="h-8 w-8 p-0 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100"
                            title={`Call ${donor.name}`}
                          >
                            <PhoneCall className="w-3.5 h-3.5" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleSMS(donor)}
                            className="h-8 w-8 p-0 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100"
                            title={`Send SMS to ${donor.name}`}
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>

        {/* Right: Donor Health Donut Chart Card (4 cols) */}
        <Card className="lg:col-span-4 p-6 bg-white border border-slate-200/80 shadow-xs space-y-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 font-heading">
              Donor health
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Retention risk by cohort
            </p>
          </div>

          {/* Donut Chart with Centered Metric */}
          <div className="relative h-60 w-full flex items-center justify-center pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={DONOR_HEALTH_DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={92}
                  paddingAngle={3}
                  dataKey="value"
                  startAngle={90}
                  endAngle={-270}
                >
                  {DONOR_HEALTH_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>

            {/* Central Badge Overlay */}
            <div
              className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
              title={`${safePercentage}% non-critical safe retention base (Engaged 68% + At risk 18%)`}
            >
              <span className="text-3xl font-black text-slate-900 font-mono tracking-tight">
                {safePercentage}%
              </span>
              <span className="text-xs text-slate-500 font-medium">safe</span>
            </div>
          </div>

          {/* Color-coded Legend */}
          <div className="space-y-2.5 pt-4 border-t border-slate-100 text-xs">
            {DONOR_HEALTH_DATA.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-slate-600 font-medium">{item.name}</span>
                </div>
                <span className="font-mono font-bold text-slate-800">{item.value}%</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* 4. Donor Retention Risk Simulator */}
      <RfmSimulator />
    </div>
  );
}
