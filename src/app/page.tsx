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
        {/* Slide 01 */}
        <PresentationSlide title="Demo Deck">
          <div className="flex h-full flex-col justify-between">
            <div className="grid grid-cols-[1fr_1fr_1.1fr] items-start gap-4">
              <div className="flex flex-col col-span-2 gap-8 mt-6 mr-8">
                <div className="flex flex-wrap items-center gap-3">
                  <span className={cn(chipClass, "px-5 py-2 text-xl")}>
                    <Sparkles className="h-4 w-4" />
                    Reusable template
                  </span>
                  <span className={cn(chipClass, "px-5 py-2 text-xl")}>
                    <LayoutGrid className="h-4 w-4" />
                    Component-first
                  </span>
                  <span className={cn(chipClass, "px-5 py-2 text-xl")}>
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
                  <span className={cn("font-light tracking-tight", textMediumClass)}>
                    A polished, open-source deck engine
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

              <div className={cn(cardClass, "p-6")}>
                <p
                  className={cn(
                    "mb-4 text-xl font-semibold uppercase tracking-[0.2em]",
                    textFaintClass
                  )}
                >
                  Quick Start
                </p>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className={cn(iconBadgeClass, "h-8 w-8")}>
                      <Brush className="h-6 w-6" />
                    </div>
                    <div>
                      <p
                        className={cn(
                          "text-xl font-semibold",
                          textStrongClass
                        )}
                      >
                        Edit slides
                      </p>
                      <p className={cn("text-xl", textMutedClass)}>
                        Replace {" "}
                        <span className="font-mono">page.tsx</span>.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className={cn(iconBadgeClass, "h-8 w-8")}>
                      <Settings2 className="h-6 w-6" />
                    </div>
                    <div>
                      <p
                        className={cn(
                          "text-xl font-semibold",
                          textStrongClass
                        )}
                      >
                        Tune settings
                      </p>
                      <p className={cn("text-xl", textMutedClass)}>
                        Aspect ratio, resolution, theme.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className={cn(iconBadgeClass, "h-8 w-8")}>
                      <Download className="h-6 w-6" />
                    </div>
                    <div>
                      <p
                        className={cn(
                          "text-xl font-semibold",
                          textStrongClass
                        )}
                      >
                        Export PNGs
                      </p>
                      <p className={cn("text-xl", textMutedClass)}>
                        Use the Export buttons.
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <div className={cn("mb-6 h-px w-full", surfaceSoftBgClass)} />
                  <p
                    className={cn(
                      "text-xl font-semibold uppercase tracking-[0.2em]",
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
              <div className={statCardClass}>
                <p
                  className={cn(
                    "text-xl font-semibold uppercase tracking-[0.2em]",
                    textFaintClass
                  )}
                >
                  Slide System
                </p>
                <p className={cn("mt-2 text-4xl font-bold", textStrongClass)}>
                  1
                </p>
                <p className={cn("mt-2 text-xl", textMutedClass)}>
                  layout + scaling engine
                </p>
              </div>
              <div className={statCardClass}>
                <p
                  className={cn(
                    "text-xl font-semibold uppercase tracking-[0.2em]",
                    textFaintClass
                  )}
                >
                  Themes
                </p>
                <p className={cn("mt-2 text-4xl font-bold", textStrongClass)}>
                  4
                </p>
                <p className={cn("mt-2 text-xl", textMutedClass)}>
                  Aurora / Mono / Midnight / Custom
                </p>
              </div>
              <div className={statCardClass}>
                <p
                  className={cn(
                    "text-xl font-semibold uppercase tracking-[0.2em]",
                    textFaintClass
                  )}
                >
                  Export
                </p>
                <p className={cn("mt-2 text-4xl font-bold", textStrongClass)}>
                  PPTX / PDF / PNG
                </p>
                <p className={cn("mt-2 text-xl", textMutedClass)}>
                  download every slide
                </p>
              </div>
            </div>
          </div>
        </PresentationSlide>

        {/* Slide 02 */}
        <PresentationSlide title="Layout + Components">
          <div className="grid grid-cols-[1fr_1.6fr] items-center gap-8">
            <div className="flex flex-col gap-6">
              <div className={cn(figureCardClass, "py-6")}>
                <CustomImage
                  path="assets/sample-pexels.jpg"
                  className="h-full w-full object-contain"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className={cn(softCardClass, "gap-4 py-6")}>
                  <LayoutGrid className="h-8 w-8 mb-4" />
                  <p className={cn("text-xl font-bold", textStrongClass)}>
                    Structure
                  </p>
                  <p className={cn("mt-1 text-xl", textSoftClass)}>
                    Slides are standard React components.
                  </p>
                </div>
                <div className={cn(softCardClass, "gap-4 py-6")}>
                  <Target className="h-8 w-8 mb-4" />
                  <div>
                    <p className={cn("text-xl font-bold", textStrongClass)}>
                      Consistency
                    </p>
                    <p className={cn("mt-1 text-xl", textSoftClass)}>
                      Reuse cards, chips, stats, and grids.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-6 h-full">
              <div className={cn(accentCardClass, "relative overflow-hidden")}>
                <div className="absolute -bottom-14 -right-14 opacity-5">
                  <BarChart3
                    className={cn("h-80 w-80", textAccentStrongClass)}
                  />
                </div>
                <p
                  className={cn(
                    "text-xl font-bold uppercase tracking-[0.2em]",
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
                  <span className={cn(chipClass, "px-5 py-2 text-xl")}>
                    <Palette className="h-4 w-4" />
                    Theme styles
                  </span>
                  <span className={cn(chipClass, "px-5 py-2 text-xl")}>
                    <Download className="h-4 w-4" />
                    Export pipeline
                  </span>
                </div>
              </div>

              <div className={cn(cardClass)}>
                <div className={cn("flex items-center gap-4", textMutedClass)}>
                  <div className={cn(iconBadgeStrongClass)}>
                    <CheckCircle2 className="h-6 w-6" />
                  </div>
                  <p className="text-xl font-semibold uppercase tracking-[0.2em]">
                    Practical guidance
                  </p>
                </div>
                <p className={cn("mt-4 text-xl leading-relaxed", textMediumClass)}>
                  Keep each slide focused: one big idea, one strong visual, and a
                  small number of supporting facts.
                </p>
                <div className="mt-3 space-y-2">
                  <div
                    className={cn(
                      "flex items-center justify-between",
                      surfaceBgClass
                    )}
                  >
                    <span className={cn("font-mono text-xl", textMediumClass)}>
                      src/app/page.tsx
                    </span>
                    <span className={cn("text-xl", textMutedClass)}>
                      your content
                    </span>
                  </div>
                  <div
                    className={cn(
                      "flex items-center justify-between",
                      surfaceBgClass
                    )}
                  >
                    <span className={cn("font-mono text-xl", textMediumClass)}>
                      public/assets/
                    </span>
                    <span className={cn("text-xl", textMutedClass)}>
                      your images
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </PresentationSlide>

        {/* Slide 03 */}
        <PresentationSlide title="LaTeX (Math)">
          <div className="flex flex-row items-start gap-6">
            <div className="flex w-1/2 flex-col gap-6">
              <div className={accentCardClass}>
                <p
                  className={cn(
                    "text-xl font-bold uppercase tracking-[0.2em]",
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
                <p className={cn("mt-3 text-xl leading-relaxed", textMediumClass)}>
                  Use <span className="font-mono">String.raw</span> with explicit{" "}
                  <span className="font-mono">$...$</span> or{" "}
                  <span className="font-mono">$$...$$</span> delimiters for slide
                  math.
                </p>
              </div>
              <div>
                <div className={cn(figureCardClass, "pt-8 gap-2!")}>
                  <p
                    className={cn(
                      textFaintClass,
                      "text-xl font-semibold uppercase tracking-[0.2em]"
                    )}
                  >
                    Matrices + notation
                  </p>
                  <Latex
                    className={cn(
                      "whitespace-pre-wrap text-3xl leading-relaxed mt-3 mb-3",
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
                    "text-xl font-semibold uppercase tracking-[0.2em]",
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
                      "text-xl font-semibold uppercase tracking-[0.2em]",
                      textFaintClass
                    )}
                  >
                    Display example
                  </p>
                  <p className="text-xl">Gaussian integral:</p>
                  <Latex
                    className={cn(
                      textBaseClass,
                      "whitespace-pre-wrap text-3xl leading-relaxed block mt-3"
                    )}
                  >
                    {String.raw`$$
  \int_{-\infty}^{\infty} e^{-x^2}\,dx = \sqrt{\pi}
  $$`}
                  </Latex>
                </div>
              </div>
              <div className={softCardClass}>
                <p
                  className={cn(
                    "text-xl font-semibold uppercase tracking-[0.2em]",
                    textFaintClass
                  )}
                >
                  Tip
                </p>
                <p className={cn("mt-2 text-xl leading-relaxed", textMediumClass)}>
                  Prefer <span className="font-mono">String.raw</span> so LaTeX
                  stays readable and backslashes do not need double-escaping.
                </p>
              </div>
            </div>
          </div>
          <StageTimeline activeStage={2} className="mt-auto" />
        </PresentationSlide>

        {/* Slide 04 */}
        <PresentationSlide title="Themes + Settings">
          <div className="flex h-full flex-col justify-center gap-6">
            <div className="grid grid-cols-3 gap-4">
              <div className={cardClass}>
                <div className={cn("flex items-center gap-4", textMutedClass)}>
                  <div className={cn(iconBadgeStrongClass)}>
                    <Palette className="h-6 w-6" />
                  </div>
                  <p className="text-xl font-semibold uppercase tracking-[0.2em]">
                    Theme Tokens
                  </p>
                </div>
                <p className={cn("mt-4 text-xl leading-relaxed", textMediumClass)}>
                  Visual language is derived from a small set of theme classes.
                </p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <span className={cn(chipClass, "px-5 py-2 text-xl")}>
                    cardClass
                  </span>
                  <span className={cn(chipClass, "px-5 py-2 text-xl")}>
                    accentCardClass
                  </span>
                  <span className={cn(chipClass, "px-5 py-2 text-xl")}>
                    critiqueCardClass
                  </span>
                  <span className={cn(chipClass, "px-5 py-2 text-xl")}>
                    ...
                  </span>
                </div>
              </div>

              <div className={cardClass}>
                <div className={cn("flex items-center gap-4", textMutedClass)}>
                  <div className={cn(iconBadgeStrongClass)}>
                    <Settings2 className="h-6 w-6" />
                  </div>
                  <p className="text-xl font-semibold uppercase tracking-[0.2em]">
                    Settings UI
                  </p>
                </div>
                <p className={cn("mt-4 text-xl leading-relaxed", textMediumClass)}>
                  Aspect ratio, resolution, theme, and safe auto-sizing are saved
                  in cookies.
                </p>
                <div className={cn("mt-6 space-y-4 text-xl", textSoftClass)}>
                  <div className={cn("flex items-center justify-between")}>
                    <span className="font-mono">Aspect</span>
                    <span className="font-semibold">{settings.aspectRatio}</span>
                  </div>
                  <div className={cn("flex items-center justify-between")}>
                    <span className="font-mono">Resolution</span>
                    <span className="font-semibold">{settings.resolution}</span>
                  </div>
                </div>
              </div>

              <div className={cardClass}>
                <div className={cn("flex items-center gap-4", textMutedClass)}>
                  <div className={cn(iconBadgeStrongClass)}>
                    <Download className="h-6 w-6" />
                  </div>
                  <p className="text-xl font-semibold uppercase tracking-[0.2em]">
                    Export Workflow
                  </p>
                </div>
                <p className={cn("mt-4 text-xl leading-relaxed", textMediumClass)}>
                  Export walks the DOM and downloads each section as a PNG.
                </p>
                <div className={cn("mt-6")}>
                  <p
                    className={cn(
                      "text-xl font-semibold uppercase tracking-[0.2em]",
                      textFaintClass
                    )}
                  >
                    Tip
                  </p>
                  <p className={cn("mt-2 text-xl", textSoftClass)}>
                    Use consistent spacing and typography to keep exports clean.
                  </p>
                </div>
              </div>
            </div>

            <div className={critiqueCardClass}>
              <div className="absolute right-0 top-0 p-4 opacity-10">
                <Sparkles className={cn("h-34 w-34", textWarnStrongClass)} />
              </div>
              <p
                className={cn(
                  "mb-3 text-xl font-bold uppercase tracking-[0.2em]",
                  textWarnClass
                )}
              >
                Template Note
              </p>
              <p className={cn("text-xl font-medium leading-relaxed", textBaseClass)}>
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
