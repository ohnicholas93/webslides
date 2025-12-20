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
import Latex from "@/components/latex";
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
    iconBadgeStrongClass,
    statCardClass,
    softCardClass,
    textBaseClass,
    textStrongClass,
    textMediumClass,
    textSoftClass,
    textMutedClass,
    textFaintClass,
    textAccentClass,
    textAccentStrongClass,
    textWarnClass,
    textWarnStrongClass,
    surfaceBgClass,
    surfaceSoftBgClass,
  } = themeStyles;

  return (
    <main className="flex flex-col items-center gap-12 px-8 pt-4 pb-16">
      <div className="flex w-full flex-col items-center gap-12">
        <PresentationSlide title="Demo Deck">
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

                <h1
                  className={cn(
                    "text-5xl font-bold leading-tight",
                    textStrongClass
                  )}
                >
                  WebSlides
                  <br />
                  <span className={cn("font-light", textMediumClass)}>
                    A polished, open-source deck template
                  </span>
                </h1>

                <p
                  className={cn(
                    "max-w-3xl text-2xl leading-relaxed",
                    textSoftClass
                  )}
                >
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
                <p
                  className={cn(
                    "mb-4 text-xs font-semibold uppercase tracking-[0.2em]",
                    textFaintClass
                  )}
                >
                  Quick Start
                </p>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className={cn(iconBadgeClass, "h-10 w-10")}>
                      <Brush className="h-5 w-5" />
                    </div>
                    <div>
                      <p
                        className={cn(
                          "text-base font-semibold",
                          textStrongClass
                        )}
                      >
                        Edit slides
                      </p>
                      <p className={cn("text-sm", textMutedClass)}>
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
                      <p
                        className={cn(
                          "text-base font-semibold",
                          textStrongClass
                        )}
                      >
                        Tune settings
                      </p>
                      <p className={cn("text-sm", textMutedClass)}>
                        Aspect ratio, resolution, theme.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className={cn(iconBadgeClass, "h-10 w-10")}>
                      <Download className="h-5 w-5" />
                    </div>
                    <div>
                      <p
                        className={cn(
                          "text-base font-semibold",
                          textStrongClass
                        )}
                      >
                        Export PNGs
                      </p>
                      <p className={cn("text-sm", textMutedClass)}>
                        Use the Export button in the header.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 border-t border-slate-100 pt-6">
                  <p
                    className={cn(
                      "text-xs font-semibold uppercase tracking-[0.2em]",
                      textFaintClass
                    )}
                  >
                    Current Theme
                  </p>
                  <p
                    className={cn(
                      "mt-1 text-xl font-semibold",
                      textStrongClass
                    )}
                  >
                    {settings.theme}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-5">
              <div className={statCardClass}>
                <p
                  className={cn(
                    "text-xs font-semibold uppercase tracking-[0.2em]",
                    textFaintClass
                  )}
                >
                  Slide System
                </p>
                <p className={cn("mt-2 text-4xl font-bold", textStrongClass)}>
                  1
                </p>
                <p className={cn("mt-2 text-sm", textMutedClass)}>
                  layout + scaling engine
                </p>
              </div>
              <div className={statCardClass}>
                <p
                  className={cn(
                    "text-xs font-semibold uppercase tracking-[0.2em]",
                    textFaintClass
                  )}
                >
                  Themes
                </p>
                <p className={cn("mt-2 text-4xl font-bold", textStrongClass)}>
                  3
                </p>
                <p className={cn("mt-2 text-sm", textMutedClass)}>
                  Aurora / Mono / Custom
                </p>
              </div>
              <div className={statCardClass}>
                <p
                  className={cn(
                    "text-xs font-semibold uppercase tracking-[0.2em]",
                    textFaintClass
                  )}
                >
                  Export
                </p>
                <p className={cn("mt-2 text-4xl font-bold", textStrongClass)}>
                  PNG
                </p>
                <p className={cn("mt-2 text-sm", textMutedClass)}>
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
              <p className={cn("text-center text-sm italic", textMutedClass)}>
                Example media slot (served from{" "}
                <span className="font-mono">public/assets</span>).
              </p>

              <div className="grid grid-cols-2 gap-4">
                <div className={cn(softCardClass, "flex items-center gap-4")}>
                  <div className={cn(iconBadgeClass, "h-12 w-12")}>
                    <LayoutGrid className="h-6 w-6" />
                  </div>
                  <div>
                    <p className={cn("text-lg font-bold", textStrongClass)}>
                      Structure
                    </p>
                    <p className={cn("mt-1", textSoftClass)}>
                      Slides are standard React components.
                    </p>
                  </div>
                </div>
                <div className={cn(softCardClass, "flex items-center gap-4")}>
                  <div className={cn(iconBadgeClass, "h-12 w-12")}>
                    <Target className="h-6 w-6" />
                  </div>
                  <div>
                    <p className={cn("text-lg font-bold", textStrongClass)}>
                      Consistency
                    </p>
                    <p className={cn("mt-1", textSoftClass)}>
                      Reuse cards, chips, stats, and grids.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex w-[55%] flex-col gap-6">
              <div className={accentCardClass + " relative overflow-hidden"}>
                <div className="absolute -right-14 -bottom-14 opacity-5">
                  <BarChart3
                    className={cn("h-80 w-80", textAccentStrongClass)}
                  />
                </div>
                <p
                  className={cn(
                    "text-sm font-bold uppercase tracking-[0.2em]",
                    textAccentClass
                  )}
                >
                  What this deck demonstrates
                </p>
                <h3 className={cn("mt-3 text-4xl font-bold", textStrongClass)}>
                  A complete slide toolchain
                </h3>
                <p className={cn("mt-4 text-xl leading-relaxed", textMediumClass)}>
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
                <div className={cn("flex items-center gap-4", textMutedClass)}>
                  <div
                    className={cn(
                      iconBadgeStrongClass
                    )}
                  >
                    <CheckCircle2 className="h-6 w-6" />
                  </div>
                  <p className="text-sm font-semibold uppercase tracking-[0.2em]">
                    Practical guidance
                  </p>
                </div>
                <p className={cn("mt-4 text-lg leading-relaxed", textMediumClass)}>
                  Keep each slide focused: one big idea, one strong visual, and a
                  small number of supporting facts.
                </p>
                <div className="mt-6 space-y-2">
                  <div
                    className={cn(
                      "flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3",
                      surfaceBgClass
                    )}
                  >
                    <span className={cn("font-mono text-sm", textMediumClass)}>
                      src/app/page.tsx
                    </span>
                    <span className={cn("text-sm", textMutedClass)}>
                      your content
                    </span>
                  </div>
                  <div
                    className={cn(
                      "flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3",
                      surfaceBgClass
                    )}
                  >
                    <span className={cn("font-mono text-sm", textMediumClass)}>
                      public/assets/
                    </span>
                    <span className={cn("text-sm", textMutedClass)}>
                      your images
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </PresentationSlide>

        <PresentationSlide title="LaTeX (Math)">
          <div className="flex flex-row items-start gap-6">
            <div className="flex w-1/2 flex-col gap-6">
              <div className={accentCardClass}>
                <p
                  className={cn(
                    "text-sm font-bold uppercase tracking-[0.2em]",
                    textAccentClass
                  )}
                >
                  Built-in math typesetting
                </p>
                <p
                  className={cn(
                    "mt-3 text-2xl font-semibold leading-snug",
                    textStrongClass
                  )}
                >
                  Write equations directly in your slides.
                </p>
                <p className={cn("mt-3 text-lg leading-relaxed", textMediumClass)}>
                  Supports inline and display math via{" "}
                  <span className="font-mono">$...$</span>,{" "}
                  <span className="font-mono">$$...$$</span>,{" "}
                  <span className="font-mono">\\(...\\)</span>, and{" "}
                  <span className="font-mono">\\[...\\]</span>.
                </p>
              </div>
              <div className="flex flex-col gap-6">
              <div className={figureCardClass}>
                <p
                  className={cn(
                    "text-xs font-semibold uppercase tracking-[0.2em]",
                    textFaintClass
                  )}
                >
                  Matrices + notation
                </p>
                <Latex
                  className={cn(
                    "mt-4 whitespace-pre-wrap text-xl leading-relaxed",
                    textBaseClass
                  )}
                >
                  {String.raw`$$
\mathbf{A}=
\begin{bmatrix}
1 & 2 \\
3 & 4
\end{bmatrix},
\quad
\det(\mathbf{A}) = -2
$$`}
                </Latex>
              </div>

              
            </div>
            </div>
            <div className="flex flex-col gap-6">
              <div className={cardClass}>
                <p
                  className={cn(
                    "text-xs font-semibold uppercase tracking-[0.2em]",
                    textFaintClass
                  )}
                >
                  Inline example
                </p>
                <Latex className={cn("mt-3 text-xl leading-relaxed", textBaseClass)}>
                  {String.raw`Euler's identity: $e^{i\pi}+1=0$`}
                </Latex>

                <div className="mt-2 pt-6">
                  <p
                    className={cn(
                      "text-xs font-semibold uppercase tracking-[0.2em]",
                      textFaintClass
                    )}
                  >
                    Display example
                  </p>
                  <Latex
                    className={cn(
                      "mt-3 whitespace-pre-wrap text-xl leading-relaxed",
                      textBaseClass
                    )}
                  >
                    {String.raw`Gaussian integral:
  $$\int_{-\infty}^{\infty} e^{-x^2}\,dx = \sqrt{\pi}$$`}
                  </Latex>
                </div>
              </div>
              <div className={softCardClass}>
                <p
                  className={cn(
                    "text-xs font-semibold uppercase tracking-[0.2em]",
                    textFaintClass
                  )}
                >
                  Tip
                </p>
                <p className={cn("mt-2 text-lg leading-relaxed", textMediumClass)}>
                  In TSX strings, remember to escape backslashes when needed
                  (for example{" "}
                  <span className="font-mono">{"\"\\\\alpha\""}</span>).
                </p>
              </div>
            </div>
            
            
          </div>
          <StageTimeline activeStage={2} className="mt-auto" />
        </PresentationSlide>

        <PresentationSlide title="Themes + Settings">
          <div className="flex h-full flex-col justify-center gap-6">
            <div className="grid grid-cols-3 gap-4">
              <div className={cardClass}>
                <div className={cn("flex items-center gap-4", textMutedClass)}>
                  <div
                    className={cn(
                      "rounded-xl bg-indigo-50 p-3",
                      iconBadgeStrongClass
                    )}
                  >
                    <Palette className="h-6 w-6" />
                  </div>
                  <p className="text-sm font-semibold uppercase tracking-[0.2em]">
                    Theme Tokens
                  </p>
                </div>
                <p className={cn("mt-4 text-lg leading-relaxed", textMediumClass)}>
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
                <div className={cn("flex items-center gap-4", textMutedClass)}>
                  <div
                    className={cn(
                      "rounded-xl bg-indigo-50 p-3",
                      iconBadgeStrongClass
                    )}
                  >
                    <Settings2 className="h-6 w-6" />
                  </div>
                  <p className="text-sm font-semibold uppercase tracking-[0.2em]">
                    Settings UI
                  </p>
                </div>
                <p className={cn("mt-4 text-lg leading-relaxed", textMediumClass)}>
                  Aspect ratio, resolution, theme, and safe auto-sizing are saved
                  in cookies.
                </p>
                <div className={cn("mt-6 space-y-2 text-sm", textSoftClass)}>
                  <div
                    className={cn(
                      "flex items-center justify-between rounded-xl px-4 py-2",
                      surfaceSoftBgClass
                    )}
                  >
                    <span className="font-mono">Aspect</span>
                    <span className="font-semibold">{settings.aspectRatio}</span>
                  </div>
                  <div
                    className={cn(
                      "flex items-center justify-between rounded-xl px-4 py-2",
                      surfaceSoftBgClass
                    )}
                  >
                    <span className="font-mono">Resolution</span>
                    <span className="font-semibold">{settings.resolution}</span>
                  </div>
                </div>
              </div>

              <div className={cardClass}>
                <div className={cn("flex items-center gap-4", textMutedClass)}>
                  <div
                    className={cn(
                      "rounded-xl bg-indigo-50 p-3",
                      iconBadgeStrongClass
                    )}
                  >
                    <Download className="h-6 w-6" />
                  </div>
                  <p className="text-sm font-semibold uppercase tracking-[0.2em]">
                    Export Workflow
                  </p>
                </div>
                <p className={cn("mt-4 text-lg leading-relaxed", textMediumClass)}>
                  Export walks the DOM and downloads each section as a PNG.
                </p>
                <div
                  className={cn(
                    "mt-6 rounded-2xl border border-slate-200 px-4 py-3",
                    surfaceSoftBgClass
                  )}
                >
                  <p
                    className={cn(
                      "text-xs font-semibold uppercase tracking-[0.2em]",
                      textFaintClass
                    )}
                  >
                    Tip
                  </p>
                  <p className={cn("mt-1 text-sm", textSoftClass)}>
                    Use consistent spacing and typography to keep exports clean.
                  </p>
                </div>
              </div>
            </div>

            <div className={critiqueCardClass}>
              <div className="absolute right-0 top-0 p-4 opacity-10">
                <Sparkles className={cn("h-24 w-24", textWarnStrongClass)} />
              </div>
              <p
                className={cn(
                  "mb-3 text-xs font-bold uppercase tracking-[0.2em]",
                  textWarnClass
                )}
              >
                Template Note
              </p>
              <p className={cn("text-lg font-medium leading-relaxed", textBaseClass)}>
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
