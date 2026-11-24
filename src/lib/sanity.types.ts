// TypeScript interfaces for all Sanity CMS content types

/* ------------------------------------------------------------------ */
/*  Shared / Utility types                                             */
/* ------------------------------------------------------------------ */
export interface SanityDocument {
  _id: string;
  _type: string;
  _rev?: string;
  _createdAt?: string;
  _updatedAt?: string;
}

export interface SanityImageRef {
  _type: "image";
  asset: { _ref: string; _type: "reference" };
}

export interface SanitySlug {
  _type: "slug";
  current: string;
}

/* ------------------------------------------------------------------ */
/*  Site Settings                                                      */
/* ------------------------------------------------------------------ */
export interface SiteSettings extends SanityDocument {
  brand: string;
  tagline: string;
  phone: string;
  phoneRaw: string;
  whatsappNumber: string;
  email: string;
  address: string;
  mapsUrl: string;
  mapsEmbed: string;
  socialMedia?: { platform: string; url: string }[];
  copyright?: string;
}

/* ------------------------------------------------------------------ */
/*  Stat item (homepage counters)                                      */
/* ------------------------------------------------------------------ */
export interface StatItem {
  value: number;
  suffix: string;
  label: string;
}

/* ------------------------------------------------------------------ */
/*  "Why Us" feature                                                   */
/* ------------------------------------------------------------------ */
export interface WhyUsFeature {
  iconName: string;
  title: string;
  desc: string;
}

/* ------------------------------------------------------------------ */
/*  Homepage                                                           */
/* ------------------------------------------------------------------ */
export interface HomepageContent extends SanityDocument {
  heroEyebrow: string;
  heroHeading: string;
  heroHeadingAccent: string;
  heroDescription: string;
  heroCtaText: string;
  heroCtaLink: string;
  heroSecondaryCtaText: string;
  heroSecondaryCtaLink: string;
  heroVideoUrl: string;
  heroPosterImage: string | SanityImageRef;
  stats: StatItem[];
  storyEyebrow: string;
  storyHeading: string;
  storyHeadingAccent: string;
  storyImage: string | SanityImageRef;
  storyParagraphs: string[];
  storyCtaText: string;
  storyCtaLink: string;
  servicesEyebrow: string;
  servicesHeading: string;
  servicesDesc: string;
  menuPreviewEyebrow: string;
  menuPreviewHeading: string;
  menuPreviewDesc: string;
  menuPreviewCtaText: string;
  eventsEyebrow: string;
  eventsHeading: string;
  eventsDesc: string;
  eventsCtaText: string;
  whyUsEyebrow: string;
  whyUsHeading: string;
  whyUsFeatures: WhyUsFeature[];
  testimonialsEyebrow: string;
  testimonialsHeading: string;
  ctaHeading: string;
  ctaHeadingAccent: string;
  ctaDescription: string;
  ctaButtonText: string;
  ctaButtonLink: string;
  ctaBackgroundImage: string | SanityImageRef;
}

/* ------------------------------------------------------------------ */
/*  About Page                                                         */
/* ------------------------------------------------------------------ */
export interface AboutValue {
  iconName: string;
  title: string;
  desc: string;
}

export interface Milestone {
  year: string;
  title: string;
  desc: string;
}

export interface AboutPageContent extends SanityDocument {
  heroEyebrow: string;
  heroHeading: string;
  heroHeadingAccent: string;
  heroDescription: string;
  heroBackgroundImage: string | SanityImageRef;
  storyEyebrow: string;
  storyHeading: string;
  storyImage: string | SanityImageRef;
  storyParagraphs: string[];
  valuesEyebrow: string;
  valuesHeading: string;
  values: AboutValue[];
  milestonesEyebrow: string;
  milestonesHeading: string;
  milestones: Milestone[];
}

/* ------------------------------------------------------------------ */
/*  Services                                                           */
/* ------------------------------------------------------------------ */
export interface ServiceItem extends SanityDocument {
  title: string;
  description: string;
  image: string | SanityImageRef;
  iconName: string;
  order: number;
  visible: boolean;
}

