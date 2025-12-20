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
    <div ref={containerRef} className="w-full flex justify-center">
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
              "relative overflow-hidden px-20 pt-14 pb-16 flex flex-col",
              themeStyles.slideClass,
              className
            )}
          >
            <div className="relative w-full z-50 flex flex-row justify-between mb-4 basis-0 shrink-0 grow-0 px-0.5">
              <div
                className={cn(
                  "flex items-center gap-3 text-sm uppercase tracking-[0.5em]",
                  themeStyles.slideMetaTextClass
                )}
              >
                {formattedNumber && title && (
                  <span
                    className={cn(
                      "font-semibold tracking-[0.4em]",
                      themeStyles.slideMetaNumberClass
                    )}
                  >
                    {formattedNumber}
                  </span>
                )}
                {title && formattedNumber && <span aria-hidden="true">—</span>}
                <span>{title}</span>
              </div>
              {!hideLogo && (
                <div className="relative w-max z-50 overflow-visible justify-center items-center mr-0.5">
                  <div className="absolute w-full h-[80%] top-[12.5%] scale-200 z-10 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,1)_0%,transparent_60%)]"></div>
                  <CustomImage
                    path="assets/logo.png"
                    className="w-max h-14 flex items-center justify-center text-[11px] tracking-[0.3em] uppercase border-0 relative z-50"
                  />
                </div>
              )}
            </div>
            <div className="w-full z-50 flex-1 relative min-h-0">{children}</div>
            <div className="absolute inset-0 z-10">
              <div className={themeStyles.slideBackgroundClass}></div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
