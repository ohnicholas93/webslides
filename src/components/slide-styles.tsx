export const themes = {
  Aurora: {
    slideClass:
      "bg-gradient-to-br from-white via-[#f6f7ff] to-[#e7edff] text-slate-800 shadow-[0_30px_120px_rgba(15,23,66,0.15)]",
    slideBackgroundClass:
      "after:absolute after:-right-24 after:-top-24 after:h-72 after:w-72 after:rounded-full after:bg-gradient-to-br after:from-[#a6b8ff] after:via-[#f3f8ff] after:to-[#ffe6f2] after:blur-3xl after:opacity-70 after:pointer-events-none",
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
    iconBadgeStrongClass:
      "flex p-3 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 border border-indigo-100 shadow-sm text-indigo-600",
    statCardClass:
      "flex flex-col justify-center p-6 rounded-2xl bg-white border border-slate-100 shadow-sm",
    textBaseClass: "text-slate-800",
    textStrongClass: "text-slate-900",
    textMediumClass: "text-slate-700",
    textSoftClass: "text-slate-600",
    textMutedClass: "text-slate-500",
    textFaintClass: "text-slate-400",
    textAccentClass: "text-indigo-500",
    textAccentStrongClass: "text-indigo-600",
    textWarnClass: "text-rose-600",
    textWarnStrongClass: "text-rose-500",
    surfaceBgClass: "bg-white",
    surfaceSoftBgClass: "bg-slate-50/50",
  },
  Mono: {
    slideClass:
      "bg-gradient-to-br from-white via-slate-50 to-slate-100 text-slate-900 shadow-[0_30px_120px_rgba(15,23,42,0.16)]",
    slideBackgroundClass:
      "after:absolute after:-right-24 after:-top-24 after:h-72 after:w-72 after:rounded-full after:bg-gradient-to-br after:from-slate-200 after:via-white after:to-slate-300 after:blur-3xl after:opacity-80 after:pointer-events-none",
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
    iconBadgeStrongClass:
      "flex p-3 shrink-0 items-center justify-center rounded-2xl bg-slate-50 border border-slate-100 shadow-sm text-slate-600",
    statCardClass:
      "flex flex-col justify-center p-6 rounded-2xl bg-white border border-slate-200 shadow-sm",
    textBaseClass: "text-slate-900",
    textStrongClass: "text-slate-900",
    textMediumClass: "text-slate-800",
    textSoftClass: "text-slate-700",
    textMutedClass: "text-slate-500",
    textFaintClass: "text-slate-400",
    textAccentClass: "text-slate-700",
    textAccentStrongClass: "text-slate-800",
    textWarnClass: "text-slate-800",
    textWarnStrongClass: "text-slate-800",
    surfaceBgClass: "bg-white",
    surfaceSoftBgClass: "bg-slate-50/60",
  },
  Midnight: {
    slideClass:
      "bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-slate-100 shadow-[0_30px_120px_rgba(0,0,0,0.55)]",
    slideBackgroundClass:
      "after:absolute after:-right-24 after:-top-24 after:h-72 after:w-72 after:rounded-full after:bg-gradient-to-br after:from-indigo-500/30 after:via-slate-950/10 after:to-fuchsia-400/20 after:blur-3xl after:opacity-80 after:pointer-events-none",
    slideMetaTextClass: "text-slate-400",
    slideMetaNumberClass: "text-slate-200",
    chipClass:
      "inline-flex items-center gap-2 rounded-full border border-slate-700/80 bg-slate-950/40 px-4 py-1 text-sm font-medium text-slate-200 shadow-sm backdrop-blur",
    cardClass:
      "rounded-3xl border border-slate-800/70 bg-slate-950/40 p-8 shadow-[0_10px_40px_rgba(0,0,0,0.35)] backdrop-blur flex flex-col",
    accentCardClass:
      "rounded-3xl border border-indigo-900/50 bg-gradient-to-br from-indigo-950/40 via-slate-950/30 to-slate-950/30 p-8 shadow-[0_10px_40px_rgba(79,70,229,0.18)] backdrop-blur flex flex-col",
    critiqueCardClass:
      "rounded-3xl border-l-8 border-l-rose-400 border-y border-r border-y-rose-950/50 border-r-rose-950/50 bg-slate-950/40 p-8 shadow-[0_10px_40px_rgba(244,63,94,0.14)] backdrop-blur flex flex-col relative overflow-hidden",
    softCardClass:
      "rounded-3xl border border-slate-800/70 bg-slate-900/25 p-6 backdrop-blur",
    figureCardClass:
      "figureCard flex flex-col gap-6 rounded-3xl border border-slate-800/70 bg-slate-950/35 p-4 shadow-sm h-full w-full justify-center items-center overflow-hidden backdrop-blur",
    iconBadgeClass:
      "flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-slate-950/40 border border-slate-800/70 shadow-sm text-slate-200 backdrop-blur",
    iconBadgeStrongClass:
      "flex p-3 shrink-0 items-center justify-center rounded-2xl bg-indigo-950 border border-indigo-800 shadow-sm text-indigo-200",
    statCardClass:
      "flex flex-col justify-center p-6 rounded-2xl bg-slate-950/35 border border-slate-800/70 shadow-sm backdrop-blur",
    textBaseClass: "text-slate-100",
    textStrongClass: "text-white",
    textMediumClass: "text-slate-200",
    textSoftClass: "text-slate-300",
    textMutedClass: "text-slate-400",
    textFaintClass: "text-slate-500",
    textAccentClass: "text-indigo-300",
    textAccentStrongClass: "text-indigo-200",
    textWarnClass: "text-rose-300",
    textWarnStrongClass: "text-rose-400",
    surfaceBgClass: "bg-slate-600/75",
    surfaceSoftBgClass: "bg-slate-700/30",
  },
  Custom: {
    slideClass:
      "bg-[var(--slide-bg)] text-[var(--slide-fg)] shadow-[0_30px_120px_rgba(0,0,0,0.25)]",
    slideBackgroundClass:
      "after:absolute after:-right-24 after:-top-24 after:h-72 after:w-72 after:rounded-full after:bg-[radial-gradient(ellipse_at_center,var(--slide-accent)_0%,transparent_65%)] after:blur-3xl after:opacity-70 after:pointer-events-none",
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
    iconBadgeStrongClass:
      "flex p-3 shrink-0 items-center justify-center rounded-2xl bg-[var(--slide-accent-bg)] border border-[var(--slide-border)] shadow-sm text-[var(--slide-accent)]",
    statCardClass:
      "flex flex-col justify-center p-6 rounded-2xl bg-[var(--slide-card-bg)] border border-[var(--slide-border)] shadow-sm",
    textBaseClass: "text-[var(--slide-fg)]",
    textStrongClass: "text-[var(--slide-fg)]",
    textMediumClass: "text-[var(--slide-fg)]",
    textSoftClass: "text-[var(--slide-muted)]",
    textMutedClass: "text-[var(--slide-muted)]",
    textFaintClass: "text-[var(--slide-muted)]",
    textAccentClass: "text-[var(--slide-accent)]",
    textAccentStrongClass: "text-[var(--slide-accent)]",
    textWarnClass: "text-[var(--slide-warn)]",
    textWarnStrongClass: "text-[var(--slide-warn)]",
    surfaceBgClass: "bg-[var(--slide-card-bg)]",
    surfaceSoftBgClass: "bg-[var(--slide-soft-bg)]",
  },
} as const;

export type ThemeName = keyof typeof themes;
