import { Container, Section, Skeleton } from "@/components/ui";

/**
 * Route-level loading skeleton for the About page (/about).
 */
export default function AboutLoading() {
  return (
    <main id="main-content">
      <Section tone="cream" className="pt-12 pb-16 md:pt-16 lg:pt-20">
        <Container className="space-y-12">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
            <div className="space-y-6 lg:col-span-7">
              <Skeleton rounded="pill" className="h-8 w-44" />
              <Skeleton className="h-14 w-64" />
              <Skeleton className="h-6 w-full max-w-[34rem]" />
              <Skeleton rounded="card" className="h-44 w-full" />
            </div>
            <div className="lg:col-span-5">
              <Skeleton rounded="frame" className="h-[26rem] w-full" />
            </div>
          </div>
        </Container>
      </Section>
    </main>
  );
}
