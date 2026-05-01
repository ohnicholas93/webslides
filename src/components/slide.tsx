import { useEffect, useMemo, useRef, useState } from "react";

import CustomImage from "@/core/image";
import { usePresentationSettings } from "@/core/presentation-settings";
import { cn } from "@/lib/utils";

type PresentationSlideProps = {
  children: React.ReactNode;
  className?: string;
  headerTone?: "light" | "dark";
  title?: string;
};

export default function PresentationSlide({
  children,
  className,
  headerTone = "light",
  title,
}: PresentationSlideProps) {
  const { domSlideSize, settings } = usePresentationSettings();
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const baselineDevicePixelRatioRef = useRef<number | null>(null);
  const [slideNumber, setSlideNumber] = useState<number | null>(null);
  const [viewportScale, setViewportScale] = useState(1);
  const [containerWidth, setContainerWidth] = useState<number | null>(null);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;

    const updateSlideNumber = () => {
      const slides = Array.from(
        document.querySelectorAll<HTMLElement>("section[data-slide]")
      );
      const index = slides.indexOf(node);
      if (index !== -1) {
        setSlideNumber(index + 1);
      }
    };

    updateSlideNumber();

    const parent = node.parentElement;
    if (!parent) return;

    const observer = new MutationObserver(() => updateSlideNumber());
    observer.observe(parent, { childList: true });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    const update = () => {
      const rect = node.getBoundingClientRect();
      const viewportWidth =
        window.visualViewport?.width ?? document.documentElement.clientWidth;
      const visibleWidth =
        Math.min(rect.right, viewportWidth) - Math.max(rect.left, 0);
      const nextWidth =
        visibleWidth > 0 ? visibleWidth : Math.min(rect.width, viewportWidth);

      setContainerWidth(nextWidth);
    };
    update();

    const observer = new ResizeObserver(() => update());
    observer.observe(node);
    const visualViewport = window.visualViewport;
    visualViewport?.addEventListener("resize", update);

    return () => {
      observer.disconnect();
      visualViewport?.removeEventListener("resize", update);
    };
  }, []);

  useEffect(() => {
    const update = () => {
      if (!settings.safeAutoSizing) {
        setViewportScale(1);
        return;
      }

      const epsilon = 0.02;

      const vvScale = window.visualViewport?.scale;
      if (typeof vvScale === "number" && Number.isFinite(vvScale)) {
        const zoomed = Math.abs(vvScale - 1) > epsilon;
        if (zoomed) {
          setViewportScale(1);
          return;
        }
      } else {
        const currentDpr = window.devicePixelRatio || 1;
        if (baselineDevicePixelRatioRef.current === null) {
          baselineDevicePixelRatioRef.current = currentDpr;
        }
        const baselineDpr = baselineDevicePixelRatioRef.current;
        const zoomed = Math.abs(currentDpr - baselineDpr) > epsilon;
        if (zoomed) {
          setViewportScale(1);
          return;
        }
      }

      const cssHeaderHeight =
        typeof window === "undefined"
          ? 0
          : Number.parseFloat(
              getComputedStyle(document.documentElement).getPropertyValue(
                "--app-header-h"
              )
            ) || 0;

      const availableHeight = Math.max(0, window.innerHeight - cssHeaderHeight - 40);
      const availableWidth = Math.max(0, containerWidth ?? window.innerWidth);

      const heightScale = availableHeight / domSlideSize.height;
      const widthScale = availableWidth / domSlideSize.width;
      const nextScale = Math.min(heightScale, widthScale);

      setViewportScale(
        Number.isFinite(nextScale) && nextScale > 0 ? nextScale : 1
      );
    };

    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [containerWidth, domSlideSize.height, domSlideSize.width, settings.safeAutoSizing]);

  const formattedNumber =
    slideNumber !== null ? String(slideNumber).padStart(2, "0") : null;

  const scaledSize = useMemo(
    () => ({
      width: Math.max(1, Math.round(domSlideSize.width * viewportScale)),
      height: Math.max(1, Math.round(domSlideSize.height * viewportScale)),
    }),
    [domSlideSize.height, domSlideSize.width, viewportScale]
  );

  return (
    <div
      ref={containerRef}
      className="grid w-full min-w-0 justify-self-stretch justify-center"
    >
      <div
        className="relative rounded-[1.15rem] border border-slate-300/70 bg-white shadow-[0_22px_70px_rgba(15,23,42,0.14)]"
        style={{ width: scaledSize.width, height: scaledSize.height }}
      >
        <div
          style={{
            width: domSlideSize.width,
            height: domSlideSize.height,
            transform: `scale(${viewportScale})`,
            transformOrigin: "top left",
          }}
        >
          <section
            ref={sectionRef}
            data-slide
            data-slide-title={title ?? ""}
            style={{
              width: domSlideSize.width,
              height: domSlideSize.height,
            }}
            className={cn(
              "relative grid overflow-hidden bg-white px-14 pt-12 pb-12 text-slate-950",
              "grid-rows-[auto_1fr]",
              className
            )}
          >
            <div className="relative z-50 mb-8 grid w-full grid-cols-[1fr_auto] items-start gap-6 px-0.5">
              <div
              className={cn(
                  "flex items-center gap-3 text-xl uppercase tracking-[0.35em]",
                  headerTone === "dark" ? "text-white/58" : "text-slate-500"
                )}
              >
                {formattedNumber && title && (
                  <span
                    className={cn(
                      "font-semibold tracking-[0.4em]",
                      headerTone === "dark" ? "text-white" : "text-slate-900"
                    )}
                  >
                    {formattedNumber}
                  </span>
                )}
                {title && formattedNumber && <span aria-hidden="true">—</span>}
                <span>{title}</span>
              </div>
              <div className="relative z-50 mr-0.5 grid w-max place-items-center overflow-visible">
                <div className="absolute inset-x-0 top-1/2 h-10 -translate-y-1/2 rounded-full bg-white/70 blur-xl" />
                <CustomImage
                  path="assets/logo.png"
                  className="relative z-10 h-14 w-max border-0 text-[11px] uppercase tracking-[0.3em]"
                />
              </div>
            </div>
            <div className="relative z-50 flex min-h-0 w-full flex-1 flex-col">
              {children}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
