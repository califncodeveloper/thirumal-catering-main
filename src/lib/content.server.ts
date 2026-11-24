import { createServerFn } from "@tanstack/react-start";
import { sanityFetch } from "./sanity.server";
import {
  HOMEPAGE_QUERY,
  ABOUT_PAGE_QUERY,
  VISIBLE_SERVICES_QUERY,
  VISIBLE_EVENTS_QUERY,
  ALL_MENU_DATA_QUERY,
  CONTACT_PAGE_QUERY,
  SITE_SETTINGS_QUERY,
  HEADER_SETTINGS_QUERY,
  FOOTER_SETTINGS_QUERY,
  EVENTS_PAGE_QUERY,
  VISIBLE_TESTIMONIALS_QUERY,
} from "./sanity.queries";
import { services as fallbackServices } from "../data/services";
import { events as fallbackEvents, galleryImages as fallbackGallery } from "../data/events";
import { tiffinSets, lunchSets, dinnerSets } from "../data/menu";
import {
  friedRiceNoodles,
  indianBreads,
  northIndianGravy,
  grillTandooriBBQ,
} from "../data/additionalMenu";
import { testimonials as fallbackTestimonials } from "../data/testimonials";
import { CONTACT as fallbackContact } from "./contact";
import type {
  HomepageContent,
  AboutPageContent,
  ServiceItem,
  EventItem,
  SiteSettings,
  HeaderSettings,
  FooterSettings,
} from "./sanity.types";

/* ── Homepage Data ───────────────────────────────────────────────── */
export const getHomepageDataServerFn = createServerFn({ method: "GET" }).handler(
  async () => {
    let cmsHome: HomepageContent | null = null;
    let cmsServices: ServiceItem[] | null = null;
    let cmsEvents: EventItem[] | null = null;
    let cmsTestimonials = null;

    try {
      [cmsHome, cmsServices, cmsEvents, cmsTestimonials] = await Promise.all([
        sanityFetch<HomepageContent>(HOMEPAGE_QUERY),
        sanityFetch<ServiceItem[]>(VISIBLE_SERVICES_QUERY),
        sanityFetch<EventItem[]>(VISIBLE_EVENTS_QUERY),
        sanityFetch(VISIBLE_TESTIMONIALS_QUERY),
      ]);
    } catch (e) {
      console.warn("[content] Sanity fetch error on Homepage, falling back to static:", e);
    }

    return {
      home: cmsHome || {
        _id: "homepage",
        _type: "homepage",
        heroEyebrow: "Since 2008 · Chennai",
        heroHeading: "Tradition",
        heroHeadingAccent: "in Every Taste",
        heroDescription:
          "Authentic South Indian catering for weddings, receptions, temple utsavams and every occasion worth celebrating.",
        heroCtaText: "Book Your Event",
        heroCtaLink: "/contact",
        heroSecondaryCtaText: "View Menu",
        heroSecondaryCtaLink: "/menu",
        heroVideoUrl: "/Cinematic_aerial_drone_shot_sl.mp4",
        heroPosterImage: "/images/services-hero-bg.jpg",
        stats: [
          { value: 1500, suffix: "+", label: "Events Catered" },
          { value: 17, suffix: "+", label: "Years of Legacy" },
          { value: 150, suffix: "+", label: "Menu Varieties" },
          { value: 98, suffix: "%", label: "Happy Clients" },
        ],
        storyEyebrow: "Our Story",
        storyHeading: "A Legacy of",
        storyHeadingAccent: "Flavor & Devotion",
        storyImage: "/images/about-hero-feast.jpg",
        storyParagraphs: [
          "For over seventeen years, Thirumal Catering has served Chennai's most memorable weddings, receptions, temple utsavams, and family gatherings with recipes handed down through generations.",
          "Every meal is prepared with pure ingredients, cooked with devotion, and served with the warmth of tradition — from banana leaves to bell-metal serving vessels.",
        ],
        storyCtaText: "Discover Our Journey",
        storyCtaLink: "/about",
        servicesEyebrow: "What We Cater",
        servicesHeading: "Every Occasion, Perfected",
        servicesDesc:
          "From intimate family functions to grand thousand-guest weddings — we bring the same devotion to every event.",
        menuPreviewEyebrow: "Signature Menus",
        menuPreviewHeading: "A Feast on Banana Leaf",
        menuPreviewDesc:
          "Traditional Tamil menus crafted for every appetite and occasion.",
        menuPreviewCtaText: "Explore Full Menu",
        eventsEyebrow: "Recent Events",
        eventsHeading: "Where We've Feasted",
        eventsDesc:
          "A glimpse into the celebrations we've had the honor of serving.",
        eventsCtaText: "See All Events",
        whyUsEyebrow: "Why Thirumal",
        whyUsHeading: "Detail is Our Devotion",
        whyUsFeatures: [
          {
            iconName: "ChefHat",
            title: "Master Chefs",
            desc: "Traditional cooks with 20+ years of temple & wedding kitchen experience.",
          },
          {
            iconName: "Utensils",
            title: "Pure Ingredients",
            desc: "Sourced fresh daily from trusted farms — no shortcuts, ever.",
          },
          {
            iconName: "Users",
            title: "Trained Servers",
            desc: "Warm, courteous banana-leaf service that treats every guest as family.",
          },
          {
            iconName: "Award",
            title: "Hygiene First",
            desc: "FSSAI certified kitchens and rigorous cleanliness at every step.",
          },
        ],
        testimonialsEyebrow: "Kind Words",
        testimonialsHeading: "Loved by Chennai's Families",
        ctaHeading: "Let's Cater Your",
        ctaHeadingAccent: "Next Celebration",
        ctaDescription:
          "Tell us about your event and we'll craft a menu that turns guests into family.",
        ctaButtonText: "Get Your Custom Quote",
        ctaButtonLink: "/contact",
        ctaBackgroundImage: "/images/cta-section-bg.jpg",
      },
      services: (cmsServices && cmsServices.length > 0) ? cmsServices : fallbackServices.map((s, idx) => ({
        _id: `service-${s.id}`,
        _type: "service",
        title: s.title,
        description: s.desc,
        image: s.image,
        iconName: s.icon.name || "Heart",
        order: idx + 1,
        visible: true,
      })),
      events: (cmsEvents && cmsEvents.length > 0) ? cmsEvents : fallbackEvents.map((e, idx) => ({
        _id: `event-${e.id}`,
        _type: "event",
        title: e.title,
        category: e.category,
        stat: e.stat,
        description: e.desc,
        image: e.image,
        order: idx + 1,
        visible: true,
      })),
      tiffinPreviewSets: tiffinSets.slice(0, 3),
      testimonials: cmsTestimonials || fallbackTestimonials,
    };
  },
);

