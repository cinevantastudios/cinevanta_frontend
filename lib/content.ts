import type { EnquiryType, WorkCategory } from "@/types/api";

export type ServiceCardTone = "yellow" | "sand" | "white" | "ink";

export interface ServiceItem {
  id: WorkCategory;
  title: string;
  description: string;
  tone: ServiceCardTone;
  href: string;
}

export const content = {
  meta: {
    titleTemplate: "%s | Cinevanta Studios",
    defaultTitle: "Cinevanta Studios | Film, advertising and live events in Delhi",
    // Placeholder copy to confirm with proprietor
    defaultDescription:
      "Cinevanta Studios is a Delhi production house for films, advertising, live events, fashion shows and corporate events.",
  },
  nav: {
    skipToContent: "Skip to content",
    links: [
      { label: "Services", href: "/#services" },
      { label: "Work", href: "/work" },
      { label: "Events", href: "/events" },
      { label: "Contact", href: "/contact" },
    ],
    registerLabel: "Register",
    openMenuLabel: "Open menu",
    closeMenuLabel: "Close menu",
  },
  adStrip: {
    regionLabel: "Featured events",
    defaultLabel: "Featured event",
    prevLabel: "Previous slide",
    nextLabel: "Next slide",
    pauseLabel: "Pause",
    playLabel: "Play",
    slideLabel: (index: number, total: number) => `${index} of ${total}`,
    goToSlideLabel: (index: number) => `Go to slide ${index}`,
    announcement: (index: number, total: number, title: string) =>
      `Slide ${index} of ${total}: ${title}`,
  },
  hero: {
    kicker: "Film studio, Delhi",
    headlineLines: ["Films,", "brands &", "live moments."] as const,
    outlinedLineIndex: 2,
    lead: "We develop, produce and present films, advertising and live entertainment.",
    primaryCta: { label: "See our work", href: "/work" },
    secondaryCta: { label: "Upcoming events", href: "/events" },
    badgeRingText: "FILMS ✦ ADS ✦ LIVE ✦ EST. 2026 ✦",
    badgeCenter: "C*",
    showreelLabel: "Showreel",
    showreelPlaceholder: "[SHOWREEL OR HERO STILL]",
    playShowreelLabel: "Play showreel",
    muteLabel: "Mute video",
    unmuteLabel: "Unmute video",
  },
  marquee: {
    items: ["Film", "Advertising", "Live events", "Fashion", "Talent", "Corporate"],
  },
  services: {
    heading: "What we do",
    sticker: "Five ways to work with us",
    items: [
      {
        id: "film",
        title: "Film & Content",
        description: "Films, web series, documentaries, shorts and music videos.",
        tone: "yellow",
        href: "/work?category=film",
      },
      {
        id: "advertising",
        title: "Advertising",
        description: "Ad films, TVCs, digital ads and branded content.",
        tone: "sand",
        href: "/work?category=advertising",
      },
      {
        id: "live_event",
        title: "Live Events & Sports",
        description: "Celebrity cricket, concerts, award nights and festivals.",
        tone: "white",
        href: "/work?category=live_event",
      },
      {
        id: "fashion",
        title: "Fashion & Talent",
        description: "Fashion shows, pageants, talent hunts and artist management.",
        tone: "ink",
        href: "/work?category=fashion",
      },
      {
        id: "corporate",
        title: "Corporate Events",
        description: "Launches, conferences, brand activations and summits.",
        tone: "yellow",
        href: "/work?category=corporate",
      },
    ] satisfies ServiceItem[],
  },
  work: {
    heading: "Our work",
    sticker: "Selected projects",
    seeAll: "See all work",
    pageTitle: "Work",
    pageLead: "Films, advertising campaigns, live events, fashion shows and corporate stages.",
    empty: "Projects will appear here soon.",
    emptyCategory: "No projects in this category yet.",
    loadMore: "Load more",
    loadingMore: "Loading...",
    loadedAnnouncement: (count: number) => `${count} more projects loaded`,
    playVideoLabel: "Play video",
    closeDialogLabel: "Close project details",
    homePlaceholders: [
      { label: "[FILM POSTER OR STILL]", tone: "yellow" as const },
      { label: "[AD FILM FRAME]", tone: "ink" as const },
      { label: "[EVENT PHOTO]", tone: "white" as const },
    ],
    categories: [
      { value: "all" as const, label: "All" },
      { value: "film" as const, label: "Film" },
      { value: "advertising" as const, label: "Advertising" },
      { value: "live_event" as const, label: "Live event" },
      { value: "fashion" as const, label: "Fashion" },
      { value: "corporate" as const, label: "Corporate" },
    ],
    categoryLabels: {
      film: "Film",
      advertising: "Advertising",
      live_event: "Live event",
      fashion: "Fashion",
      corporate: "Corporate",
    } satisfies Record<WorkCategory, string>,
  },
  events: {
    heading: "Events",
    sticker: "Register to attend",
    pageTitle: "Events",
    pageLead: "Live entertainment, sports, fashion and cultural nights from Cinevanta Studios.",
    upcomingBadge: "Upcoming",
    pastHeading: "Past events",
    galleryLink: "Gallery",
    seeAll: "See all events",
    registerLabel: "Register",
    emptyUpcoming:
      "No events announced right now. Leave your details and we will message you when the next one opens.",
    emptyPast: "Past events will be listed here.",
    posterPlaceholder: "[EVENT POSTER]",
    tabs: [
      { value: "upcoming" as const, label: "Upcoming" },
      { value: "past" as const, label: "Past" },
    ],
  },
  partners: {
    label: "Worked with",
  },
  cta: {
    heading: "Got a story, a brand or a stage?",
    button: "Start a conversation",
    href: "/contact",
  },
  notify: {
    dialogTitle: "Registration opens soon",
    dialogDescription: (eventName?: string) =>
      `Leave your details and we will message you when registration for ${eventName || "[Event Name]"} opens.`,
    emailLabel: "Email",
    emailPlaceholder: "name@example.com",
    phoneLabel: "Phone",
    phonePlaceholder: "+91 98765 43210",
    helperText: "Enter an email address, a phone number, or both.",
    consentLabel: "I agree to be contacted about Cinevanta events",
    privacyNotePrefix: "Read our",
    submitLabel: "Notify me",
    submittingLabel: "Sending...",
    successMessage: "Done. We will be in touch.",
    errorMessage: "We could not save your details. Check your connection and try again.",
    closeLabel: "Close",
  },
  contact: {
    pageTitle: "Contact",
    pageLead: "Tell us what you are planning and we will get back to you.",
    detailsHeading: "Studio details",
    fields: {
      name: { label: "Name", placeholder: "Your full name" },
      email: { label: "Email", placeholder: "name@example.com" },
      phone: {
        label: "Phone",
        optional: "Optional",
        placeholder: "+91 98765 43210",
        helper: "Indian mobile number (+91 or 10 digits).",
      },
      type: {
        label: "Enquiry type",
        placeholder: "Choose a category",
      },
      message: {
        label: "Message",
        placeholder: "Share your project, dates, location or questions.",
      },
    },
    enquiryTypes: [
      { value: "film", label: "Film" },
      { value: "advertising", label: "Advertising" },
      { value: "live_event", label: "Live event" },
      { value: "fashion", label: "Fashion and talent" },
      { value: "corporate", label: "Corporate" },
      { value: "other", label: "Other" },
    ] satisfies Array<{ value: EnquiryType; label: string }>,
    submitLabel: "Send enquiry",
    sendingLabel: "Sending...",
    successTitle: "Enquiry received",
    successMessage: (name: string) =>
      `Thanks, ${name}. We received your enquiry and will reply by email or phone.`,
    errorMessage: (email: string) =>
      `We could not send your enquiry. Check your connection and try again, or email ${email}.`,
    sendAnotherLabel: "Send another enquiry",
  },
  about: {
    pageTitle: "About",
    statement: "[One or two sentences about the studio in the proprietor's own words]",
    whatWeMakeHeading: "What we make",
    proprietorHeading: "Leadership",
    proprietorName: "[Proprietor name]",
    proprietorBio: "[Short bio]",
    proprietorPortraitLabel: "[PROPRIETOR PORTRAIT]",
  },
  legal: {
    privacyTitle: "Privacy",
    termsTitle: "Terms",
    placeholder: "[Legal copy to be supplied]",
  },
  footer: {
    tagline: "Films, advertising and live events from Delhi.",
    navHeading: "Navigate",
    contactHeading: "Contact",
    notifyHeading: "Event updates",
    notifyLabel: "Email address",
    notifyPlaceholder: "name@example.com",
    notifyButton: "Notify me",
    privacyLabel: "Privacy",
    termsLabel: "Terms",
  },
  errors: {
    notFoundTitle: "Scene not found.",
    notFoundDescription: "This page is not in the script.",
    notFoundCta: "Back to home",
    errorTitle: "Something broke on our side. Try again.",
    errorCta: "Try again",
  },
  validation: {
    nameRequired: "Enter your name (at least 2 characters).",
    nameTooLong: "Keep your name under 80 characters.",
    emailInvalid: "Enter an email like name@example.com.",
    phoneInvalid: "Enter a 10-digit Indian mobile number (with or without +91).",
    typeRequired: "Choose an enquiry type.",
    messageShort: "Write at least 10 characters so we know how to help.",
    messageTooLong: "Keep your message under 1000 characters.",
    contactRequired: "Enter an email address or a phone number.",
    consentRequired: "Confirm that we can contact you about Cinevanta events.",
  },
};

