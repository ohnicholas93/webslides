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
  } = themeStyles;

  return (
    <main className="px-8 pt-4 pb-16">
      <div className="flex flex-col gap-4">
        {/* Slide 01 */}
        <PresentationSlide title="Demo Deck">
          <div className="grid grid-cols-[1fr_1fr_1.1fr] items-start gap-4">
            <div className="col-span-2 mr-8 mt-8 flex flex-col gap-8">
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

              <h1 className={cn(textStrongClass, "text-5xl font-bold leading-tight")}>
                WebSlides
                <br />
                <span className={cn(textMediumClass, "font-light tracking-tight")}>
                  A polished, open-source deck engine
                </span>
              </h1>

              <p
                className={cn(
                  textSoftClass,
                  "max-w-3xl text-2xl leading-relaxed"
                )}
              >
                This starter deck showcases the slide layout, theme tokens,
                settings panel, and export flow without any presentation-specific
                content.
              </p>
            </div>

            <div className={cn(cardClass, "p-6")}>
              <p
                className={cn(
                  textFaintClass,
                  "mb-4 text-xl font-semibold uppercase tracking-[0.2em]"
                )}
              >
                Quick Start
              </p>

              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-4">
                  <div className={cn(iconBadgeClass, "h-12 w-12")}>
                    <Brush className="h-6 w-6" />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <p className={cn(textStrongClass, "text-xl font-semibold")}>
                      Edit slides
                    </p>
                    <p className={cn(textMutedClass, "text-xl")}>
                      Replace <span className="font-mono">page.tsx</span>.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className={cn(iconBadgeClass, "h-12 w-12")}>
                    <Settings2 className="h-6 w-6" />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <p className={cn(textStrongClass, "text-xl font-semibold")}>
                      Tune settings
                    </p>
                    <p className={cn(textMutedClass, "text-xl")}>
                      Aspect ratio, resolution, theme.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className={cn(iconBadgeClass, "h-12 w-12")}>
                    <Download className="h-6 w-6" />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <p className={cn(textStrongClass, "text-xl font-semibold")}>
                      Export assets
                    </p>
                    <p className={cn(textMutedClass, "text-xl")}>
                      Use the export buttons.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-1 mt-12">
                <p
                  className={cn(
                    textFaintClass,
                    "text-xl font-semibold uppercase tracking-[0.2em]"
                  )}
                >
                  Current Theme
                </p>
                <p className={cn(textStrongClass, "text-xl font-semibold")}>
                  {settings.theme}
                </p>
              </div>
            </div>

            <div className={statCardClass}>
              <p
                className={cn(
                  textFaintClass,
                  "text-xl font-semibold uppercase tracking-[0.2em]"
                )}
              >
                Slide System
              </p>
              <p className={cn(textStrongClass, "mt-2 text-4xl font-bold")}>1</p>
              <p className={cn(textMutedClass, "mt-2 text-xl")}>
                layout + scaling engine
              </p>
            </div>

            <div className={statCardClass}>
              <p
                className={cn(
                  textFaintClass,
                  "text-xl font-semibold uppercase tracking-[0.2em]"
                )}
              >
                Themes
              </p>
              <p className={cn(textStrongClass, "mt-2 text-4xl font-bold")}>4</p>
              <p className={cn(textMutedClass, "mt-2 text-xl")}>
                Aurora / Mono / Midnight / Custom
              </p>
            </div>

            <div className={statCardClass}>
              <p
                className={cn(
                  textFaintClass,
                  "text-xl font-semibold uppercase tracking-[0.2em]"
                )}
              >
                Export
              </p>
              <p className={cn(textStrongClass, "mt-2 text-4xl font-bold")}>
                PPTX / PDF / PNG
              </p>
              <p className={cn(textMutedClass, "mt-2 text-xl")}>
                download every slide
              </p>
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

              <div className="grid grid-cols-[1fr_1fr] gap-4">
                <div className={cn(softCardClass, "gap-3 py-6")}>
                  <LayoutGrid className="mb-4 h-8 w-8" />
                  <div className="flex flex-col gap-1">
                    <p className={cn(textStrongClass, "text-xl font-bold")}>
                      Structure
                    </p>
                    <p className={cn(textSoftClass, "mt-1 text-xl")}>
                      Slides are standard React components.
                    </p>
                  </div>
                </div>

                <div className={cn(softCardClass, "gap-3 py-6")}>
                  <Target className="mb-4 h-8 w-8" />
                  <div className="flex flex-col gap-1">
                    <p className={cn(textStrongClass, "text-xl font-bold")}>
                      Consistency
                    </p>
                    <p className={cn(textSoftClass, "mt-1 text-xl")}>
                      Reuse cards, chips, stats, etc.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-6">
              <div className={cn(accentCardClass, "relative overflow-hidden")}>
                <div className="absolute -right-14 -bottom-14 opacity-5">
                  <BarChart3 className={cn(textAccentStrongClass, "h-80 w-80")} />
                </div>
                <p
                  className={cn(
                    textAccentClass,
                    "text-xl font-bold uppercase tracking-[0.2em]"
                  )}
                >
                  What this deck demonstrates
                </p>
                <h3 className={cn(textStrongClass, "mt-3 text-4xl font-bold")}>
                  A complete slide toolchain
                </h3>
                <p
                  className={cn(
                    textMediumClass,
                    "mt-4 text-xl leading-relaxed"
                  )}
                >
                  Theme-aware tokens, responsive auto-sizing, and a built-in
                  export path designed to stay out of the way while you present.
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

              <div className={cardClass}>
                <div className="flex items-center gap-4">
                  <div className={iconBadgeStrongClass}>
                    <CheckCircle2 className="h-6 w-6" />
                  </div>
                  <p
                    className={cn(
                      textMutedClass,
                      "text-xl font-semibold uppercase tracking-[0.2em]"
                    )}
                  >
                    Practical guidance
                  </p>
                </div>
                <p
                  className={cn(
                    textMediumClass,
                    "mt-4 text-xl leading-relaxed"
                  )}
                >
                  Keep each slide focused: one big idea, one strong visual, and a
                  small number of supporting facts.
                </p>
                <div className="mt-3 flex flex-col gap-2">
                  <div
                    className={cn(
                      surfaceBgClass,
                      "flex items-center justify-between"
                    )}
                  >
                    <span className={cn(textMediumClass, "font-mono text-xl")}>
                      src/app/page.tsx
                    </span>
                    <span className={cn(textMutedClass, "text-xl")}>
                      your content
                    </span>
                  </div>
                  <div
                    className={cn(
                      surfaceBgClass,
                      "flex items-center justify-between"
                    )}
                  >
                    <span className={cn(textMediumClass, "font-mono text-xl")}>
                      public/assets/
                    </span>
                    <span className={cn(textMutedClass, "text-xl")}>
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
          <div className="grid grid-cols-[1fr_1fr] items-start gap-6">
            <div className="flex flex-col gap-6">
              <div className={accentCardClass}>
                <p
                  className={cn(
                    textAccentClass,
                    "text-xl font-bold uppercase tracking-[0.2em]"
                  )}
                >
                  Built-in math typesetting
                </p>
                <p
                  className={cn(
                    textStrongClass,
                    "mt-3 text-2xl font-semibold leading-snug"
                  )}
                >
                  Write equations directly in your slides.
                </p>
                <p
                  className={cn(
                    textMediumClass,
                    "mt-3 text-xl leading-relaxed"
                  )}
                >
                  Use <span className="font-mono">String.raw</span> with explicit{" "}
                  <span className="font-mono">$...$</span> or{" "}
                  <span className="font-mono">$$...$$</span> delimiters for slide
                  math.
                </p>
              </div>

              <div>
                <div className={cn(figureCardClass, "pt-8 gap-2")}>
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
                      textBaseClass,
                      "mt-3 mb-3 whitespace-pre-wrap text-3xl leading-relaxed"
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
                <div>
                  <p
                    className={cn(
                      textFaintClass,
                      "text-xl font-semibold uppercase tracking-[0.2em]"
                    )}
                  >
                    Inline example
                  </p>
                </div>
                <Latex className={cn(textBaseClass, "mt-2 text-xl leading-relaxed")}>
                  {String.raw`Euler's identity: $e^{i\pi}+1=0$`}
                </Latex>

                <div className="mt-2 flex flex-col gap-2 pt-6">
                  <p
                    className={cn(
                      textFaintClass,
                      "text-xl font-semibold uppercase tracking-[0.2em]"
                    )}
                  >
                    Display example
                  </p>
                  <p className={cn(textBaseClass, "text-xl")}>Gaussian integral:</p>
                  <Latex
                    className={cn(
                      textBaseClass,
                      "mt-2 block whitespace-pre-wrap text-3xl leading-relaxed"
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
                    textFaintClass,
                    "text-xl font-semibold uppercase tracking-[0.2em]"
                  )}
                >
                  Tip
                </p>
                <p
                  className={cn(
                    textMediumClass,
                    "mt-2 text-xl leading-relaxed"
                  )}
                >
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
          <div className="grid grid-cols-[1fr_1fr_1fr] gap-x-4 gap-y-6">
            <div className={cardClass}>
              <div className="flex items-center gap-4">
                <div className={iconBadgeStrongClass}>
                  <Palette className="h-6 w-6" />
                </div>
                <p
                  className={cn(
                    textMutedClass,
                    "text-xl font-semibold uppercase tracking-[0.2em]"
                  )}
                >
                  Theme Tokens
                </p>
              </div>
              <p
                className={cn(
                  textMediumClass,
                  "mt-4 text-xl leading-relaxed"
                )}
              >
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
                <span className={cn(chipClass, "px-5 py-2 text-xl")}>...</span>
              </div>
            </div>

            <div className={cardClass}>
              <div className="flex items-center gap-4">
                <div className={iconBadgeStrongClass}>
                  <Settings2 className="h-6 w-6" />
                </div>
                <p
                  className={cn(
                    textMutedClass,
                    "text-xl font-semibold uppercase tracking-[0.2em]"
                  )}
                >
                  Settings UI
                </p>
              </div>
              <p
                className={cn(
                  textMediumClass,
                  "mt-4 text-xl leading-relaxed"
                )}
              >
                Aspect ratio, resolution, theme, and safe auto-sizing are saved
                in cookies.
              </p>
              <div className={cn(textSoftClass, "mt-6 grid gap-4 text-xl")}>
                <div className="flex items-center justify-between">
                  <span className="font-mono">Aspect</span>
                  <span className="font-semibold">{settings.aspectRatio}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-mono">Resolution</span>
                  <span className="font-semibold">{settings.resolution}</span>
                </div>
              </div>
            </div>

            <div className={cardClass}>
              <div className="flex items-center gap-4">
                <div className={iconBadgeStrongClass}>
                  <Download className="h-6 w-6" />
                </div>
                <p
                  className={cn(
                    textMutedClass,
                    "text-xl font-semibold uppercase tracking-[0.2em]"
                  )}
                >
                  Export Workflow
                </p>
              </div>
              <p
                className={cn(
                  textMediumClass,
                  "mt-4 text-xl leading-relaxed"
                )}
              >
                Export walks the DOM and packages PNG, PDF, or PPTX output.
              </p>
              <div className="mt-6 grid gap-2">
                <p
                  className={cn(
                    textFaintClass,
                    "text-xl font-semibold uppercase tracking-[0.2em]"
                  )}
                >
                  Tip
                </p>
                <p className={cn(textSoftClass, "mt-2 text-xl")}>
                  Use consistent spacing and typography to keep exports clean.
                </p>
              </div>
            </div>
            <div className={cn(critiqueCardClass, "col-span-3 py-6")}>
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Sparkles className={cn(textWarnStrongClass, "h-[8.5rem] w-[8.5rem]")} />
              </div>
              <p
                className={cn(
                  textWarnClass,
                  "mb-3 text-xl font-bold uppercase tracking-[0.2em]"
                )}
              >
                Template Note
              </p>
              <p
                className={cn(
                  textBaseClass,
                  "text-xl font-medium leading-relaxed"
                )}
              >
                For a new deck, you should only have to change{" "}
                <span className="font-mono">src/app/page.tsx</span> and images in{" "}
                <span className="font-mono">public/assets</span>. Everything else is
                intended to stay reusable.
              </p>
            </div>
          </div>

          <StageTimeline activeStage={3} />
        </PresentationSlide>
      </div>
    </main>
  );
}
