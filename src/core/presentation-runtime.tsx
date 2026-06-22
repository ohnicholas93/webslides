import { createPortal } from "react-dom";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Clock3,
  CircleSlash2,
  FileJson,
  Fingerprint,
  LayoutPanelLeft,
  Link2,
  Maximize2,
  PanelRightOpen,
  PlugZap,
  X,
} from "lucide-react";

import { usePresentationSettings } from "@/core/presentation-settings";
import {
  createDefaultMetadata,
  getPresenterNote,
  metadataFingerprint,
  normalizeMetadata,
  setPresenterNote,
  type PresentationMetadata,
} from "@/lib/presentation-metadata";
import {
  DEFAULT_PRESENTATION_WS_URL,
  getPresentationClientId,
  getPresentationSessionId,
  getPresentationWsUrl,
  isPresentationSessionMessage,
  setPresentationSessionId,
  setPresentationWsUrl,
  type PresentationSessionMessage,
} from "@/lib/presentation-session";
import { cn } from "@/lib/utils";

type RuntimeMode = "present" | "presenter" | null;
type ConnectionState = "connecting" | "connected" | "disconnected";
type NotesSyncState = "loading" | "saving" | "synced" | "error";

type SlideSnapshot = {
  html: string;
  title: string;
};

const LAST_SLIDE_INDEX_STORAGE_KEY = "webslides:last-slide-index";
const METADATA_STORAGE_KEY = "webslides:presentation-metadata";
const DEFAULT_METADATA_URL = "metadata.json";
const SOURCE_SLIDE_SELECTOR = "[data-webslides-shell] section[data-slide]";

function clampSlideIndex(index: number, slideCount: number) {
  if (slideCount <= 0) return 0;
  if (!Number.isFinite(index)) return 0;
  return Math.min(Math.max(index, 0), slideCount - 1);
}

async function readMetadataFromStorage(signal?: AbortSignal) {
  const fallback = createDefaultMetadata();

  try {
    const raw = window.localStorage.getItem(METADATA_STORAGE_KEY);
    if (raw) {
      return normalizeMetadata(JSON.parse(raw), fallback);
    }
  } catch {
    // Fall through to bundled defaults.
  }

  try {
    const response = await fetch(DEFAULT_METADATA_URL, {
      cache: "no-store",
      signal,
    });

    if (response.ok) {
      return normalizeMetadata(await response.json(), fallback);
    }
  } catch {
    // Static deployments may not include metadata.json; defaults are enough.
  }

  return fallback;
}

async function saveMetadataToStorage(metadata: PresentationMetadata) {
  const next = normalizeMetadata(metadata);
  window.localStorage.setItem(METADATA_STORAGE_KEY, JSON.stringify(next));
  return next;
}

function getSlideSnapshots() {
  return Array.from(
    document.querySelectorAll<HTMLElement>(SOURCE_SLIDE_SELECTOR)
  ).map((slide, index) => ({
      html: slide.outerHTML,
      title: slide.dataset.slideTitle || `Slide ${index + 1}`,
    }));
}

function areSlideSnapshotsEqual(a: SlideSnapshot[], b: SlideSnapshot[]) {
  return (
    a.length === b.length &&
    a.every((slide, index) => {
      const next = b[index];
      return slide.html === next.html && slide.title === next.title;
    })
  );
}

function readStoredSlideIndex() {
  const raw = window.localStorage.getItem(LAST_SLIDE_INDEX_STORAGE_KEY);
  if (!raw) return 0;

  const parsed = Number.parseInt(raw, 10);
  return Number.isFinite(parsed) ? parsed : 0;
}

