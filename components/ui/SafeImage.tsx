"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";
import { Placeholder, type PlaceholderRatio, type PlaceholderTone } from "@/components/ui/Placeholder";
import { reportError } from "@/lib/analytics";

export interface SafeImageProps extends Omit<ImageProps, "onError"> {
  /** Fallback placeholder label rendered if the image fails to load. */
  fallbackLabel: string;
  /** Placeholder background tone used if the image fails to load. */
  fallbackTone?: PlaceholderTone;
  /** Placeholder aspect ratio used if the image fails to load. */
  fallbackRatio?: PlaceholderRatio;
}

/**
 * Wrapper around `next/image` that automatically skips optimization for inline data URIs
 * and gracefully falls back to an intentional `<Placeholder />` if a remote asset fails to load.
 */
export function SafeImage({
  src,
  alt,
  fallbackLabel,
  fallbackTone = "sand",
  fallbackRatio = "auto",
  unoptimized,
  ...props
}: SafeImageProps) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const srcString = typeof src === "string" ? src : null;
  const isDataUri = srcString ? srcString.startsWith("data:") : false;
  const hasFailed = srcString !== null && failedSrc === srcString;

  if (hasFailed) {
    return (
      <Placeholder
        tone={fallbackTone}
        ratio={fallbackRatio}
        label={fallbackLabel}
        className="h-full w-full"
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      unoptimized={unoptimized ?? isDataUri}
      onError={() => {
        reportError("SafeImage", new Error("Image failed to load"), { src: srcString, alt });
        if (srcString) {
          setFailedSrc(srcString);
        }
      }}
      {...props}
    />
  );
}
