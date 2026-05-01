import { cn } from "@/lib/utils";

export default function StageTimeline({
  activeStage = 1,
  className,
}: {
  activeStage: number;
  className?: string;
}) {
  const baseNumberClass =
    "grid h-10 w-10 place-items-center rounded-2xl text-xl font-semibold";
  const mutedClass = "text-slate-500";

  return (
    <div
      className={cn(
        className,
        "mt-auto pt-8 flex items-center gap-6 px-0.5"
      )}
    >
      <div className={cn(mutedClass, "flex items-center gap-3 text-xl font-semibold")}>
        <span
          className={cn(
            baseNumberClass,
            activeStage === 1
              ? "bg-slate-950 text-white"
              : "bg-slate-100 text-slate-500"
          )}
        >
          1
        </span>
        <span>Problem</span>
      </div>
      <div className={cn(mutedClass, "h-px flex-1 bg-current opacity-20")} />
      <div className={cn(mutedClass, "flex items-center gap-3 text-xl font-semibold")}>
        <span
          className={cn(
            baseNumberClass,
            activeStage === 2
              ? "bg-slate-950 text-white"
              : "bg-slate-100 text-slate-500"
          )}
        >
          2
        </span>
        <span>Method</span>
      </div>
      <div className={cn(mutedClass, "h-px flex-1 bg-current opacity-20")} />
      <div className={cn(mutedClass, "flex items-center gap-3 text-xl font-semibold")}>
        <span
          className={cn(
            baseNumberClass,
            activeStage === 3
              ? "bg-slate-950 text-white"
              : "bg-slate-100 text-slate-500"
          )}
        >
          3
        </span>
        <span>Synthesis</span>
      </div>
    </div>
  );
}