const SlidePreview = memo(function SlidePreview({
  slide,
  scale,
  className,
  emptyState,
  sourceSlideIndex,
}: {
  slide?: SlideSnapshot;
  scale: number;
  className?: string;
  emptyState?: React.ReactNode;
  sourceSlideIndex?: number;
}) {
  const { domSlideSize } = usePresentationSettings();
  const previewRef = useRef<HTMLDivElement>(null);
  const scaledWidth = Math.round(domSlideSize.width * scale);
  const scaledHeight = Math.round(domSlideSize.height * scale);

  useEffect(() => {
    if (sourceSlideIndex === undefined) return;

    let frame = 0;
    const syncCanvases = () => {
      const preview = previewRef.current;
      const sourceSlide =
        document.querySelectorAll<HTMLElement>(SOURCE_SLIDE_SELECTOR)[
          sourceSlideIndex
        ];

      if (!preview || !sourceSlide) {
        frame = window.requestAnimationFrame(syncCanvases);
        return;
      }

      const sourceCanvases = Array.from(
        sourceSlide.querySelectorAll<HTMLCanvasElement>("canvas")
      );
      const targetCanvases = Array.from(
        preview.querySelectorAll<HTMLCanvasElement>("canvas")
      );

      targetCanvases.forEach((target, index) => {
        const source = sourceCanvases[index];
        if (!source) return;

        if (target.width !== source.width) target.width = source.width;
        if (target.height !== source.height) target.height = source.height;

        const context = target.getContext("2d");
        if (!context) return;

        context.clearRect(0, 0, target.width, target.height);
        context.drawImage(source, 0, 0);
      });

      frame = window.requestAnimationFrame(syncCanvases);
    };

    syncCanvases();
    return () => window.cancelAnimationFrame(frame);
  }, [slide?.html, sourceSlideIndex]);

  if (!slide) {
    return (
      <div
        ref={previewRef}
        className={cn("grid place-items-center", className)}
        style={{
          width: scaledWidth,
          height: scaledHeight,
        }}
      >
        {emptyState ?? (
          <div className="grid h-full w-full place-items-center rounded-lg border border-white/10 bg-white/5 text-lg text-white/60">
            No slide selected
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      ref={previewRef}
      className={cn("relative overflow-hidden", className)}
      style={{
        width: scaledWidth,
        height: scaledHeight,
      }}
    >
      <div
        style={{
          width: domSlideSize.width,
          height: domSlideSize.height,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
        }}
        dangerouslySetInnerHTML={{ __html: slide.html }}
      />
    </div>
  );
}, (prev, next) =>
  prev.slide?.html === next.slide?.html &&
  prev.slide?.title === next.slide?.title &&
  prev.scale === next.scale &&
  prev.className === next.className &&
  prev.emptyState === next.emptyState &&
  prev.sourceSlideIndex === next.sourceSlideIndex
);

function RuntimeButton({
  children,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      className={cn(
        "inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/10 px-3 text-sm font-semibold text-white transition hover:bg-white/16 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-200 disabled:cursor-not-allowed disabled:opacity-40",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

function PresentationOverlay({
  mode,
  slides,
  slideIndex,
  metadata,
  connectionState,
  elapsedSeconds,
  goNext,
  goPrev,
  close,
  updateNote,
}: {
  mode: Exclude<RuntimeMode, null>;
  slides: SlideSnapshot[];
  slideIndex: number;
  metadata: PresentationMetadata;
  connectionState: ConnectionState;
  elapsedSeconds: number;
  goNext: () => void;
  goPrev: () => void;
  close: () => void;
  updateNote: (slideNumber: number, notes: string) => void;
}) {
  const { domSlideSize } = usePresentationSettings();
  const [viewport, setViewport] = useState({ width: 1280, height: 720 });
  const [sidebarWidth, setSidebarWidth] = useState(460);
  const sidebarDragStateRef = useRef<{
    startX: number;
    startWidth: number;
  } | null>(null);
  const isPresenter = mode === "presenter";
  const isPresent = mode === "present";
  const minSidebarWidth = 320;
  const maxSidebarWidth = Math.max(420, Math.min(viewport.width * 0.75, viewport.width - 160));
  const presenterSidebarWidth = Math.min(
    maxSidebarWidth,
    Math.max(minSidebarWidth, sidebarWidth)
  );

  useEffect(() => {
    const update = () => {
      setViewport({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  useEffect(() => {
    if (!isPresenter) return;

    const onPointerMove = (event: PointerEvent) => {
      const dragState = sidebarDragStateRef.current;
      if (!dragState) return;
      const delta = dragState.startX - event.clientX;
      const nextWidth = dragState.startWidth + delta;
      setSidebarWidth(Math.min(maxSidebarWidth, Math.max(minSidebarWidth, nextWidth)));
    };

    const onPointerUp = () => {
      sidebarDragStateRef.current = null;
    };

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
    };
  }, [isPresenter, maxSidebarWidth, minSidebarWidth]);

  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const previousHtmlOverflow = html.style.overflow;
    const previousBodyOverflow = body.style.overflow;
    const previousMode = body.dataset.webslidesMode;

    html.style.overflow = "hidden";
    body.style.overflow = "hidden";
    if (mode) {
      body.dataset.webslidesMode = mode;
    } else {
      delete body.dataset.webslidesMode;
    }

    return () => {
      html.style.overflow = previousHtmlOverflow;
      body.style.overflow = previousBodyOverflow;
      if (previousMode) {
        body.dataset.webslidesMode = previousMode;
      } else {
        delete body.dataset.webslidesMode;
      }
    };
  }, [mode]);

  const currentSlide = slides[slideIndex];
  const nextSlide =
    slideIndex + 1 < slides.length ? slides[slideIndex + 1] : undefined;
  const slideNumber = slideIndex + 1;
  const presenterScale = Math.min(
    Math.max(320, viewport.width - presenterSidebarWidth - 33) /
      domSlideSize.width,
    Math.max(320, viewport.height - 132) / domSlideSize.height
  );
  const presentScale = Math.min(
    Math.max(320, viewport.width) / domSlideSize.width,
    Math.max(320, viewport.height) / domSlideSize.height
  );
  const scale = isPresenter ? presenterScale : presentScale;
  const minutes = Math.floor(elapsedSeconds / 60);
  const seconds = String(elapsedSeconds % 60).padStart(2, "0");
  const connectionLabel =
    connectionState === "connected"
      ? "Connected"
      : connectionState === "connecting"
        ? "Connecting"
        : "Disconnected";

  if (isPresent) {
    return createPortal(
      <div
        className="fixed inset-0 z-[1000] overflow-hidden bg-[#08111f] text-white"
        data-presentation-runtime
      >
        <div className="absolute inset-0 bg-[#08111f]" />
        <div className="relative z-10 flex h-full items-center justify-center">
          <SlidePreview
            slide={currentSlide}
            scale={scale}
            className="rounded-none shadow-none"
            sourceSlideIndex={slideIndex}
          />
        </div>
      </div>,
      document.body
    );
  }

  return createPortal(
    <div
      className="fixed inset-0 z-[1000] overflow-hidden bg-[#08111f] text-white"
      data-presentation-runtime
    >
      <div className="absolute inset-0 bg-[#0d1117]" />
      <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(255,255,255,0.7)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.7)_1px,transparent_1px)] [background-size:44px_44px]" />

      <div className="relative z-10 grid h-full grid-rows-[auto_1fr_auto] gap-3 px-[16.5px] py-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <div className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 bg-white/5">
              <PanelRightOpen className="h-5 w-5 text-white/80" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-white/80">
                Presenter View
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/72 md:flex">
              <PlugZap className="h-4 w-4" />
              {connectionLabel}
            </div>
            <div className="hidden items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/72 md:flex">
              <Clock3 className="h-4 w-4" />
              {minutes}:{seconds}
            </div>
            <RuntimeButton onClick={close} aria-label="Close presentation">
              <X className="h-4 w-4" />
              Close
            </RuntimeButton>
          </div>
        </div>

        <div
          className="grid min-h-0 items-stretch gap-0"
          style={{
            gridTemplateColumns: `minmax(0,1fr) 16px ${presenterSidebarWidth}px`,
          }}
        >
          <div className="relative z-0 grid min-h-0 overflow-hidden place-items-center">
            <SlidePreview
              slide={currentSlide}
              scale={scale}
              className="rounded-none shadow-[0_50px_140px_rgba(0,0,0,0.48)]"
              sourceSlideIndex={slideIndex}
            />
          </div>

          <div className="relative z-20 flex items-center justify-center">
            <button
              type="button"
              aria-label="Resize presenter sidebar"
              onPointerDown={(event) => {
                sidebarDragStateRef.current = {
                  startX: event.clientX,
                  startWidth: presenterSidebarWidth,
                };
              }}
              className="group absolute left-1/2 z-30 flex w-8 -translate-x-1/2 cursor-col-resize items-center justify-center"
            >
              <span className="h-28 w-1 rounded-full border border-white/10 bg-white/20 shadow-[0_0_0_1px_rgba(0,0,0,0.1)] transition group-hover:bg-white/35" />
            </button>
          </div>

          <aside className="grid h-full min-h-0 grid-rows-[auto_minmax(0,1fr)_auto] overflow-hidden rounded-lg border border-white/10 bg-[#14181f] p-4">
            <div>
              <p className="text-sm font-semibold text-white/72">
                Slide {slideNumber} of {Math.max(slides.length, 1)}
              </p>
            </div>

            <textarea
              value={getPresenterNote(metadata, slideNumber)}
              onChange={(event) => updateNote(slideNumber, event.target.value)}
              placeholder="Write presenter notes for this slide..."
              className="mt-3 min-h-0 resize-none rounded-lg border border-white/10 bg-[#0f131a] p-3 text-base leading-relaxed text-white outline-none placeholder:text-white/36 focus:border-white/25"
            />

            <div className="mt-3 rounded-lg border border-white/10 bg-[#0f131a] p-3">
              <p className="text-sm font-semibold text-white/60">Next</p>
              <div className="mt-2 grid grid-cols-[72px_1fr] items-center gap-3">
                <SlidePreview
                  slide={nextSlide}
                  scale={Math.min(0.065, 72 / domSlideSize.width)}
                  className="rounded-md"
                  sourceSlideIndex={nextSlide ? slideIndex + 1 : undefined}
                  emptyState={
                    <div className="grid h-full w-full place-items-center rounded-md border border-white/8 bg-white/[0.03] text-white/40">
                      <CircleSlash2 className="h-4 w-4" />
                    </div>
                  }
                />
                {nextSlide ? (
                  <p className="line-clamp-3 text-sm text-white/78">
                    {nextSlide.title}
                  </p>
                ) : (
                  <p className="text-sm text-white/72">End of deck</p>
                )}
              </div>
            </div>
          </aside>
        </div>

        <div className="flex items-center justify-between gap-3">
          <RuntimeButton onClick={goPrev} disabled={slideIndex <= 0}>
            <ChevronLeft className="h-4 w-4" />
            Previous
          </RuntimeButton>
          <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm font-semibold text-white/72">
            {slideNumber} / {Math.max(slides.length, 1)}
          </div>
          <RuntimeButton onClick={goNext} disabled={slideIndex >= slides.length - 1}>
            Next
            <ChevronRight className="h-4 w-4" />
          </RuntimeButton>
        </div>
      </div>
    </div>,
    document.body
  );
}

function MetadataModal({
  open,
  slides,
  metadata,
  sessionId,
  wsUrl,
  connectionState,
  notesSyncState,
  onClose,
  onSessionIdChange,
  onUpdateNote,
  onWsUrlChange,
}: {
  open: boolean;
  slides: SlideSnapshot[];
  metadata: PresentationMetadata;
  sessionId: string;
  wsUrl: string;
  connectionState: ConnectionState;
  notesSyncState: NotesSyncState;
  onClose: () => void;
  onSessionIdChange: (value: string) => void;
  onUpdateNote: (slideNumber: number, notes: string) => void;
  onWsUrlChange: (value: string) => void;
}) {
  if (!open) return null;

  const statusMeta =
    notesSyncState === "error"
      ? {
          detail: "Notes could not be saved",
          tone: "border-rose-200 bg-rose-50 text-rose-700",
          icon: CircleSlash2,
        }
      : notesSyncState === "saving"
        ? {
            detail: "Saving locally...",
            tone: "border-amber-200 bg-amber-50 text-amber-700",
            icon: Clock3,
          }
        : notesSyncState === "loading"
          ? {
              detail: "Loading local notes...",
              tone: "border-slate-200 bg-slate-100 text-slate-600",
              icon: Clock3,
            }
          : connectionState === "connected"
            ? {
                detail: "Sync available",
                tone: "border-emerald-200 bg-emerald-50 text-emerald-700",
                icon: PlugZap,
              }
            : connectionState === "connecting"
              ? {
                  detail: "Starting sync...",
                  tone: "border-amber-200 bg-amber-50 text-amber-700",
                  icon: Clock3,
                }
              : {
                  detail: "Notes saved locally",
                  tone: "border-slate-200 bg-slate-100 text-slate-600",
                  icon: CircleSlash2,
                };
  const StatusIcon = statusMeta.icon;

  return createPortal(
    <div className="fixed inset-0 z-[900] grid justify-items-center overflow-y-auto bg-slate-950/40 px-4 py-6">
      <div className="my-auto grid max-h-[calc(100vh-3rem)] w-full max-w-[1120px] grid-rows-[auto_minmax(0,1fr)] overflow-hidden rounded-xl border border-slate-200 bg-white text-slate-950 shadow-[0_24px_80px_rgba(15,23,42,0.22)]">
        <div className="flex items-start justify-between gap-5 border-b border-slate-200 px-5 py-4">
          <div>
            <h2 className="text-xl font-semibold tracking-tight">
              Presenter notes and session sync
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid h-9 w-9 place-items-center rounded-lg border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-50"
            aria-label="Close metadata"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="grid min-h-0 grid-cols-[280px_minmax(0,1fr)] gap-4 overflow-hidden p-4">
          <div className="min-h-0">
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50/80">
              <label className="grid gap-3 border-b border-slate-200 bg-white p-4">
                <span className="flex min-w-0 items-center gap-3">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-blue-100 bg-blue-50 text-blue-600">
                    <Fingerprint className="h-4 w-4" />
                  </span>
                  <span className="min-w-0 text-sm font-semibold text-slate-900">
                    Session ID
                  </span>
                </span>
                <input
                  value={sessionId}
                  onChange={(event) => onSessionIdChange(event.target.value)}
                  className="min-w-0 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 font-mono text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white"
                />
              </label>

              <label className="grid gap-3 border-b border-slate-200 bg-white p-4">
                <span className="flex min-w-0 items-center gap-3">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-slate-200 bg-slate-50 text-slate-700">
                    <Link2 className="h-4 w-4" />
                  </span>
                  <span className="min-w-0 text-sm font-semibold text-slate-900">
                    WebSocket URL
                  </span>
                </span>
                <input
                  value={wsUrl}
                  onChange={(event) => onWsUrlChange(event.target.value)}
                  className="min-w-0 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 font-mono text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white"
                />
              </label>

              <div className="grid gap-3 bg-white p-4">
                <div className="flex min-w-0 items-center gap-3">
                  <span
                    className={cn(
                      "grid h-9 w-9 shrink-0 place-items-center rounded-lg border",
                      statusMeta.tone
                    )}
                  >
                    <StatusIcon className="h-4 w-4" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-900">Status</p>
                    <p className="text-xs text-slate-500">{statusMeta.detail}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="min-h-0 overflow-y-auto pr-1">
            <div className="grid gap-4">
              {slides.map((slide, index) => {
                const slideNumber = index + 1;

                return (
                  <label
                    key={`${slide.title}-${slideNumber}`}
                    className="grid gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4"
                  >
                    <span className="flex items-center justify-between gap-3">
                      <span className="text-base font-semibold text-slate-950">
                        {String(slideNumber).padStart(2, "0")} · {slide.title}
                      </span>
                    </span>
                    <textarea
                      value={getPresenterNote(metadata, slideNumber)}
                      onChange={(event) =>
                        onUpdateNote(slideNumber, event.target.value)
                      }
                      placeholder="Presenter notes..."
                      className="min-h-28 resize-y rounded-md border border-slate-300 bg-white p-3 text-sm leading-6 text-slate-900 outline-none focus:border-slate-500"
                    />
                  </label>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

function ViewModeModal({
  open,
  onClose,
  onPresent,
  onPresenter,
  onNotes,
}: {
  open: boolean;
  onClose: () => void;
  onPresent: () => void;
  onPresenter: () => void;
  onNotes: () => void;
}) {
  if (!open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[910] grid place-items-center bg-slate-950/40 px-4 py-6 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Presentation view options"
    >
      <button
        type="button"
        className="absolute inset-0"
        aria-label="Close view options"
        onClick={onClose}
      />
      <div className="relative w-full max-w-3xl rounded-xl border border-slate-200 bg-white p-6 text-slate-950 shadow-[0_24px_80px_rgba(15,23,42,0.22)]">
        <div className="flex items-start justify-between gap-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              View
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight">
              Choose a mode
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid h-10 w-10 place-items-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {[
            {
              title: "Fullscreen Mode",
              description: "Slide-only view for presenting.",
              icon: Maximize2,
              onClick: onPresent,
            },
            {
              title: "Presenter View",
              description: "Current slide, notes, and next slide.",
              icon: PanelRightOpen,
              onClick: onPresenter,
            },
            {
              title: "Notes",
              description: "Session settings and presenter notes.",
              icon: FileJson,
              onClick: onNotes,
            },
          ].map(({ title, description, icon: Icon, onClick }) => (
            <button
              key={title}
              type="button"
              onClick={onClick}
              className="grid min-h-44 content-between rounded-lg border border-slate-200 bg-slate-50 p-5 text-left transition hover:border-slate-300 hover:bg-white"
            >
              <span className="grid h-11 w-11 place-items-center rounded-lg border border-slate-200 bg-white text-slate-700">
                <Icon className="h-5 w-5" />
              </span>
              <span>
                <span className="block text-xl font-semibold text-slate-950">
                  {title}
                </span>
                <span className="mt-2 block text-sm leading-6 text-slate-600">
                  {description}
                </span>
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>,
    document.body
  );
}

export default function PresentationRuntimeControls() {
  const [mode, setModeState] = useState<RuntimeMode>(null);
  const [isMetadataOpen, setIsMetadataOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [slides, setSlides] = useState<SlideSnapshot[]>([]);
  const [slideIndex, setSlideIndex] = useState(() =>
    typeof window === "undefined" ? 0 : readStoredSlideIndex()
  );
  const [metadata, setMetadata] = useState<PresentationMetadata>(() =>
    createDefaultMetadata()
  );
  const [clientId] = useState(() =>
    typeof window === "undefined" ? "" : getPresentationClientId()
  );
  const [sessionId, setSessionId] = useState(() =>
    typeof window === "undefined" ? "" : getPresentationSessionId()
  );
  const [wsUrl, setWsUrl] = useState(() =>
    typeof window === "undefined" ? DEFAULT_PRESENTATION_WS_URL : getPresentationWsUrl()
  );
  const [connectionState, setConnectionState] =
    useState<ConnectionState>("connecting");
  const [notesSyncState, setNotesSyncState] =
    useState<NotesSyncState>("loading");
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const socketRef = useRef<WebSocket | null>(null);
  const metadataRef = useRef(metadata);
  const modeRef = useRef(mode);
  const slidesLengthRef = useRef(slides.length);
  const metadataSaveTimerRef = useRef<number | null>(null);
  const isSavingMetadataRef = useRef(false);

  const setMode = (nextMode: RuntimeMode) => {
    if (nextMode) {
      setElapsedSeconds(0);
    }
    setModeState(nextMode);
    setIsViewModalOpen(false);

    const url = new URL(window.location.href);
    if (nextMode) {
      url.searchParams.set("webslidesView", nextMode);
    } else {
      url.searchParams.delete("webslidesView");
    }
    window.history.replaceState({}, "", url);
  };

  const persistMetadata = useCallback((next: PresentationMetadata) => {
    if (metadataSaveTimerRef.current !== null) {
      window.clearTimeout(metadataSaveTimerRef.current);
    }

    setNotesSyncState("saving");
    metadataSaveTimerRef.current = window.setTimeout(async () => {
      isSavingMetadataRef.current = true;

      try {
        const saved = await saveMetadataToStorage(next);
        setMetadata((current) => {
          if (metadataFingerprint(current) !== metadataFingerprint(next)) {
            return current;
          }

          metadataRef.current = saved;
          return saved;
        });
        setNotesSyncState("synced");
      } catch {
        setNotesSyncState("error");
      } finally {
        isSavingMetadataRef.current = false;
        metadataSaveTimerRef.current = null;
      }
    }, 200);
  }, []);

  const refreshMetadata = useCallback(
    async ({ quiet = false }: { quiet?: boolean } = {}) => {
      if (isSavingMetadataRef.current || metadataSaveTimerRef.current !== null) {
        return;
      }

      if (!quiet) {
        setNotesSyncState("loading");
      }

      try {
        const next = await readMetadataFromStorage();
        setMetadata((current) => {
          if (metadataFingerprint(current) === metadataFingerprint(next)) {
            metadataRef.current = current;
            return current;
          }

          metadataRef.current = next;
          return next;
        });
        setNotesSyncState("synced");
      } catch {
        setNotesSyncState("error");
      }
    },
    []
  );

  const sendMessage = useCallback((message: PresentationSessionMessage) => {
    const socket = socketRef.current;
    if (!socket || socket.readyState !== WebSocket.OPEN) return;
    socket.send(JSON.stringify(message));
  }, []);

  const applyMetadata = (next: PresentationMetadata, shouldBroadcast = true) => {
    metadataRef.current = next;
    setMetadata(next);
    persistMetadata(next);

    if (shouldBroadcast) {
      sendMessage({
        type: "metadata:update",
        sessionId,
        clientId,
        metadata: next,
      });
    }
  };

  const setSyncedSlideIndex = useCallback(
    (nextIndex: number, shouldBroadcast = true) => {
      const clamped = clampSlideIndex(nextIndex, slides.length);
      setSlideIndex(clamped);
      window.localStorage.setItem(LAST_SLIDE_INDEX_STORAGE_KEY, String(clamped));

      if (shouldBroadcast) {
        sendMessage({
          type: "slide:set",
          sessionId,
          clientId,
          slideIndex: clamped,
        });
      }
    },
    [clientId, sendMessage, sessionId, slides.length]
  );

  const updateNote = (slideNumber: number, notes: string) => {
    applyMetadata(setPresenterNote(metadata, slideNumber, notes));
  };

  useEffect(() => {
    void refreshMetadata();
  }, [refreshMetadata]);

  useEffect(() => {
    return () => {
      if (metadataSaveTimerRef.current !== null) {
        window.clearTimeout(metadataSaveTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    metadataRef.current = metadata;
  }, [metadata]);

  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);

  useEffect(() => {
    const view = new URLSearchParams(window.location.search).get("webslidesView");
    if (view === "presenter" || view === "present") {
      const timer = window.setTimeout(() => setMode(view), 0);
      return () => window.clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    slidesLengthRef.current = slides.length;
  }, [slides.length]);

  useEffect(() => {
    const updateSlides = () => {
      const snapshots = getSlideSnapshots();
      setSlides((current) =>
        areSlideSnapshotsEqual(current, snapshots) ? current : snapshots
      );
      setSlideIndex((current) => {
        const clamped = clampSlideIndex(current, snapshots.length);
        window.localStorage.setItem(LAST_SLIDE_INDEX_STORAGE_KEY, String(clamped));
        return clamped;
      });
    };

    updateSlides();
    const frame = window.requestAnimationFrame(updateSlides);
    const observer = new MutationObserver(updateSlides);
    const slideRoot =
      document.querySelector(SOURCE_SLIDE_SELECTOR)?.parentElement ??
      document.getElementById("root");
    if (slideRoot) {
      observer.observe(slideRoot, { childList: true, subtree: true });
    }

    return () => {
      window.cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!clientId || !sessionId || !wsUrl) return;

    let reconnectTimer: number | null = null;
    let closedByEffect = false;
    let reconnectDelay = 1000;

    const connect = () => {
      try {
        const socket = new WebSocket(wsUrl);
        socketRef.current = socket;

        socket.addEventListener("open", () => {
          setConnectionState("connected");
          reconnectDelay = 1000;
          sendMessage({
            type: "hello",
            sessionId,
            clientId,
            role: modeRef.current === "presenter" ? "presenter-view" : "viewer",
          });
        });

        socket.addEventListener("message", (event) => {
          let parsed: unknown;

          try {
            parsed = JSON.parse(String(event.data));
          } catch {
            return;
          }

          if (!isPresentationSessionMessage(parsed)) return;
          if (parsed.sessionId !== sessionId) return;

          if (parsed.type === "slide:set") {
            setSlideIndex(
              clampSlideIndex(parsed.slideIndex, slidesLengthRef.current)
            );
          }

          if (parsed.type === "metadata:update") {
            const next = normalizeMetadata(parsed.metadata, metadataRef.current);
            setMetadata(next);
            persistMetadata(next);
          }
        });

        socket.addEventListener("close", () => {
          if (socketRef.current === socket) {
            socketRef.current = null;
          }
          setConnectionState("disconnected");
          if (!closedByEffect) {
            reconnectTimer = window.setTimeout(connect, reconnectDelay);
            reconnectDelay = Math.min(Math.round(reconnectDelay * 1.8), 15000);
          }
        });

        socket.addEventListener("error", () => {
          setConnectionState("disconnected");
          if (socket.readyState === WebSocket.CONNECTING) {
            try {
              socket.close();
            } catch {
              // ignore close failures
            }
          }
        });
      } catch {
        setConnectionState("disconnected");
        if (!closedByEffect) {
          reconnectTimer = window.setTimeout(connect, reconnectDelay);
          reconnectDelay = Math.min(Math.round(reconnectDelay * 1.8), 15000);
        }
      }
    };

    connect();

    return () => {
      closedByEffect = true;
      if (reconnectTimer !== null) window.clearTimeout(reconnectTimer);
      socketRef.current?.close();
      socketRef.current = null;
    };
  }, [clientId, persistMetadata, sendMessage, sessionId, wsUrl]);

  useEffect(() => {
    if (!mode) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (
        event.target instanceof HTMLTextAreaElement ||
        event.target instanceof HTMLInputElement
      ) {
        return;
      }

      if (event.key === "ArrowRight" || event.key === "PageDown") {
        event.preventDefault();
        setSyncedSlideIndex(slideIndex + 1);
      }

      if (event.key === "ArrowLeft" || event.key === "PageUp") {
        event.preventDefault();
        setSyncedSlideIndex(slideIndex - 1);
      }

      if (event.key === "Escape") {
        event.preventDefault();
        setMode(null);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [mode, slideIndex, slides.length, setSyncedSlideIndex]);

  useEffect(() => {
    if (!mode) return;

    const timer = window.setInterval(() => {
      setElapsedSeconds((seconds) => seconds + 1);
    }, 1000);

    return () => window.clearInterval(timer);
  }, [mode]);

  useEffect(() => {
    const refresh = () => {
      void refreshMetadata({ quiet: true });
    };
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        refresh();
      }
    };

    const interval = window.setInterval(refresh, 2000);
    window.addEventListener("focus", refresh);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.clearInterval(interval);
      window.removeEventListener("focus", refresh);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [refreshMetadata]);

  const updateWsUrl = (value: string) => {
    setWsUrl(value);
    setPresentationWsUrl(value);
    setConnectionState(value ? "connecting" : "disconnected");
  };

  const updateSessionId = (value: string) => {
    setSessionId(value);
    setPresentationSessionId(value);
    setConnectionState(value ? "connecting" : "disconnected");
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsViewModalOpen(true)}
        className="inline-flex h-10 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600"
      >
        <LayoutPanelLeft className="h-4 w-4" />
        View
      </button>

      {mode && (
        <PresentationOverlay
          mode={mode}
          slides={slides}
          slideIndex={slideIndex}
          metadata={metadata}
          connectionState={connectionState}
          elapsedSeconds={elapsedSeconds}
          goNext={() => setSyncedSlideIndex(slideIndex + 1)}
          goPrev={() => setSyncedSlideIndex(slideIndex - 1)}
          close={() => setMode(null)}
          updateNote={updateNote}
        />
      )}

      <ViewModeModal
        open={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        onPresent={() => setMode("present")}
        onPresenter={() => setMode("presenter")}
        onNotes={() => {
          setIsViewModalOpen(false);
          setIsMetadataOpen(true);
        }}
      />

      <MetadataModal
        open={isMetadataOpen}
        slides={slides}
        metadata={metadata}
        sessionId={sessionId}
        wsUrl={wsUrl}
        connectionState={connectionState}
        notesSyncState={notesSyncState}
        onClose={() => setIsMetadataOpen(false)}
        onSessionIdChange={updateSessionId}
        onUpdateNote={updateNote}
        onWsUrlChange={updateWsUrl}
      />
    </>
  );
}
