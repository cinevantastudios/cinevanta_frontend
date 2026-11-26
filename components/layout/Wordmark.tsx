import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

export interface WordmarkProps {
  size?: "sm" | "md" | "giant";
  tone?: "ink" | "cream";
  withAsterisk?: boolean;
  outlined?: boolean;
  className?: string;
}

const imageSizeClasses: Record<NonNullable<WordmarkProps["size"]>, string> = {
  sm: "h-12 w-auto md:h-14",
  md: "h-14 w-auto md:h-16",
  giant: "h-24 w-auto md:h-32",
};

export function Wordmark({
  size = "sm",
  tone = "ink",
  withAsterisk = true,
  className,
}: WordmarkProps) {
  const logoSrc = tone === "cream" ? "/images/logo-cream.png" : "/images/logo.png";

  return (
    <span
      className={cn(
        "inline-flex items-center whitespace-nowrap select-none",
        className,
      )}
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- Static brand logo asset rendered at intrinsic aspect ratio */}
      <img
        src={logoSrc}
        alt=""
        aria-hidden="true"
        className={cn("object-contain", imageSizeClasses[size])}
      />
      <span className="sr-only">
        {site.wordmark}
        {withAsterisk ? "*" : ""}
      </span>
    </span>
  );
}


