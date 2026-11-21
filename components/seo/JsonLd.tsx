export interface JsonLdProps {
  data: Record<string, unknown>;
}

/**
 * Renders structured JSON-LD safely as a React text child (no dangerouslySetInnerHTML).
 * Escapes "<" to prevent premature </script> closing from dynamic API strings.
 */
export function JsonLd({ data }: JsonLdProps) {
  const safeJson = JSON.stringify(data).replaceAll("<", "\\u003c");
  return <script type="application/ld+json">{safeJson}</script>;
}

