/**
 * THIRUMAL CATERING — CONTENT MIGRATION SCRIPT
 *
 * Migrates all original static TypeScript content into Sanity CMS:
 * - Site Settings & Contact info
 * - Homepage (hero, video, stats, story, why-us, testimonials, cta)
 * - About Page (intro, story, milestones, values)
 * - Services (all 6 services)
 * - Events (all 6 showcase events + gallery images)
 * - Menu Categories (all 7 categories)
 * - Menu Sets (all 14 traditional sets with preserved Tamil text)
 * - Priced Menu Items (all 38 items with exact prices)
 * - Header & Footer settings
 * - SEO Settings
 *
 * Run with: node --loader ts-node/esm src/scripts/migrate-content.ts
 * Or: npx tsx src/scripts/migrate-content.ts
 */

import { createClient } from "@sanity/client";
import { services } from "../data/services";
import { events, galleryImages } from "../data/events";
import { tiffinSets, lunchSets, dinnerSets } from "../data/menu";
import {
  friedRiceNoodles,
  indianBreads,
  northIndianGravy,
  grillTandooriBBQ,
} from "../data/additionalMenu";
import { testimonials } from "../data/testimonials";
import { CONTACT } from "../lib/contact";

const projectId = process.env.SANITY_PROJECT_ID || "hsd7yaac";
const dataset = process.env.SANITY_DATASET || "production";
const apiVersion = process.env.SANITY_API_VERSION || "2026-11-24";
const token =
  process.env.SANITY_API_TOKEN ||
  "skHJ6YAQOQNbX2NPEI8YPDzF5zS0mjxpbOmXUWxlVGzcwzYI7wuLznRYU3YjsXOFgzysD5hCi8mL8Gsu00qOOemxHZcX71dZYK9cEfJHjYq6yNhvlkdXEZ3LPibxxAZ7f4YDm0EA5vMOgW6rqwkRolmnURRnasPZsuq5sbVlVbEB2rSBDttx";

const client = createClient({
  projectId,
  dataset,
  apiVersion,
  token,
  useCdn: false,
});

