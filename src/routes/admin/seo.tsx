import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Search, Globe, Image as ImageIcon } from "lucide-react";
import {
  getAdminSeoDataServerFn,
  saveSingletonDocServerFn,
} from "../../lib/admin-actions.server";
import { ImageUploader } from "../../components/admin/ImageUploader";
import { PublishBar } from "../../components/admin/PublishBar";
import type { SeoSettings } from "../../lib/sanity.types";

const PAGES = [
  { id: "home", label: "Homepage (/)", path: "/" },
  { id: "about", label: "About Page (/about)", path: "/about" },
  { id: "services", label: "Services (/services)", path: "/services" },
  { id: "events", label: "Events (/events)", path: "/events" },
  { id: "menu", label: "Menu (/menu)", path: "/menu" },
  { id: "contact", label: "Contact (/contact)", path: "/contact" },
];

export const Route = createFileRoute("/admin/seo")({
  loader: async (): Promise<{ settings: Record<string, SeoSettings> }> => {
    const map: Record<string, SeoSettings> = {};
    try {
      const data = (await getAdminSeoDataServerFn()) as SeoSettings[];
      if (Array.isArray(data)) {
        data.forEach((s) => {
          if (s.pageId) map[s.pageId] = s;
        });
      }
    } catch {
      // fallback
    }

    // Ensure all 6 pages have default values
    PAGES.forEach((p) => {
      if (!map[p.id]) {
        map[p.id] = {
          _id: `seo-${p.id}`,
          _type: "seoSettings",
          pageId: p.id,
          title: `Thirumal Catering — Authentic South Indian Catering in Chennai`,
          description: `Chennai's most trusted South Indian caterer since 2008. Weddings, receptions, temple utsavams, corporate events & housewarmings.`,
          ogTitle: `Thirumal Catering — Tradition in Every Taste | Chennai`,
          ogDescription: `Authentic South Indian catering for weddings, temple functions and corporate events.`,
          ogImage: "https://thirumalcatering.com/logo-with-bg.png",
          canonicalUrl: `https://thirumalcatering.com${p.path === "/" ? "" : p.path}`,
        };
      }
    });

    return { settings: map };
  },
  head: () => ({
    meta: [{ title: "SEO Settings — Thirumal Admin" }],
  }),
  component: AdminSeoPage,
});

function AdminSeoPage() {
  const { settings: initialSettings } = Route.useLoaderData();
  const [settings, setSettings] = useState<Record<string, SeoSettings>>(initialSettings);
  const [activePageId, setActivePageId] = useState<string>("home");
  const [isSaving, setIsSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const activeSeo = settings[activePageId];

  const updateActive = <K extends keyof SeoSettings>(
    key: K,
    val: SeoSettings[K],
  ) => {
    if (!activeSeo) return;
    const updated = { ...activeSeo, [key]: val };
    setSettings({ ...settings, [activePageId]: updated });
    setIsDirty(true);
  };

  const handlePublish = async () => {
    setIsSaving(true);
    try {
      if (activeSeo) {
        await saveSingletonDocServerFn({ data: { doc: activeSeo } });
      }
      setIsDirty(false);
      setLastSaved(new Date());
    } catch (e) {
      console.error(e);
      alert("Failed to save SEO settings.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground">
          Search Engine Optimization (SEO)
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Configure search engine titles, meta descriptions, social media OpenGraph cards, and canonical links.
        </p>
      </div>

      {/* ── Page Selector Pills ─────────────────────────────────── */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
        {PAGES.map((page) => {
          const isActive = page.id === activePageId;
          return (
            <button
              key={page.id}
              onClick={() => setActivePageId(page.id)}
              className={`shrink-0 px-5 py-2.5 rounded-full text-xs font-bold transition-all ${
                isActive
                  ? "gold-gradient text-maroon-deep shadow-md"
                  : "bg-card border border-border text-foreground hover:border-gold"
              }`}
            >
              {page.label}
            </button>
          );
        })}
      </div>

      {/* ── Google Search Snippet Preview ───────────────────────── */}
      <div className="p-6 rounded-3xl bg-card border border-border shadow-sm space-y-2">
        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
          <Globe size={13} className="text-primary" /> Google Search Preview
        </span>
        <div className="max-w-xl space-y-1">
          <div className="text-xs text-emerald-800 dark:text-emerald-400 font-mono">
            {activeSeo?.canonicalUrl || "https://thirumalcatering.com"}
          </div>
          <h3 className="text-base text-blue-700 dark:text-blue-400 font-medium hover:underline cursor-pointer line-clamp-1">
            {activeSeo?.title || "Page Title"}
          </h3>
          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
            {activeSeo?.description || "Meta description of the page..."}
          </p>
        </div>
      </div>

      {/* ── SEO Editor Form ─────────────────────────────────────── */}
      {activeSeo && (
        <div className="p-6 md:p-8 rounded-3xl bg-card border border-border shadow-lg space-y-6">
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Page Title (Meta Title)
                </label>
                <span
                  className={`text-[11px] font-semibold ${
                    activeSeo.title.length > 60
                      ? "text-amber-500"
                      : "text-muted-foreground"
                  }`}
                >
                  {activeSeo.title.length} / 60 recommended
                </span>
              </div>
              <input
                type="text"
                value={activeSeo.title}
                onChange={(e) => updateActive("title", e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-input bg-background text-sm font-semibold"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Meta Description
                </label>
                <span
                  className={`text-[11px] font-semibold ${
                    activeSeo.description.length > 160
                      ? "text-amber-500"
                      : "text-muted-foreground"
                  }`}
                >
                  {activeSeo.description.length} / 160 recommended
                </span>
              </div>
              <textarea
                rows={3}
                value={activeSeo.description}
                onChange={(e) => updateActive("description", e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-input bg-background text-sm resize-none leading-relaxed"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                  OpenGraph (Social) Title
                </label>
                <input
                  type="text"
                  value={activeSeo.ogTitle}
                  onChange={(e) => updateActive("ogTitle", e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-input bg-background text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                  Canonical URL
                </label>
                <input
                  type="text"
                  value={activeSeo.canonicalUrl}
                  onChange={(e) => updateActive("canonicalUrl", e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-input bg-background text-sm font-mono text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                OpenGraph Description
              </label>
              <textarea
                rows={2}
                value={activeSeo.ogDescription}
                onChange={(e) => updateActive("ogDescription", e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-input bg-background text-sm resize-none"
              />
            </div>

            <ImageUploader
              label="OpenGraph Social Share Image (1200x630)"
              aspectRatio="wide"
              value={
                typeof activeSeo.ogImage === "string" ? activeSeo.ogImage : ""
              }
              onChange={(url) => updateActive("ogImage", url)}
            />
          </div>
        </div>
      )}

      {/* ── Sticky Publish Bar ───────────────────────────────────── */}
      <PublishBar
        isSaving={isSaving}
        isDirty={isDirty}
        lastSaved={lastSaved}
        onPublish={handlePublish}
        onReset={() => {
          setSettings(initialSettings);
          setIsDirty(false);
        }}
      />
    </div>
  );
}
