import { useEffect, useMemo, useRef, useState } from "react";

import CustomImage from "@/core/image";
import { usePresentationSettings } from "@/core/presentation-settings";
import { cn } from "@/lib/utils";

type PresentationSlideProps = {
  children: React.ReactNode;
  className?: string;
  hideLogo?: boolean;
  title?: string;
};

export default function PresentationSlide({
  children,
  className,
  title,
  hideLogo = false,
}: PresentationSlideProps) {
  const { domSlideSize, settings, themeStyles } = usePresentationSettings();
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

    const update = () => setContainerWidth(node.getBoundingClientRect().width);
    update();

    const observer = new ResizeObserver(() => update());
    observer.observe(node);
    return () => observer.disconnect();
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
      const nextScale = Math.min(1, heightScale, widthScale);

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
    <div ref={containerRef} className="grid w-full justify-center">
      <div
        className="relative"
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
            style={{
              width: domSlideSize.width,
              height: domSlideSize.height,
            }}
            className={cn(
              themeStyles.slideClass,
              "relative grid overflow-hidden px-16 pt-10 pb-16",
              "grid-rows-[auto_1fr]",
              className
            )}
          >
            <div className="relative z-50 mb-8 grid w-full grid-cols-[1fr_auto] items-start gap-6 px-0.5">
              <div
                className={cn(
                  themeStyles.slideMetaTextClass,
                  "flex items-center gap-3 text-xl uppercase tracking-[0.35em]"
                )}
              >
                {formattedNumber && title && (
                  <span
                    className={cn(
                      themeStyles.slideMetaNumberClass,
                      "font-semibold tracking-[0.4em]"
                    )}
                  >
                    {formattedNumber}
                  </span>
                )}
                {title && formattedNumber && <span aria-hidden="true">—</span>}
                <span>{title}</span>
              </div>
              {!hideLogo && (
                <div className="relative z-50 mr-0.5 grid w-max place-items-center overflow-visible">
                  <div
                    className="absolute w-full h-[80%] top-[12.5%] scale-200 z-10"
                    style={{
                      background: `radial-gradient(ellipse at center, ${themeStyles.logoHaloColor} 0%, transparent 60%)`,
                    }}
                  />
                  <CustomImage
                    path="assets/logo.png"
                    className="relative z-50 h-14 w-max border-0 text-[11px] uppercase tracking-[0.3em]"
                  />
                </div>
              )}
            </div>
            <div className="relative z-50 flex min-h-0 w-full flex-1 flex-col">
              {children}
            </div>
            <div className="absolute inset-0 z-10">
              <div className={themeStyles.slideBackgroundClass}></div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
