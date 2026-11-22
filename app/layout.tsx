import type { Metadata } from "next";
import { Archivo, DM_Mono, Inter } from "next/font/google";
import { ToastProvider } from "@/components/ui";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { content } from "@/lib/content";
import { site } from "@/lib/site";
import "./globals.css";

const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-archivo",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

const dmMono = DM_Mono({
  subsets: ["latin"],
  weight: ["500"],
  variable: "--font-dm-mono",
  display: "swap",
});

/** Revalidate root layout every 60 seconds so static pages stay edge-cached. */
export const revalidate = 60;

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: content.meta.defaultTitle,
    template: content.meta.titleTemplate,
  },
  description: content.meta.defaultDescription,
  openGraph: {
    type: "website",
    locale: site.ogLocale,
    url: site.url,
    siteName: site.name,
    title: content.meta.defaultTitle,
    description: content.meta.defaultDescription,
  },
  twitter: {
    card: "summary_large_image",
    title: content.meta.defaultTitle,
    description: content.meta.defaultDescription,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang={site.htmlLang}
      className={`${archivo.variable} ${inter.variable} ${dmMono.variable}`}
    >
      <body className="flex min-h-screen flex-col bg-cream text-ink antialiased">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[var(--z-skip-link)] focus:rounded-pill focus:border-2 focus:border-ink focus:bg-yellow focus:px-5 focus:py-3 focus:text-sm focus:font-semibold focus:text-ink"
        >
          {content.nav.skipToContent}
        </a>
        <ToastProvider>
          <Navbar />
          <div className="flex-1">{children}</div>
          <Footer />
        </ToastProvider>
      </body>
    </html>
  );
}
