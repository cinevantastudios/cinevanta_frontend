import { routes, site } from "@/lib/site";
import { formConstraints, type EnquiryType, type WorkCategory } from "@/types/api";

export type ServiceCardTone = "yellow" | "sand" | "white" | "ink";

export interface ServiceItem {
  id: WorkCategory;
  title: string;
  description: string;
  tone: ServiceCardTone;
  href: string;
}

/** Single source of truth for work category display labels, reused across filters, cards, and dialogs. */
const WORK_CATEGORY_LABELS: Record<WorkCategory, string> = {
  film: "Film",
  advertising: "Advertising",
  live_event: "Live event",
  fashion: "Fashion",
  corporate: "Corporate",
};

/** Primary navigation links shared by desktop Navbar, MobileMenu, and derived footer navigation. */
const PRIMARY_NAV_LINKS = [
  { label: "Services", href: routes.services },
  { label: "Work", href: routes.work },
  { label: "Events", href: routes.events },
  { label: "Contact", href: routes.contact },
] as const;

/** Centralized copy deck derived dynamically from `site` and `routes` to prevent duplicate literals. */
export const content = {
  meta: {
    titleTemplate: `%s | ${site.name}`,
    defaultTitle: `${site.name} | Film, advertising and live events in ${site.locality}`,
    // Placeholder copy to confirm with proprietor
    defaultDescription: `${site.name} is a ${site.locality} production house for films, advertising, live events, fashion shows and corporate events.`,
  },
  nav: {
    skipToContent: "Skip to content",
    homeAriaLabel: `${site.name} home`,
    primaryNavLabel: "Primary",
    mobileDialogLabel: "Site navigation",
    mobileNavLabel: "Mobile navigation",
    links: PRIMARY_NAV_LINKS,
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
    kicker: `Film studio, ${site.locality}`,
    headlineLines: ["Films,", "brands &", "live moments."] as const,
    outlinedLineIndex: 2,
    lead: "We develop, produce and present films, advertising and live entertainment.",
    primaryCta: { label: "See our work", href: routes.work },
    secondaryCta: { label: "Upcoming events", href: routes.events },
    badgeRingText: `FILMS ✦ ADS ✦ LIVE ✦ EST. ${site.foundedYear} ✦`,
    badgeCenter: site.shortMark,
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
        href: routes.workByCategory("film"),
      },
      {
        id: "advertising",
        title: "Advertising",
        description: "Ad films, TVCs, digital ads and branded content.",
        tone: "sand",
        href: routes.workByCategory("advertising"),
      },
      {
        id: "live_event",
        title: "Live Events & Sports",
        description: "Celebrity cricket, concerts, award nights and festivals.",
        tone: "white",
        href: routes.workByCategory("live_event"),
      },
      {
        id: "fashion",
        title: "Fashion & Talent",
        description: "Fashion shows, pageants, talent hunts and artist management.",
        tone: "ink",
        href: routes.workByCategory("fashion"),
      },
      {
        id: "corporate",
        title: "Corporate Events",
        description: "Launches, conferences, brand activations and summits.",
        tone: "yellow",
        href: routes.workByCategory("corporate"),
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
    filterAriaLabel: "Filter projects by category",
    placeholderStillLabel: "[PROJECT STILL]",
    placeholderMetaLabel: "[Category • YYYY]",
    placeholderTitleLabel: "[Project Title]",
    homePlaceholders: [
      { label: "[FILM POSTER OR STILL]", tone: "yellow" as const },
      { label: "[AD FILM FRAME]", tone: "ink" as const },
      { label: "[EVENT PHOTO]", tone: "white" as const },
    ],
    categoryLabels: WORK_CATEGORY_LABELS,
    categories: [
      { value: "all" as const, label: "All" },
      ...(Object.entries(WORK_CATEGORY_LABELS) as Array<[WorkCategory, string]>).map(
        ([value, label]) => ({ value, label }),
      ),
    ],
  },
  events: {
    heading: "Events",
    sticker: "Register to attend",
    pageTitle: "Events",
    pageLead: `Live entertainment, sports, fashion and cultural nights from ${site.name}.`,
    upcomingBadge: "Upcoming",
    pastHeading: "Past events",
    galleryLink: "Gallery",
    seeAll: "See all events",
    registerLabel: "Register",
    emptyUpcoming:
      "No events announced right now. Leave your details and we will message you when the next one opens.",
    emptyPast: "Past events will be listed here.",
    posterPlaceholder: "[EVENT POSTER]",
    tabsAriaLabel: "Event status",
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
    href: routes.contact,
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
    consentLabel: `I agree to be contacted about ${site.wordmark} events`,
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
      { value: "film", label: WORK_CATEGORY_LABELS.film },
      { value: "advertising", label: WORK_CATEGORY_LABELS.advertising },
      { value: "live_event", label: WORK_CATEGORY_LABELS.live_event },
      { value: "fashion", label: "Fashion and talent" },
      { value: "corporate", label: WORK_CATEGORY_LABELS.corporate },
      { value: "other", label: "Other" },
    ] satisfies Array<{ value: EnquiryType; label: string }>,
    submitLabel: "Send enquiry",
    sendingLabel: "Sending...",
    successTitle: "Enquiry received",
    successMessage: (name: string) =>
      `Thanks, ${name}. We received your enquiry and will reply by email or phone.`,
    errorMessage: (email: string) =>
      `We could not send your enquiry. Check your connection and try again, or email ${email}.`,
    errorFallbackEmail: (email: string) => `You can also reach us directly at ${email}.`,
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
    privacyDescription: `Privacy policy for ${site.name}.`,
    privacyBody: `This site does not set cookies or run third-party tracking scripts. Information submitted via the contact or event notification forms is used solely by ${site.name} to respond to enquiries or send event updates.`,
    privacyQuestionsPrefix: "Questions:",
    termsTitle: "Terms",
    termsDescription: `Terms of use for ${site.name}.`,
    termsBody: `Published by ${site.name}, ${site.city}. Contact ${site.email} for enquiries regarding these terms.`,
    placeholder: "[Legal copy to be supplied]",
  },
  footer: {
    tagline: `Films, advertising and live events from ${site.locality}.`,
    navHeading: "Navigate",
    navLinks: [
      ...PRIMARY_NAV_LINKS.slice(0, 3),
      { label: "About", href: routes.about },
      ...PRIMARY_NAV_LINKS.slice(3),
    ],
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
    notFoundDescription:
      "This page is not in the script. Check the web address or jump to one of the sections below.",
    notFoundCta: "Back to home",
    notFoundLinks: [
      { label: "Explore our work", href: routes.work },
      { label: "Upcoming events", href: routes.events },
      { label: "Contact us", href: routes.contact },
    ],
    errorTitle: "We hit a snag loading this view.",
    errorDescription:
      "Try refreshing this section. If it still does not load, return to the home page or reach out to us.",
    errorCta: "Try again",
    errorHomeCta: "Back to home",
    errorContactCta: "Contact us",
  },
  validation: {
    nameRequired: `Enter your name (at least ${formConstraints.nameMin} characters).`,
    nameTooLong: `Keep your name under ${formConstraints.nameMax} characters.`,
    emailInvalid: "Enter an email like name@example.com.",
    phoneInvalid: "Enter a 10-digit Indian mobile number (with or without +91).",
    typeRequired: "Choose an enquiry type.",
    messageShort: `Write at least ${formConstraints.messageMin} characters so we know how to help.`,
    messageTooLong: `Keep your message under ${formConstraints.messageMax} characters.`,
    contactRequired: "Enter an email address or a phone number.",
    consentRequired: `Confirm that we can contact you about ${site.wordmark} events.`,
  },
};
