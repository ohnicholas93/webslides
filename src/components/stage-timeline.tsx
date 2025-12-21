import { cn } from "@/lib/utils";
import { usePresentationSettings } from "@/core/presentation-settings";

export default function StageTimeline({ activeStage = 1, className }: { activeStage: number, className?: string }) {
  const {
    textMediumClass,
    textMutedClass,
    surfaceBgClass,
    surfaceSoftBgClass,
  } = usePresentationSettings().themeStyles;
  
  const baseNumberClass = `h-10 w-10 rounded-2xl bg-slate-200 flex items-center justify-center`

  return (
    <div className={cn("mt-6! flex items-center gap-6 px-0.5", className)}>
      <div className="flex items-center gap-3 text-sm font-semibold text-slate-500">
        <span className={cn(baseNumberClass, activeStage === 1 ? `${surfaceBgClass} ${textMediumClass}` : `${surfaceSoftBgClass} ${textMutedClass}`)}>1</span>
        <span>Problem</span>
      </div>
      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-300 to-transparent" />
      <div className="flex items-center gap-3 text-sm font-semibold text-slate-500">
        <span className={cn(baseNumberClass, activeStage === 2 ? `${surfaceBgClass} ${textMediumClass}` : `${surfaceSoftBgClass} ${textMutedClass}`)}>2</span>
        <span>Method</span>
      </div>
      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-300 to-transparent" />
      <div className="flex items-center gap-3 text-sm font-semibold text-slate-500">
        <span className={cn(baseNumberClass, activeStage === 3 ? `${surfaceBgClass} ${textMediumClass}` : `${surfaceSoftBgClass} ${textMutedClass}`)}>3</span>
        <span>Synthesis</span>
      </div>
    </div>
  )
}