import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Check, Sparkles, Plus, Trash2, Video, Award, Star } from "lucide-react";
import {
  getAdminHomepageDataServerFn,
  saveSingletonDocServerFn,
} from "../../lib/admin-actions.server";
import { ImageUploader } from "../../components/admin/ImageUploader";
import { PublishBar } from "../../components/admin/PublishBar";
import type { HomepageContent } from "../../lib/sanity.types";

export const Route = createFileRoute("/admin/homepage")({
  loader: async (): Promise<HomepageContent> => {
    try {
      const data = (await getAdminHomepageDataServerFn()) as HomepageContent;
      if (data && data._id) return data;
    } catch {
      // fallback
    }

    return {
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
    };
  },
  head: () => ({
    meta: [{ title: "Homepage Editor — Thirumal Admin" }],
  }),
  component: AdminHomepageEditor,
});

function AdminHomepageEditor() {
  const initialData = Route.useLoaderData();
  const [content, setContent] = useState<HomepageContent>(initialData);
  const [isSaving, setIsSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const updateField = <K extends keyof HomepageContent>(
    key: K,
    val: HomepageContent[K],
  ) => {
    setContent({ ...content, [key]: val });
    setIsDirty(true);
  };

  const handlePublish = async () => {
    setIsSaving(true);
    try {
      await saveSingletonDocServerFn({ data: { doc: content } });
      setIsDirty(false);
      setLastSaved(new Date());
    } catch (e) {
      console.error(e);
      alert("Failed to publish homepage content.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground">
          Homepage Content Editor
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Edit hero headlines, video, statistics, story section, why-us features, and call-to-action blocks.
        </p>
      </div>

      {/* ── Section: Hero ────────────────────────────────────────── */}
      <section className="p-6 md:p-8 rounded-3xl bg-card border border-border shadow-lg space-y-6">
        <div className="flex items-center gap-2 border-b border-border pb-3">
          <Star size={18} className="text-gold" />
          <h2 className="font-display text-2xl font-bold text-foreground">
            Hero Section
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
              Hero Eyebrow Tag
            </label>
            <input
              type="text"
              value={content.heroEyebrow}
              onChange={(e) => updateField("heroEyebrow", e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border border-input bg-background text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
              Hero Heading Line 1
            </label>
            <input
              type="text"
              value={content.heroHeading}
              onChange={(e) => updateField("heroHeading", e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border border-input bg-background text-sm font-display text-lg"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
              Hero Accent Subheading
            </label>
            <input
              type="text"
              value={content.heroHeadingAccent}
              onChange={(e) => updateField("heroHeadingAccent", e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border border-input bg-background text-sm italic"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
              Hero Background Video URL
            </label>
            <input
              type="text"
              value={content.heroVideoUrl}
              onChange={(e) => updateField("heroVideoUrl", e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border border-input bg-background text-sm font-mono text-xs"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
            Hero Description Paragraph
          </label>
          <textarea
            rows={3}
            value={content.heroDescription}
            onChange={(e) => updateField("heroDescription", e.target.value)}
            className="w-full px-4 py-3 rounded-2xl border border-input bg-background text-sm resize-none"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <ImageUploader
            label="Hero Poster Image"
            value={
              typeof content.heroPosterImage === "string"
                ? content.heroPosterImage
                : ""
            }
            onChange={(url) => updateField("heroPosterImage", url)}
          />

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                Primary Button Label
              </label>
              <input
                type="text"
                value={content.heroCtaText}
                onChange={(e) => updateField("heroCtaText", e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-input bg-background text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                Secondary Button Label
              </label>
              <input
                type="text"
                value={content.heroSecondaryCtaText}
                onChange={(e) =>
                  updateField("heroSecondaryCtaText", e.target.value)
                }
                className="w-full px-4 py-3 rounded-2xl border border-input bg-background text-sm"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Section: Statistics Counters ─────────────────────────── */}
      <section className="p-6 md:p-8 rounded-3xl bg-card border border-border shadow-lg space-y-6">
        <div className="flex items-center gap-2 border-b border-border pb-3">
          <Award size={18} className="text-gold" />
          <h2 className="font-display text-2xl font-bold text-foreground">
            Statistics Counters
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {content.stats.map((st, i) => (
            <div
              key={i}
              className="p-4 rounded-2xl border border-border bg-muted/30 space-y-3"
            >
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">
                  Numeric Value
                </label>
                <input
                  type="number"
                  value={st.value}
                  onChange={(e) => {
                    const updated = [...content.stats];
                    updated[i].value = parseInt(e.target.value) || 0;
                    updateField("stats", updated);
                  }}
                  className="w-full px-3 py-2 rounded-xl border border-input bg-background text-sm font-bold font-display text-lg"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">
                    Suffix
                  </label>
                  <input
                    type="text"
                    value={st.suffix}
                    onChange={(e) => {
                      const updated = [...content.stats];
                      updated[i].suffix = e.target.value;
                      updateField("stats", updated);
                    }}
                    className="w-full px-3 py-2 rounded-xl border border-input bg-background text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">
                    Label
                  </label>
                  <input
                    type="text"
                    value={st.label}
                    onChange={(e) => {
                      const updated = [...content.stats];
                      updated[i].label = e.target.value;
                      updateField("stats", updated);
                    }}
                    className="w-full px-3 py-2 rounded-xl border border-input bg-background text-xs"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Section: Story Block ─────────────────────────────────── */}
      <section className="p-6 md:p-8 rounded-3xl bg-card border border-border shadow-lg space-y-6">
        <h2 className="font-display text-2xl font-bold text-foreground border-b border-border pb-3">
          Our Story Preview Section
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
              Story Heading
            </label>
            <input
              type="text"
              value={content.storyHeading}
              onChange={(e) => updateField("storyHeading", e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border border-input bg-background text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
              Story Heading Accent
            </label>
            <input
              type="text"
              value={content.storyHeadingAccent}
              onChange={(e) =>
                updateField("storyHeadingAccent", e.target.value)
              }
              className="w-full px-4 py-3 rounded-2xl border border-input bg-background text-sm italic"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
            Story Paragraphs (One per box)
          </label>
          <div className="space-y-3">
            {content.storyParagraphs.map((p, i) => (
              <textarea
                key={i}
                rows={3}
                value={p}
                onChange={(e) => {
                  const updated = [...content.storyParagraphs];
                  updated[i] = e.target.value;
                  updateField("storyParagraphs", updated);
                }}
                className="w-full px-4 py-3 rounded-2xl border border-input bg-background text-sm resize-none"
              />
            ))}
          </div>
        </div>

        <ImageUploader
          label="Story Section Photo"
          value={
            typeof content.storyImage === "string" ? content.storyImage : ""
          }
          onChange={(url) => updateField("storyImage", url)}
        />
      </section>

      {/* ── Section: Call To Action Banner ───────────────────────── */}
      <section className="p-6 md:p-8 rounded-3xl bg-card border border-border shadow-lg space-y-6">
        <h2 className="font-display text-2xl font-bold text-foreground border-b border-border pb-3">
          Bottom Call-To-Action Banner
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
              CTA Heading
            </label>
            <input
              type="text"
              value={content.ctaHeading}
              onChange={(e) => updateField("ctaHeading", e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border border-input bg-background text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
              CTA Heading Accent
            </label>
            <input
              type="text"
              value={content.ctaHeadingAccent}
              onChange={(e) => updateField("ctaHeadingAccent", e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border border-input bg-background text-sm italic"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
            CTA Subtitle / Description
          </label>
          <input
            type="text"
            value={content.ctaDescription}
            onChange={(e) => updateField("ctaDescription", e.target.value)}
            className="w-full px-4 py-3 rounded-2xl border border-input bg-background text-sm"
          />
        </div>

        <ImageUploader
          label="CTA Banner Background Image"
          aspectRatio="wide"
          value={
            typeof content.ctaBackgroundImage === "string"
              ? content.ctaBackgroundImage
              : ""
          }
          onChange={(url) => updateField("ctaBackgroundImage", url)}
        />
      </section>

      {/* ── Sticky Publish Bar ───────────────────────────────────── */}
      <PublishBar
        isSaving={isSaving}
        isDirty={isDirty}
        lastSaved={lastSaved}
        onPublish={handlePublish}
        onReset={() => {
          setContent(initialData);
          setIsDirty(false);
        }}
      />
    </div>
  );
}
