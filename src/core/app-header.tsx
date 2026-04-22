"use client";

import { useEffect, useRef, useState } from "react";
import { Settings } from "lucide-react";

import SettingsModal from "@/core/settings-modal";
import SlideExporter from "@/core/slide-exporter";
import { usePresentationSettings } from "@/core/presentation-settings";
import { cn } from "@/lib/utils";

export default function AppHeader() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const { themeStyles } = usePresentationSettings();

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
        className={themeStyles.appHeaderClass}
      >
        <div className="mx-auto grid w-full grid-cols-[auto_minmax(0,1fr)] items-center gap-6 px-8 py-4">
          <div className="grid grid-cols-[1fr] items-center select-none">
            <div className="flex items-baseline gap-0 font-semibold tracking-tight">
              <span className={cn(themeStyles.appHeaderBrandPrimaryClass, "text-xl")}>
                Web
              </span>
              <span
                className={cn(
                  themeStyles.appHeaderBrandSecondaryClass,
                  "scale-95 rounded-lg text-xl leading-none font-light"
                )}
              >
                Slides
              </span>
            </div>
          </div>

          <div className="flex min-w-0 items-center justify-end gap-2">
            <SlideExporter variant="header" />
            <button
              type="button"
              onClick={() => setIsSettingsOpen(true)}
              className={cn(
                themeStyles.appControlClass,
                "inline-grid h-10 w-10 place-items-center rounded-xl p-2 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
              )}
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
