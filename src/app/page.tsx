"use client";

import {
  BarChart3,
  Brush,
  CheckCircle2,
  Download,
  LayoutGrid,
  Palette,
  Settings2,
  Sparkles,
  Target,
} from "lucide-react";

import CustomImage from "@/core/image";
import PresentationSlide from "@/components/slide";
import { usePresentationSettings } from "@/core/presentation-settings";
import { cn } from "@/lib/utils";
import StageTimeline from "@/components/stage-timeline";

export default function Home() {
  const { settings, themeStyles } = usePresentationSettings();
  const {
    chipClass,
    cardClass,
    accentCardClass,
    critiqueCardClass,
    figureCardClass,
    iconBadgeClass,
    statCardClass,
    softCardClass,
  } = themeStyles;

  return (
    <main className="flex flex-col items-center gap-12 px-8 pt-4 pb-16">
      <div className="flex w-full flex-col items-center gap-12">
        <PresentationSlide title="Demo Deck" className="bg-slate-50">
          <div className="flex h-full flex-col justify-between">
            <div className="flex flex-row items-start gap-12">
              <div className="flex w-2/3 flex-col gap-8">
                <div className="flex flex-wrap items-center gap-3">
                  <span className={chipClass}>
                    <Sparkles className="h-4 w-4" />
                    Reusable template
                  </span>
                  <span className={chipClass}>
                    <LayoutGrid className="h-4 w-4" />
                    Component-first
                  </span>
                  <span className={chipClass}>
                    <Download className="h-4 w-4" />
                    Export-ready
                  </span>
                </div>

                <h1 className="text-5xl font-bold leading-tight text-slate-900">
                  WebSlides
                  <br />
                  <span className="font-light text-slate-700">
                    A polished, open-source deck template
                  </span>
                </h1>

                <p className="max-w-3xl text-2xl leading-relaxed text-slate-600">
                  This starter deck showcases the slide layout, theme tokens,
                  settings panel, and PNG export flow—without any
                  presentation-specific content.
                </p>
              </div>

              <div
                className={cn(
                  cardClass,
                  "w-1/3 border-l-4 border-l-indigo-500 p-6"
                )}
              >
                <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                  Quick Start
                </p>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className={cn(iconBadgeClass, "h-10 w-10")}>
                      <Brush className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-base font-semibold text-slate-900">
                        Edit slides
                      </p>
                      <p className="text-sm text-slate-500">
                        Replace content in{" "}
                        <span className="font-mono">page.tsx</span>.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className={cn(iconBadgeClass, "h-10 w-10")}>
                      <Settings2 className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-base font-semibold text-slate-900">
                        Tune settings
                      </p>
                      <p className="text-sm text-slate-500">
                        Aspect ratio, resolution, theme.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className={cn(iconBadgeClass, "h-10 w-10")}>
                      <Download className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-base font-semibold text-slate-900">
                        Export PNGs
                      </p>
                      <p className="text-sm text-slate-500">
                        Use the Export button in the header.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 border-t border-slate-100 pt-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                    Current Theme
                  </p>
                  <p className="mt-1 text-xl font-semibold text-slate-900">
                    {settings.theme}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-5">
              <div className={statCardClass}>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                  Slide System
                </p>
                <p className="mt-2 text-4xl font-bold text-slate-900">1</p>
                <p className="mt-2 text-sm text-slate-500">
                  layout + scaling engine
                </p>
              </div>
              <div className={statCardClass}>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                  Themes
                </p>
                <p className="mt-2 text-4xl font-bold text-slate-900">3</p>
                <p className="mt-2 text-sm text-slate-500">
                  Aurora / Mono / Custom
                </p>
              </div>
              <div className={statCardClass}>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                  Export
                </p>
                <p className="mt-2 text-4xl font-bold text-slate-900">PNG</p>
                <p className="mt-2 text-sm text-slate-500">
                  download every slide
                </p>
              </div>
            </div>
          </div>
        </PresentationSlide>

        <PresentationSlide title="Layout + Components">
          <div className="flex h-full flex-row items-center gap-8">
            <div className="flex w-[45%] h-full flex-col gap-6">
              <div className={cn(figureCardClass, "h-max py-6 grow")}>
                <CustomImage
                  path="assets/sample-pexels.jpg"
                  className="w-full h-full object-contain"
                />
              </div>
              <p className="text-center text-sm italic text-slate-500">
                Example media slot (served from{" "}
                <span className="font-mono">public/assets</span>).
              </p>

              <div className="grid grid-cols-2 gap-4">
                <div className={cn(softCardClass, "flex items-center gap-4")}>
                  <div className={cn(iconBadgeClass, "h-12 w-12")}>
                    <LayoutGrid className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-slate-900">
                      Structure
                    </p>
                    <p className="mt-1 text-slate-600">
                      Slides are standard React components.
                    </p>
                  </div>
                </div>
                <div className={cn(softCardClass, "flex items-center gap-4")}>
                  <div className={cn(iconBadgeClass, "h-12 w-12")}>
                    <Target className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-slate-900">
                      Consistency
                    </p>
                    <p className="mt-1 text-slate-600">
                      Reuse cards, chips, stats, and grids.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex w-[55%] flex-col gap-6">
              <div className={accentCardClass + " relative overflow-hidden"}>
                <div className="absolute -right-14 -bottom-14 opacity-5">
                  <BarChart3 className="h-80 w-80 text-indigo-600" />
                </div>
                <p className="text-sm font-bold uppercase tracking-[0.2em] text-indigo-500">
                  What this deck demonstrates
                </p>
                <h3 className="mt-3 text-4xl font-bold text-slate-900">
                  A complete slide toolchain
                </h3>
                <p className="mt-4 text-xl leading-relaxed text-slate-700">
                  Theme-aware tokens, responsive auto-sizing, and a built-in
                  export path—designed to stay out of the way while you present.
                </p>

                <div className="mt-6 flex flex-wrap gap-3">
                  <span className={chipClass}>
                    <Palette className="h-4 w-4" />
                    Theme styles
                  </span>
                  <span className={chipClass}>
                    <Settings2 className="h-4 w-4" />
                    Cookie-backed settings
                  </span>
                  <span className={chipClass}>
                    <Download className="h-4 w-4" />
                    Export pipeline
                  </span>
                </div>
              </div>

              <div className={cardClass}>
                <div className="flex items-center gap-4 text-slate-500">
                  <div className="rounded-xl bg-indigo-50 p-2 text-indigo-600">
                    <CheckCircle2 className="h-6 w-6" />
                  </div>
                  <p className="text-sm font-semibold uppercase tracking-[0.2em]">
                    Practical guidance
                  </p>
                </div>
                <p className="mt-4 text-lg leading-relaxed text-slate-700">
                  Keep each slide focused: one big idea, one strong visual, and a
                  small number of supporting facts.
                </p>
                <div className="mt-6 space-y-2">
                  <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3">
                    <span className="font-mono text-sm text-slate-700">
                      src/app/page.tsx
                    </span>
                    <span className="text-sm text-slate-500">your content</span>
                  </div>
                  <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3">
                    <span className="font-mono text-sm text-slate-700">
                      public/assets/
                    </span>
                    <span className="text-sm text-slate-500">your images</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </PresentationSlide>

        <PresentationSlide title="Themes + Settings">
          <div className="flex h-full flex-col justify-center gap-6">
            <div className="grid grid-cols-3 gap-4">
              <div className={cardClass}>
                <div className="flex items-center gap-4 text-slate-500">
                  <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600">
                    <Palette className="h-6 w-6" />
                  </div>
                  <p className="text-sm font-semibold uppercase tracking-[0.2em]">
                    Theme Tokens
                  </p>
                </div>
                <p className="mt-4 text-lg leading-relaxed text-slate-700">
                  Visual language is derived from a small set of theme classes.
                </p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <span className={chipClass}>cardClass</span>
                  <span className={chipClass}>accentCardClass</span>
                  <span className={chipClass}>critiqueCardClass</span>
                  <span className={chipClass}>statCardClass</span>
                </div>
              </div>

              <div className={cardClass}>
                <div className="flex items-center gap-4 text-slate-500">
                  <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600">
                    <Settings2 className="h-6 w-6" />
                  </div>
                  <p className="text-sm font-semibold uppercase tracking-[0.2em]">
                    Settings UI
                  </p>
                </div>
                <p className="mt-4 text-lg leading-relaxed text-slate-700">
                  Aspect ratio, resolution, theme, and safe auto-sizing are saved
                  in cookies.
                </p>
                <div className="mt-6 space-y-2 text-sm text-slate-600">
                  <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-2">
                    <span className="font-mono">Aspect</span>
                    <span className="font-semibold">{settings.aspectRatio}</span>
                  </div>
                  <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-2">
                    <span className="font-mono">Resolution</span>
                    <span className="font-semibold">{settings.resolution}</span>
                  </div>
                </div>
              </div>

              <div className={cardClass}>
                <div className="flex items-center gap-4 text-slate-500">
                  <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600">
                    <Download className="h-6 w-6" />
                  </div>
                  <p className="text-sm font-semibold uppercase tracking-[0.2em]">
                    Export Workflow
                  </p>
                </div>
                <p className="mt-4 text-lg leading-relaxed text-slate-700">
                  Export walks the DOM and downloads each section as a PNG.
                </p>
                <div className="mt-6 rounded-2xl border border-slate-200 bg-white px-4 py-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                    Tip
                  </p>
                  <p className="mt-1 text-sm text-slate-600">
                    Use consistent spacing and typography to keep exports clean.
                  </p>
                </div>
              </div>
            </div>

            <div className={critiqueCardClass}>
              <div className="absolute right-0 top-0 p-4 opacity-10">
                <Sparkles className="h-24 w-24 text-rose-500" />
              </div>
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-rose-600">
                Template Note
              </p>
              <p className="text-lg font-medium leading-relaxed text-slate-800">
                For a new deck, you should only have to change{" "}
                <span className="font-mono">src/app/page.tsx</span> and images in{" "}
                <span className="font-mono">public/assets</span>. Everything else is
                intended to stay reusable.
              </p>
            </div>
            
            <StageTimeline activeStage={3} />
          </div>
        </PresentationSlide>
      </div>
    </main>
  );
}

