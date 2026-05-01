"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Clock3,
  Download,
  FileJson,
  Maximize2,
  MonitorPlay,
  PanelRightOpen,
  PlugZap,
  Upload,
  X,
} from "lucide-react";

import { usePresentationSettings } from "@/core/presentation-settings";
import {
  createDefaultMetadata,
  getPresenterNote,
  normalizeMetadata,
  PRESENTATION_METADATA_STORAGE_KEY,
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

type SlideSnapshot = {
  html: string;
  title: string;
};

function downloadJson(value: unknown, fileName: string) {
  const blob = new Blob([JSON.stringify(value, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function clampSlideIndex(index: number, slideCount: number) {
  if (slideCount <= 0) return 0;
  if (!Number.isFinite(index)) return 0;
  return Math.min(Math.max(index, 0), slideCount - 1);
}

function getDeckBaseName() {
  const sanitized = document.title
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);

  return sanitized || "webslides";
}

function readStoredMetadata() {
  const fallback = createDefaultMetadata();
  const raw = window.localStorage.getItem(PRESENTATION_METADATA_STORAGE_KEY);
  if (!raw) return fallback;

  try {
    return normalizeMetadata(JSON.parse(raw), fallback);
  } catch {
    return fallback;
  }
}

function getSlideSnapshots() {
  return Array.from(document.querySelectorAll<HTMLElement>("main section[data-slide]"))
    .map((slide, index) => ({
      html: slide.outerHTML,
      title: slide.dataset.slideTitle || `Slide ${index + 1}`,
    }));
}

function SlidePreview({
  slide,
  scale,
  className,
}: {
  slide?: SlideSnapshot;
  scale: number;
  className?: string;
}) {
  const { domSlideSize } = usePresentationSettings();

  if (!slide) {
    return (
      <div className="grid min-h-80 place-items-center rounded-[2rem] border border-white/10 bg-white/5 text-xl text-white/60">
        No slide selected
      </div>
    );
  }

  return (
    <div
      className={cn("relative overflow-hidden rounded-[2rem]", className)}
      style={{
        width: Math.round(domSlideSize.width * scale),
        height: Math.round(domSlideSize.height * scale),
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
}

function RuntimeButton({
  children,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      className={cn(
        "inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/10 px-4 text-xl font-semibold text-white shadow-[0_20px_70px_rgba(0,0,0,0.22)] backdrop-blur transition hover:bg-white/16 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-200 disabled:cursor-not-allowed disabled:opacity-40",
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

  const isPresenter = mode === "presenter";
  const slideAreaWidth = isPresenter
    ? Math.max(320, viewport.width - 520)
    : viewport.width;
  const slideAreaHeight = isPresenter
    ? Math.max(320, viewport.height - 176)
    : Math.max(320, viewport.height - 156);
  const scale = Math.min(
    1,
    (slideAreaWidth - 72) / domSlideSize.width,
    slideAreaHeight / domSlideSize.height
  );
  const currentSlide = slides[slideIndex];
  const nextSlide =
    slideIndex + 1 < slides.length ? slides[slideIndex + 1] : undefined;
  const slideNumber = slideIndex + 1;
  const minutes = Math.floor(elapsedSeconds / 60);
  const seconds = String(elapsedSeconds % 60).padStart(2, "0");
  const connectionLabel =
    connectionState === "connected"
      ? "WS live"
      : connectionState === "connecting"
        ? "WS connecting"
        : "WS offline";

  return (
    <div
      className="fixed inset-0 z-[1000] overflow-hidden bg-[#08111f] text-white"
      data-presentation-runtime
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(50,213,255,0.22),transparent_32%),radial-gradient(circle_at_86%_12%,rgba(255,184,77,0.18),transparent_28%),linear-gradient(135deg,#08111f_0%,#0d1a2b_42%,#101010_100%)]" />
      <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(255,255,255,0.7)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.7)_1px,transparent_1px)] [background-size:44px_44px]" />

      <div className="relative z-10 grid h-full grid-rows-[auto_1fr_auto] gap-5 p-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-4">
            <div className="grid h-14 w-14 place-items-center rounded-2xl border border-cyan-200/20 bg-cyan-200/10">
              {isPresenter ? (
                <PanelRightOpen className="h-7 w-7 text-cyan-100" />
              ) : (
                <MonitorPlay className="h-7 w-7 text-cyan-100" />
              )}
            </div>
            <div className="min-w-0">
              <p className="text-xl font-semibold uppercase tracking-[0.28em] text-cyan-100/70">
                {isPresenter ? "Presenter View" : "Live Presentation"}
              </p>
              <h2 className="truncate text-3xl font-bold tracking-tight">
                {currentSlide?.title ?? "WebSlides"}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-2 rounded-2xl border border-white/10 bg-white/8 px-4 py-2 text-xl text-white/72 md:flex">
              <PlugZap className="h-5 w-5" />
              {connectionLabel}
            </div>
            <div className="hidden items-center gap-2 rounded-2xl border border-white/10 bg-white/8 px-4 py-2 text-xl text-white/72 md:flex">
              <Clock3 className="h-5 w-5" />
              {minutes}:{seconds}
            </div>
            <RuntimeButton onClick={close} aria-label="Close presentation">
              <X className="h-5 w-5" />
              Close
            </RuntimeButton>
          </div>
        </div>

        <div
          className={cn(
            "grid min-h-0 items-center gap-6",
            isPresenter ? "grid-cols-[minmax(0,1fr)_460px]" : "grid-cols-1"
          )}
        >
          <div className="grid min-h-0 place-items-center">
            <SlidePreview
              slide={currentSlide}
              scale={scale}
              className="shadow-[0_50px_140px_rgba(0,0,0,0.48)]"
            />
          </div>

          {isPresenter && (
            <aside className="grid h-full min-h-0 grid-rows-[auto_minmax(0,1fr)_auto] overflow-hidden rounded-[2rem] border border-white/12 bg-white/[0.075] p-5 shadow-[0_40px_120px_rgba(0,0,0,0.28)] backdrop-blur-2xl">
              <div>
                <p className="text-xl font-semibold uppercase tracking-[0.24em] text-amber-100/70">
                  Speaker Notes
                </p>
                <p className="mt-2 text-2xl font-bold">
                  Slide {slideNumber} of {Math.max(slides.length, 1)}
                </p>
              </div>

              <textarea
                value={getPresenterNote(metadata, slideNumber)}
                onChange={(event) => updateNote(slideNumber, event.target.value)}
                placeholder="Write presenter notes for this slide..."
                className="mt-5 min-h-0 resize-none rounded-[1.5rem] border border-white/12 bg-black/24 p-5 text-xl leading-relaxed text-white outline-none transition placeholder:text-white/36 focus:border-cyan-200/60 focus:bg-black/32"
              />

              <div className="mt-5 rounded-[1.5rem] border border-white/10 bg-black/20 p-4">
                <p className="text-xl font-semibold uppercase tracking-[0.2em] text-white/50">
                  Next
                </p>
                <div className="mt-3 grid grid-cols-[120px_1fr] items-center gap-4">
                  <SlidePreview
                    slide={nextSlide}
                    scale={Math.min(0.1, 120 / domSlideSize.width)}
                    className="rounded-xl"
                  />
                  <p className="line-clamp-3 text-xl text-white/78">
                    {nextSlide?.title ?? "End of deck"}
                  </p>
                </div>
              </div>
            </aside>
          )}
        </div>

        <div className="flex items-center justify-between gap-4">
          <RuntimeButton onClick={goPrev} disabled={slideIndex <= 0}>
            <ChevronLeft className="h-5 w-5" />
            Previous
          </RuntimeButton>
          <div className="rounded-full border border-white/10 bg-white/8 px-5 py-2 text-xl font-semibold text-white/72">
            {slideNumber} / {Math.max(slides.length, 1)}
          </div>
          <RuntimeButton onClick={goNext} disabled={slideIndex >= slides.length - 1}>
            Next
            <ChevronRight className="h-5 w-5" />
          </RuntimeButton>
        </div>
      </div>
    </div>
  );
}

function MetadataModal({
  open,
  slides,
  metadata,
  sessionId,
  clientId,
  wsUrl,
  connectionState,
  onClose,
  onImport,
  onDownload,
  onSessionIdChange,
  onUpdateNote,
  onWsUrlChange,
}: {
  open: boolean;
  slides: SlideSnapshot[];
  metadata: PresentationMetadata;
  sessionId: string;
  clientId: string;
  wsUrl: string;
  connectionState: ConnectionState;
  onClose: () => void;
  onImport: (file: File) => void;
  onDownload: () => void;
  onSessionIdChange: (value: string) => void;
  onUpdateNote: (slideNumber: number, notes: string) => void;
  onWsUrlChange: (value: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[900] grid place-items-center bg-slate-950/50 px-5 py-8 backdrop-blur">
      <div className="grid max-h-[92vh] w-full max-w-6xl grid-rows-[auto_minmax(0,1fr)] overflow-hidden rounded-[2rem] border border-slate-200 bg-[#f8faf7] text-slate-950 shadow-2xl">
        <div className="flex items-start justify-between gap-5 border-b border-slate-200 bg-white/80 p-6">
          <div>
            <p className="text-xl font-semibold uppercase tracking-[0.24em] text-slate-500">
              Metadata Studio
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight">
              Presenter notes and session sync
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid h-11 w-11 place-items-center rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50"
            aria-label="Close metadata"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="grid min-h-0 grid-cols-[360px_1fr] gap-5 overflow-hidden p-6">
          <div className="flex min-h-0 flex-col gap-4">
            <label className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm">
              <span className="text-xl font-semibold text-slate-500">
                Session ID
              </span>
              <input
                value={sessionId}
                onChange={(event) => onSessionIdChange(event.target.value)}
                className="mt-3 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 font-mono text-xl text-slate-900 outline-none focus:border-slate-400"
              />
            </label>
            <div className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-xl font-semibold text-slate-500">Client ID</p>
              <p className="mt-2 break-all font-mono text-xl text-slate-900">
                {clientId}
              </p>
            </div>
            <label className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm">
              <span className="text-xl font-semibold text-slate-500">
                WebSocket URL
              </span>
              <input
                value={wsUrl}
                onChange={(event) => onWsUrlChange(event.target.value)}
                className="mt-3 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 font-mono text-xl text-slate-900 outline-none focus:border-slate-400"
              />
            </label>
            <div className="rounded-[1.5rem] border border-slate-200 bg-white p-5 text-xl text-slate-600 shadow-sm">
              Status:{" "}
              <span className="font-semibold text-slate-950">
                {connectionState}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-4 py-3 text-xl font-semibold text-white shadow-sm transition hover:bg-slate-800"
              >
                <Upload className="h-5 w-5" />
                Open
              </button>
              <button
                type="button"
                onClick={onDownload}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-xl font-semibold text-slate-900 shadow-sm transition hover:bg-slate-50"
              >
                <Download className="h-5 w-5" />
                Download
              </button>
            </div>
            <input
              ref={inputRef}
              type="file"
              accept="application/json,.json"
              className="hidden"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) onImport(file);
                event.currentTarget.value = "";
              }}
            />
          </div>

          <div className="min-h-0 overflow-y-auto pr-2">
            <div className="grid gap-4">
              {slides.map((slide, index) => {
                const slideNumber = index + 1;

                return (
                  <label
                    key={`${slide.title}-${slideNumber}`}
                    className="grid gap-3 rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm"
                  >
                    <span className="flex items-center justify-between gap-3">
                      <span className="text-2xl font-bold text-slate-950">
                        {String(slideNumber).padStart(2, "0")} · {slide.title}
                      </span>
                    </span>
                    <textarea
                      value={getPresenterNote(metadata, slideNumber)}
                      onChange={(event) =>
                        onUpdateNote(slideNumber, event.target.value)
                      }
                      placeholder="Presenter notes..."
                      className="min-h-36 resize-y rounded-2xl border border-slate-200 bg-slate-50 p-4 text-xl leading-relaxed text-slate-900 outline-none focus:border-slate-400"
                    />
                  </label>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PresentationRuntimeControls() {
  const { themeStyles } = usePresentationSettings();
  const [mode, setModeState] = useState<RuntimeMode>(() => {
    if (typeof window === "undefined") return null;
    const view = new URLSearchParams(window.location.search).get("webslidesView");
    if (view === "presenter") return "presenter";
    if (view === "present") return "present";
    return null;
  });
  const [isMetadataOpen, setIsMetadataOpen] = useState(false);
  const [slides, setSlides] = useState<SlideSnapshot[]>([]);
  const [slideIndex, setSlideIndex] = useState(0);
  const [metadata, setMetadata] = useState<PresentationMetadata>(() =>
    typeof window === "undefined" ? createDefaultMetadata() : readStoredMetadata()
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
    useState<ConnectionState>("disconnected");
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const socketRef = useRef<WebSocket | null>(null);
  const metadataRef = useRef(metadata);
  const modeRef = useRef(mode);
  const slidesLengthRef = useRef(slides.length);

  const setMode = (nextMode: RuntimeMode) => {
    if (nextMode) {
      setElapsedSeconds(0);
    }
    setModeState(nextMode);
  };

  const persistMetadata = (next: PresentationMetadata) => {
    window.localStorage.setItem(
      PRESENTATION_METADATA_STORAGE_KEY,
      JSON.stringify(next)
    );
  };

  const sendMessage = useCallback((message: PresentationSessionMessage) => {
    const socket = socketRef.current;
    if (!socket || socket.readyState !== WebSocket.OPEN) return;
    socket.send(JSON.stringify(message));
  }, []);

  const applyMetadata = (next: PresentationMetadata, shouldBroadcast = true) => {
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
    fetch("/metadata.json")
      .then((response) => (response.ok ? response.json() : null))
      .then((json) => {
        const stored = window.localStorage.getItem(
          PRESENTATION_METADATA_STORAGE_KEY
        );
        if (stored || !json) return;
        const seeded = normalizeMetadata(json);
        setMetadata(seeded);
        persistMetadata(seeded);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    metadataRef.current = metadata;
  }, [metadata]);

  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);

  useEffect(() => {
    slidesLengthRef.current = slides.length;
  }, [slides.length]);

  useEffect(() => {
    const updateSlides = () => {
      const snapshots = getSlideSnapshots();
      setSlides(snapshots);
      setSlideIndex((current) => clampSlideIndex(current, snapshots.length));
    };

    updateSlides();
    const frame = window.requestAnimationFrame(updateSlides);
    const observer = new MutationObserver(updateSlides);
    const main = document.querySelector("main");
    if (main) {
      observer.observe(main, { childList: true, subtree: true });
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

    const connect = () => {
      setConnectionState("connecting");

      try {
        const socket = new WebSocket(wsUrl);
        socketRef.current = socket;

        socket.addEventListener("open", () => {
          setConnectionState("connected");
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
            reconnectTimer = window.setTimeout(connect, 1800);
          }
        });

        socket.addEventListener("error", () => {
          setConnectionState("disconnected");
        });
      } catch {
        setConnectionState("disconnected");
        reconnectTimer = window.setTimeout(connect, 1800);
      }
    };

    connect();

    return () => {
      closedByEffect = true;
      if (reconnectTimer !== null) window.clearTimeout(reconnectTimer);
      socketRef.current?.close();
      socketRef.current = null;
    };
  }, [clientId, sendMessage, sessionId, wsUrl]);

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

  const openPresenterView = () => {
    const url = new URL(window.location.href);
    url.searchParams.set("webslidesView", "presenter");
    window.open(
      url.toString(),
      "webslides-presenter",
      "popup=yes,width=1440,height=960"
    );
  };

  const importMetadata = async (file: File) => {
    const text = await file.text();
    const next = normalizeMetadata(JSON.parse(text), metadata);
    applyMetadata(next);
  };

  const updateWsUrl = (value: string) => {
    setWsUrl(value);
    setPresentationWsUrl(value);
  };

  const updateSessionId = (value: string) => {
    setSessionId(value);
    setPresentationSessionId(value);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setMode("present")}
        className={cn(
          themeStyles.appControlClass,
          "inline-flex h-10 items-center gap-2 rounded-xl px-3 text-xl font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
        )}
      >
        <Maximize2 className="h-5 w-5" />
        Present
      </button>
      <button
        type="button"
        onClick={openPresenterView}
        className={cn(
          themeStyles.appControlClass,
          "inline-flex h-10 items-center gap-2 rounded-xl px-3 text-xl font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
        )}
      >
        <PanelRightOpen className="h-5 w-5" />
        Presenter
      </button>
      <button
        type="button"
        onClick={() => setIsMetadataOpen(true)}
        className={cn(
          themeStyles.appControlClass,
          "inline-grid h-10 w-10 place-items-center rounded-xl p-2 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
        )}
        aria-label="Open presentation metadata"
      >
        <FileJson className="h-5 w-5" />
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

      <MetadataModal
        open={isMetadataOpen}
        slides={slides}
        metadata={metadata}
        sessionId={sessionId}
        clientId={clientId}
        wsUrl={wsUrl}
        connectionState={connectionState}
        onClose={() => setIsMetadataOpen(false)}
        onImport={importMetadata}
        onDownload={() =>
          downloadJson(metadata, `${getDeckBaseName()}-metadata.json`)
        }
        onSessionIdChange={updateSessionId}
        onUpdateNote={updateNote}
        onWsUrlChange={updateWsUrl}
      />
    </>
  );
}
