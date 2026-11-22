import { Container, Section, Skeleton } from "@/components/ui";

export default function WorkLoading() {
  return (
    <main id="main-content">
      <Section tone="cream" className="pt-12 pb-16 md:pt-16 lg:pt-20">
        <Container className="space-y-10">
          <div className="space-y-4">
            <Skeleton className="h-14 w-48" />
            <Skeleton className="h-6 w-full max-w-[32.5rem]" />
          </div>
          <div className="flex flex-wrap gap-2.5">
            {[0, 1, 2, 3, 4, 5].map((idx) => (
              <Skeleton key={idx} rounded="pill" className="h-11 w-24" />
            ))}
          </div>
          <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2, 3, 4, 5].map((idx) => (
              <Skeleton key={idx} rounded="frame" className="h-[25rem] w-full" />
            ))}
          </div>
        </Container>
      </Section>
    </main>
  );
}