export interface ProcessStep {
  iconName: string;
  title: string;
  desc: string;
}

export interface ServicesPageContent extends SanityDocument {
  heroEyebrow: string;
  heroHeading: string;
  heroHeadingAccent: string;
  heroBackgroundImage: string | SanityImageRef;
  processEyebrow: string;
  processHeading: string;
  processSteps: ProcessStep[];
}

/* ------------------------------------------------------------------ */
/*  Events                                                             */
/* ------------------------------------------------------------------ */
export interface EventItem extends SanityDocument {
  title: string;
  category: string;
  description: string;
  stat: string;
  image: string | SanityImageRef;
  order: number;
  visible: boolean;
}

export interface EventsPageContent extends SanityDocument {
  heroEyebrow: string;
  heroHeading: string;
  heroHeadingAccent: string;
  heroBackgroundImage: string | SanityImageRef;
  galleryEyebrow: string;
  galleryHeading: string;
  galleryImages: (string | SanityImageRef)[];
}

/* ------------------------------------------------------------------ */
/*  Menu                                                               */
/* ------------------------------------------------------------------ */
export interface MenuCategory extends SanityDocument {
  title: string;
  tamil: string;
  description?: string;
  menuType: "sets" | "priced";
  order: number;
  visible: boolean;
}

export interface CmsMenuSet extends SanityDocument {
  title: string;
  tamil: string;
  items: string[];
  variant: "maroon" | "leaf";
  categoryId: string;
  order: number;
}

export interface CmsMenuItem extends SanityDocument {
  name: string;
  price: number;
  categoryId: string;
  order: number;
}

export interface MenuPageContent extends SanityDocument {
  heroEyebrow: string;
  heroHeading: string;
  heroHeadingAccent: string;
  heroDescription: string;
  heroBackgroundImage?: string | SanityImageRef;
}

/* ------------------------------------------------------------------ */
/*  Contact                                                            */
/* ------------------------------------------------------------------ */
export interface ContactPageContent extends SanityDocument {
  heroEyebrow: string;
  heroHeading: string;
  heroHeadingAccent: string;
  heroBackgroundImage?: string | SanityImageRef;
  reachUsHeading: string;
  reachUsDescription: string;
  formHeading: string;
  formDescription: string;
  eventTypes: string[];
}

/* ------------------------------------------------------------------ */
/*  Header                                                             */
/* ------------------------------------------------------------------ */
export interface NavLink {
  to: string;
  label: string;
}

export interface HeaderSettings extends SanityDocument {
  logoUrl: string | SanityImageRef;
  brandName: string;
  brandSubtext: string;
  navLinks: NavLink[];
  ctaText: string;
  ctaLink: string;
}

/* ------------------------------------------------------------------ */
/*  Footer                                                             */
/* ------------------------------------------------------------------ */
export interface SocialLink {
  platform: string;
  url: string;
}

export interface FooterSettings extends SanityDocument {
  logoUrl: string | SanityImageRef;
  brandName: string;
  brandSubtext: string;
  tagline: string;
  navLinks: NavLink[];
  socialLinks: SocialLink[];
  copyright: string;
  developerName: string;
  developerUrl: string;
}

/* ------------------------------------------------------------------ */
/*  SEO                                                                */
/* ------------------------------------------------------------------ */
export interface SeoSettings extends SanityDocument {
  pageId: string;
  title: string;
  description: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string | SanityImageRef;
  canonicalUrl: string;
}

/* ------------------------------------------------------------------ */
/*  Testimonials                                                       */
/* ------------------------------------------------------------------ */
export interface TestimonialItem extends SanityDocument {
  name: string;
  event: string;
  quote: string;
  order: number;
  visible: boolean;
}

/* ------------------------------------------------------------------ */
/*  Dashboard stats                                                    */
/* ------------------------------------------------------------------ */
export interface DashboardStats {
  totalServices: number;
  totalEvents: number;
  totalMenuCategories: number;
  totalMenuItems: number;
  totalMenuSets: number;
  totalTestimonials: number;
  totalImages: number;
}
