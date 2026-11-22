import type { NextConfig } from "next";
import { getEnvApiBaseUrl, getEnvImageHosts } from "./lib/env";

const imageHosts = getEnvImageHosts();
const apiBaseUrl = getEnvApiBaseUrl();

function getOrigin(url: string): string {
  try {
    return new URL(url).origin;
  } catch {
    return "";
  }
}

const isDev = process.env.NODE_ENV !== "production";
const apiOrigin = getOrigin(apiBaseUrl);
const imgSrcSources = ["'self'", "data:", "blob:", ...imageHosts.map((host) => `https://${host}`)];
const connectSrcSources = [
  "'self'",
  ...(apiOrigin ? [apiOrigin] : []),
  ...(isDev ? ["ws:", "wss:", "http://localhost:*", "http://127.0.0.1:*"] : []),
];
const scriptSrcSources = ["'self'", "'unsafe-inline'", ...(isDev ? ["'unsafe-eval'"] : [])];

const cspDirectives = [
  "default-src 'self'",
  `script-src ${scriptSrcSources.join(" ")}`,
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com data:",
  `img-src ${imgSrcSources.join(" ")}`,
  `media-src 'self' ${imageHosts.map((host) => `https://${host}`).join(" ")}`.trim(),
  "frame-src https://www.youtube-nocookie.com https://player.vimeo.com",
  `connect-src ${connectSrcSources.join(" ")}`,
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join("; ");

const nextConfig: NextConfig = {
  images: {
    dangerouslyAllowSVG: false,
    remotePatterns: imageHosts.map((hostname) => ({
      protocol: "https",
      hostname,
    })),
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Content-Security-Policy", value: cspDirectives },
          // Enforce HTTPS via HSTS in production deployments.
          ...(!isDev
            ? [
                {
                  key: "Strict-Transport-Security",
                  value: "max-age=63072000; includeSubDomains; preload",
                },
              ]
            : []),
        ],
      },
    ];
  },
};

export default nextConfig;
