"use client";

import { createPortal } from "react-dom";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Clock3,
  Download,
  FileJson,
  Maximize2,
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
        "inline-flex h-10 items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/10 px-3 text-base font-semibold text-white shadow-[0_20px_70px_rgba(0,0,0,0.22)] backdrop-blur transition hover:bg-white/16 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-200 disabled:cursor-not-allowed disabled:opacity-40",
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
  const isPresenter = mode === "presenter";
  const isPresent = mode === "present";

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
    1,
    (Math.max(320, viewport.width - 520) - 72) / domSlideSize.width,
    Math.max(320, viewport.height - 176) / domSlideSize.height
  );
  const presentScale = Math.min(
    1,
    (Math.max(320, viewport.width) - 48) / domSlideSize.width,
    (Math.max(320, viewport.height) - 48) / domSlideSize.height
  );
  const scale = isPresenter ? presenterScale : presentScale;
  const minutes = Math.floor(elapsedSeconds / 60);
  const seconds = String(elapsedSeconds % 60).padStart(2, "0");
  const connectionLabel =
    connectionState === "connected"
      ? "WS live"
      : connectionState === "connecting"
        ? "WS connecting"
        : "WS offline";

  if (isPresent) {
    return createPortal(
      <div
        className="fixed inset-0 z-[1000] overflow-hidden bg-[#08111f] text-white"
        data-presentation-runtime
      >
        <div className="absolute inset-0 bg-[#08111f]" />
        <div className="relative z-10 flex h-full items-center justify-center p-6">
          <SlidePreview
            slide={currentSlide}
            scale={scale}
            className="rounded-none shadow-none"
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
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(50,213,255,0.22),transparent_32%),radial-gradient(circle_at_86%_12%,rgba(255,184,77,0.18),transparent_28%),linear-gradient(135deg,#08111f_0%,#0d1a2b_42%,#101010_100%)]" />
      <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(255,255,255,0.7)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.7)_1px,transparent_1px)] [background-size:44px_44px]" />

      <div className="relative z-10 grid h-full grid-rows-[auto_1fr_auto] gap-4 p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-2xl border border-cyan-200/20 bg-cyan-200/10">
              <PanelRightOpen className="h-7 w-7 text-cyan-100" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold uppercase tracking-[0.32em] text-cyan-100/70">
                Presenter View
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden items-center gap-2 rounded-2xl border border-white/10 bg-white/8 px-3 py-2 text-base text-white/72 md:flex">
              <PlugZap className="h-5 w-5" />
              {connectionLabel}
            </div>
            <div className="hidden items-center gap-2 rounded-2xl border border-white/10 bg-white/8 px-3 py-2 text-base text-white/72 md:flex">
              <Clock3 className="h-5 w-5" />
              {minutes}:{seconds}
            </div>
            <RuntimeButton onClick={close} aria-label="Close presentation">
              <X className="h-5 w-5" />
              Close
            </RuntimeButton>
          </div>
        </div>

        <div className="grid min-h-0 grid-cols-[minmax(0,1fr)_400px] items-center gap-4">
          <div className="grid min-h-0 place-items-center">
            <SlidePreview
              slide={currentSlide}
              scale={scale}
              className="rounded-none shadow-[0_50px_140px_rgba(0,0,0,0.48)]"
            />
          </div>

          <aside className="grid h-full min-h-0 grid-rows-[auto_minmax(0,1fr)_auto] overflow-hidden rounded-[1.5rem] border border-white/12 bg-white/[0.075] p-4 shadow-[0_40px_120px_rgba(0,0,0,0.28)] backdrop-blur-2xl">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-amber-100/70">
                Speaker Notes
              </p>
              <p className="mt-1 text-lg font-semibold text-white">
                Slide {slideNumber} of {Math.max(slides.length, 1)}
              </p>
            </div>

            <textarea
              value={getPresenterNote(metadata, slideNumber)}
              onChange={(event) => updateNote(slideNumber, event.target.value)}
              placeholder="Write presenter notes for this slide..."
              className="mt-4 min-h-0 resize-none rounded-[1.25rem] border border-white/12 bg-black/24 p-4 text-lg leading-relaxed text-white outline-none transition placeholder:text-white/36 focus:border-cyan-200/60 focus:bg-black/32"
            />

            <div className="mt-4 rounded-[1.25rem] border border-white/10 bg-black/20 p-3">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/50">
                Next
              </p>
              <div className="mt-3 grid grid-cols-[100px_1fr] items-center gap-3">
                <SlidePreview
                  slide={nextSlide}
                  scale={Math.min(0.085, 100 / domSlideSize.width)}
                  className="rounded-xl"
                />
                {nextSlide ? (
                  <p className="line-clamp-3 text-base text-white/78">
                    {nextSlide.title}
                  </p>
                ) : (
                  <div className="rounded-[1rem] border border-white/10 bg-black/20 px-4 py-4">
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-white/50">
                      End of deck
                    </p>
                    <p className="mt-2 text-base text-white/72">
                      No next slide.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </aside>
        </div>

        <div className="flex items-center justify-between gap-3">
          <RuntimeButton onClick={goPrev} disabled={slideIndex <= 0}>
            <ChevronLeft className="h-5 w-5" />
            Previous
          </RuntimeButton>
          <div className="rounded-full border border-white/10 bg-white/8 px-4 py-2 text-base font-semibold text-white/72">
            {slideNumber} / {Math.max(slides.length, 1)}
          </div>
          <RuntimeButton onClick={goNext} disabled={slideIndex >= slides.length - 1}>
            Next
            <ChevronRight className="h-5 w-5" />
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
  const [mode, setModeState] = useState<RuntimeMode>(null);
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
    useState<ConnectionState>("connecting");
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

    const url = new URL(window.location.href);
    if (nextMode) {
      url.searchParams.set("webslidesView", nextMode);
    } else {
      url.searchParams.delete("webslidesView");
    }
    window.history.replaceState({}, "", url);
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

  const importMetadata = async (file: File) => {
    const text = await file.text();
    const next = normalizeMetadata(JSON.parse(text), metadata);
    applyMetadata(next);
  };

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
        onClick={() => setMode("present")}
        className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600"
      >
        <Maximize2 className="h-4 w-4" />
        Present
      </button>
      <button
        type="button"
        onClick={() => setMode("presenter")}
        className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600"
      >
        <PanelRightOpen className="h-4 w-4" />
        Presenter
      </button>
      <button
        type="button"
        onClick={() => setIsMetadataOpen(true)}
        className="inline-grid h-10 w-10 place-items-center rounded-xl border border-slate-200 bg-white p-2 text-slate-700 shadow-sm transition hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600"
        aria-label="Open presentation metadata"
      >
        <FileJson className="h-4 w-4" />
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
