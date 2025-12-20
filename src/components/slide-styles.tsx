export const themes = {
  Aurora: {
    slideClass:
      "bg-gradient-to-br from-white via-[#f6f7ff] to-[#e7edff] text-slate-800 shadow-[0_30px_120px_rgba(15,23,66,0.15)]",
    slideBackgroundClass:
      "before:absolute before:inset-10 before:rounded-[40px] before:border before:border-slate-200/80 before:pointer-events-none after:absolute after:-right-24 after:-top-24 after:h-72 after:w-72 after:rounded-full after:bg-gradient-to-br after:from-[#a6b8ff] after:via-[#f3f8ff] after:to-[#ffe6f2] after:blur-3xl after:opacity-70 after:pointer-events-none",
    slideMetaTextClass: "text-slate-500",
    slideMetaNumberClass: "text-slate-700",
    chipClass:
      "inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-1 text-sm font-medium text-slate-600 shadow-sm",
    cardClass:
      "rounded-3xl border border-slate-200/80 bg-white/95 p-8 shadow-[0_10px_40px_rgba(0,0,0,0.04)] backdrop-blur flex flex-col",
    accentCardClass:
      "rounded-3xl border border-indigo-100/80 bg-gradient-to-br from-indigo-50/50 via-white to-blue-50/50 p-8 shadow-[0_10px_40px_rgba(99,102,241,0.1)] flex flex-col",
    critiqueCardClass:
      "rounded-3xl border-l-8 border-l-rose-500 border-y border-r border-y-rose-100 border-r-rose-100 bg-gradient-to-br from-rose-50/80 to-white p-8 shadow-[0_10px_40px_rgba(244,63,94,0.1)] flex flex-col relative overflow-hidden",
    softCardClass:
      "rounded-3xl border border-slate-200 bg-slate-50/50 p-6",
    figureCardClass:
      "figureCard flex flex-col gap-6 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm h-full w-full justify-center items-center overflow-hidden",
    iconBadgeClass:
      "flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white border border-slate-100 shadow-sm text-slate-600",
    statCardClass:
      "flex flex-col justify-center p-6 rounded-2xl bg-white border border-slate-100 shadow-sm",
  },
  Mono: {
    slideClass:
      "bg-gradient-to-br from-white via-slate-50 to-slate-100 text-slate-900 shadow-[0_30px_120px_rgba(15,23,42,0.16)]",
    slideBackgroundClass:
      "before:absolute before:inset-10 before:rounded-[40px] before:border before:border-slate-200/80 before:pointer-events-none after:absolute after:-right-24 after:-top-24 after:h-72 after:w-72 after:rounded-full after:bg-gradient-to-br after:from-slate-200 after:via-white after:to-slate-300 after:blur-3xl after:opacity-80 after:pointer-events-none",
    slideMetaTextClass: "text-slate-500",
    slideMetaNumberClass: "text-slate-800",
    chipClass:
      "inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-1 text-sm font-medium text-slate-700 shadow-sm",
    cardClass:
      "rounded-3xl border border-slate-200/80 bg-white p-8 shadow-[0_10px_40px_rgba(15,23,42,0.06)] flex flex-col",
    accentCardClass:
      "rounded-3xl border border-slate-200/80 bg-gradient-to-br from-white via-slate-50 to-slate-100 p-8 shadow-[0_10px_40px_rgba(15,23,42,0.06)] flex flex-col",
    critiqueCardClass:
      "rounded-3xl border-l-8 border-l-slate-800 border-y border-r border-y-slate-200 border-r-slate-200 bg-gradient-to-br from-slate-50 to-white p-8 shadow-[0_10px_40px_rgba(15,23,42,0.06)] flex flex-col relative overflow-hidden",
    softCardClass:
      "rounded-3xl border border-slate-200 bg-slate-50/60 p-6",
    figureCardClass:
      "figureCard flex flex-col gap-6 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm h-full w-full justify-center items-center overflow-hidden",
    iconBadgeClass:
      "flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white border border-slate-200 shadow-sm text-slate-700",
    statCardClass:
      "flex flex-col justify-center p-6 rounded-2xl bg-white border border-slate-200 shadow-sm",
  },
  Custom: {
    slideClass:
      "bg-[var(--slide-bg)] text-[var(--slide-fg)] shadow-[0_30px_120px_rgba(0,0,0,0.25)]",
    slideBackgroundClass:
      "before:absolute before:inset-10 before:rounded-[40px] before:border before:border-[var(--slide-border)] before:pointer-events-none after:absolute after:-right-24 after:-top-24 after:h-72 after:w-72 after:rounded-full after:bg-[radial-gradient(ellipse_at_center,var(--slide-accent)_0%,transparent_65%)] after:blur-3xl after:opacity-70 after:pointer-events-none",
    slideMetaTextClass: "text-[var(--slide-muted)]",
    slideMetaNumberClass: "text-[var(--slide-fg)]",
    chipClass:
      "inline-flex items-center gap-2 rounded-full border border-[var(--slide-border)] bg-[var(--slide-card-bg)] px-4 py-1 text-sm font-medium text-[var(--slide-muted)] shadow-sm",
    cardClass:
      "rounded-3xl border border-[var(--slide-border)] bg-[var(--slide-card-bg)] p-8 shadow-[0_10px_40px_rgba(0,0,0,0.08)] backdrop-blur flex flex-col",
    accentCardClass:
      "rounded-3xl border border-[var(--slide-border)] bg-[var(--slide-accent-bg)] p-8 shadow-[0_10px_40px_rgba(0,0,0,0.1)] flex flex-col",
    critiqueCardClass:
      "rounded-3xl border-l-8 border-l-[var(--slide-warn)] border-y border-r border-y-[var(--slide-border)] border-r-[var(--slide-border)] bg-[var(--slide-card-bg)] p-8 shadow-[0_10px_40px_rgba(0,0,0,0.08)] flex flex-col relative overflow-hidden",
    softCardClass:
      "rounded-3xl border border-[var(--slide-border)] bg-[var(--slide-soft-bg)] p-6",
    figureCardClass:
      "figureCard flex flex-col gap-6 rounded-3xl border border-[var(--slide-border)] bg-[var(--slide-card-bg)] p-4 shadow-sm h-full w-full justify-center items-center overflow-hidden",
    iconBadgeClass:
      "flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[var(--slide-card-bg)] border border-[var(--slide-border)] shadow-sm text-[var(--slide-muted)]",
    statCardClass:
      "flex flex-col justify-center p-6 rounded-2xl bg-[var(--slide-card-bg)] border border-[var(--slide-border)] shadow-sm",
  },
} as const;

export type ThemeName = keyof typeof themes;
