import { Container, Section, Skeleton } from "@/components/ui";

export default function ContactLoading() {
  return (
    <main id="main-content">
      <Section tone="cream" className="pt-12 pb-16 md:pt-16 lg:pt-20">
        <Container className="space-y-10">
          <div className="space-y-4">
            <Skeleton className="h-14 w-56" />
            <Skeleton className="h-6 w-full max-w-[460px]" />
          </div>
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
            <Skeleton rounded="card" className="h-[520px] lg:col-span-7" />
            <Skeleton rounded="card" className="h-[340px] lg:col-span-5" />
          </div>
        </Container>
      </Section>
    </main>
  );
}

