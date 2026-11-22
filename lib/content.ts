import { routes, site } from "@/lib/site";
import { formConstraints, type EnquiryType, type WorkCategory } from "@/types/api";

export type ServiceCardTone = "yellow" | "sand" | "white" | "ink";

export interface ServiceItem {
  id: WorkCategory;
  title: string;
  description: string;
  detail: string;
  deliverables: readonly string[];
  placeholderLabel: string;
  tone: ServiceCardTone;
  href: string;
  enquiryHref: string;
}

export interface ServiceProcessStep {
  stage: string;
  title: string;
  description: string;
  tone: "yellow" | "white" | "sand" | "ink";
}

export interface ServiceCollaborateGroup {
  tag: string;
  title: string;
  description: string;
  ctaLabel: string;
  href: string;
}

export interface AboutCraftPillar {
  meta: string;
  title: string;
  description: string;
  tone: "yellow" | "cream" | "ink";
}

/** Single source of truth for work category display labels, reused across filters, cards, and dialogs. */
const WORK_CATEGORY_LABELS: Record<WorkCategory, string> = {
  film: "Film",
  advertising: "Advertising",
  live_event: "Live event",
  fashion: "Fashion",
  corporate: "Corporate",
};

/** Navigation link descriptor shared by desktop Navbar, MobileMenu, and Footer. */
export interface NavLinkItem {
  label: string;
  href: string;
  /** Set to `false` when a link temporarily redirects to another route and should not highlight as active there. */
  matchActive?: boolean;
}

