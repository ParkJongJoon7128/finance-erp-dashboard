import { cn } from "@/shared/lib/cn";

type ProgressProps = {
  value: number;
  className?: string;
  indicatorClassName?: string;
};

export function Progress({
  value,
  className,
  indicatorClassName,
}: ProgressProps) {
  const normalizedValue = Math.max(0, Math.min(value, 100));

  return (
    <div
      className={cn(
        "h-2 overflow-hidden rounded-full bg-toss-grey-100 dark:bg-toss-grey-700",
        className,
      )}
    >
      <div
        className={cn(
          "h-full rounded-full bg-primary transition-all",
          indicatorClassName,
        )}
        style={{ width: `${normalizedValue}%` }}
      />
    </div>
  );
}
