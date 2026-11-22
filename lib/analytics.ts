/**
 * Privacy-first analytics and centralized error-reporting module.
 * Currently avoids cookies and third-party tracking scripts; wire up production
 * analytics and error monitoring (e.g., Sentry) in this single place when ready.
 */

/** Records a page view when an analytics provider is configured. */
export function trackPageView(_path: string): void {
  // No-op until analytics is configured.
}

/** Records a custom domain event when an analytics provider is configured. */
export function trackEvent(_name: string, _properties?: Record<string, string | number>): void {
  // No-op until analytics is configured.
}

/**
 * Logs technical error diagnostics silently at error boundaries without exposing
 * sensitive or technical details to end users. Forward to Sentry/monitoring here in production.
 */
export function reportError(
  scope: string,
  error: unknown,
  context?: Record<string, unknown>,
): void {
  if (context && Object.keys(context).length > 0) {
    console.error(`[${scope}]`, error, context);
    return;
  }
  console.error(`[${scope}]`, error);
}
