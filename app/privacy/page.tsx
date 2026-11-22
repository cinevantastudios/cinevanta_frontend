import type { Metadata } from "next";
import { LegalPageLayout } from "@/components/layout/LegalPageLayout";
import { content } from "@/lib/content";
import { routes, site } from "@/lib/site";
import { createPageMetadata } from "@/lib/utils";

export const metadata: Metadata = createPageMetadata({
  title: content.legal.privacyTitle,
  description: content.legal.privacyDescription,
  path: routes.privacy,
});

/** Privacy policy page rendered through the shared LegalPageLayout and centralized content deck. */
export default function PrivacyPage() {
  return (
    <LegalPageLayout title={content.legal.privacyTitle}>
      <p className="text-muted">{content.legal.privacyBody}</p>
      <p className="text-muted">
        {content.legal.privacyQuestionsPrefix} {site.email} • {site.address}
      </p>
    </LegalPageLayout>
  );
}
