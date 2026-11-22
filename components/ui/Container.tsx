import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

/**
 * Responsive page width container driven by `--container-max-width` (1318px: 90% base 1296px + 22px
 * so left and right margins sit ~0.25–0.3 cm closer to the extreme edges).
 */
export function Container({ children, className, ...props }: ContainerProps) {
  return (
    <div
      className={cn("mx-auto w-full max-w-[var(--container-max-width)] px-5 md:px-8 lg:px-12", className)}
      {...props}
    >
      {children}
    </div>
  );
}

