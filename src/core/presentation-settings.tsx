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
  PRESENTATION_SETTINGS_STORAGE_KEYS,
  readPresentationSettingsFromStorage,
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

function readInitialSettings(initialSettings?: PresentationSettings) {
  if (initialSettings) return initialSettings;
  if (typeof window === "undefined") return defaultPresentationSettings;

  try {
    return readPresentationSettingsFromStorage(window.localStorage);
  } catch {
    return defaultPresentationSettings;
  }
}

function setStoredValue(name: string, value: string) {
  try {
    window.localStorage.setItem(name, value);
  } catch {
    // Storage may be unavailable in private browsing or locked-down contexts.
  }
}

export function PresentationSettingsProvider({
  children,
  initialSettings,
}: {
  children: React.ReactNode;
  initialSettings?: PresentationSettings;
}) {
  const [settings, setSettings] = useState<PresentationSettings>(
    () => readInitialSettings(initialSettings)
  );

  const setAspectRatio = useCallback((value: AspectRatioKey) => {
    setSettings((prev) => {
      const next = { ...prev, aspectRatio: value };
      setStoredValue(PRESENTATION_SETTINGS_STORAGE_KEYS.aspectRatio, value);
      return next;
    });
  }, []);

  const setResolution = useCallback((value: ResolutionKey) => {
    setSettings((prev) => {
      const next = { ...prev, resolution: value };
      setStoredValue(PRESENTATION_SETTINGS_STORAGE_KEYS.resolution, value);
      return next;
    });
  }, []);

  const setSafeAutoSizing = useCallback((value: boolean) => {
    setSettings((prev) => {
      const next = { ...prev, safeAutoSizing: value };
      setStoredValue(
        PRESENTATION_SETTINGS_STORAGE_KEYS.safeAutoSizing,
        value ? "1" : "0"
      );
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
