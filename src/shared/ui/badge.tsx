import { cva, type VariantProps } from "class-variance-authority";
import type { HTMLAttributes } from "react";
import { cn } from "@/shared/lib/cn";

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2 py-0.5 text-tds-7 font-medium",
  {
    variants: {
      variant: {
        default:
          "border-toss-grey-200 bg-toss-grey-100 text-toss-grey-700 dark:border-toss-grey-700 dark:bg-toss-grey-800 dark:text-toss-grey-300",
        success:
          "border-toss-green-100 bg-toss-green-50 text-toss-green-600 dark:border-toss-green-600 dark:bg-toss-grey-800 dark:text-toss-green-300",
        warning:
          "border-toss-orange-100 bg-toss-orange-50 text-toss-orange-600 dark:border-toss-orange-600 dark:bg-toss-grey-800 dark:text-toss-orange-100",
        danger:
          "border-toss-red-100 bg-toss-red-50 text-toss-red-600 dark:border-toss-red-600 dark:bg-toss-grey-800 dark:text-toss-red-300",
        info: "border-toss-blue-100 bg-toss-blue-50 text-toss-blue-700 dark:border-toss-blue-600 dark:bg-toss-grey-800 dark:text-toss-blue-200",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export function Badge({
  className,
  variant,
  ...props
}: HTMLAttributes<HTMLSpanElement> & VariantProps<typeof badgeVariants>) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}
