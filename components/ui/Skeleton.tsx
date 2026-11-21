import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  rounded?: "input" | "frame" | "card" | "pill";
}

const roundedClasses: Record<NonNullable<SkeletonProps["rounded"]>, string> = {
  input: "rounded-input",
  frame: "rounded-frame",
  card: "rounded-card",
  pill: "rounded-pill",
};

export function Skeleton({ rounded = "input", className, ...props }: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={cn("animate-skeleton bg-sand", roundedClasses[rounded], className)}
      {...props}
    />
  );
}

