import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/shared/ui/card";

type MetricCardProps = {
  title: string;
  value: string;
  change: string;
  icon: LucideIcon;
  tone?: "default" | "success" | "warning";
};

export function MetricCard({
  title,
  value,
  change,
  icon: Icon,
  tone = "default",
}: MetricCardProps) {
  const toneClassName = {
    default:
      "bg-toss-grey-100 text-toss-grey-700 dark:bg-toss-grey-800 dark:text-toss-grey-300",
    success:
      "bg-toss-green-50 text-toss-green-600 dark:bg-toss-grey-800 dark:text-toss-green-300",
    warning:
      "bg-toss-orange-50 text-toss-orange-600 dark:bg-toss-grey-800 dark:text-toss-orange-100",
  }[tone];

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-tds-6 text-muted">{title}</p>
            <p className="mt-2 break-keep text-tds-3 font-semibold sm:text-tds-2">
              {value}
            </p>
          </div>
          <div className={`shrink-0 rounded-md p-2 ${toneClassName}`}>
            <Icon className="h-5 w-5" aria-hidden="true" />
          </div>
        </div>
        <p className="mt-3 text-tds-7 text-muted">{change}</p>
      </CardContent>
    </Card>
  );
}
