"use client";

import { useState } from "react";
import { toPng } from "html-to-image";

import { usePresentationSettings } from "@/core/presentation-settings";

interface SlideExporterProps {
  slidesContainerRef?: React.RefObject<HTMLDivElement | null>;
  onExportComplete?: () => void;
  variant?: "page" | "header";
}

export default function SlideExporter({
  slidesContainerRef,
  onExportComplete,
  variant = "page",
}: SlideExporterProps) {
  const { domSlideSize, exportPixelRatio } = usePresentationSettings();
  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);

  const handleExport = async () => {
    const slideRoot = slidesContainerRef?.current ?? document;

    const slideElements = Array.from(
      slideRoot.querySelectorAll("section[data-slide]")
    ) as HTMLElement[];

    if (!slideElements.length) {
      setExportError("No slides found to export.");
      return;
    }

    setExportError(null);
    setIsExporting(true);

    try {
      for (const [index, slide] of slideElements.entries()) {
        const dataUrl = await toPng(slide, {
          cacheBust: true,
          width: domSlideSize.width,
          height: domSlideSize.height,
          pixelRatio: exportPixelRatio,
        });

        const link = document.createElement("a");
        link.href = dataUrl;
        link.download = `slide-${String(index + 1).padStart(2, "0")}.png`;
        link.click();
      }
    } catch (error) {
      console.error("Failed to export slides", error);
      setExportError("Failed to export slides. Please try again.");
    } finally {
      setIsExporting(false);
      onExportComplete?.();
    }
  };

  if (variant === "header") {
    return (
      <div className="flex flex-col items-end">
        <button
          type="button"
          onClick={handleExport}
          disabled={isExporting}
          className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white/70 px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-white hover:text-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isExporting ? "Exporting…" : "Export"}
        </button>
        {exportError && (
          <p className="mt-1 text-xs text-red-600" aria-live="polite">
            {exportError}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl text-center">
      <button
        type="button"
        onClick={handleExport}
        disabled={isExporting}
        className="mt-4 w-full rounded-3xl bg-slate-900 px-6 py-4 text-lg font-semibold text-white shadow-xl transition hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-500 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isExporting ? "Exporting slides…" : "Export slides as PNG"}
      </button>
      {exportError && (
        <p className="mt-2 text-sm text-red-600" aria-live="polite">
          {exportError}
        </p>
      )}
    </div>
  );
}
