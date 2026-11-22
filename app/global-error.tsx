"use client";

import { useEffect } from "react";
import { reportError } from "@/lib/analytics";
import { content } from "@/lib/content";
import { layoutConfig, routes, themeColors } from "@/lib/site";

/**
 * Root-level error boundary that catches failures in app/layout.tsx.
 * Uses self-contained inline styling from centralized `themeColors` and `layoutConfig`
 * with hard navigation so the user can always recover even if root CSS chunks or the Next.js router failed.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    reportError("GlobalError", error, { digest: error.digest });
  }, [error]);

  function handleReturnHome() {
    window.location.assign(routes.home);
  }

  return (
    <html lang="en" style={{ fontSize: `${layoutConfig.rootScalePercent}%` }}>
      <body
        className="bg-cream text-ink antialiased"
        style={{
          backgroundColor: themeColors.cream,
          color: themeColors.ink,
          margin: 0,
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        <main
          id="main-content"
          style={{ maxWidth: "48rem", margin: "0 auto", padding: "6rem 1.5rem" }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <h1
              style={{
                fontSize: "2rem",
                fontWeight: 800,
                letterSpacing: "-0.02em",
                margin: 0,
                color: themeColors.ink,
              }}
            >
              {content.errors.errorTitle}
            </h1>
            <p
              style={{
                maxWidth: "52ch",
                fontSize: "1.125rem",
                lineHeight: 1.6,
                margin: 0,
                color: themeColors.muted,
              }}
            >
              {content.errors.errorDescription}
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", paddingTop: "0.5rem" }}>
              <button
                type="button"
                onClick={() => reset()}
                style={{
                  borderRadius: "999px",
                  border: `2px solid ${themeColors.ink}`,
                  backgroundColor: themeColors.yellow,
                  color: themeColors.ink,
                  padding: "0.75rem 1.5rem",
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                {content.errors.errorCta}
              </button>
              <button
                type="button"
                onClick={handleReturnHome}
                style={{
                  borderRadius: "999px",
                  border: `2px solid ${themeColors.ink}`,
                  backgroundColor: themeColors.ink,
                  color: themeColors.cream,
                  padding: "0.75rem 1.5rem",
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                {content.errors.errorHomeCta}
              </button>
            </div>
          </div>
        </main>
      </body>
    </html>
  );
}
