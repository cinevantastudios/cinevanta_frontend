export interface SocialLink {
  label: string;
  href: string;
}

export interface ShowreelMedia {
  videoUrl: string;
  posterUrl?: string;
}

export interface SiteConfig {
  name: string;
  wordmark: string;
  city: string;
  email: string;
  phone: string;
  responseTime: string;
  copyright: string;
  url: string;
  showreel: ShowreelMedia | null;
  socials: SocialLink[];
  partners: string[];
}

export const site: SiteConfig = {
  name: "Cinevanta Studios",
  wordmark: "Cinevanta",
  city: "Delhi, India",
  email: "[email]@[domain]",
  phone: "[Phone]",
  responseTime: "[We reply within X working days]",
  copyright: "© 2026 Cinevanta Studios",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  showreel: null,
  socials: [
    { label: "Instagram", href: "#" },
    { label: "YouTube", href: "#" },
    { label: "LinkedIn", href: "#" },
    { label: "X", href: "#" },
  ],
  partners: ["[Brand]", "[Partner]", "[Sponsor]", "[Platform]"],
};

