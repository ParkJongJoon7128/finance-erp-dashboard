import { cva, type VariantProps } from "class-variance-authority";
import type { HTMLAttributes } from "react";
import { cn } from "@/shared/lib";

const cardVariants = cva("rounded-xl border bg-card", {
  variants: {
    padding: {
      none: "p-0",
      sm: "p-4",
      md: "p-6",
    },
    shadow: {
      none: "shadow-none",
      sm: "shadow-sm",
      md: "shadow-md",
    },
  },
  defaultVariants: {
    padding: "md",
    shadow: "sm",
  },
});

interface CardProps extends HTMLAttributes<HTMLDivElement>, VariantProps<typeof cardVariants> {}

export function Card({ className, padding, shadow, ...props }: CardProps) {
  return <div className={cn(cardVariants({ padding, shadow }), className)} {...props} />;
}