/* ── About Data ──────────────────────────────────────────────────── */
export const getAboutDataServerFn = createServerFn({ method: "GET" }).handler(
  async () => {
    let cmsAbout: AboutPageContent | null = null;
    try {
      cmsAbout = await sanityFetch<AboutPageContent>(ABOUT_PAGE_QUERY);
    } catch (e) {
      console.warn("[content] Sanity fetch error on About, falling back to static:", e);
    }

    return {
      about: cmsAbout || {
        _id: "aboutPage",
        _type: "aboutPage",
        heroEyebrow: "Our Story",
        heroHeading: "A Family,",
        heroHeadingAccent: "A Legacy",
        heroDescription:
          "What began as one family's love for feeding people has grown into Chennai's most trusted South Indian catering service.",
        heroBackgroundImage: "/images/about-hero-feast.jpg",
        storyEyebrow: "Est. 2008",
        storyHeading: "Rooted in Ranganathapuram",
        storyImage: "/images/chef-traditional-kitchen.jpg",
        storyParagraphs: [
          "Thirumal Catering was born in a modest Tambaram home in 2008, where three generations of family cooks would gather to prepare feasts for weddings and temple functions.",
          "Today we serve over 1,500 events across Chennai each year — from intimate housewarmings to thousand-guest weddings — but every plate still carries the warmth of that first family kitchen.",
        ],
        valuesEyebrow: "Our Values",
        valuesHeading: "What We Stand For",
        values: [
          {
            iconName: "Leaf",
            title: "Purity",
            desc: "100% pure vegetarian, sattvik cooking with fresh, seasonal ingredients.",
          },
          {
            iconName: "Heart",
            title: "Tradition",
            desc: "Recipes preserved and refined across three generations of family cooks.",
          },
          {
            iconName: "HandHeart",
            title: "Hospitality",
            desc: "Warm, banana-leaf service that treats every guest as our own.",
          },
          {
            iconName: "Sparkles",
            title: "Hygiene",
            desc: "FSSAI-certified kitchens with rigorous standards at every stage.",
          },
        ],
        milestonesEyebrow: "Milestones",
        milestonesHeading: "Our Journey",
        milestones: [
          {
            year: "2008",
            title: "Humble Beginnings",
            desc: "Founded with a single wedding order in Tambaram.",
          },
          {
            year: "2013",
            title: "500 Events",
            desc: "Reached our first major milestone catering across Chennai.",
          },
          {
            year: "2018",
            title: "Temple Partnerships",
            desc: "Trusted by 20+ Chennai temples for annadhanam & utsavams.",
          },
          {
            year: "2023",
            title: "New Central Kitchen",
            desc: "Opened a state-of-the-art FSSAI-certified central kitchen.",
          },
          {
            year: "2026",
            title: "1500+ Events Served",
            desc: "A legacy of trust, tradition, and taste continues.",
          },
        ],
      },
    };
  },
);

