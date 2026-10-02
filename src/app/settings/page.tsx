"use client";

import React, { useState } from "react";
import { Check, LayoutGrid, User } from "lucide-react";
import { usePreferences, DEFAULT_PREFERENCES } from "@/context/PreferencesContext";
import { useToast } from "@/components/ui/use-toast";

function SwitchToggle({
  checked,
  onChange,
  id,
  label,
}: {
  checked: boolean;
  onChange: (val: boolean) => void;
  id: string;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      id={id}
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-emerald-500/30 ${
        checked ? "bg-[#0e6245]" : "bg-slate-200"
      }`}
    >
      <span
        aria-hidden="true"
        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
          checked ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  );
}

export default function SettingsPage() {
  const { preferences, savePreferences, storageAvailable } = usePreferences();
  const { toast } = useToast();

  // Local draft state for editing before save
  const [displayName, setDisplayName] = useState(preferences.displayName);
  const [compactSidebar, setCompactSidebar] = useState(preferences.compactSidebar);
  const [compactTableRows, setCompactTableRows] = useState(preferences.compactTableRows);
  const [reduceMotion, setReduceMotion] = useState(preferences.reduceMotion);
  const [isSaved, setIsSaved] = useState(false);

  // Determine if form has unsaved modifications
  const isDirty =
    displayName !== preferences.displayName ||
    compactSidebar !== preferences.compactSidebar ||
    compactTableRows !== preferences.compactTableRows ||
    reduceMotion !== preferences.reduceMotion;

  const handleSave = () => {
    const trimmedName = displayName.trim() || DEFAULT_PREFERENCES.displayName;
    const success = savePreferences({
      displayName: trimmedName,
      compactSidebar,
      compactTableRows,
      reduceMotion,
    });

    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);

    toast({
      title: success ? "Preferences saved" : "Applied for current session",
      description: success
        ? "Your workspace preferences were updated and saved in local storage."
        : "Local storage is unavailable; preferences are active for this browser session only.",
    });
  };

  const handleRestoreDefaults = () => {
    setDisplayName(DEFAULT_PREFERENCES.displayName);
    setCompactSidebar(DEFAULT_PREFERENCES.compactSidebar);
    setCompactTableRows(DEFAULT_PREFERENCES.compactTableRows);
    setReduceMotion(DEFAULT_PREFERENCES.reduceMotion);
  };

  return (
    <div className="space-y-6 max-w-4xl animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold font-mono tracking-widest text-[#719688] uppercase block">
            YOUR WORKSPACE
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-heading mt-1">
            Settings
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Make the command center work the way you do.
          </p>
        </div>

        <div>
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#dff3ea] text-[#136a4f] text-[10px] font-bold font-mono tracking-wider select-none">
            BROWSER PREFERENCES
          </span>
        </div>
      </div>

      {/* Card 1: Profile */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs space-y-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Profile</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Personalize how your name appears in the workspace
            </p>
          </div>
          <div className="w-9 h-9 rounded-xl bg-[#e6f4ee] text-[#1b7352] flex items-center justify-center shrink-0">
            <User className="w-4 h-4" />
          </div>
        </div>

        <div className="pt-1">
          <label htmlFor="display-name-input" className="font-bold text-slate-900 text-sm block mb-2">
            Display name
          </label>
          <input
            id="display-name-input"
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="w-full bg-[#f8faf9] border border-slate-200/90 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
            placeholder="e.g. Amina M."
          />
          <p className="text-xs text-slate-500 mt-2">
            A local display preference, not a change to your account or access role.
          </p>
        </div>
      </div>

      {/* Card 2: Workspace appearance */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Workspace appearance</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              A little less friction. A little more focus.
            </p>
          </div>
          <div className="w-9 h-9 rounded-xl bg-[#e6f4ee] text-[#1b7352] flex items-center justify-center shrink-0">
            <LayoutGrid className="w-4 h-4" />
          </div>
        </div>

        <div className="space-y-5 pt-1">
          {/* Toggle 1: Compact sidebar */}
          <div className="flex items-center justify-between gap-4">
            <div>
              <h4 className="font-bold text-slate-900 text-sm">Compact sidebar</h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Use icon-only navigation on desktop. Mobile navigation stays expanded.
              </p>
            </div>
            <SwitchToggle
              id="compact-sidebar-switch"
              label="Compact sidebar"
              checked={compactSidebar}
              onChange={setCompactSidebar}
            />
          </div>

          <div className="border-t border-slate-100" />

          {/* Toggle 2: Compact table rows */}
          <div className="flex items-center justify-between gap-4">
            <div>
              <h4 className="font-bold text-slate-900 text-sm">Compact table rows</h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Fit more requests, donors, and transfer recommendations on screen.
              </p>
            </div>
            <SwitchToggle
              id="compact-table-rows-switch"
              label="Compact table rows"
              checked={compactTableRows}
              onChange={setCompactTableRows}
            />
          </div>

          <div className="border-t border-slate-100" />

          {/* Toggle 3: Reduce motion */}
          <div className="flex items-center justify-between gap-4">
            <div>
              <h4 className="font-bold text-slate-900 text-sm">Reduce motion</h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Turn off interface transitions and smooth scrolling in the command center.
              </p>
            </div>
            <SwitchToggle
              id="reduce-motion-switch"
              label="Reduce motion"
              checked={reduceMotion}
              onChange={setReduceMotion}
            />
          </div>
        </div>
      </div>

      {/* Buttons & Status Row */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={handleRestoreDefaults}
            className="bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl px-4 py-2.5 text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
          >
            Restore defaults
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="bg-[#0e6245] hover:bg-[#0b5038] text-white rounded-xl px-5 py-2.5 text-xs font-bold shadow-2xs transition-colors cursor-pointer flex items-center gap-1.5"
          >
            {isSaved ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Changes saved</span>
              </>
            ) : (
              <span>Save changes</span>
            )}
          </button>
        </div>

        {/* Unsaved changes notice */}
        {isDirty && (
          <p className="text-xs text-[#0e6245] font-medium animate-in fade-in duration-200">
            You have unsaved changes.
          </p>
        )}

        {/* Storage unavailable warning */}
        {!storageAvailable && (
          <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-xl p-3">
            Local storage is unavailable in your browser environment. Preferences will remain active for this session only and cannot be saved permanently.
          </p>
        )}
      </div>
    </div>
  );
}
