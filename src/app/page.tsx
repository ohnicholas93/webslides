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

const ink = "text-[#12211b]";
const muted = "text-[#5c6d63]";
const panel =
  "rounded-[1.75rem] border border-[#d8e2dc] bg-white/78 p-6 shadow-[0_24px_70px_rgba(37,67,51,0.12)]";
const darkPanel =
  "rounded-[1.75rem] border border-white/14 bg-white/8 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.24)] backdrop-blur";

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
      <div className="grid h-14 w-14 place-items-center rounded-2xl bg-[#10241b] text-[#d6ffe9]">
        <Icon className="h-7 w-7" />
      </div>
      <h3 className={cn(ink, "mt-5 text-3xl font-bold")}>{title}</h3>
      <p className={cn(muted, "mt-3 text-xl leading-relaxed")}>{body}</p>
    </div>
  );
}

function Rule({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-[8rem_1fr] gap-5 border-t border-[#d7e3dc] py-5">
      <p className="text-xl font-bold uppercase tracking-[0.2em] text-[#0f8d55]">
        {label}
      </p>
      <p className="text-2xl font-semibold leading-snug text-white">
        {children}
      </p>
    </div>
  );
}

export default function Home() {
  const { settings } = usePresentationSettings();

  return (
    <main className="bg-[#eef3ef] px-8 pt-4 pb-16">
      <div className="flex flex-col gap-4">
        {/* Slide 01 */}
        <PresentationSlide
          title="WebSlides"
          className="bg-[#e9f2ec] text-[#12211b]"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_84%_15%,rgba(39,160,96,0.25),transparent_27%),radial-gradient(circle_at_8%_90%,rgba(255,195,77,0.28),transparent_26%)]" />
          <div className="relative grid min-h-0 grid-cols-[1.05fr_0.95fr] gap-10">
            <div className="flex flex-col justify-center">
              <Pill className="w-fit border-[#9ccdb4] bg-white/60 text-[#17593a]">
                <Sparkles className="h-5 w-5" />
                Agent-authored slide systems
              </Pill>

              <h1 className="mt-10 text-7xl font-black leading-[0.95] tracking-tight">
                No global theme.
                <br />
                Every deck owns its visual language.
              </h1>

              <p className="mt-8 max-w-4xl text-3xl leading-snug text-[#40554a]">
                WebSlides now treats the framework as structure: slide bounds,
                export, presenter mode, and settings. The deck code defines the
                style.
              </p>

              <div className="mt-12 grid grid-cols-3 gap-4">
                {["Bespoke visuals", "Reusable local code", "Export-safe DOM"].map(
                  (item) => (
                    <div
                      key={item}
                      className="rounded-2xl border border-[#bdd4c6] bg-white/60 p-4 text-xl font-bold text-[#173d2a]"
                    >
                      {item}
                    </div>
                  )
                )}
              </div>
            </div>

            <div className="relative grid place-items-center">
              <div className="absolute h-[34rem] w-[34rem] rounded-full border border-[#b8d8c5]" />
              <div className="absolute h-[25rem] w-[25rem] rounded-full border border-[#8fbea5]" />
              <div className="relative grid h-[28rem] w-[28rem] rotate-3 grid-rows-[auto_1fr] overflow-hidden rounded-[2.2rem] border border-[#234331]/15 bg-[#10241b] p-7 text-white shadow-[0_50px_120px_rgba(28,65,43,0.28)]">
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    <span className="h-3 w-3 rounded-full bg-[#ffcc66]" />
                    <span className="h-3 w-3 rounded-full bg-[#7ee2a8]" />
                    <span className="h-3 w-3 rounded-full bg-[#7ab7ff]" />
                  </div>
                  <FileCode2 className="h-7 w-7 text-[#d6ffe9]" />
                </div>
                <div className="mt-8 grid content-center gap-4">
                  <div className="h-6 w-3/4 rounded-full bg-white/24" />
                  <div className="h-6 w-11/12 rounded-full bg-[#78dda2]/70" />
                  <div className="h-6 w-2/3 rounded-full bg-white/18" />
                  <div className="mt-7 grid grid-cols-2 gap-4">
                    <div className="h-28 rounded-2xl bg-white/10" />
                    <div className="h-28 rounded-2xl bg-[#ffc94d]/24" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </PresentationSlide>

        {/* Slide 02 */}
        <PresentationSlide
          title="What Stays in the Framework"
          className="bg-[#fbfaf4] text-[#17231b]"
        >
          <div className="grid min-h-0 grid-cols-[0.9fr_1.1fr] gap-8">
            <div className="flex flex-col justify-between">
              <div>
                <Pill className="border-[#dfd4b5] bg-[#fff8df] text-[#71561a]">
                  <Boxes className="h-5 w-5" />
                  Structural primitives
                </Pill>
                <h2 className="mt-8 text-6xl font-black leading-tight tracking-tight">
                  The boring parts stay dependable.
                </h2>
                <p className="mt-6 text-2xl leading-relaxed text-[#5f665d]">
                  Decks can look different every time because shared code still
                  protects the mechanics that must not drift.
                </p>
              </div>

              <div className="rounded-[2rem] bg-[#17231b] p-6 text-white">
                <p className="text-xl font-bold uppercase tracking-[0.22em] text-[#e9d37a]">
                  Current output settings
                </p>
                <div className="mt-5 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xl text-white/55">Aspect</p>
                    <p className="mt-1 text-3xl font-bold">
                      {settings.aspectRatio}
                    </p>
                  </div>
                  <div>
                    <p className="text-xl text-white/55">Resolution</p>
                    <p className="mt-1 text-3xl font-bold">
                      {settings.resolution}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-5">
              <Capability
                icon={Layers3}
                title="Slide boundary"
                body="PresentationSlide owns fixed dimensions, numbering metadata, and export discovery."
              />
              <Capability
                icon={Download}
                title="Export path"
                body="PNG, PDF, and PPTX exports capture the DOM at deterministic slide dimensions."
              />
              <Capability
                icon={MonitorPlay}
                title="Presenter mode"
                body="Live view, presenter notes, session sync, and local storage remain framework concerns."
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
          className="bg-[#10241b] text-white"
        >
          <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(126,226,168,0.16),transparent_42%),radial-gradient(circle_at_82%_75%,rgba(255,201,77,0.22),transparent_30%)]" />
          <div className="relative grid min-h-0 grid-cols-[1fr_1fr] gap-8">
            <div className="flex flex-col justify-center">
              <Pill className="w-fit border-white/16 bg-white/8 text-[#d6ffe9]">
                <CheckCircle2 className="h-5 w-5" />
                Prompt-level guidance
              </Pill>
              <h2 className="mt-8 text-6xl font-black leading-tight tracking-tight">
                Freedom with hard export constraints.
              </h2>
              <p className="mt-6 text-2xl leading-relaxed text-white/68">
                Agents can invent visual systems, but every slide still has to
                fit the viewport, read at a distance, and export cleanly.
              </p>
            </div>

            <div className={darkPanel}>
              <Rule label="Define">
                Local components, class constants, diagrams, and data structures.
              </Rule>
              <Rule label="Reuse">
                Abstractions only when repetition appears or coherence improves.
              </Rule>
              <Rule label="Avoid">
                Hidden autoplay content, carousels, marquees, and timing-dependent meaning.
              </Rule>
              <Rule label="Export">
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
          <div className="grid min-h-0 grid-cols-[1fr_1fr] gap-8">
            <div className="flex flex-col gap-5">
              <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-5 shadow-[0_26px_70px_rgba(15,23,42,0.10)]">
                <CustomImage
                  path="assets/sample-pexels.jpg"
                  className="h-[22rem] w-full rounded-[1.4rem] object-cover"
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
                  Still just React
                </Pill>
                <h2 className="mt-8 text-5xl font-black leading-tight tracking-tight">
                  Bespoke does not mean unstructured.
                </h2>
                <p className="mt-5 text-2xl leading-relaxed text-slate-600">
                  The deck can mix imagery, local visual components, and LaTeX
                  without depending on a shared theme registry.
                </p>
              </div>

              <div className="rounded-[2rem] border border-slate-200 bg-white p-7 shadow-[0_26px_70px_rgba(15,23,42,0.10)]">
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
