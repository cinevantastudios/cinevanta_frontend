import { AdStrip } from "@/components/ads/AdStrip";
import { CtaBlock } from "@/components/home/CtaBlock";
import { EventsSection } from "@/components/home/EventsSection";
import { Hero } from "@/components/home/Hero";
import { Marquee } from "@/components/home/Marquee";
import { Partners } from "@/components/home/Partners";
import { Services } from "@/components/home/Services";
import { WorkPreview } from "@/components/home/WorkPreview";
import { JsonLd } from "@/components/seo/JsonLd";
import { getAds, getEvents, getWork } from "@/lib/api";
import { site } from "@/lib/site";

export default async function HomePage() {
  const [ads, upcomingEvents, pastEvents, work] = await Promise.all([
    getAds(),
    getEvents("upcoming"),
    getEvents("past"),
    getWork(undefined, 1, 3),
  ]);

  const organizationLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.name,
    url: site.url,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Delhi",
      addressCountry: "IN",
    },
  };

  return (
    <>
      <JsonLd data={organizationLd} />
      <AdStrip ads={ads} />
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
