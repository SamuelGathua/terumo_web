"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutGrid,
  Menu,
  Settings,
  Share2,
  TrendingUp,
  Users,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { usePreferences } from "@/context/PreferencesContext";

interface LayoutWrapperProps {
  children: React.ReactNode;
}

export function LayoutWrapper({ children }: LayoutWrapperProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { preferences } = usePreferences();
  const compact = preferences.compactSidebar;

  const isLanding = pathname === "/";

  const workspaceNav = [
    {
      name: "Overview",
      href: "/overview",
      icon: LayoutGrid,
    },
    {
      name: "Forecasts",
      href: "/forecasts",
      icon: TrendingUp,
    },
    {
      name: "Donor retention",
      href: "/donors",
      icon: Users,
    },
    {
      name: "Traceability",
      href: "/traceability",
      icon: Share2,
    },
  ];

  const systemNav = [
    {
      name: "Settings",
      href: "/settings",
      icon: Settings,
    },
  ];

  if (isLanding) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-[#f4f7f5] text-slate-800 flex flex-col md:flex-row antialiased selection:bg-[#e02e48] selection:text-white font-sans">
      {/* Desktop Left Sidebar */}
      <aside
        className={cn(
          "hidden md:flex flex-col bg-[#0a1e17] border-r border-[#153a2d] shrink-0 z-30 select-none sticky top-0 h-screen overflow-y-auto transition-all duration-200",
          compact ? "w-20 p-3 items-center" : "w-64 p-5"
        )}
      >
        <div className={compact ? "w-full flex flex-col items-center" : "w-full"}>
          {/* Logo / Brand Header */}
          <Link
            href="/"
            className="flex items-center justify-center py-2 px-1 group"
            title="ABIS Command Center"
          >
            <Image
              src="/abis_logo.png"
              alt="ABIS Logo"
              width={280}
              height={150}
              priority
              className={cn(
                "object-contain transition-all duration-200 group-hover:scale-105",
                compact ? "h-11 w-11 object-contain" : "h-20 w-auto max-w-52"
              )}
            />
          </Link>

          {/* Section: WORKSPACE */}
          <div className="mt-8 w-full">
            {!compact && (
              <span className="text-[10px] font-bold text-[#446d5f] tracking-widest uppercase px-3 block mb-2 font-mono">
                WORKSPACE
              </span>
            )}
            <nav className="space-y-1.5 w-full">
              {workspaceNav.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    title={item.name}
                    className={cn(
                      "relative flex items-center rounded-xl font-medium text-xs transition-all duration-150",
                      compact ? "justify-center p-3 w-full" : "gap-3 px-3.5 py-2.5",
                      isActive
                        ? "bg-[#133527] text-white shadow-xs"
                        : "text-[#7d9f92] hover:text-white hover:bg-[#0e271f]"
                    )}
                  >
                    {isActive && (
                      <span className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-[#e02e48] rounded-r-md" />
                    )}
                    <Icon
                      className={cn(
                        "w-4 h-4 shrink-0 transition-colors",
                        isActive ? "text-white" : "text-[#5f8779]"
                      )}
                    />
                    {!compact && <span>{item.name}</span>}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Section: SYSTEM */}
          <div className="mt-6 w-full">
            {!compact && (
              <span className="text-[10px] font-bold text-[#446d5f] tracking-widest uppercase px-3 block mb-2 font-mono">
                SYSTEM
              </span>
            )}
            <nav className="space-y-1.5 w-full">
              {systemNav.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    title={item.name}
                    className={cn(
                      "relative flex items-center rounded-xl font-medium text-xs transition-all duration-150",
                      compact ? "justify-center p-3 w-full" : "gap-3 px-3.5 py-2.5",
                      isActive
                        ? "bg-[#133527] text-white shadow-xs"
                        : "text-[#7d9f92] hover:text-white hover:bg-[#0e271f]"
                    )}
                  >
                    {isActive && (
                      <span className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-[#e02e48] rounded-r-md" />
                    )}
                    <Icon
                      className={cn(
                        "w-4 h-4 shrink-0 transition-colors",
                        isActive ? "text-white" : "text-[#5f8779]"
                      )}
                    />
                    {!compact && <span>{item.name}</span>}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </aside>

      {/* Main Column */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header Bar */}
        <div className="md:hidden bg-white border-b border-slate-200/80 px-4 py-3 flex items-center justify-between sticky top-0 z-20">
          <Link href="/" className="flex items-center" title="ABIS Home">
            <Image
              src="/logo.png"
              alt="ABIS Logo"
              width={120}
              height={36}
              priority
              className="h-8 w-auto object-contain"
            />
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl bg-slate-100 text-slate-600 hover:text-slate-900"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#0a1e17] border-b border-[#153a2d] p-4 space-y-1.5 z-20">
            {[...workspaceNav, ...systemNav].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-xl text-xs font-medium",
                  pathname === item.href
                    ? "bg-[#133527] text-white"
                    : "text-[#7d9f92] hover:bg-[#0e271f] hover:text-white"
                )}
              >
                <item.icon className="w-4 h-4" />
                <span>{item.name}</span>
              </Link>
            ))}
          </div>
        )}

        {/* Main Content Viewport */}
        <main className="flex-1 p-4 md:p-8 max-w-[1400px] w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
