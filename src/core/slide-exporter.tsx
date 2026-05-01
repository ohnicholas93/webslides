"use client";

import { createPortal } from "react-dom";
import { useEffect, useRef, useState } from "react";
import { toPng } from "html-to-image";
import { jsPDF } from "jspdf";
import JSZip from "jszip";
import { Download, FileArchive, FileImage, FileText, X } from "lucide-react";
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

const exportOptions: {
  format: ExportFormat;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  {
    format: "png",
    title: "PNGs",
    description: "One image per slide, zipped.",
    icon: FileImage,
  },
  {
    format: "pptx",
    title: "PPTX",
    description: "PowerPoint with slide images.",
    icon: FileArchive,
  },
  {
    format: "pdf",
    title: "PDF",
    description: "Static deck for sharing.",
    icon: FileText,
  },
];

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
  const [isModalOpen, setIsModalOpen] = useState(false);
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

  useEffect(() => {
    if (!isModalOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsModalOpen(false);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isModalOpen]);

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
    setIsModalOpen(false);
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
      ? cn(
          "inline-grid min-h-10 place-items-center rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600 disabled:cursor-not-allowed disabled:opacity-60"
        )
      : cn(
          "grid w-full place-items-center rounded-3xl bg-slate-950 px-6 py-4 text-xl font-semibold text-white shadow-sm transition hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600 disabled:cursor-not-allowed disabled:opacity-60"
        );

  const wrapperClassName =
    variant === "header"
      ? "flex min-w-0 flex-none flex-col items-end gap-1"
      : "w-full max-w-4xl text-center";

  const isToastVisible = toast.phase !== "hidden";

  return (
    <>
      <div className={wrapperClassName}>
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          disabled={isExporting}
          className={buttonClassName}
        >
          <span className="inline-flex items-center gap-2">
            <Download className={variant === "header" ? "h-4 w-4" : "h-5 w-5"} />
            {activeExport ? "Exporting..." : "Export"}
          </span>
        </button>
      </div>

      {isModalOpen &&
        createPortal(
        <div
          className="fixed inset-0 z-[110] grid place-items-center bg-slate-950/40 px-6 py-10 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label="Choose export format"
        >
          <button
            type="button"
            className="absolute inset-0"
            aria-label="Close export options"
            onClick={() => setIsModalOpen(false)}
          />
          <div className="relative w-full max-w-3xl rounded-[1.75rem] border border-slate-200 bg-white p-6 text-slate-950 shadow-2xl">
            <div className="flex items-start justify-between gap-5">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.22em] text-slate-500">
                  Export
                </p>
                <h2 className="mt-2 text-2xl font-bold tracking-tight">
                  Choose a format
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {exportOptions.map(({ format, title, description, icon: Icon }) => (
                <button
                  key={format}
                  type="button"
                  onClick={() => handleExport(format)}
                  className="group grid min-h-48 content-between rounded-2xl border border-slate-200 bg-slate-50 p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-cyan-300 hover:bg-white hover:shadow-[0_18px_55px_rgba(15,23,42,0.12)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600"
                >
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white text-cyan-700 shadow-sm ring-1 ring-slate-200 transition group-hover:bg-cyan-50 group-hover:ring-cyan-200">
                    <Icon className="h-6 w-6" />
                  </span>
                  <span>
                    <span className="block text-2xl font-bold text-slate-950">
                      {title}
                    </span>
                    <span className="mt-2 block text-base leading-relaxed text-slate-600">
                      {description}
                    </span>
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>,
        document.body
      )}

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
          className={cn(
            toast.tone === "error"
              ? "border-red-200 bg-red-50 text-red-800"
              : "border-slate-200 bg-white text-slate-800",
            "mx-auto grid min-h-10 w-fit max-w-full place-items-center rounded-full border px-5 py-2 text-sm font-medium shadow-[0_20px_60px_rgba(15,23,42,0.18)] backdrop-blur-xl transition-all duration-250 ease-out",
            toast.phase === "visible" || toast.phase === "enter"
              ? "scale-100"
              : "scale-95"
          )}
        >
          {toast.message}
        </div>
      </div>
    </>
  );
}
