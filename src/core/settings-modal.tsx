"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronDown, X } from "lucide-react";

import { usePresentationSettings } from "@/core/presentation-settings";
import { themes, type ThemeName } from "@/components/slide-styles";
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
    setTheme,
    setSafeAutoSizing,
    themeStyles,
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
          themeStyles.appModalBackdropClass,
          "absolute inset-0 backdrop-blur-sm transition-opacity duration-200",
          visible ? "opacity-100" : "opacity-0"
        )}
        onClick={() => onOpenChange(false)}
      />

      <div
        className={cn(
          themeStyles.appModalClass,
          "relative grid w-full max-w-lg grid-cols-[1fr] gap-6 rounded-3xl p-6 transition duration-200 ease-out",
          visible ? "translate-y-0 scale-100 opacity-100" : "translate-y-2 scale-[0.99] opacity-0"
        )}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="grid grid-cols-[1fr] gap-1">
            <h2 className={cn(themeStyles.textStrongClass, "text-lg font-semibold")}>
              Settings
            </h2>
            <p className={cn(themeStyles.textMutedClass, "text-sm")}>
              Saved automatically in cookies.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className={cn(
              themeStyles.appControlClass,
              "inline-grid h-9 w-9 place-items-center rounded-xl transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
            )}
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="grid grid-cols-[1fr] gap-5">
          <div className="grid grid-cols-[1fr] gap-2">
            <label className={cn(themeStyles.textStrongClass, "text-sm font-medium")}>
              Aspect Ratio
            </label>
            <div className="relative grid grid-cols-[1fr]">
              <select
                value={settings.aspectRatio}
                onChange={(e) =>
                  setAspectRatio(e.target.value as AspectRatioKey)
                }
                className={cn(
                  themeStyles.appInputClass,
                  "w-full appearance-none rounded-2xl px-4 py-3 pr-12 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                )}
              >
                {aspectRatioOptions.map((option) => (
                  <option key={option.key} value={option.key}>
                    {option.label}
                  </option>
                ))}
              </select>
              <ChevronDown
                className={cn(
                  themeStyles.appInputIconClass,
                  "pointer-events-none absolute top-1/2 right-4 h-4 w-4 -translate-y-1/2"
                )}
              />
            </div>
          </div>

          <div className="grid grid-cols-[1fr] gap-2">
            <label className={cn(themeStyles.textStrongClass, "text-sm font-medium")}>
              Resolution
            </label>
            <div className="relative grid grid-cols-[1fr]">
              <select
                value={settings.resolution}
                onChange={(e) => setResolution(e.target.value as ResolutionKey)}
                className={cn(
                  themeStyles.appInputClass,
                  "w-full appearance-none rounded-2xl px-4 py-3 pr-12 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                )}
              >
                {resolutionOptions.map((option) => (
                  <option key={option.key} value={option.key}>
                    {option.label}
                  </option>
                ))}
              </select>
              <ChevronDown
                className={cn(
                  themeStyles.appInputIconClass,
                  "pointer-events-none absolute top-1/2 right-4 h-4 w-4 -translate-y-1/2"
                )}
              />
            </div>
            <p className={cn(themeStyles.textMutedClass, "text-xs")}>
              Export size: {exportSize.width} × {exportSize.height}
            </p>
          </div>

          <div className="grid grid-cols-[1fr] gap-2">
            <label className={cn(themeStyles.textStrongClass, "text-sm font-medium")}>
              Theme
            </label>
            <div className="relative grid grid-cols-[1fr]">
              <select
                value={settings.theme}
                onChange={(e) => setTheme(e.target.value as ThemeName)}
                className={cn(
                  themeStyles.appInputClass,
                  "w-full appearance-none rounded-2xl px-4 py-3 pr-12 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                )}
              >
                {themeOptions.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
              <ChevronDown
                className={cn(
                  themeStyles.appInputIconClass,
                  "pointer-events-none absolute top-1/2 right-4 h-4 w-4 -translate-y-1/2"
                )}
              />
            </div>
          </div>

          <div
            className={cn(
              themeStyles.appPanelClass,
              "flex items-center justify-between gap-6 rounded-2xl px-4 py-3"
            )}
          >
            <div className="grid grid-cols-[1fr] gap-0.5">
              <p className={cn(themeStyles.textStrongClass, "text-sm font-medium")}>
                Safe Auto Sizing
              </p>
              <p className={cn(themeStyles.textMutedClass, "text-xs")}>
                Auto-fit slides to the viewport.
              </p>
            </div>
            <label className="flex items-center gap-2">
              <span className="sr-only">Enable safe auto sizing</span>
              <input
                type="checkbox"
                checked={settings.safeAutoSizing}
                onChange={(e) => setSafeAutoSizing(e.target.checked)}
                className={cn(themeStyles.appCheckboxClass, "h-5 w-5 rounded")}
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