/* ── Services Data ───────────────────────────────────────────────── */
export const getServicesDataServerFn = createServerFn({ method: "GET" }).handler(
  async () => {
    let cmsServices: ServiceItem[] | null = null;
    try {
      cmsServices = await sanityFetch<ServiceItem[]>(VISIBLE_SERVICES_QUERY);
    } catch (e) {
      console.warn("[content] Sanity fetch error on Services, falling back to static:", e);
    }

    const services =
      cmsServices && cmsServices.length > 0
        ? cmsServices
        : fallbackServices.map((s, idx) => ({
            _id: `service-${s.id}`,
            _type: "service",
            title: s.title,
            description: s.desc,
            image: s.image,
            iconName: s.icon.name || "Heart",
            order: idx + 1,
            visible: true,
          }));

    return { services };
  },
);

/* ── Events Data ─────────────────────────────────────────────────── */
export const getEventsDataServerFn = createServerFn({ method: "GET" }).handler(
  async () => {
    let cmsEvents: EventItem[] | null = null;
    let cmsPage = null;
    try {
      [cmsEvents, cmsPage] = await Promise.all([
        sanityFetch<EventItem[]>(VISIBLE_EVENTS_QUERY),
        sanityFetch(EVENTS_PAGE_QUERY),
      ]);
    } catch (e) {
      console.warn("[content] Sanity fetch error on Events, falling back to static:", e);
    }

    const events =
      cmsEvents && cmsEvents.length > 0
        ? cmsEvents
        : fallbackEvents.map((e, idx) => ({
            _id: `event-${e.id}`,
            _type: "event",
            title: e.title,
            category: e.category,
            stat: e.stat,
            description: e.desc,
            image: e.image,
            order: idx + 1,
            visible: true,
          }));

    return {
      events,
      gallery: cmsPage?.galleryImages || fallbackGallery,
    };
  },
);

/* ── Menu Data ───────────────────────────────────────────────────── */
export const getMenuDataServerFn = createServerFn({ method: "GET" }).handler(
  async () => {
    let cmsMenu: {
      categories: any[];
      sets: any[];
      items: any[];
      pageSettings?: any;
    } | null = null;

    try {
      cmsMenu = await sanityFetch(ALL_MENU_DATA_QUERY);
    } catch (e) {
      console.warn("[content] Sanity fetch error on Menu, falling back to static:", e);
    }

    // If CMS has valid data, return it
    if (
      cmsMenu &&
      Array.isArray(cmsMenu.categories) &&
      cmsMenu.categories.length > 0
    ) {
      return {
        categories: cmsMenu.categories,
        sets: cmsMenu.sets,
        items: cmsMenu.items,
        pageSettings: cmsMenu.pageSettings,
      };
    }

    // Otherwise return robust fallback
    return {
      categories: [
        { id: "tiffin", title: "Tiffin", tamil: "டிபன்", menuType: "sets" },
        { id: "lunch", title: "Lunch", tamil: "சாப்பாடு", menuType: "sets" },
        { id: "dinner", title: "Dinner", tamil: "டின்னர்", menuType: "sets" },
        {
          id: "fried-rice-noodles",
          title: "Fried Rice & Noodles",
          tamil: "ப்ரைட் ரைஸ் & நூடுல்ஸ்",
          menuType: "priced",
          description: friedRiceNoodles.description,
        },
        {
          id: "indian-breads",
          title: "Indian Breads",
          tamil: "இந்தியன் பிரெட்ஸ்",
          menuType: "priced",
          description: indianBreads.description,
        },
        {
          id: "north-indian-gravy",
          title: "North Indian Gravy",
          tamil: "வட இந்திய கிரேவி",
          menuType: "priced",
          description: northIndianGravy.description,
        },
        {
          id: "grill-tandoori-bbq",
          title: "Grill, Tandoori & BBQ",
          tamil: "கிரில், தந்தூரி & BBQ",
          menuType: "priced",
          description: grillTandooriBBQ.description,
        },
      ],
      sets: [
        ...tiffinSets.map((s) => ({ ...s, categoryId: "tiffin" })),
        ...lunchSets.map((s) => ({ ...s, categoryId: "lunch" })),
        ...dinnerSets.map((s) => ({ ...s, categoryId: "dinner" })),
      ],
      items: [
        ...friedRiceNoodles.items.map((i) => ({
          ...i,
          categoryId: "fried-rice-noodles",
        })),
        ...indianBreads.items.map((i) => ({
          ...i,
          categoryId: "indian-breads",
        })),
        ...northIndianGravy.items.map((i) => ({
          ...i,
          categoryId: "north-indian-gravy",
        })),
        ...grillTandooriBBQ.items.map((i) => ({
          ...i,
          categoryId: "grill-tandoori-bbq",
        })),
      ],
      pageSettings: {
        heroEyebrow: "Our Menus",
        heroHeading: "A Feast",
        heroHeadingAccent: "on Banana Leaf",
        heroDescription:
          "Choose from carefully curated Tiffin, Lunch, Dinner, Indian Breads, Gravies, and Tandoori specialties — or ask us to design a custom feast for your event.",
      },
    };
  },
);

