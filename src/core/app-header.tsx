"use client";

import { useEffect, useRef, useState } from "react";
import { Settings } from "lucide-react";

import SettingsModal from "@/core/settings-modal";
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
        className="shadow-sm"
      >
        <div className="mx-auto flex w-full items-center justify-between px-8 py-4">
          <div className="flex items-center gap-3 select-none">
            <div className="flex items-baseline gap-0 font-semibold tracking-tight">
              <span className="text-xl bg-gradient-to-r from-indigo-600 via-sky-500 to-fuchsia-500 bg-clip-text text-transparent">
                Web
              </span>
              <span className="text-xl rounded-lg leading-none text-slate-600 font-light scale-95">
                Slides
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <SlideExporter variant="header" />
            <button
              type="button"
              onClick={() => setIsSettingsOpen(true)}
              className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white/70 p-2 text-slate-700 shadow-sm transition hover:bg-white hover:text-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
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
