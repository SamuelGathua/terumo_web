"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export interface UserPreferences {
  displayName: string;
  compactSidebar: boolean;
  compactTableRows: boolean;
  reduceMotion: boolean;
}

export const DEFAULT_PREFERENCES: UserPreferences = {
  displayName: "Amina M.",
  compactSidebar: false,
  compactTableRows: false,
  reduceMotion: false,
};

const STORAGE_KEY = "abis_user_preferences";

interface PreferencesContextType {
  preferences: UserPreferences;
  savePreferences: (newPrefs: UserPreferences) => boolean;
  restoreDefaults: () => UserPreferences;
  storageAvailable: boolean;
}

const PreferencesContext = createContext<PreferencesContextType>({
  preferences: DEFAULT_PREFERENCES,
  savePreferences: () => true,
  restoreDefaults: () => DEFAULT_PREFERENCES,
  storageAvailable: true,
});

function getInitialPreferences(): UserPreferences {
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return {
          displayName:
            typeof parsed.displayName === "string" && parsed.displayName.trim()
              ? parsed.displayName
              : DEFAULT_PREFERENCES.displayName,
          compactSidebar: Boolean(parsed.compactSidebar),
          compactTableRows: Boolean(parsed.compactTableRows),
          reduceMotion: Boolean(parsed.reduceMotion),
        };
      }
    } catch {
      // Fallback to defaults
    }
  }
  return DEFAULT_PREFERENCES;
}

export function PreferencesProvider({ children }: { children: React.ReactNode }) {
  const [preferences, setPreferences] = useState<UserPreferences>(getInitialPreferences);
  const [storageAvailable, setStorageAvailable] = useState(true);

  // Synchronize document classes for global appearance effects
  useEffect(() => {
    if (typeof document !== "undefined") {
      if (preferences.reduceMotion) {
        document.documentElement.classList.add("reduce-motion");
        document.body.classList.add("reduce-motion");
      } else {
        document.documentElement.classList.remove("reduce-motion");
        document.body.classList.remove("reduce-motion");
      }

      if (preferences.compactTableRows) {
        document.body.classList.add("compact-tables");
      } else {
        document.body.classList.remove("compact-tables");
      }
    }
  }, [preferences.reduceMotion, preferences.compactTableRows]);

  const savePreferences = (newPrefs: UserPreferences): boolean => {
    setPreferences(newPrefs);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newPrefs));
      setStorageAvailable(true);
      return true;
    } catch (err) {
      console.warn("ABIS Preferences: Failed to persist to localStorage", err);
      setStorageAvailable(false);
      return false;
    }
  };

  const restoreDefaults = () => {
    return DEFAULT_PREFERENCES;
  };

  return (
    <PreferencesContext.Provider
      value={{
        preferences,
        savePreferences,
        restoreDefaults,
        storageAvailable,
      }}
    >
      {children}
    </PreferencesContext.Provider>
  );
}

export function usePreferences() {
  return useContext(PreferencesContext);
}
