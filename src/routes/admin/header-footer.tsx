import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Layout, Plus, Trash2 } from "lucide-react";
import {
  getAdminHeaderFooterDataServerFn,
  saveSingletonDocServerFn,
} from "../../lib/admin-actions.server";
import { ImageUploader } from "../../components/admin/ImageUploader";
import { PublishBar } from "../../components/admin/PublishBar";
import type { HeaderSettings, FooterSettings } from "../../lib/sanity.types";

interface HeaderFooterData {
  header: HeaderSettings;
  footer: FooterSettings;
}

export const Route = createFileRoute("/admin/header-footer")({
  loader: async (): Promise<HeaderFooterData> => {
    try {
      const data = (await getAdminHeaderFooterDataServerFn()) as HeaderFooterData;
      if (data && data.header?._id && data.footer?._id) return data;
    } catch {
      // fallback
    }

    return {
      header: {
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
      footer: {
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
  head: () => ({
    meta: [{ title: "Header & Footer — Thirumal Admin" }],
  }),
  component: AdminHeaderFooterEditor,
});

function AdminHeaderFooterEditor() {
  const initialData = Route.useLoaderData();
  const [header, setHeader] = useState<HeaderSettings>(initialData.header);
  const [footer, setFooter] = useState<FooterSettings>(initialData.footer);
  const [isSaving, setIsSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const updateHeader = <K extends keyof HeaderSettings>(
    key: K,
    val: HeaderSettings[K],
  ) => {
    setHeader({ ...header, [key]: val });
    setIsDirty(true);
  };

  const updateFooter = <K extends keyof FooterSettings>(
    key: K,
    val: FooterSettings[K],
  ) => {
    setFooter({ ...footer, [key]: val });
    setIsDirty(true);
  };

  const handlePublish = async () => {
    setIsSaving(true);
    try {
      await Promise.all([
        saveSingletonDocServerFn({ data: { doc: header } }),
        saveSingletonDocServerFn({ data: { doc: footer } }),
      ]);
      setIsDirty(false);
      setLastSaved(new Date());
    } catch (e) {
      console.error(e);
      alert("Failed to save header and footer.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground">
          Header & Footer Settings
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Customize navigation menus, brand logos, tagline, button labels, and footer copyright statements.
        </p>
      </div>

      {/* ── Section: Header Settings ────────────────────────────── */}
      <section className="p-6 md:p-8 rounded-3xl bg-card border border-border shadow-lg space-y-6">
        <h2 className="font-display text-2xl font-bold text-foreground border-b border-border pb-3 flex items-center gap-2">
          <Layout size={20} className="text-gold" /> Website Header (Navigation Bar)
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
              Brand Title
            </label>
            <input
              type="text"
              value={header.brandName}
              onChange={(e) => updateHeader("brandName", e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border border-input bg-background text-sm font-bold"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
              Subtext
            </label>
            <input
              type="text"
              value={header.brandSubtext}
              onChange={(e) => updateHeader("brandSubtext", e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border border-input bg-background text-sm text-xs uppercase"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
              Header Button Label
            </label>
            <input
              type="text"
              value={header.ctaText}
              onChange={(e) => updateHeader("ctaText", e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border border-input bg-background text-sm font-bold"
            />
          </div>
        </div>

        <ImageUploader
          label="Header Brand Logo"
          aspectRatio="square"
          value={typeof header.logoUrl === "string" ? header.logoUrl : ""}
          onChange={(url) => updateHeader("logoUrl", url)}
        />
      </section>

      {/* ── Section: Footer Settings ────────────────────────────── */}
      <section className="p-6 md:p-8 rounded-3xl bg-card border border-border shadow-lg space-y-6">
        <h2 className="font-display text-2xl font-bold text-foreground border-b border-border pb-3 flex items-center gap-2">
          <Layout size={20} className="text-gold" /> Footer Layout & Copyright
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
              Brand Tagline
            </label>
            <input
              type="text"
              value={footer.tagline}
              onChange={(e) => updateFooter("tagline", e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border border-input bg-background text-sm italic font-display text-base"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
              Copyright Statement
            </label>
            <input
              type="text"
              value={footer.copyright}
              onChange={(e) => updateFooter("copyright", e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border border-input bg-background text-sm"
            />
          </div>
        </div>
      </section>

      {/* ── Sticky Publish Bar ───────────────────────────────────── */}
      <PublishBar
        isSaving={isSaving}
        isDirty={isDirty}
        lastSaved={lastSaved}
        onPublish={handlePublish}
        onReset={() => {
          setHeader(initialData.header);
          setFooter(initialData.footer);
          setIsDirty(false);
        }}
      />
    </div>
  );
}
