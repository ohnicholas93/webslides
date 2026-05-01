"use client";

import { useEffect, useRef, useState } from "react";
import { Settings } from "lucide-react";

import SettingsModal from "@/core/settings-modal";
import PresentationRuntimeControls from "@/core/presentation-runtime";
import SlideExporter from "@/core/slide-exporter";

export default function AppHeader() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const node = headerRef.current;
    if (!node) return;

    const update = () => {
      const height = Math.ceil(node.getBoundingClientRect().height);
      document.documentElement.style.setProperty("--app-header-h", `${height}px`);
    };

    update();

    const observer = new ResizeObserver(() => update());
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <header
        ref={headerRef}
        className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 text-slate-950 shadow-sm backdrop-blur-xl"
      >
        <div className="mx-auto grid w-full grid-cols-[auto_minmax(0,1fr)] items-center gap-6 px-8 py-4">
          <div className="grid grid-cols-[1fr] items-center select-none">
            <div className="flex items-baseline gap-0 font-semibold tracking-tight">
              <span className="text-xl text-slate-950">
                Web
              </span>
              <span
                className="scale-95 rounded-lg text-xl leading-none font-light text-cyan-700"
              >
                Slides
              </span>
            </div>
          </div>

          <div className="flex min-w-0 items-center justify-end gap-2">
            <PresentationRuntimeControls />
            <SlideExporter variant="header" />
            <button
              type="button"
              onClick={() => setIsSettingsOpen(true)}
              className="inline-grid h-10 w-10 place-items-center rounded-xl border border-slate-200 bg-white p-2 text-slate-700 shadow-sm transition hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600"
              aria-label="Open settings"
            >
              <Settings className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      <SettingsModal open={isSettingsOpen} onOpenChange={setIsSettingsOpen} />
    </>
  );
}
