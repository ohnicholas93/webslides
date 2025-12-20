import { cn } from "@/lib/utils";

export default function StageTimeline({ activeStage = 1, className }: { activeStage: number, className?: string }) {
  const baseNumberClass = "h-10 w-10 rounded-2xl bg-slate-200 flex items-center justify-center text-slate-800"
  return (
    <div className={cn("mt-6 flex items-center gap-6 px-0.5", className)}>
      <div className="flex items-center gap-3 text-sm font-semibold text-slate-500">
        <span className={cn(baseNumberClass, activeStage === 1 && "bg-slate-900/90 text-white")}>1</span>
        <span>Problem</span>
      </div>
      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-300 to-transparent" />
      <div className="flex items-center gap-3 text-sm font-semibold text-slate-500">
        <span className={cn(baseNumberClass, activeStage === 2 && "bg-slate-900/90 text-white")}>2</span>
        <span>Method</span>
      </div>
      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-300 to-transparent" />
      <div className="flex items-center gap-3 text-sm font-semibold text-slate-500">
        <span className={cn(baseNumberClass, activeStage === 3 && "bg-slate-900/90 text-white")}>3</span>
        <span>Synthesis</span>
      </div>
    </div>
  )
}