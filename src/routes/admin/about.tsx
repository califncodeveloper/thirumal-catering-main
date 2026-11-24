import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Sparkles, Plus, Trash2, Heart, Award } from "lucide-react";
import {
  getAdminAboutDataServerFn,
  saveSingletonDocServerFn,
} from "../../lib/admin-actions.server";
import { ImageUploader } from "../../components/admin/ImageUploader";
import { PublishBar } from "../../components/admin/PublishBar";
import type { AboutPageContent } from "../../lib/sanity.types";

export const Route = createFileRoute("/admin/about")({
  loader: async (): Promise<AboutPageContent> => {
    try {
      const data = (await getAdminAboutDataServerFn()) as AboutPageContent;
      if (data && data._id) return data;
    } catch {
      // fallback
    }

    return {
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
    };
  },
  head: () => ({
    meta: [{ title: "About Page Editor — Thirumal Admin" }],
  }),
  component: AdminAboutEditor,
});

function AdminAboutEditor() {
  const initialData = Route.useLoaderData();
  const [content, setContent] = useState<AboutPageContent>(initialData);
  const [isSaving, setIsSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const updateField = <K extends keyof AboutPageContent>(
    key: K,
    val: AboutPageContent[K],
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
      alert("Failed to publish About page.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground">
          About Page Editor
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage family legacy history, milestones timeline, core values, and kitchen imagery.
        </p>
      </div>

      {/* ── Section: Hero ────────────────────────────────────────── */}
      <section className="p-6 md:p-8 rounded-3xl bg-card border border-border shadow-lg space-y-6">
        <h2 className="font-display text-2xl font-bold text-foreground border-b border-border pb-3">
          Hero Header
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
              Eyebrow Tag
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
              Heading
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
              Accent Line
            </label>
            <input
              type="text"
              value={content.heroHeadingAccent}
              onChange={(e) => updateField("heroHeadingAccent", e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border border-input bg-background text-sm italic"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
            Intro Subtitle
          </label>
          <textarea
            rows={2}
            value={content.heroDescription}
            onChange={(e) => updateField("heroDescription", e.target.value)}
            className="w-full px-4 py-3 rounded-2xl border border-input bg-background text-sm resize-none"
          />
        </div>

        <ImageUploader
          label="Hero Banner Image"
          value={
            typeof content.heroBackgroundImage === "string"
              ? content.heroBackgroundImage
              : ""
          }
          onChange={(url) => updateField("heroBackgroundImage", url)}
        />
      </section>

      {/* ── Section: Family Story ────────────────────────────────── */}
      <section className="p-6 md:p-8 rounded-3xl bg-card border border-border shadow-lg space-y-6">
        <h2 className="font-display text-2xl font-bold text-foreground border-b border-border pb-3">
          Family Legacy Story
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
              Tagline (e.g. Est. 2008)
            </label>
            <input
              type="text"
              value={content.storyEyebrow}
              onChange={(e) => updateField("storyEyebrow", e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border border-input bg-background text-sm"
            />
          </div>
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
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
            Story Paragraphs
          </label>
          <div className="space-y-3">
            {content.storyParagraphs.map((para, i) => (
              <textarea
                key={i}
                rows={3}
                value={para}
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
          label="Kitchen / Chef Photograph"
          value={
            typeof content.storyImage === "string" ? content.storyImage : ""
          }
          onChange={(url) => updateField("storyImage", url)}
        />
      </section>

      {/* ── Section: Milestones Timeline ─────────────────────────── */}
      <section className="p-6 md:p-8 rounded-3xl bg-card border border-border shadow-lg space-y-6">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <h2 className="font-display text-2xl font-bold text-foreground">
            Milestones Timeline ({content.milestones.length})
          </h2>
          <button
            type="button"
            onClick={() => {
              const updated = [
                ...content.milestones,
                { year: "2027", title: "New Milestone", desc: "Description..." },
              ];
              updateField("milestones", updated);
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl gold-gradient text-maroon-deep font-bold text-xs uppercase"
          >
            <Plus size={14} /> Add Year
          </button>
        </div>

        <div className="space-y-4">
          {content.milestones.map((m, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl border border-border bg-muted/20 flex flex-col md:flex-row items-start md:items-center gap-4"
            >
              <div className="w-24 shrink-0">
                <input
                  type="text"
                  value={m.year}
                  onChange={(e) => {
                    const updated = [...content.milestones];
                    updated[idx].year = e.target.value;
                    updateField("milestones", updated);
                  }}
                  className="w-full px-3 py-2 rounded-xl border border-input bg-background font-display font-bold text-lg text-primary text-center"
                />
              </div>

              <div className="flex-1 space-y-2 w-full">
                <input
                  type="text"
                  value={m.title}
                  onChange={(e) => {
                    const updated = [...content.milestones];
                    updated[idx].title = e.target.value;
                    updateField("milestones", updated);
                  }}
                  placeholder="Milestone title"
                  className="w-full px-3 py-2 rounded-xl border border-input bg-background text-sm font-semibold"
                />
                <input
                  type="text"
                  value={m.desc}
                  onChange={(e) => {
                    const updated = [...content.milestones];
                    updated[idx].desc = e.target.value;
                    updateField("milestones", updated);
                  }}
                  placeholder="Brief description"
                  className="w-full px-3 py-2 rounded-xl border border-input bg-background text-xs"
                />
              </div>

              <button
                type="button"
                onClick={() => {
                  const updated = content.milestones.filter((_, i) => i !== idx);
                  updateField("milestones", updated);
                }}
                className="p-2 rounded-xl text-destructive hover:bg-destructive/10"
                title="Remove milestone"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
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
