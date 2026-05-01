"use client";

import {
  ArrowRight,
  Boxes,
  CheckCircle2,
  Download,
  FileCode2,
  Layers3,
  MonitorPlay,
  PenTool,
  Sparkles,
} from "lucide-react";

import Latex from "@/components/latex";
import PresentationSlide from "@/components/slide";
import CustomImage from "@/core/image";
import { usePresentationSettings } from "@/core/presentation-settings";
import { cn } from "@/lib/utils";

const coolInk = "text-[#10213a]";
const muted = "text-[#536985]";
const panel =
  "rounded-[1.75rem] border border-slate-200 bg-white/82 p-6 shadow-[0_24px_70px_rgba(15,23,42,0.10)]";
const darkPanel =
  "rounded-[1.75rem] border border-sky-200/20 bg-[#244a68]/88 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.22)]";

function Pill({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xl font-semibold",
        className
      )}
    >
      {children}
    </span>
  );
}

function Capability({
  icon: Icon,
  title,
  body,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  body: string;
}) {
  return (
    <div className={panel}>
      <div className="flex gap-4 items-center">
        <div className="grid h-14 w-14 place-items-center rounded-2xl bg-[#123f69] text-[#dff3ff]">
          <Icon className="h-7 w-7" />
        </div>
        <h3 className={cn(coolInk, "text-3xl font-bold tracking-tight")}>{title}</h3>
      </div>
      <p className={cn(muted, "mt-5 text-2xl leading-relaxed")}>{body}</p>
    </div>
  );
}

function Rule({
  label,
  children,
  className,
  hideTopBorder = false,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
  hideTopBorder?: boolean;
}) {
  return (
    <div
      className={cn(
        "grid grid-cols-[8rem_1fr] gap-5 py-5",
        hideTopBorder ? "border-0 pt-0" : "border-t border-white/18",
        className
      )}
    >
      <p className="text-2xl font-bold uppercase tracking-widest text-[#7dd3fc]">
        {label}
      </p>
      <p className="text-2xl leading-snug text-white">
        {children}
      </p>
    </div>
  );
}

