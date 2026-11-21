import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface StickerProps extends HTMLAttributes<HTMLSpanElement> {
  children: ReactNode;
  rotation?: -4 | -3 | 0;
}

const rotationClasses: Record<NonNullable<StickerProps["rotation"]>, string> = {
  [-4]: "-rotate-4",
  [-3]: "-rotate-3",
  0: "rotate-0",
};

export function Sticker({ children, rotation = -4, className, ...props }: StickerProps) {
  return (
    <span
      className={cn(
        "font-meta inline-flex items-center rounded-pill border-2 border-ink bg-yellow px-4 py-[7px] text-ink select-none",
        rotationClasses[rotation],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}