async function migrate() {
  console.log("=================================================");
  console.log("  THIRUMAL CATERING — SANITY CONTENT MIGRATION  ");
  console.log("=================================================");
  console.log(`Connecting to Sanity: project ${projectId}, dataset: ${dataset}...`);

  const summary = {
    singletons: 0,
    services: 0,
    events: 0,
    categories: 0,
    menuSets: 0,
    menuItems: 0,
    testimonials: 0,
    seo: 0,
    errors: 0,
  };

  /* ── 1. Site Settings ────────────────────────────────────────── */
  try {
    console.log("\n[1/10] Migrating Site Settings...");
    await client.createOrReplace({
      _id: "siteSettings",
      _type: "siteSettings",
      brand: CONTACT.brand,
      tagline: CONTACT.tagline,
      phone: CONTACT.phone,
      phoneRaw: CONTACT.phoneRaw,
      whatsappNumber: CONTACT.whatsappNumber,
      email: CONTACT.email,
      address: CONTACT.address,
      mapsUrl: CONTACT.mapsUrl,
      mapsEmbed: CONTACT.mapsEmbed,
    });
    summary.singletons++;
    console.log("  ✓ Site Settings migrated successfully.");
  } catch (err) {
    console.error("  ✗ Site Settings error:", err);
    summary.errors++;
  }

  /* ── 2. Header & Footer Settings ─────────────────────────────── */
  try {
    console.log("\n[2/10] Migrating Header & Footer Settings...");
    await client.createOrReplace({
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
    });
    summary.singletons++;

    await client.createOrReplace({
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
    });
    summary.singletons++;
    console.log("  ✓ Header & Footer settings migrated.");
  } catch (err) {
    console.error("  ✗ Header & Footer error:", err);
    summary.errors++;
  }

  /* ── 3. Homepage Content ─────────────────────────────────────── */
  try {
    console.log("\n[3/10] Migrating Homepage Content...");
    await client.createOrReplace({
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
    });
    summary.singletons++;
    console.log("  ✓ Homepage document migrated.");
  } catch (err) {
    console.error("  ✗ Homepage error:", err);
    summary.errors++;
  }

  /* ── 4. About Page Content ───────────────────────────────────── */
  try {
    console.log("\n[4/10] Migrating About Page Content...");
    await client.createOrReplace({
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
    });
    summary.singletons++;
    console.log("  ✓ About page document migrated.");
  } catch (err) {
    console.error("  ✗ About page error:", err);
    summary.errors++;
  }

  /* ── 5. Services ─────────────────────────────────────────────── */
  try {
    console.log("\n[5/10] Migrating 6 Services...");
    for (let idx = 0; idx < services.length; idx++) {
      const s = services[idx];
      await client.createOrReplace({
        _id: `service-${s.id}`,
        _type: "service",
        title: s.title,
        description: s.desc,
        image: s.image,
        iconName: s.icon.name || "Heart",
        order: idx + 1,
        visible: true,
      });
      summary.services++;
      console.log(`  ✓ Service: ${s.title}`);
    }
  } catch (err) {
    console.error("  ✗ Services error:", err);
    summary.errors++;
  }

  /* ── 6. Events & Gallery ─────────────────────────────────────── */
  try {
    console.log("\n[6/10] Migrating 6 Events & Gallery...");
    for (let idx = 0; idx < events.length; idx++) {
      const e = events[idx];
      await client.createOrReplace({
        _id: `event-${e.id}`,
        _type: "event",
        title: e.title,
        category: e.category,
        stat: e.stat,
        description: e.desc,
        image: e.image,
        order: idx + 1,
        visible: true,
      });
      summary.events++;
      console.log(`  ✓ Event: ${e.title}`);
    }

    await client.createOrReplace({
      _id: "eventsPage",
      _type: "eventsPage",
      heroEyebrow: "Portfolio",
      heroHeading: "Events We've",
      heroHeadingAccent: "Feasted",
      galleryEyebrow: "Gallery",
      galleryHeading: "Moments From Our Kitchen",
      galleryImages,
    });
    summary.singletons++;
    console.log("  ✓ Events gallery migrated.");
  } catch (err) {
    console.error("  ✗ Events error:", err);
    summary.errors++;
  }

  /* ── 7. Menu Categories (All 7) ──────────────────────────────── */
  try {
    console.log("\n[7/10] Migrating 7 Menu Categories...");
    const categoryConfigs = [
      { id: "cat-tiffin", title: "Tiffin", tamil: "டிபன்", menuType: "sets", order: 1 },
      { id: "cat-lunch", title: "Lunch", tamil: "சாப்பாடு", menuType: "sets", order: 2 },
      { id: "cat-dinner", title: "Dinner", tamil: "டின்னர்", menuType: "sets", order: 3 },
      {
        id: "cat-fried-rice-noodles",
        title: friedRiceNoodles.title,
        tamil: friedRiceNoodles.tamil,
        description: friedRiceNoodles.description,
        menuType: "priced",
        order: 4,
      },
      {
        id: "cat-indian-breads",
        title: indianBreads.title,
        tamil: indianBreads.tamil,
        description: indianBreads.description,
        menuType: "priced",
        order: 5,
      },
      {
        id: "cat-north-indian-gravy",
        title: northIndianGravy.title,
        tamil: northIndianGravy.tamil,
        description: northIndianGravy.description,
        menuType: "priced",
        order: 6,
      },
      {
        id: "cat-grill-tandoori-bbq",
        title: grillTandooriBBQ.title,
        tamil: grillTandooriBBQ.tamil,
        description: grillTandooriBBQ.description,
        menuType: "priced",
        order: 7,
      },
    ];

    for (const cat of categoryConfigs) {
      await client.createOrReplace({
        _id: cat.id,
        _type: "menuCategory",
        title: cat.title,
        tamil: cat.tamil,
        description: cat.description || "",
        menuType: cat.menuType,
        order: cat.order,
        visible: true,
      });
      summary.categories++;
      console.log(`  ✓ Category: ${cat.title} (${cat.tamil})`);
    }
  } catch (err) {
    console.error("  ✗ Menu categories error:", err);
    summary.errors++;
  }

  /* ── 8. Menu Sets (All 14 Traditional Sets) ─────────────────── */
  try {
    console.log("\n[8/10] Migrating 14 Traditional Menu Sets (Preserving Tamil text)...");
    const allSets = [
      ...tiffinSets.map((s, idx) => ({ ...s, categoryId: "cat-tiffin", order: idx + 1 })),
      ...lunchSets.map((s, idx) => ({ ...s, categoryId: "cat-lunch", order: idx + 1 })),
      ...dinnerSets.map((s, idx) => ({ ...s, categoryId: "cat-dinner", order: idx + 1 })),
    ];

    for (const s of allSets) {
      await client.createOrReplace({
        _id: `set-${s.id}`,
        _type: "menuSet",
        title: s.title,
        tamil: s.tamil,
        items: s.items,
        variant: s.variant,
        categoryId: s.categoryId,
        order: s.order,
      });
      summary.menuSets++;
      console.log(`  ✓ Set: ${s.title} (${s.tamil}) - ${s.items.length} items`);
    }
  } catch (err) {
    console.error("  ✗ Menu sets error:", err);
    summary.errors++;
  }

  /* ── 9. Priced Menu Items (All 38 Items) ─────────────────────── */
  try {
    console.log("\n[9/10] Migrating 38 Priced Menu Items...");
    const allPriced = [
      ...friedRiceNoodles.items.map((i, idx) => ({ ...i, categoryId: "cat-fried-rice-noodles", order: idx + 1 })),
      ...indianBreads.items.map((i, idx) => ({ ...i, categoryId: "cat-indian-breads", order: idx + 1 })),
      ...northIndianGravy.items.map((i, idx) => ({ ...i, categoryId: "cat-north-indian-gravy", order: idx + 1 })),
      ...grillTandooriBBQ.items.map((i, idx) => ({ ...i, categoryId: "cat-grill-tandoori-bbq", order: idx + 1 })),
    ];

    for (const it of allPriced) {
      await client.createOrReplace({
        _id: `item-${it.id}`,
        _type: "menuItem",
        name: it.name,
        price: it.price,
        categoryId: it.categoryId,
        order: it.order,
      });
      summary.menuItems++;
    }
    console.log(`  ✓ Migrated all ${allPriced.length} priced items across 4 categories.`);
  } catch (err) {
    console.error("  ✗ Priced items error:", err);
    summary.errors++;
  }

  /* ── 10. Testimonials & SEO ─────────────────────────────────── */
  try {
    console.log("\n[10/10] Migrating 8 Testimonials and SEO settings...");
    for (let idx = 0; idx < testimonials.length; idx++) {
      const t = testimonials[idx];
      await client.createOrReplace({
        _id: `testimonial-${idx + 1}`,
        _type: "testimonial",
        name: t.name,
        event: t.event,
        quote: t.quote,
        order: idx + 1,
        visible: true,
      });
      summary.testimonials++;
    }

    const pages = ["home", "about", "services", "events", "menu", "contact"];
    for (const p of pages) {
      await client.createOrReplace({
        _id: `seo-${p}`,
        _type: "seoSettings",
        pageId: p,
        title: `Thirumal Catering — Authentic South Indian Catering in Chennai`,
        description: `Chennai's most trusted South Indian caterer since 2008. Weddings, receptions, temple utsavams, corporate events & housewarmings.`,
        ogTitle: `Thirumal Catering — Tradition in Every Taste | Chennai`,
        ogDescription: `Authentic South Indian catering for weddings, temple functions and corporate events.`,
        ogImage: "https://thirumalcatering.com/logo-with-bg.png",
        canonicalUrl: `https://thirumalcatering.com${p === "home" ? "" : "/" + p}`,
      });
      summary.seo++;
    }
    console.log("  ✓ Testimonials & SEO configurations migrated.");
  } catch (err) {
    console.error("  ✗ Testimonials & SEO error:", err);
    summary.errors++;
  }

  console.log("\n=================================================");
  console.log("             MIGRATION COMPLETED                 ");
  console.log("=================================================");
  console.log(`• Singletons migrated:    ${summary.singletons}`);
  console.log(`• Services migrated:      ${summary.services}`);
  console.log(`• Events migrated:        ${summary.events}`);
  console.log(`• Menu Categories:        ${summary.categories}`);
  console.log(`• Menu Sets:              ${summary.menuSets} (All Tamil items preserved)`);
  console.log(`• Priced Menu Items:      ${summary.menuItems} (All prices preserved)`);
  console.log(`• Testimonials migrated:  ${summary.testimonials}`);
  console.log(`• SEO configurations:     ${summary.seo}`);
  console.log(`• Errors encountered:     ${summary.errors}`);
  console.log("=================================================");
}

migrate().catch(console.error);
