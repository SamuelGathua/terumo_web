"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  AlertTriangle,
  ArrowRightLeft,
  BarChart3,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Clock,
  Droplet,
  Layers,
  Menu,
  Radio,
  RefreshCw,
  ShieldCheck,
  Truck,
  Users,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface LayoutWrapperProps {
  children: React.ReactNode;
}

export function LayoutWrapper({ children }: LayoutWrapperProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState<string>("");
  const [isLiveConnected, setIsLiveConnected] = useState<boolean>(true);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          timeZoneName: "short",
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const navItems = [
    {
      name: "Command Center",
      href: "/",
      icon: Activity,
      description: "Regional liquidity & network health",
    },
    {
      name: "Demand Forecasts",
      href: "/forecasts",
      icon: BarChart3,
      description: "7-day ARIMA & rebalancing matrix",
    },
    {
      name: "Donor Retention AI",
      href: "/donors",
      icon: Users,
      description: "Random Forest RFM attrition predictor",
    },
    {
      name: "Cold-Chain Traceability",
      href: "/traceability",
      icon: Truck,
      description: "Offline ledger & temperature telemetry",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row antialiased selection:bg-rose-500 selection:text-white">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-72 bg-slate-900/90 border-r border-slate-800/80 p-5 backdrop-blur-xl shrink-0 z-30 justify-between">
        <div>
          {/* Logo & Platform Badge */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-600 via-rose-500 to-rose-400 flex items-center justify-center shadow-[0_0_20px_rgba(225,29,72,0.4)] group-hover:scale-105 transition-transform duration-300">
              <Droplet className="w-5 h-5 text-white fill-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold tracking-tight text-lg text-white font-mono">ABIS</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-950/80 text-rose-400 border border-rose-800/60 font-semibold tracking-wider uppercase">
                  Africa 2026
                </span>
              </div>
              <p className="text-[11px] text-slate-400 tracking-tight font-medium">
                Adaptive Blood Infrastructure
              </p>
            </div>
          </Link>

          {/* Network Health Indicator */}
          <div className="mt-6 p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span className="font-medium text-slate-300">FastAPI & Redis</span>
            </div>
            <span className="font-mono text-[11px] text-emerald-400 font-semibold uppercase tracking-wider">
              Online
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="mt-6 space-y-1.5">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-start gap-3 p-3 rounded-xl transition-all duration-200 group text-sm",
                    isActive
                      ? "bg-rose-950/50 text-white border border-rose-800/50 shadow-[0_0_15px_rgba(225,29,72,0.15)]"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                  )}
                >
                  <Icon
                    className={cn(
                      "w-5 h-5 shrink-0 mt-0.5 transition-colors",
                      isActive ? "text-rose-400" : "text-slate-500 group-hover:text-slate-300"
                    )}
                  />
                  <div>
                    <span className="font-semibold block leading-tight">{item.name}</span>
                    <span className="text-[11px] text-slate-500 block mt-0.5 leading-snug">
                      {item.description}
                    </span>
                  </div>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Regional Hub Info in Footer */}
        <div className="pt-4 border-t border-slate-800/80 space-y-2">
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span>Regional Territory</span>
            <span className="font-mono text-slate-200">Kenya Region</span>
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span>Active Cold Hubs</span>
            <span className="font-mono text-cyan-400 font-semibold">4 Facilities</span>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800 text-[10px] text-slate-400 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Terumo BCT Hybrid Architecture</span>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-16 bg-slate-900/60 border-b border-slate-800/80 px-4 md:px-8 flex items-center justify-between backdrop-blur-md sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <div className="flex items-center gap-2 text-xs md:text-sm text-slate-400">
              <span className="hidden sm:inline">Regional Command</span>
              <ChevronRight className="w-3.5 h-3.5 hidden sm:inline" />
              <span className="font-semibold text-slate-200">
                {navItems.find((n) => n.href === pathname)?.name || "Executive Dashboard"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 md:gap-5">
            {/* Live Clock */}
            <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full bg-slate-950/80 border border-slate-800 text-xs font-mono text-slate-300">
              <Clock className="w-3.5 h-3.5 text-rose-400" />
              <span>{currentTime || "EAT 2026"}</span>
            </div>

            {/* Emergency Rebalance Quick Status */}
            <Link
              href="/forecasts"
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white text-xs font-semibold shadow-lg shadow-rose-600/20 transition-all hover:scale-105 active:scale-95"
            >
              <ArrowRightLeft className="w-3.5 h-3.5" />
              <span>Stock Transfers</span>
            </Link>

            {/* User Profile Pill */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
              <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-xs text-rose-400">
                SG
              </div>
              <div className="hidden sm:block text-left text-xs">
                <span className="font-semibold text-slate-200 block leading-tight">Dr. S. Gathua</span>
                <span className="text-[10px] text-slate-400 block leading-none">Transfusion Director</span>
              </div>
            </div>
          </div>
        </header>

        {/* Mobile Dropdown Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-slate-900 border-b border-slate-800 p-4 space-y-2 z-20">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-xl text-sm font-medium",
                  pathname === item.href
                    ? "bg-rose-950 text-rose-400 border border-rose-800"
                    : "text-slate-300 hover:bg-slate-800"
                )}
              >
                <item.icon className="w-4 h-4" />
                <span>{item.name}</span>
              </Link>
            ))}
          </div>
        )}

        {/* Page Content Body */}
        <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto space-y-8">
          {children}
        </main>
      </div>
    </div>
  );
}
