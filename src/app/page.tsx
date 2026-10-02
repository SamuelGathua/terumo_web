"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  AlertTriangle,
  ArrowRight,
  Check,
  CheckCircle2,
  Droplet,
  Sparkles,
  Thermometer,
  Truck,
  X,
} from "lucide-react";

export default function LandingPage() {
  const [demoModalOpen, setDemoModalOpen] = useState(false);
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"forecast" | "retention" | "trace" | "rebalance">("forecast");
  const [demoFormSubmitted, setDemoFormSubmitted] = useState(false);
  const [demoFormData, setDemoFormData] = useState({
    name: "",
    email: "",
    facility: "",
    role: "Medical Director",
    region: "Kenya",
  });

  const handleDemoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setDemoFormSubmitted(true);
    setTimeout(() => {
      setDemoFormSubmitted(false);
      setDemoModalOpen(false);
    }, 2800);
  };

  return (
    <div className="min-h-screen bg-[#051611] text-[#e2ece8] selection:bg-[#e02e48] selection:text-white relative overflow-hidden">
      {/* Ambient Radial Background Glows */}
      <div className="pointer-events-none absolute top-[700px] -left-48 w-[700px] h-[700px] bg-[radial-gradient(circle,_rgba(224,46,72,0.08)_0%,_transparent_65%)] -z-10" />
      <div className="pointer-events-none absolute top-[1200px] -right-48 w-[800px] h-[800px] bg-[radial-gradient(circle,_rgba(45,170,143,0.09)_0%,_transparent_70%)] -z-10" />

      {/* Floating Invisible Navigation Header (Strictly Matching Reference Image) */}
      <header className="fixed top-0 inset-x-0 z-50 pointer-events-none py-6 transition-all duration-300">
        <div className="w-full px-6 sm:px-10 lg:px-14 flex items-center justify-between relative">
          {/* Logo & Brand (ABIS Official Logo with Full Name) */}
          <div className="pointer-events-auto">
            <Link href="/" className="flex items-center gap-3 sm:gap-4 group">
              <Image
                src="/abis_logo.png"
                alt="ABIS"
                width={220}
                height={80}
                priority
                className="h-12 sm:h-14 md:h-16 w-auto object-contain group-hover:scale-105 transition-transform duration-300"
              />
              <span className="hidden sm:inline-block text-xs md:text-sm font-medium tracking-wide text-slate-300/90 group-hover:text-white transition-colors border-l border-white/20 pl-3 sm:pl-4">
                The Adaptive Blood Infrastructure System
              </span>
            </Link>
          </div>


          {/* Right Action Button — Launch Command Center */}
          <div className="pointer-events-auto flex items-center">
            <Link
              href="/overview"
              className="inline-flex items-center justify-center text-xs sm:text-sm font-heading font-bold uppercase tracking-wider px-6 sm:px-7 py-2.5 sm:py-3 rounded-full bg-white hover:bg-slate-100 text-black shadow-[0_0_30px_rgba(255,255,255,0.25)] transition-all hover:scale-105 active:scale-95"
            >
              <span>Launch Command Center</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Full-Screen Hero Section — Clean, Cinematic, 100vh Full Viewport */}
      <section className="relative w-full h-screen min-h-screen flex items-center justify-center overflow-hidden isolate" id="horizon">
        {/* Full-Screen Infinite Looping Arterial GIF Canvas (Pure Black, No Green Tint, No Semi-Circle) */}
        <div className="absolute inset-0 w-full h-full z-0 overflow-hidden bg-black">
          <Image
            src="/landing_page.gif"
            alt="ABIS 3D Arterial Blood Network Flow Simulation"
            fill
            unoptimized
            priority
            className="object-cover object-center filter contrast-125 brightness-95"
          />

          {/* Clean Neutral Dark Vignette for Text Contrast (Top Fade for Nav Header) */}
          <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/80 via-black/40 to-transparent pointer-events-none z-10" />

          {/* Gradual Green Fade from Arterial GIF into the next section (#061913) */}
          <div className="absolute inset-x-0 bottom-0 h-72 sm:h-96 bg-gradient-to-t from-[#061913] via-[#061913]/85 via-45% to-transparent pointer-events-none z-10" />
        </div>

        {/* Hero Title — EXACTLY IN THE VERTICAL & HORIZONTAL MIDDLE OF THE SCREEN */}
        <div className="relative z-10 text-center max-w-5xl mx-auto px-4 select-none">
          <h1 className="font-heading text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.05] drop-shadow-[0_4px_45px_rgba(0,0,0,0.95)]">
            Every unit of blood,
            <span className="block mt-1 sm:mt-2 text-[#6fe3c8]">
              Exactly where it&apos;s needed.
            </span>
          </h1>
        </div>
      </section>

      {/* Clinical Reality Section (Featuring blood_transfusion.jpg) */}
      <section className="py-20 relative bg-[#061913]" id="clinical">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Copy Column */}
            <div className="lg:col-span-6 space-y-6">
              <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight">
                From Donor Vein to Transfusion Ward.
              </h2>

              <p className="text-base text-[#9cb3aa] leading-relaxed">
                Algorithms alone do not save lives—unbroken supply chains do. ABIS bridges high-precision
                machine learning with frontline phlebotomy, cold-storage refrigeration, and surgical wards.
              </p>

              {/* 3 Clinical Guarantee Bullets */}
              <div className="space-y-4 pt-2">
                <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-[#09221a]/60 border border-[#2daa8f]/20">
                  <div className="p-2 rounded-xl bg-[#108f75]/20 text-[#4ef0c9] mt-0.5">
                    <Thermometer className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white">
                      Strict 2°C – 6°C Cold-Chain Telemetry
                    </h3>
                    <p className="text-xs text-[#7fa396] mt-0.5">
                      Sub-minute temperature logging with automated alerts when heat excursions occur during rural transport.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-[#09221a]/60 border border-[#2daa8f]/20">
                  <div className="p-2 rounded-xl bg-[#e02e48]/20 text-[#ff6b81] mt-0.5">
                    <Droplet className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white">
                      Serology Screening Validation (s/co ≥ 10)
                    </h3>
                    <p className="text-xs text-[#7fa396] mt-0.5">
                      Rigorous 98.4% positive predictive value verification ensuring 100% infection-free transfusions.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-[#09221a]/60 border border-[#2daa8f]/20">
                  <div className="p-2 rounded-xl bg-[#35b398]/20 text-[#6fe3c8] mt-0.5">
                    <Truck className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white">
                      Asynchronous Mobile Drive Ledger
                    </h3>
                    <p className="text-xs text-[#7fa396] mt-0.5">
                      Collect donations in remote areas without internet; transactions auto-reconcile once regional hubs sync.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Clinical Image Column (Using blood_transfusion.jpg) */}
            <div className="lg:col-span-6 relative">
              <div className="relative rounded-3xl overflow-hidden border border-[#2daa8f]/30 shadow-[0_20px_50px_rgba(0,0,0,0.7),_0_0_40px_rgba(45,170,143,0.15)] group">
                <Image
                  src="/blood_transfusion.jpg"
                  alt="Clinical blood transfusion and donation venipuncture care"
                  width={800}
                  height={530}
                  className="w-full h-[460px] object-cover filter brightness-90 contrast-110 group-hover:scale-103 transition-transform duration-700"
                />

                {/* Dark Vignette Overlay for Clinical Dignity and Legibility */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#051611] via-[#051611]/30 to-transparent" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Command Center Capabilities Tabs */}
      <section className="py-24 relative" id="network">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs uppercase font-bold tracking-widest text-[#35b398]">
              The Operational Command Center
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-white mt-2">
              Four Interconnected Modules in One Interface
            </h2>
            <p className="text-sm sm:text-base text-[#9cb3aa] mt-3">
              Explore how regional managers, laboratory technicians, and transfusion directors coordinate logistics.
            </p>

            {/* Tab Selectors — Clean, Borderless Button Group */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
              <button
                onClick={() => setActiveTab("forecast")}
                className={`px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                  activeTab === "forecast"
                    ? "bg-[#108f75] text-white shadow-lg shadow-[#108f75]/30"
                    : "text-[#88ada0] hover:text-white"
                }`}
              >
                1. Demand Forecasts
              </button>
              <button
                onClick={() => setActiveTab("retention")}
                className={`px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                  activeTab === "retention"
                    ? "bg-[#108f75] text-white shadow-lg shadow-[#108f75]/30"
                    : "text-[#88ada0] hover:text-white"
                }`}
              >
                2. Donor Retention
              </button>
              <button
                onClick={() => setActiveTab("trace")}
                className={`px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                  activeTab === "trace"
                    ? "bg-[#108f75] text-white shadow-lg shadow-[#108f75]/30"
                    : "text-[#88ada0] hover:text-white"
                }`}
              >
                3. Traceability
              </button>
              <button
                onClick={() => setActiveTab("rebalance")}
                className={`px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                  activeTab === "rebalance"
                    ? "bg-[#108f75] text-white shadow-lg shadow-[#108f75]/30"
                    : "text-[#88ada0] hover:text-white"
                }`}
              >
                4. Rebalancing
              </button>
            </div>
          </div>

          {/* Tab Content Display — No Background Tiles */}
          <div className="mt-10">
            {activeTab === "forecast" && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                <div className="lg:col-span-5 space-y-4">
                  <h3 className="font-heading text-2xl sm:text-3xl font-bold text-white">
                    Anticipate Deficits 72 Hours in Advance
                  </h3>
                  <p className="text-sm text-[#9cb3aa] leading-relaxed">
                    Rather than reacting to empty blood banks, ABIS projects demand shifts by hospital facility and blood group with a 95% confidence envelope.
                  </p>
                  <ul className="space-y-2 text-xs text-[#c8d9d2]">
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-[#4ef0c9]" />
                      <span>Mean-reverting stochastic random walk processes</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-[#4ef0c9]" />
                      <span>Redis caching layer with 15-minute TTL</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-[#4ef0c9]" />
                      <span>Automated seasonal surge tracking (holidays & rains)</span>
                    </li>
                  </ul>
                </div>

                <div className="lg:col-span-7 space-y-3">
                  <div className="flex items-center justify-between pb-3 border-b border-[#2daa8f]/15">
                    <div>
                      <span className="text-xs font-bold text-white">Demand Trajectory (Kenyatta Referral)</span>
                      <p className="text-[11px] text-[#7fa396]">Predicted vs. actual hospital transfusions</p>
                    </div>
                    <span className="text-xs font-mono text-cyan-400 bg-cyan-950/60 px-2.5 py-1 rounded-md border border-cyan-800/40">
                      MAPE: 8.4%
                    </span>
                  </div>

                  {/* SVG Chart Preview */}
                  <div className="h-52 w-full pt-2">
                    <svg viewBox="0 0 500 160" preserveAspectRatio="none" className="w-full h-full">
                      {[30, 70, 110, 140].map((y) => (
                        <line key={y} x1="30" x2="490" y1={y} y2={y} stroke="#10382d" strokeWidth="1" />
                      ))}
                      <defs>
                        <linearGradient id="tabForecastGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#108f75" stopOpacity="0.4" />
                          <stop offset="100%" stopColor="#108f75" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                      <path
                        d="M30,110 C80,95 120,105 170,80 C220,60 270,75 320,45 C380,25 430,35 490,15 L490,150 L30,150 Z"
                        fill="url(#tabForecastGrad)"
                      />
                      <path
                        d="M30,110 C80,95 120,105 170,80 C220,60 270,75 320,45 C380,25 430,35 490,15"
                        fill="none"
                        stroke="#2daa8f"
                        strokeWidth="3"
                      />
                      <path
                        d="M30,125 C80,115 120,120 170,100 C220,85 270,95 320,70 C380,50 430,60 490,40"
                        fill="none"
                        stroke="#e02e48"
                        strokeWidth="2"
                        strokeDasharray="4 4"
                      />
                    </svg>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-[#7fa396] pt-1">
                    <span className="flex items-center gap-1.5"><i className="w-3 h-1 bg-[#2daa8f] rounded inline-block" /> Forecast Trend</span>
                    <span className="flex items-center gap-1.5"><i className="w-3 h-1 bg-[#e02e48] rounded inline-block" /> Upper 95% Bound</span>
                    <span className="text-white font-mono">Net 7-Day Need: 428 units</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "retention" && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                <div className="lg:col-span-5 space-y-4">
                  <h3 className="font-heading text-2xl sm:text-3xl font-bold text-white">
                    Protect Repeat Donor Cohorts
                  </h3>
                  <p className="text-sm text-[#9cb3aa] leading-relaxed">
                    AI analyzes recency, frequency, and tenure vectors to detect churn risk before donors lapse, generating tailored SMS invitations.
                  </p>
                  <ul className="space-y-2 text-xs text-[#c8d9d2]">
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-[#ff6b81]" />
                      <span>Automated risk tiering (Engaged, At Risk, High Risk)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-[#ff6b81]" />
                      <span>One-click SMS dispatch to targeted rare blood donors</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-[#ff6b81]" />
                      <span>Ethical opt-out and regional communication compliance</span>
                    </li>
                  </ul>
                </div>

                <div className="lg:col-span-7 space-y-3">
                  <div className="flex items-center justify-between pb-3 border-b border-[#2daa8f]/15">
                    <span className="text-xs font-bold text-white">Donor Attrition Risk Tiers</span>
                    <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded">
                      86% Safe Retention
                    </span>
                  </div>

                  <div className="divide-y divide-[#2daa8f]/15">
                    <div className="py-3 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3">
                        <span className="w-7 h-7 rounded-full bg-[#108f75] text-white flex items-center justify-center font-bold text-[10px]">
                          GW
                        </span>
                        <div>
                          <strong className="text-white block">Grace Wanjiku (O+)</strong>
                          <span className="text-[#6d9487] text-[10px]">Last donated 140 days ago</span>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-950 text-rose-400 border border-rose-800">
                        High Risk · 18% Score
                      </span>
                    </div>

                    <div className="py-3 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3">
                        <span className="w-7 h-7 rounded-full bg-[#35b398] text-white flex items-center justify-center font-bold text-[10px]">
                          LN
                        </span>
                        <div>
                          <strong className="text-white block">Leah Njeri (A−)</strong>
                          <span className="text-[#6d9487] text-[10px]">Last donated 85 days ago</span>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-950 text-amber-400 border border-amber-800">
                        At Risk · 48% Score
                      </span>
                    </div>

                    <div className="py-3 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3">
                        <span className="w-7 h-7 rounded-full bg-[#2daa8f] text-white flex items-center justify-center font-bold text-[10px]">
                          DK
                        </span>
                        <div>
                          <strong className="text-white block">David Kamau (O−)</strong>
                          <span className="text-[#6d9487] text-[10px]">Last donated 28 days ago</span>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">
                        Engaged · 76% Score
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "trace" && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                <div className="lg:col-span-5 space-y-4">
                  <h3 className="font-heading text-2xl sm:text-3xl font-bold text-white">
                    Uncompromising Chain-of-Custody
                  </h3>
                  <p className="text-sm text-[#9cb3aa] leading-relaxed">
                    Track every blood bag from donor arm through centrifuges, cold room storage, and highway transport with automated breach detection.
                  </p>
                  <ul className="space-y-2 text-xs text-[#c8d9d2]">
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-[#6fe3c8]" />
                      <span>Automated quarantine upon temperature excursions</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-[#6fe3c8]" />
                      <span>GPS route tracking with transit vehicle telemetry</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-[#6fe3c8]" />
                      <span>Full audit trail ready for WHO and national regulators</span>
                    </li>
                  </ul>
                </div>

                <div className="lg:col-span-7 space-y-3">
                  <div className="flex items-center justify-between pb-3 border-b border-[#2daa8f]/15">
                    <span className="text-xs font-bold text-white">Live Logistics Timeline</span>
                    <span className="text-xs text-rose-400 font-semibold flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5" /> 1 Excursion Flagged
                    </span>
                  </div>

                  <div className="space-y-1 font-mono text-xs divide-y divide-[#2daa8f]/15">
                    <div className="py-2.5 flex items-center justify-between">
                      <div>
                        <span className="text-[#5eead4]">08:42</span> · Unit BLD-90218 received at Kenyatta Cold Room
                      </div>
                      <span className="text-emerald-400 font-bold">4.2°C OK</span>
                    </div>

                    <div className="py-2.5 flex items-center justify-between text-rose-300">
                      <div>
                        <span className="text-rose-400 font-semibold">08:31</span> · Temp excursion detected in Transit #TR-2048
                      </div>
                      <span className="text-rose-400 font-bold">7.2°C BREACH</span>
                    </div>

                    <div className="py-2.5 flex items-center justify-between">
                      <div>
                        <span className="text-[#5eead4]">08:18</span> · Shipment departed Nakuru Regional Hub (84 units)
                      </div>
                      <span className="text-cyan-400 font-bold">IN TRANSIT</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "rebalance" && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                <div className="lg:col-span-5 space-y-4">
                  <h3 className="font-heading text-2xl sm:text-3xl font-bold text-white">
                    Zero Blood Wastage Protocol
                  </h3>
                  <p className="text-sm text-[#9cb3aa] leading-relaxed">
                    Surplus depots automatically route expiring units to high-volume surgical centers, guaranteeing optimal utilization before shelf-life expires.
                  </p>
                  <ul className="space-y-2 text-xs text-[#c8d9d2]">
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-cyan-400" />
                      <span>Mathematical surplus-to-deficit matching algorithm</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-cyan-400" />
                      <span>Real-time hospital inventory fill ratios</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-cyan-400" />
                      <span>Automated courier dispatch routing</span>
                    </li>
                  </ul>
                </div>

                <div className="lg:col-span-7 space-y-4">
                  <div className="pb-3 border-b border-rose-800/40">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-bold text-rose-400">SURPLUS-DEFICIT DISPATCH ACTION</span>
                      <span className="font-mono text-slate-400">Highway A109 Route</span>
                    </div>
                    <div className="text-sm font-semibold text-white">
                      Nairobi Regional Depot ➔ Coast General Hospital
                    </div>
                    <div className="text-xs text-[#8cb3a5] mt-1">
                      Recommended Transfer: <strong className="text-white">45 Units Whole Blood</strong>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-xs pt-1">
                    <div className="border-l-2 border-[#108f75] pl-3 py-1">
                      <span className="text-[#6d9487] block text-[10px] uppercase tracking-wider">Nairobi Central Depot</span>
                      <strong className="text-white text-base font-mono block mt-0.5">2,400 u</strong>
                      <span className="text-cyan-400 block text-[10px] mt-0.5">Surplus (80% capacity)</span>
                    </div>
                    <div className="border-l-2 border-rose-500 pl-3 py-1">
                      <span className="text-[#6d9487] block text-[10px] uppercase tracking-wider">Coast General Hospital</span>
                      <strong className="text-rose-400 text-base font-mono block mt-0.5">90 u</strong>
                      <span className="text-rose-400 block text-[10px] mt-0.5">Critical Deficit (22.5%)</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Call to Action Section — Compact, Direct, No Background Tile */}
      <section className="py-10 sm:py-14 relative text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl font-extrabold text-white max-w-2xl mx-auto leading-tight">
            Eliminate Blood Stockouts Across Your Health Network.
          </h2>

          <p className="text-xs sm:text-sm text-[#9cb3aa] max-w-xl mx-auto mt-3 leading-relaxed">
            Connect your blood depots, laboratories, and regional hospitals to Africa&apos;s most adaptive blood infrastructure platform.
          </p>

          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <Link
              href="/overview"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 sm:py-3 rounded-xl btn-primary-crimson font-heading font-bold text-xs sm:text-sm shadow-lg shadow-rose-950/40 hover:scale-102 transition-transform"
            >
              <span>Launch Command Center</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <button
              onClick={() => setDemoModalOpen(true)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 sm:py-3 rounded-xl btn-glass-secondary font-medium text-xs sm:text-sm hover:text-white"
            >
              <span>Request Facility Pilot</span>
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#2daa8f]/15 bg-[#030e0a] py-6 text-xs text-[#6e8d81]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <Image
              src="/abis_logo.png"
              alt="ABIS - Adaptive Blood Infrastructure System"
              width={160}
              height={60}
              className="h-9 sm:h-10 w-auto object-contain"
            />
            <span className="hidden sm:inline-block text-[#2daa8f]/30">|</span>
            <p className="text-[11px] sm:text-xs text-[#6e8d81] tracking-wide text-center sm:text-left">
              Adaptive Blood Infrastructure System · Terumo BCT Africa Hackathon 2026
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center md:justify-end gap-5 text-[#8baea1] text-xs font-medium">
            <a href="#horizon" className="hover:text-white transition-colors">Intelligence</a>
            <a href="#clinical" className="hover:text-white transition-colors">Clinical Chain</a>
            <a href="#network" className="hover:text-white transition-colors">Capabilities</a>
            <Link href="/overview" className="hover:text-white transition-colors">Executive Overview</Link>
          </div>
        </div>
      </footer>

      {/* Interactive Request-A-Demo Modal Dialog */}
      {demoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg rounded-3xl bg-[#071f17] border border-[#2daa8f]/40 p-6 sm:p-8 shadow-2xl">
            <button
              onClick={() => setDemoModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full bg-[#0d3429] text-[#86a99c] hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {demoFormSubmitted ? (
              <div className="text-center py-8 space-y-4">
                <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="font-heading text-2xl font-bold text-white">
                  Pilot Request Received!
                </h3>
                <p className="text-sm text-[#9cb3aa] max-w-sm mx-auto">
                  Thank you, {demoFormData.name || "Director"}. A Terumo BCT regional logistics advisor will contact you within 2 business hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleDemoSubmit} className="space-y-4">
                <div className="flex items-center gap-2 text-xs font-semibold text-[#4ef0c9] uppercase tracking-wider">
                  <Droplet className="w-3.5 h-3.5 fill-[#4ef0c9]" />
                  <span>Facility Deployment Pilot</span>
                </div>
                <h3 className="font-heading text-2xl font-bold text-white">
                  Request an ABIS Demonstration
                </h3>
                <p className="text-xs text-[#8cb0a2]">
                  Connect your blood depot or hospital transfusion department for real-time visibility.
                </p>

                <div className="space-y-3 pt-2">
                  <div>
                    <label className="block text-xs font-medium text-[#c8d9d2] mb-1">
                      Full Name
                    </label>
                    <input
                      required
                      type="text"
                      placeholder="Dr. Amina Mwangi"
                      value={demoFormData.name}
                      onChange={(e) => setDemoFormData({ ...demoFormData, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#051611] border border-[#2daa8f]/30 text-sm text-white placeholder-[#507769] focus:outline-none focus:border-[#4ef0c9]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#c8d9d2] mb-1">
                      Work Email
                    </label>
                    <input
                      required
                      type="email"
                      placeholder="amina.m@referral-hospital.org"
                      value={demoFormData.email}
                      onChange={(e) => setDemoFormData({ ...demoFormData, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#051611] border border-[#2daa8f]/30 text-sm text-white placeholder-[#507769] focus:outline-none focus:border-[#4ef0c9]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-[#c8d9d2] mb-1">
                        Facility Name
                      </label>
                      <input
                        required
                        type="text"
                        placeholder="Nairobi National Referral"
                        value={demoFormData.facility}
                        onChange={(e) => setDemoFormData({ ...demoFormData, facility: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#051611] border border-[#2daa8f]/30 text-sm text-white placeholder-[#507769] focus:outline-none focus:border-[#4ef0c9]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[#c8d9d2] mb-1">
                        Role
                      </label>
                      <select
                        value={demoFormData.role}
                        onChange={(e) => setDemoFormData({ ...demoFormData, role: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#051611] border border-[#2daa8f]/30 text-sm text-white focus:outline-none focus:border-[#4ef0c9]"
                      >
                        <option value="Medical Director">Medical Director</option>
                        <option value="Cold Chain Officer">Cold Chain Officer</option>
                        <option value="Transfusion Specialist">Transfusion Specialist</option>
                        <option value="Regional Blood Officer">Regional Blood Officer</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="pt-3">
                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-xl btn-primary-crimson font-heading font-bold text-sm tracking-wide shadow-lg"
                  >
                    Submit Deployment Request
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Interactive "See How It Works" Walkthrough Modal */}
      {videoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl rounded-3xl bg-[#071f17] border border-[#2daa8f]/40 p-6 sm:p-8 shadow-2xl">
            <button
              onClick={() => setVideoModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full bg-[#0d3429] text-[#86a99c] hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 text-xs font-semibold text-[#4ef0c9] uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Interactive Architecture Walkthrough</span>
            </div>

            <h3 className="font-heading text-2xl font-bold text-white mb-2">
              How ABIS Unifies the Regional Blood Lifecycle
            </h3>
            <p className="text-xs text-[#8cb0a2] mb-6">
              A 4-stage automated protocol engineered for intermittent network environments.
            </p>

            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 rounded-2xl bg-[#051611] border border-[#2daa8f]/20">
                <span className="w-8 h-8 rounded-full bg-[#108f75] text-white flex items-center justify-center font-bold text-xs shrink-0">
                  1
                </span>
                <div>
                  <h4 className="text-sm font-bold text-white">Mobile Drive Collection & Ledger Stamping</h4>
                  <p className="text-xs text-[#7fa396] mt-0.5">
                    Field phlebotomists record donor IDs and tube barcodes offline. The device signs transactions locally with SHA-256 hashes.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-2xl bg-[#051611] border border-[#2daa8f]/20">
                <span className="w-8 h-8 rounded-full bg-[#35b398] text-white flex items-center justify-center font-bold text-xs shrink-0">
                  2
                </span>
                <div>
                  <h4 className="text-sm font-bold text-white">Central Serology Lab Screening (s/co ≥ 10)</h4>
                  <p className="text-xs text-[#7fa396] mt-0.5">
                    Automated ELISA/CLIA results verify HIV, Hepatitis B/C, and Syphilis. Safe units are released directly to cold depots.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-2xl bg-[#051611] border border-[#2daa8f]/20">
                <span className="w-8 h-8 rounded-full bg-[#8c5bde] text-white flex items-center justify-center font-bold text-xs shrink-0">
                  3
                </span>
                <div>
                  <h4 className="text-sm font-bold text-white">ARIMA Predictive Hospital Rebalancing</h4>
                  <p className="text-xs text-[#7fa396] mt-0.5">
                    7-day stochastic modeling matches surplus depots with impending hospital shortages, planning transit dispatches before stockouts occur.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-2xl bg-[#051611] border border-[#2daa8f]/20">
                <span className="w-8 h-8 rounded-full bg-[#e02e48] text-white flex items-center justify-center font-bold text-xs shrink-0">
                  4
                </span>
                <div>
                  <h4 className="text-sm font-bold text-white">Continuous Cold-Chain Transit IoT</h4>
                  <p className="text-xs text-[#7fa396] mt-0.5">
                    Temperature sensors log every minute inside transport boxes. Any heat breach over 6°C flags immediate hospital quarantine.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <Link
                href="/overview"
                onClick={() => setVideoModalOpen(false)}
                className="px-6 py-2.5 rounded-xl btn-primary-crimson text-xs font-semibold"
              >
                Experience Live Command Center
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
