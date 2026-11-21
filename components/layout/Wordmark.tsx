import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

export interface WordmarkProps {
  size?: "sm" | "md" | "giant";
  tone?: "ink" | "cream";
  withAsterisk?: boolean;
  outlined?: boolean;
  className?: string;
}

const sizeClasses: Record<NonNullable<WordmarkProps["size"]>, string> = {
  sm: "text-[24px] leading-none",
  md: "text-[28px] leading-none",
  giant: "text-wordmark-giant leading-[0.92]",
};

export function Wordmark({
  size = "sm",
  tone = "ink",
  withAsterisk = true,
  outlined = false,
  className,
}: WordmarkProps) {
  const colorClass = outlined
    ? tone === "cream"
      ? "text-outline-cream"
      : "text-outline-ink"
    : tone === "cream"
      ? "text-cream"
      : "text-ink";

  return (
    <span
      className={cn(
        "font-display-expanded inline-flex items-baseline whitespace-nowrap select-none",
        sizeClasses[size],
        colorClass,
        className,
      )}
    >
      {site.wordmark}
      {withAsterisk ? (
        <span
          aria-hidden="true"
          className={cn(
            outlined ? "" : tone === "cream" ? "text-cream" : "text-ink",
          )}
        >
          *
        </span>
      ) : null}
    </span>
  );
}

