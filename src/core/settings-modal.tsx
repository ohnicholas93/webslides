"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronDown, X } from "lucide-react";

import { usePresentationSettings } from "@/core/presentation-settings";
import { themes, type ThemeName } from "@/components/slide-styles";
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
    setTheme,
    setSafeAutoSizing,
  } =
    usePresentationSettings();

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

  const themeOptions = useMemo(() => {
    return Object.keys(themes) as ThemeName[];
  }, []);

  useEffect(() => {
    if (open) {
      setMounted(true);
      setVisible(false);
      let id2: number | null = null;
      const id1 = requestAnimationFrame(() => {
        id2 = requestAnimationFrame(() => setVisible(true));
      });
      return () => {
        cancelAnimationFrame(id1);
        if (id2 !== null) cancelAnimationFrame(id2);
      };
    }

    setVisible(false);
    const timeout = window.setTimeout(() => setMounted(false), 200);
    return () => window.clearTimeout(timeout);
  }, [open]);

  if (!mounted) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center px-6 py-10"
      role="dialog"
      aria-modal="true"
      aria-label="Settings"
    >
      <button
        type="button"
        aria-label="Close settings"
        className={[
          "absolute inset-0 bg-slate-950/30 backdrop-blur-sm transition-opacity duration-200",
          visible ? "opacity-100" : "opacity-0",
        ].join(" ")}
        onClick={() => onOpenChange(false)}
      />

      <div
        className={[
          "relative w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl transition duration-200 ease-out",
          visible ? "translate-y-0 scale-100 opacity-100" : "translate-y-2 scale-[0.99] opacity-0",
        ].join(" ")}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Settings</h2>
            <p className="mt-1 text-sm text-slate-500">
              Saved automatically in cookies.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:bg-slate-50 hover:text-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-6 space-y-5">
          <div>
            <label className="text-sm font-medium text-slate-900">
              Aspect Ratio
            </label>
            <div className="relative mt-2">
              <select
                value={settings.aspectRatio}
                onChange={(e) =>
                  setAspectRatio(e.target.value as AspectRatioKey)
                }
                className="w-full appearance-none rounded-2xl border border-slate-200 bg-white px-4 py-3 pr-12 text-sm text-slate-900 shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
              >
                {aspectRatioOptions.map((option) => (
                  <option key={option.key} value={option.key}>
                    {option.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-900">
              Resolution
            </label>
            <div className="relative mt-2">
              <select
                value={settings.resolution}
                onChange={(e) => setResolution(e.target.value as ResolutionKey)}
                className="w-full appearance-none rounded-2xl border border-slate-200 bg-white px-4 py-3 pr-12 text-sm text-slate-900 shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
              >
                {resolutionOptions.map((option) => (
                  <option key={option.key} value={option.key}>
                    {option.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            </div>
            <p className="mt-2 text-xs text-slate-500">
              Export size: {exportSize.width} × {exportSize.height}
            </p>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-900">Theme</label>
            <div className="relative mt-2">
              <select
                value={settings.theme}
                onChange={(e) => setTheme(e.target.value as ThemeName)}
                className="w-full appearance-none rounded-2xl border border-slate-200 bg-white px-4 py-3 pr-12 text-sm text-slate-900 shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
              >
                {themeOptions.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            </div>
          </div>

          <div className="flex items-center justify-between gap-6 rounded-2xl border border-slate-200 bg-slate-50/60 px-4 py-3">
            <div>
              <p className="text-sm font-medium text-slate-900">
                Safe Auto Sizing
              </p>
              <p className="mt-0.5 text-xs text-slate-500">
                Auto-fit slides to the viewport.
              </p>
            </div>
            <label className="inline-flex items-center gap-2">
              <span className="sr-only">Enable safe auto sizing</span>
              <input
                type="checkbox"
                checked={settings.safeAutoSizing}
                onChange={(e) => setSafeAutoSizing(e.target.checked)}
                className="h-5 w-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
