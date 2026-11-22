import type { Metadata } from "next";
import { LegalPageLayout } from "@/components/layout/LegalPageLayout";
import { content } from "@/lib/content";
import { routes } from "@/lib/site";
import { createPageMetadata } from "@/lib/utils";

export const metadata: Metadata = createPageMetadata({
  title: content.legal.termsTitle,
  description: content.legal.termsDescription,
  path: routes.terms,
});

/** Terms of use page rendered through the shared LegalPageLayout and centralized content deck. */
export default function TermsPage() {
  return (
    <LegalPageLayout title={content.legal.termsTitle}>
      <p className="text-muted">{content.legal.termsBody}</p>
    </LegalPageLayout>
  );
}
