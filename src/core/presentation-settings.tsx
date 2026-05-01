"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

import {
  defaultPresentationSettings,
  getDomSlideSize,
  getExportPixelRatio,
  type AspectRatioKey,
  type PresentationSettings,
  PRESENTATION_COOKIE_KEYS,
  type ResolutionKey,
} from "@/lib/presentation-settings";

type PresentationSettingsContextValue = {
  settings: PresentationSettings;
  setAspectRatio: (value: AspectRatioKey) => void;
  setResolution: (value: ResolutionKey) => void;
  setSafeAutoSizing: (value: boolean) => void;
  domSlideSize: { width: number; height: number };
  exportPixelRatio: number;
};

const PresentationSettingsContext =
  createContext<PresentationSettingsContextValue | null>(null);

function setCookie(name: string, value: string) {
  const maxAgeSeconds = 60 * 60 * 24 * 365;
  const parts = [
    `${name}=${encodeURIComponent(value)}`,
    "Path=/",
    `Max-Age=${maxAgeSeconds}`,
    "SameSite=Lax",
  ];

  if (typeof window !== "undefined" && window.location.protocol === "https:") {
    parts.push("Secure");
  }

  document.cookie = parts.join("; ");
}

export function PresentationSettingsProvider({
  children,
  initialSettings,
}: {
  children: React.ReactNode;
  initialSettings?: PresentationSettings;
}) {
  const [settings, setSettings] = useState<PresentationSettings>(
    initialSettings ?? defaultPresentationSettings
  );

  const setAspectRatio = useCallback((value: AspectRatioKey) => {
    setSettings((prev) => {
      const next = { ...prev, aspectRatio: value };
      setCookie(PRESENTATION_COOKIE_KEYS.aspectRatio, value);
      return next;
    });
  }, []);

  const setResolution = useCallback((value: ResolutionKey) => {
    setSettings((prev) => {
      const next = { ...prev, resolution: value };
      setCookie(PRESENTATION_COOKIE_KEYS.resolution, value);
      return next;
    });
  }, []);

  const setSafeAutoSizing = useCallback((value: boolean) => {
    setSettings((prev) => {
      const next = { ...prev, safeAutoSizing: value };
      setCookie(PRESENTATION_COOKIE_KEYS.safeAutoSizing, value ? "1" : "0");
      return next;
    });
  }, []);

  const domSlideSize = useMemo(() => getDomSlideSize(settings), [settings]);
  const exportPixelRatio = useMemo(
    () => getExportPixelRatio(settings),
    [settings]
  );

  const value = useMemo<PresentationSettingsContextValue>(
    () => ({
      settings,
      setAspectRatio,
      setResolution,
      setSafeAutoSizing,
      domSlideSize,
      exportPixelRatio,
    }),
    [
      domSlideSize,
      exportPixelRatio,
      setAspectRatio,
      setResolution,
      setSafeAutoSizing,
      settings,
    ]
  );

  return (
    <PresentationSettingsContext.Provider value={value}>
      {children}
    </PresentationSettingsContext.Provider>
  );
}

export function usePresentationSettings() {
  const ctx = useContext(PresentationSettingsContext);
  if (!ctx) {
    throw new Error(
      "usePresentationSettings must be used within PresentationSettingsProvider"
    );
  }
  return ctx;
}
