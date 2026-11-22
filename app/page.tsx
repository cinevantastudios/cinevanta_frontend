import { AdStrip } from "@/components/ads/AdStrip";
import { CtaBlock } from "@/components/home/CtaBlock";
import { EventsSection } from "@/components/home/EventsSection";
import { Hero } from "@/components/home/Hero";
import { Marquee } from "@/components/home/Marquee";
import { Partners } from "@/components/home/Partners";
import { Services } from "@/components/home/Services";
import { WorkPreview } from "@/components/home/WorkPreview";
import { JsonLd, buildOrganizationJsonLd } from "@/components/seo/JsonLd";
import { getAds, getEvents, getWork } from "@/lib/api-client";
import { displayLimits, site } from "@/lib/site";

/** Revalidate home page every 60s (matches PAGE_REVALIDATE_SECONDS in cache_logics/revalidation-cache.ts). */
export const revalidate = 60;

/**
 * Cinevanta Studios landing page.
 * Fetches ads, events, and featured work in parallel and passes a deterministic render timestamp
 * to AdStrip to prevent SSR/client clock hydration mismatches.
 */
export default async function HomePage() {
  const renderedAtIso = new Date().toISOString();
  const [ads, upcomingEvents, pastEvents, work] = await Promise.all([
    getAds(),
    getEvents("upcoming"),
    getEvents("past"),
    getWork(undefined, 1, displayLimits.homeWorkPreviewCount),
  ]);

  return (
    <>
      <JsonLd data={buildOrganizationJsonLd()} />
      <AdStrip ads={ads} renderedAtIso={renderedAtIso} />
      <main id="main-content">
        <Hero showreel={site.showreel} />
        <Marquee />
        <Services />
        <WorkPreview items={work.items} />
        <EventsSection upcomingEvents={upcomingEvents} pastEvents={pastEvents} />
        <Partners />
        <CtaBlock />
      </main>
    </>
  );
}