export default function Home() {
  const { settings } = usePresentationSettings();

  return (
    <main className="bg-[#eef3f8] px-8 pt-4 pb-16">
      <style>{`
        @keyframes webslides-float {
          0%, 100% { transform: translate3d(0, 0, 0) rotate(3deg); }
          50% { transform: translate3d(0, -18px, 0) rotate(1deg); }
        }

        @keyframes webslides-line {
          0%, 100% { opacity: 0.38; transform: scaleX(0.82); }
          50% { opacity: 0.86; transform: scaleX(1); }
        }

        @keyframes webslides-orbit {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
      <div className="flex flex-col gap-4">
        {/* Slide 01 */}
        <PresentationSlide
          title="WebSlides"
          className="bg-[radial-gradient(circle_at_78%_18%,rgba(125,211,252,0.26),transparent_34%),radial-gradient(circle_at_6%_88%,rgba(147,197,253,0.24),transparent_32%),linear-gradient(135deg,#f8fbff_0%,#eef6ff_54%,#eaf2fb_100%)] text-[#10213a]"
        >
          <div className="relative grid min-h-0 grid-cols-[1.3fr_1fr] gap-16 my-auto pb-8">
            <div className="flex flex-col justify-center">
              <Pill className="w-fit border-sky-200 bg-white/66 text-sky-800">
                <Sparkles className="h-5 w-5" />
                Agent-authored slide systems
              </Pill>

              <h1 className="mt-9 text-6xl font-black leading-[0.98] tracking-tight">
                No global theme.
                <br />
                Every deck owns its visual language.
              </h1>

              <p className="mt-8 max-w-4xl text-3xl leading-snug text-[#47627f]">
                WebSlides treats the framework as structure: slide bounds,
                export, presenter mode, and settings. The deck code defines the
                style.
              </p>

              <div className="mt-12 grid grid-cols-3 gap-4">
                {["Bespoke visuals", "Reusable local code", "Export-safe DOM"].map(
                  (item) => (
                    <div
                      key={item}
                      className="rounded-2xl border border-sky-200/80 bg-white/64 p-4 text-2xl font-bold text-[#173b5f]"
                    >
                      {item}
                    </div>
                  )
                )}
              </div>
            </div>

            <div className="relative grid place-items-center">
              <div className="absolute h-[30rem] w-[30rem] animate-[webslides-orbit_18s_linear_infinite] rounded-full border border-sky-200/70" />
              <div className="absolute h-[22rem] w-[22rem] animate-[webslides-orbit_13s_linear_infinite_reverse] rounded-full border border-blue-200/80" />
              <div className="relative grid h-[24.5rem] w-[24.5rem] animate-[webslides-float_5s_ease-in-out_infinite] grid-rows-[auto_1fr] overflow-hidden rounded-[2.2rem] border border-slate-950/10 bg-[#0e3047] p-7 text-white shadow-[0_50px_120px_rgba(15,48,80,0.26)]">
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    <span className="h-3 w-3 rounded-full bg-[#f8c15f]" />
                    <span className="h-3 w-3 rounded-full bg-[#90cdf4]" />
                    <span className="h-3 w-3 rounded-full bg-[#7ab7ff]" />
                  </div>
                  <FileCode2 className="h-7 w-7 text-[#dff3ff]" />
                </div>
                <div className="mt-8 grid content-center gap-4">
                  <div className="h-5 w-3/4 origin-left animate-[webslides-line_3.4s_ease-in-out_infinite] rounded-full bg-white/24" />
                  <div className="h-5 w-11/12 origin-left animate-[webslides-line_3.4s_ease-in-out_0.45s_infinite] rounded-full bg-[#7dd3fc]/70" />
                  <div className="h-5 w-2/3 origin-left animate-[webslides-line_3.4s_ease-in-out_0.9s_infinite] rounded-full bg-white/18" />
                  <div className="mt-7 grid grid-cols-2 gap-4">
                    <div className="h-24 rounded-2xl bg-white/10" />
                    <div className="h-24 rounded-2xl bg-[#bfdbfe]/20" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </PresentationSlide>

        {/* Slide 02 */}
        <PresentationSlide
          title="What Stays in the Framework"
          className="bg-[radial-gradient(circle_at_82%_12%,rgba(186,230,253,0.26),transparent_32%),linear-gradient(135deg,#fbfdff_0%,#f3f7fc_100%)] text-[#10213a]"
        >
          <div className="grid min-h-0 grid-cols-[1fr_1.52fr] gap-16 my-auto pb-8">
            <div className="flex flex-col justify-between pr-5">
              <div>
                <Pill className="border-sky-200 bg-sky-50 text-sky-800">
                  <Boxes className="h-5 w-5" />
                  Structural primitives
                </Pill>
                <h2 className="mt-5 text-[3.45rem] font-black leading-[0.96] tracking-tight">
                  The boring parts stay dependable.
                </h2>
                <p className="mt-6 max-w-136 text-2xl leading-relaxed text-[#536985]">
                  Decks can look different every time because shared code still
                  protects the mechanics that must not drift.
                </p>
              </div>

              <div className="rounded-4xl bg-[#10213a] p-5 text-white">
                <p className="text-2xl font-bold uppercase tracking-[0.22em] text-[#93c5fd]">
                  Current settings
                </p>
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-2xl text-white/55">Aspect</p>
                    <p className="mt-1 text-3xl font-bold">
                      {settings.aspectRatio}
                    </p>
                  </div>
                  <div>
                    <p className="text-2xl text-white/55">Resolution</p>
                    <p className="mt-1 text-3xl font-bold">
                      {settings.resolution}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-7 self-start">
              <Capability
                icon={Layers3}
                title="Slide boundary"
                body="PresentationSlide owns dimensions, numbering metadata, and exports."
              />
              <Capability
                icon={Download}
                title="Export path"
                body="PNG, PDF, and PPTX export at deterministic slide dimensions."
              />
              <Capability
                icon={MonitorPlay}
                title="Presenter mode"
                body="Live view, presenter notes, session sync, and storage are framework concerns."
              />
              <Capability
                icon={PenTool}
                title="Deck styling"
                body="Visual systems live beside content in page.tsx, as local code the agent controls."
              />
            </div>
          </div>
        </PresentationSlide>

        {/* Slide 03 */}
        <PresentationSlide
          title="Agent Authoring Contract"
          headerTone="dark"
          className="bg-[radial-gradient(circle_at_84%_75%,rgba(56,189,248,0.18),transparent_33%),linear-gradient(135deg,#0f172a_0%,#133450_58%,#0f172a_100%)] text-white"
        >
          <div className="relative grid min-h-0 grid-cols-[1fr_1fr] gap-16 my-auto pb-8">
            <div className="flex flex-col justify-center mb-4">
              <Pill className="w-fit border-white/16 bg-white/8 text-[#dff3ff]">
                <CheckCircle2 className="h-5 w-5" />
                Prompt-level guidance
              </Pill>
              <h2 className="mt-8 text-6xl font-black leading-tight tracking-tight">
                Freedom with hard export constraints.
              </h2>
              <p className="mt-6 text-2xl leading-relaxed text-white/68 max-w-lg">
                Agents can invent visual systems, but every slide still has to
                fit the viewport, read at a distance, and export cleanly.
              </p>
            </div>

            <div className={darkPanel}>
              <Rule label="Define" hideTopBorder>
                Local components, class constants, diagrams, and data structures.
              </Rule>
              <Rule label="Reuse" className="pt-4">
                Abstractions only when repetition appears or coherence improves.
              </Rule>
              <Rule label="Avoid" className="pt-4">
                Hidden autoplay content, carousels, marquees, and timing-dependent meaning.
              </Rule>
              <Rule label="Export" className="pt-4">
                Final static state must contain the important information.
              </Rule>
            </div>
          </div>
        </PresentationSlide>

        {/* Slide 04 */}
        <PresentationSlide
          title="Slide Content Can Still Be Rich"
          className="bg-[#f5f7fb] text-[#121826]"
        >
          <div className="grid min-h-0 grid-cols-[1fr_1fr] gap-16 my-auto pb-8">
            <div className="flex flex-col gap-6">
              <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-4 shadow-[0_26px_70px_rgba(15,23,42,0.10)]">
                <CustomImage
                  path="assets/sample-pexels.jpg"
                  className="h-[20rem] w-full rounded-[1.4rem] object-cover"
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                {["image", "math", "diagram"].map((item) => (
                  <div
                    key={item}
                    className="rounded-2xl border border-slate-200 bg-white p-4 text-center text-xl font-bold uppercase tracking-[0.18em] text-slate-500"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col justify-between">
              <div>
                <Pill className="border-blue-200 bg-blue-50 text-blue-800">
                  <ArrowRight className="h-5 w-5" />
                  Still Just React
                </Pill>
                <h2 className="mt-5 text-[3.2rem] font-black leading-[0.98] tracking-tight">
                  Bespoke does not mean unstructured.
                </h2>
                <p className="mt-5 max-w-[32rem] text-xl leading-relaxed text-slate-600">
                  The deck can mix imagery, local visual components, and LaTeX
                  without depending on a shared theme registry.
                </p>
              </div>

              <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_26px_70px_rgba(15,23,42,0.10)]">
                <p className="text-xl font-bold uppercase tracking-[0.22em] text-slate-500">
                  Example math block
                </p>
                <Latex className="mt-5 block text-4xl leading-relaxed text-slate-950">
                  {String.raw`$$
E = mc^2 \quad \Rightarrow \quad \Delta E = \Delta m c^2
$$`}
                </Latex>
              </div>
            </div>
          </div>
        </PresentationSlide>
      </div>
    </main>
  );
}