/** Primary navigation links shared by desktop Navbar, MobileMenu, and derived footer navigation. */
const PRIMARY_NAV_LINKS: readonly NavLinkItem[] = [
  { label: "Home", href: routes.home },
  { label: "About", href: routes.about },
  { label: "Services", href: routes.services },
  { label: "Work", href: routes.work },
  { label: "Events", href: routes.events },
  { label: "Contact", href: routes.contact },
];

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
    seeAll: "Explore all services",
    pageTitle: "Services",
    pageLead:
      "We develop, produce and stage films, advertising campaigns, live entertainment, fashion properties and corporate experiences from script to delivery.",
    jumpNavLabel: "Jump to service discipline",
    deliverablesLabel: "Formats & deliverables",
    enquireCta: "Enquire for this service",
    viewWorkCta: "See related work",
    processHeading: "How a production runs",
    processSticker: "Brief to delivery",
    processSteps: [
      {
        stage: "Stage 01",
        title: "Brief & Treatment",
        description:
          "We align on script, creative treatment, stage format, production schedule and budget parameters before cameras or rigs roll.",
        tone: "yellow",
      },
      {
        stage: "Stage 02",
        title: "Pre-Production & Casting",
        description:
          "Casting, location scouting, stage design, technical crew assembly, permits and artist logistics managed under one production desk.",
        tone: "white",
      },
      {
        stage: "Stage 03",
        title: "Principal Shoot & Live Stage",
        description:
          "On-set direction, multi-camera capture, lighting and sound engineering, show calling and crowd operations.",
        tone: "sand",
      },
      {
        stage: "Stage 04",
        title: "Post, Masters & Presentation",
        description:
          "Offline and online edit, colour grading, sound mix, broadcast/OTT deliverables and post-event highlight packages.",
        tone: "ink",
      },
    ] satisfies ServiceProcessStep[],
    collaborateHeading: "Who we build with",
    collaborateSticker: "Three ways to partner",
    collaborateGroups: [
      {
        tag: "For brands & agencies",
        title: "Commercials & brand stages",
        description:
          "Commission ad films, digital campaigns, product launches, dealer summits and on-ground activations built around your release calendar.",
        ctaLabel: "Discuss a campaign",
        href: routes.contactByType("advertising"),
      },
      {
        tag: "For producers & networks",
        title: "Original films & series",
        description:
          "Partner on feature films, OTT series, documentaries, short films and music videos with full line-production and post support in Delhi.",
        ctaLabel: "Discuss a film project",
        href: routes.contactByType("film"),
      },
      {
        tag: "For sponsors, venues & artists",
        title: "Live formats & talent properties",
        description:
          "Collaborate on celebrity cricket leagues, concerts, fashion shows, pageants, award nights and cultural festivals.",
        ctaLabel: "Partner on a live event",
        href: routes.contactByType("live_event"),
      },
    ] satisfies ServiceCollaborateGroup[],
    items: [
      {
        id: "film",
        title: "Film & Content",
        description: "Films, web series, documentaries, shorts and music videos.",
        detail:
          "Narrative and non-fiction production from script development and casting through principal photography, editorial, sound design and final theatrical or streaming masters.",
        deliverables: [
          "Feature films",
          "Web series & OTT",
          "Documentaries",
          "Short films",
          "Music videos",
        ],
        placeholderLabel: "[FILM SET OR CAMERA RIG STILL]",
        tone: "yellow",
        href: routes.workByCategory("film"),
        enquiryHref: routes.contactByType("film"),
      },
      {
        id: "advertising",
        title: "Advertising",
        description: "Ad films, TVCs, digital ads and branded content.",
        detail:
          "High-impact commercial storytelling crafted for broadcast television, digital platforms, cinema screens and social campaigns — from storyboard and casting to multi-format cutdowns.",
        deliverables: [
          "TV commercials (TVCs)",
          "Digital ad films",
          "Branded content",
          "Launch films",
          "Social video cutdowns",
        ],
        placeholderLabel: "[COMMERCIAL SHOOT FRAME]",
        tone: "sand",
        href: routes.workByCategory("advertising"),
        enquiryHref: routes.contactByType("advertising"),
      },
      {
        id: "live_event",
        title: "Live Events & Sports",
        description: "Celebrity cricket, concerts, award nights and festivals.",
        detail:
          "Large-format live entertainment and sporting spectacles designed for stadium and arena audiences, combining show direction, artist booking, broadcast capture and venue operations.",
        deliverables: [
          "Celebrity cricket matches",
          "Live concerts",
          "Award nights",
          "Cultural festivals",
          "Multi-cam live capture",
        ],
        placeholderLabel: "[STADIUM OR CONCERT STAGE PHOTO]",
        tone: "white",
        href: routes.workByCategory("live_event"),
        enquiryHref: routes.contactByType("live_event"),
      },
      {
        id: "fashion",
        title: "Fashion & Talent",
        description: "Fashion shows, pageants, talent hunts and artist management.",
        detail:
          "Runway choreography, designer showcases, regional and national talent hunts, pageants and ongoing artist representation for screen and stage.",
        deliverables: [
          "Runway & fashion shows",
          "Pageants",
          "Talent hunts",
          "Artist management",
          "Lookbooks & showreels",
        ],
        placeholderLabel: "[RUNWAY & BACKSTAGE FRAME]",
        tone: "ink",
        href: routes.workByCategory("fashion"),
        enquiryHref: routes.contactByType("fashion"),
      },
      {
        id: "corporate",
        title: "Corporate Events",
        description: "Launches, conferences, brand activations and summits.",
        detail:
          "Turnkey stage design, AV production, speaker choreography and experiential brand environments for flagship corporate moments, conferences and leadership summits.",
        deliverables: [
          "Product launches",
          "Conferences & summits",
          "Brand activations",
          "Annual galas & awards",
          "Experiential booths",
        ],
        placeholderLabel: "[CORPORATE STAGE & LIGHTING STILL]",
        tone: "yellow",
        href: routes.workByCategory("corporate"),
        enquiryHref: routes.contactByType("corporate"),
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
    kicker: `Est. ${site.foundedYear} • ${site.city}`,
    lead: `${site.name} is an independent production house in ${site.city} built for stories on screen, campaigns for brands, and live moments on stage.`,
    statement: "[One or two sentences about the studio in the proprietor's own words]",
    statementCaption: `${site.name} • ${site.city}`,
    studioStillLabel: "[STUDIO FLOOR OR SET STILL]",
    studioStillMeta: `${site.locality} • EST. ${site.foundedYear}`,
    primaryCta: { label: "See our work", href: routes.work },
    secondaryCta: { label: "Explore services", href: routes.services },
    whatWeMakeHeading: "What we make",
    whatWeMakeSticker: "Five production units",
    whatWeMakeAction: "Full services breakdown",
    exploreServiceLabel: "Explore unit",
    approachHeading: "From script to stage",
    approachSticker: "How we work",
    pillars: [
      {
        meta: "Craft ✦ Development",
        title: "Story, format & direction",
        description:
          "Every project starts with a clear narrative or show format — scripts, commercial treatments, stage blueprints and casting assembled in-house.",
        tone: "yellow",
      },
      {
        meta: "Craft ✦ Production",
        title: "Crews, cameras & stagecraft",
        description:
          "Full-unit film crews, commercial shoot production, stadium and runway staging, lighting rigs, sound engineering and on-ground show calling.",
        tone: "cream",
      },
      {
        meta: "Craft ✦ Presentation",
        title: "Post, masters & live audiences",
        description:
          "Editorial, colour, sound mix and broadcast/OTT masters for screen work alongside ticketed and invitation-only live experiences.",
        tone: "ink",
      },
    ] satisfies AboutCraftPillar[],
    proprietorHeading: "Leadership",
    proprietorSticker: site.legalStructure,
    proprietorRole: "Founder & Proprietor",
    proprietorName: site.proprietorName,
    proprietorBio: "[Short bio]",
    proprietorPortraitLabel: "[PROPRIETOR PORTRAIT]",
    factSheetHeading: "Studio sheet",
    facts: [
      { label: "Studio", value: site.name },
      { label: "Address", value: site.address },
      { label: "Established", value: String(site.foundedYear) },
      { label: "Direct contact", value: `${site.email} • ${site.phone}` },
    ] as const,
    connectCta: "Start a conversation",
  },
  legal: {
    privacyTitle: "Privacy",
    privacyDescription: `Privacy policy for ${site.name}.`,
    privacyBody: `This site does not set cookies or run third-party tracking scripts. Information submitted via the contact or event notification forms is used solely by ${site.name} to respond to enquiries or send event updates.`,
    privacyQuestionsPrefix: "Questions:",
    termsTitle: "Terms",
    termsDescription: `Terms of use for ${site.name}.`,
    termsBody: `Published by ${site.name} (${site.legalStructure.toLowerCase()} of ${site.proprietorName}), ${site.address}. Contact ${site.email} for enquiries regarding these terms.`,
    placeholder: "[Legal copy to be supplied]",
  },
  footer: {
    tagline: `Films, advertising and live events from ${site.locality}.`,
    navHeading: "Navigate",
    navLinks: PRIMARY_NAV_LINKS,
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
