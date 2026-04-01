"use client";

import { useEffect, useRef, useState } from "react";
import { toPng } from "html-to-image";
import { jsPDF } from "jspdf";
import JSZip from "jszip";
import PptxGenJS from "pptxgenjs";

import { usePresentationSettings } from "@/core/presentation-settings";
import { cn } from "@/lib/utils";

interface SlideExporterProps {
  slidesContainerRef?: React.RefObject<HTMLDivElement | null>;
  onExportComplete?: () => void;
  variant?: "page" | "header";
}

type ExportFormat = "png" | "pdf" | "pptx";

type CapturedSlide = {
  dataUrl: string;
  fileName: string;
};

type ToastTone = "info" | "error";

type ExportToast = {
  message: string;
  tone: ToastTone;
  phase: "hidden" | "enter" | "visible" | "exit";
};

const PPTX_LAYOUT_NAME = "WEBSLIDES_CUSTOM";
const PPTX_BASE_HEIGHT_INCHES = 7.5;

function getDeckBaseName() {
  const title = document.title.trim().toLowerCase();
  const sanitized = title
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);

  return sanitized || "webslides";
}

function downloadBlob(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

async function dataUrlToBlob(dataUrl: string) {
  const response = await fetch(dataUrl);
  return response.blob();
}

async function preloadImageSource(src: string) {
  await new Promise<void>((resolve, reject) => {
    const image = new window.Image();
    image.decoding = "async";
    image.onload = () => resolve();
    image.onerror = () =>
      reject(new Error(`Failed to load image for export: ${src}`));
    image.src = src;
  });
}

async function ensureSlideImagesReady(slide: HTMLElement) {
  const images = Array.from(slide.querySelectorAll("img"));

  await Promise.all(
    images.map(async (img) => {
      img.loading = "eager";

      const activeSrc = img.currentSrc || img.src;
      if (activeSrc) {
        await preloadImageSource(activeSrc);
      }

      if (!img.complete) {
        await new Promise<void>((resolve, reject) => {
          const handleLoad = () => {
            cleanup();
            resolve();
          };
          const handleError = () => {
            cleanup();
            reject(
              new Error(`Failed to load image for export: ${img.currentSrc || img.src}`)
            );
          };
          const cleanup = () => {
            img.removeEventListener("load", handleLoad);
            img.removeEventListener("error", handleError);
          };

          img.addEventListener("load", handleLoad, { once: true });
          img.addEventListener("error", handleError, { once: true });
        });
      }

      if (typeof img.decode === "function") {
        try {
          await img.decode();
        } catch {
          // Some browsers reject decode() for already-decoded or SVG-backed images.
        }
      }
    })
  );
}

export default function SlideExporter({
  slidesContainerRef,
  onExportComplete,
  variant = "page",
}: SlideExporterProps) {
  const { domSlideSize, exportPixelRatio } = usePresentationSettings();
  const [activeExport, setActiveExport] = useState<ExportFormat | null>(null);
  const [toast, setToast] = useState<ExportToast>({
    message: "",
    tone: "info",
    phase: "hidden",
  });
  const toastFrameRef = useRef<number | null>(null);
  const toastTimeoutRef = useRef<number | null>(null);

  const clearToastTimers = () => {
    if (toastFrameRef.current !== null) {
      cancelAnimationFrame(toastFrameRef.current);
      toastFrameRef.current = null;
    }

    if (toastTimeoutRef.current !== null) {
      window.clearTimeout(toastTimeoutRef.current);
      toastTimeoutRef.current = null;
    }
  };

  const showToast = (message: string, tone: ToastTone = "info") => {
    clearToastTimers();

    setToast((current) => {
      if (current.phase === "hidden") {
        return { message, tone, phase: "enter" };
      }

      return { message, tone, phase: "visible" };
    });

    toastFrameRef.current = window.requestAnimationFrame(() => {
      setToast((current) =>
        current.phase === "enter" ? { ...current, phase: "visible" } : current
      );
      toastFrameRef.current = null;
    });
  };

  const hideToast = (delayMs = 0) => {
    clearToastTimers();

    const startExit = () => {
      setToast((current) => {
        if (current.phase === "hidden") {
          return current;
        }

        return { ...current, phase: "exit" };
      });

      toastTimeoutRef.current = window.setTimeout(() => {
        setToast((current) => ({ ...current, phase: "hidden", message: "" }));
        toastTimeoutRef.current = null;
      }, 240);
    };

    if (delayMs > 0) {
      toastTimeoutRef.current = window.setTimeout(() => {
        startExit();
      }, delayMs);
      return;
    }

    startExit();
  };

  useEffect(() => {
    return () => clearToastTimers();
  }, []);

  const captureSlides = async () => {
    const slideRoot = slidesContainerRef?.current ?? document;
    const slideElements = Array.from(
      slideRoot.querySelectorAll("section[data-slide]")
    ) as HTMLElement[];

    if (!slideElements.length) {
      throw new Error("No slides found to export.");
    }

    if ("fonts" in document) {
      await document.fonts.ready;
    }

    const slides: CapturedSlide[] = [];

    for (const [index, slide] of slideElements.entries()) {
      showToast(`Rendering slide ${index + 1} of ${slideElements.length}…`);

      await ensureSlideImagesReady(slide);

      const dataUrl = await toPng(slide, {
        cacheBust: true,
        width: domSlideSize.width,
        height: domSlideSize.height,
        pixelRatio: exportPixelRatio,
      });

      slides.push({
        dataUrl,
        fileName: `slide-${String(index + 1).padStart(2, "0")}.png`,
      });
    }

    return slides;
  };

  const exportPngZip = async (slides: CapturedSlide[]) => {
    const zip = new JSZip();

    for (const slide of slides) {
      zip.file(slide.fileName, await dataUrlToBlob(slide.dataUrl));
    }

    showToast("Creating ZIP archive…");
    const blob = await zip.generateAsync({ type: "blob" });
    downloadBlob(blob, `${getDeckBaseName()}-pngs.zip`);
  };

  const exportPdf = async (slides: CapturedSlide[]) => {
    const width = Math.round(domSlideSize.width * exportPixelRatio);
    const height = Math.round(domSlideSize.height * exportPixelRatio);
    const orientation = width >= height ? "landscape" : "portrait";
    const pdf = new jsPDF({
      orientation,
      unit: "px",
      format: [width, height],
      compress: true,
    });

    slides.forEach((slide, index) => {
      if (index > 0) {
        pdf.addPage([width, height], orientation);
      }

      pdf.addImage(slide.dataUrl, "PNG", 0, 0, width, height);
    });

    await pdf.save(`${getDeckBaseName()}.pdf`, { returnPromise: true });
  };

  const exportPptx = async (slides: CapturedSlide[]) => {
    const pptx = new PptxGenJS();
    const widthInches =
      (PPTX_BASE_HEIGHT_INCHES * domSlideSize.width) / domSlideSize.height;

    pptx.defineLayout({
      name: PPTX_LAYOUT_NAME,
      width: widthInches,
      height: PPTX_BASE_HEIGHT_INCHES,
    });
    pptx.layout = PPTX_LAYOUT_NAME;
    pptx.author = "WebSlides";
    pptx.subject = "Exported slide deck";
    pptx.title = document.title || "WebSlides";

    slides.forEach((capturedSlide) => {
      const slide = pptx.addSlide();
      slide.background = { color: "FFFFFF" };
      slide.addImage({
        data: capturedSlide.dataUrl,
        x: 0,
        y: 0,
        w: widthInches,
        h: PPTX_BASE_HEIGHT_INCHES,
      });
    });

    await pptx.writeFile({ fileName: `${getDeckBaseName()}.pptx` });
  };

  const handleExport = async (format: ExportFormat) => {
    setActiveExport(format);

    try {
      const slides = await captureSlides();

      if (format === "png") {
        showToast("Packaging PNGs…");
        await exportPngZip(slides);
      }

      if (format === "pdf") {
        showToast("Building PDF…");
        await exportPdf(slides);
      }

      if (format === "pptx") {
        showToast("Building PowerPoint…");
        await exportPptx(slides);
      }

      hideToast();
    } catch (error) {
      console.error("Failed to export slides", error);
      const message =
        error instanceof Error
          ? error.message
          : "Failed to export slides. Please try again.";
      showToast(message, "error");
      hideToast(2600);
    } finally {
      setActiveExport(null);
      onExportComplete?.();
    }
  };

  const isExporting = activeExport !== null;

  const buttonClassName =
    variant === "header"
      ? "inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white/70 px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-white hover:text-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
      : "w-full rounded-3xl bg-slate-900 px-6 py-4 text-xl font-semibold text-white shadow-xl transition hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-500 disabled:cursor-not-allowed disabled:opacity-60";

  const wrapperClassName =
    variant === "header"
      ? "flex flex-col items-end gap-1"
      : "w-full max-w-4xl text-center";

  const buttonsClassName =
    variant === "header"
      ? "flex flex-wrap items-center justify-end gap-2"
      : "grid gap-3 md:grid-cols-3";

  const isToastVisible = toast.phase !== "hidden";

  return (
    <>
      <div className={wrapperClassName}>
        <div className={buttonsClassName}>
          <button
            type="button"
            onClick={() => handleExport("png")}
            disabled={isExporting}
            className={buttonClassName}
          >
            {activeExport === "png" ? "Exporting PNGs…" : "Export as PNGs"}
          </button>
          <button
            type="button"
            onClick={() => handleExport("pptx")}
            disabled={isExporting}
            className={buttonClassName}
          >
            {activeExport === "pptx" ? "Exporting PPTX…" : "Export as PPTX"}
          </button>
          <button
            type="button"
            onClick={() => handleExport("pdf")}
            disabled={isExporting}
            className={buttonClassName}
          >
            {activeExport === "pdf" ? "Exporting PDF…" : "Export as PDF"}
          </button>
        </div>
      </div>

      <div
        aria-live="polite"
        className={cn(
          "pointer-events-none fixed left-1/2 bottom-5 z-[120] w-[min(32rem,calc(100vw-1.5rem))] -translate-x-1/2 px-2 transition-all duration-250 ease-out",
          isToastVisible ? "opacity-100" : "opacity-0",
          toast.phase === "visible" || toast.phase === "enter"
            ? "translate-y-0"
            : "translate-y-6"
        )}
      >
        <div
          className={
            cn(
              "mx-auto flex min-h-10 w-fit max-w-full items-center justify-center rounded-full border px-5 py-2 text-sm font-medium shadow-[0_20px_60px_rgba(15,23,42,0.18)] backdrop-blur-xl transition-all duration-250 ease-out",
              toast.tone === "error"
                ? "border-red-300/80 bg-red-50/95 text-red-700"
                : "border-slate-200/80 bg-white/92 text-slate-700",
              toast.phase === "visible" || toast.phase === "enter"
                ? "scale-100"
                : "scale-95"
            )
          }
        >
          {toast.message}
        </div>
      </div>
    </>
  );
}
