import { useEffect, useMemo, useState } from "react";
import { ChevronDown, X } from "lucide-react";

import { usePresentationSettings } from "@/core/presentation-settings";
import { cn } from "@/lib/utils";
import {
  aspectRatioOptions,
  type AspectRatioKey,
  getExportSlideSize,
  resolutionOptions,
  type ResolutionKey,
} from "@/lib/presentation-settings";

export default function SettingsModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [mounted, setMounted] = useState(open);
  const [visible, setVisible] = useState(open);

  const {
    settings,
    setAspectRatio,
    setResolution,
    setSafeAutoSizing,
  } = usePresentationSettings();

  const exportSize = useMemo(() => getExportSlideSize(settings), [settings]);

  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onOpenChange(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onOpenChange, open]);

  useEffect(() => {
    if (open) {
      let id2: number | null = null;
      const id1 = requestAnimationFrame(() => {
        setMounted(true);
        setVisible(false);
        id2 = requestAnimationFrame(() => setVisible(true));
      });
      return () => {
        cancelAnimationFrame(id1);
        if (id2 !== null) cancelAnimationFrame(id2);
      };
    }

    const hideTimeout = window.setTimeout(() => setVisible(false), 0);
    const unmountTimeout = window.setTimeout(() => setMounted(false), 200);
    return () => {
      window.clearTimeout(hideTimeout);
      window.clearTimeout(unmountTimeout);
    };
  }, [open]);

  if (!mounted) return null;

  return (
    <div
      className="fixed inset-0 z-[60] grid place-items-center px-6 py-10"
      role="dialog"
      aria-modal="true"
      aria-label="Settings"
    >
      <button
        type="button"
        aria-label="Close settings"
        className={cn(
          "absolute inset-0 bg-slate-950/40 backdrop-blur-sm transition-opacity duration-200",
          visible ? "opacity-100" : "opacity-0"
        )}
        onClick={() => onOpenChange(false)}
      />

      <div
        className={cn(
          "relative grid w-full max-w-lg grid-cols-[1fr] gap-6 rounded-3xl border border-slate-200 bg-white p-6 text-slate-950 shadow-2xl transition duration-200 ease-out",
          visible ? "translate-y-0 scale-100 opacity-100" : "translate-y-2 scale-[0.99] opacity-0"
        )}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="grid grid-cols-[1fr] gap-1">
            <h2 className="text-lg font-semibold text-slate-950">
              Settings
            </h2>
            <p className="text-sm text-slate-500">
              Saved automatically in this browser.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="inline-grid h-9 w-9 place-items-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="grid grid-cols-[1fr] gap-5">
          <div className="grid grid-cols-[1fr] gap-2">
            <label className="text-sm font-medium text-slate-900">
              Aspect Ratio
            </label>
            <div className="relative grid grid-cols-[1fr]">
              <select
                value={settings.aspectRatio}
                onChange={(e) =>
                  setAspectRatio(e.target.value as AspectRatioKey)
                }
                className="w-full appearance-none rounded-2xl border border-slate-200 bg-white px-4 py-3 pr-12 text-sm text-slate-950 shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600"
              >
                {aspectRatioOptions.map((option) => (
                  <option key={option.key} value={option.key}>
                    {option.label}
                  </option>
                ))}
              </select>
              <ChevronDown
                className="pointer-events-none absolute top-1/2 right-4 h-4 w-4 -translate-y-1/2 text-slate-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-[1fr] gap-2">
            <label className="text-sm font-medium text-slate-900">
              Resolution
            </label>
            <div className="relative grid grid-cols-[1fr]">
              <select
                value={settings.resolution}
                onChange={(e) => setResolution(e.target.value as ResolutionKey)}
                className="w-full appearance-none rounded-2xl border border-slate-200 bg-white px-4 py-3 pr-12 text-sm text-slate-950 shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600"
              >
                {resolutionOptions.map((option) => (
                  <option key={option.key} value={option.key}>
                    {option.label}
                  </option>
                ))}
              </select>
              <ChevronDown
                className="pointer-events-none absolute top-1/2 right-4 h-4 w-4 -translate-y-1/2 text-slate-500"
              />
            </div>
            <p className="text-xs text-slate-500">
              Export size: {exportSize.width} × {exportSize.height}
            </p>
          </div>

          <div
            className="flex items-center justify-between gap-6 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
          >
            <div className="grid grid-cols-[1fr] gap-0.5">
              <p className="text-sm font-medium text-slate-900">
                Safe Auto Sizing
              </p>
              <p className="text-xs text-slate-500">
                Auto-fit slides to the viewport.
              </p>
            </div>
            <label className="flex items-center gap-2">
              <span className="sr-only">Enable safe auto sizing</span>
              <input
                type="checkbox"
                checked={settings.safeAutoSizing}
                onChange={(e) => setSafeAutoSizing(e.target.checked)}
                className="h-5 w-5 rounded border-slate-300 text-cyan-700"
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
