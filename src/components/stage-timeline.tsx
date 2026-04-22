import { cn } from "@/lib/utils";
import { usePresentationSettings } from "@/core/presentation-settings";

export default function StageTimeline({
  activeStage = 1,
  className,
}: {
  activeStage: number;
  className?: string;
}) {
  const {
    textMediumClass,
    textMutedClass,
    surfaceBgClass,
    surfaceSoftBgClass
  } = usePresentationSettings().themeStyles;

  const baseNumberClass =
    "grid h-10 w-10 place-items-center rounded-2xl text-xl font-semibold";

  return (
    <div
      className={cn(
        className,
        "mt-auto flex items-center gap-6 px-0.5"
      )}
    >
      <div className={cn(textMutedClass, "flex items-center gap-3 text-xl font-semibold")}>
        <span
          className={cn(
            baseNumberClass,
            activeStage === 1
              ? `${surfaceBgClass} ${textMediumClass}`
              : `${surfaceSoftBgClass} ${textMutedClass}`
          )}
        >
          1
        </span>
        <span>Problem</span>
      </div>
      <div className={cn(textMutedClass, "h-px flex-1 bg-current opacity-20")} />
      <div className={cn(textMutedClass, "flex items-center gap-3 text-xl font-semibold")}>
        <span
          className={cn(
            baseNumberClass,
            activeStage === 2
              ? `${surfaceBgClass} ${textMediumClass}`
              : `${surfaceSoftBgClass} ${textMutedClass}`
          )}
        >
          2
        </span>
        <span>Method</span>
      </div>
      <div className={cn(textMutedClass, "h-px flex-1 bg-current opacity-20")} />
      <div className={cn(textMutedClass, "flex items-center gap-3 text-xl font-semibold")}>
        <span
          className={cn(
            baseNumberClass,
            activeStage === 3
              ? `${surfaceBgClass} ${textMediumClass}`
              : `${surfaceSoftBgClass} ${textMutedClass}`
          )}
        >
          3
        </span>
        <span>Synthesis</span>
      </div>
    </div>
  );
}