/* ── Contact Data ────────────────────────────────────────────────── */
export const getContactDataServerFn = createServerFn({ method: "GET" }).handler(
  async () => {
    let cmsSettings: SiteSettings | null = null;
    let cmsPage = null;

    try {
      [cmsSettings, cmsPage] = await Promise.all([
        sanityFetch<SiteSettings>(SITE_SETTINGS_QUERY),
        sanityFetch(CONTACT_PAGE_QUERY),
      ]);
    } catch (e) {
      console.warn("[content] Sanity fetch error on Contact, falling back to static:", e);
    }

    return {
      settings: cmsSettings || {
        _id: "siteSettings",
        _type: "siteSettings",
        brand: fallbackContact.brand,
        tagline: fallbackContact.tagline,
        phone: fallbackContact.phone,
        phoneRaw: fallbackContact.phoneRaw,
        whatsappNumber: fallbackContact.whatsappNumber,
        email: fallbackContact.email,
        address: fallbackContact.address,
        mapsUrl: fallbackContact.mapsUrl,
        mapsEmbed: fallbackContact.mapsEmbed,
      },
      page: cmsPage || {
        heroEyebrow: "Get in Touch",
        heroHeading: "Let's Plan Your",
        heroHeadingAccent: "Feast",
        reachUsHeading: "Reach Us",
        reachUsDescription: "We respond within an hour on WhatsApp.",
        formHeading: "Send an Enquiry",
        formDescription: "Your details will open a pre-filled WhatsApp chat with us.",
      },
    };
  },
);

/* ── Header & Footer Data ────────────────────────────────────────── */
export const getHeaderFooterDataServerFn = createServerFn({ method: "GET" }).handler(
  async () => {
    let cmsHeader: HeaderSettings | null = null;
    let cmsFooter: FooterSettings | null = null;

    try {
      [cmsHeader, cmsFooter] = await Promise.all([
        sanityFetch<HeaderSettings>(HEADER_SETTINGS_QUERY),
        sanityFetch<FooterSettings>(FOOTER_SETTINGS_QUERY),
      ]);
    } catch (e) {
      // fallback
    }

    return {
      header: cmsHeader || {
        _id: "headerSettings",
        _type: "headerSettings",
        logoUrl: "/logo-with-bg.png",
        brandName: "Thirumal",
        brandSubtext: "Catering Services",
        navLinks: [
          { to: "/", label: "Home" },
          { to: "/about", label: "About" },
          { to: "/services", label: "Services" },
          { to: "/events", label: "Events" },
          { to: "/menu", label: "Menu" },
          { to: "/contact", label: "Contact" },
        ],
        ctaText: "Book Now",
        ctaLink: "/contact",
      },
      footer: cmsFooter || {
        _id: "footerSettings",
        _type: "footerSettings",
        logoUrl: "/logo-with-bg.png",
        brandName: "Thirumal",
        brandSubtext: "Catering",
        tagline: "Tradition in Every Taste",
        navLinks: [
          { to: "/", label: "Home" },
          { to: "/about", label: "About" },
          { to: "/services", label: "Services" },
          { to: "/events", label: "Events" },
          { to: "/menu", label: "Menu" },
          { to: "/contact", label: "Contact" },
        ],
        socialLinks: [
          { platform: "instagram", url: "#" },
          { platform: "facebook", url: "#" },
        ],
        copyright: "Thirumal Catering Services · Tradition in Every Taste",
        developerName: "Branding Digit",
        developerUrl: "https://www.brandingdigit.com",
      },
    };
  },
);
