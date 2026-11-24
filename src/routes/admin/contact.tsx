import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Phone, Mail, MapPin, Send, MessageSquare } from "lucide-react";
import {
  getAdminContactDataServerFn,
  saveSingletonDocServerFn,
} from "../../lib/admin-actions.server";
import { PublishBar } from "../../components/admin/PublishBar";
import { CONTACT } from "../../lib/contact";
import type { ContactPageContent, SiteSettings } from "../../lib/sanity.types";

interface ContactViewData {
  contactPage: ContactPageContent;
  settings: SiteSettings;
}

export const Route = createFileRoute("/admin/contact")({
  loader: async (): Promise<ContactViewData> => {
    try {
      const pageData = (await getAdminContactDataServerFn()) as ContactPageContent;
      if (pageData && pageData._id) {
        return {
          contactPage: pageData,
          settings: {
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
          },
        };
      }
    } catch {
      // fallback
    }

    return {
      contactPage: {
        _id: "contactPage",
        _type: "contactPage",
        heroEyebrow: "Get in Touch",
        heroHeading: "Let's Plan Your",
        heroHeadingAccent: "Feast",
        reachUsHeading: "Reach Us",
        reachUsDescription: "We respond within an hour on WhatsApp.",
        formHeading: "Send an Enquiry",
        formDescription: "Your details will open a pre-filled WhatsApp chat with us.",
        eventTypes: [
          "Wedding",
          "Reception",
          "Birthday",
          "Housewarming",
          "Corporate",
          "Temple Function",
          "Other",
        ],
      },
      settings: {
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
      },
    };
  },
  head: () => ({
    meta: [{ title: "Contact Details — Thirumal Admin" }],
  }),
  component: AdminContactEditor,
});

function AdminContactEditor() {
  const initialData = Route.useLoaderData();
  const [pageData, setPageData] = useState<ContactPageContent>(initialData.contactPage);
  const [settings, setSettings] = useState<SiteSettings>(initialData.settings);
  const [isSaving, setIsSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const updateSetting = <K extends keyof SiteSettings>(
    key: K,
    val: SiteSettings[K],
  ) => {
    setSettings({ ...settings, [key]: val });
    setIsDirty(true);
  };

  const updatePage = <K extends keyof ContactPageContent>(
    key: K,
    val: ContactPageContent[K],
  ) => {
    setPageData({ ...pageData, [key]: val });
    setIsDirty(true);
  };

  const handlePublish = async () => {
    setIsSaving(true);
    try {
      await Promise.all([
        saveSingletonDocServerFn({ data: { doc: settings } }),
        saveSingletonDocServerFn({ data: { doc: pageData } }),
      ]);
      setIsDirty(false);
      setLastSaved(new Date());
    } catch (e) {
      console.error(e);
      alert("Failed to save contact information.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground">
          Contact Details & Enquiry Settings
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Update phone numbers, WhatsApp routing, email address, physical location and Google Maps embed URL.
        </p>
      </div>

      {/* ── Business Contact Credentials ────────────────────────── */}
      <section className="p-6 md:p-8 rounded-3xl bg-card border border-border shadow-lg space-y-6">
        <h2 className="font-display text-2xl font-bold text-foreground border-b border-border pb-3 flex items-center gap-2">
          <Phone size={20} className="text-gold" /> Direct Contact Channels
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
              Display Phone Number
            </label>
            <input
              type="text"
              value={settings.phone}
              onChange={(e) => updateSetting("phone", e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border border-input bg-background text-sm font-semibold"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
              Dialable Phone (tel: format)
            </label>
            <input
              type="text"
              value={settings.phoneRaw}
              onChange={(e) => updateSetting("phoneRaw", e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border border-input bg-background text-sm font-mono text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
              WhatsApp Number (with country code)
            </label>
            <input
              type="text"
              value={settings.whatsappNumber}
              onChange={(e) => updateSetting("whatsappNumber", e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border border-input bg-background text-sm font-semibold"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
              Official Email
            </label>
            <input
              type="email"
              value={settings.email}
              onChange={(e) => updateSetting("email", e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border border-input bg-background text-sm font-semibold"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
              Complete Physical Address
            </label>
            <textarea
              rows={2}
              value={settings.address}
              onChange={(e) => updateSetting("address", e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border border-input bg-background text-sm resize-none"
            />
          </div>
        </div>
      </section>

      {/* ── Google Maps & Embed ─────────────────────────────────── */}
      <section className="p-6 md:p-8 rounded-3xl bg-card border border-border shadow-lg space-y-6">
        <h2 className="font-display text-2xl font-bold text-foreground border-b border-border pb-3 flex items-center gap-2">
          <MapPin size={20} className="text-gold" /> Location & Maps Embed
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
              Google Maps Search / Direction Link
            </label>
            <input
              type="text"
              value={settings.mapsUrl}
              onChange={(e) => updateSetting("mapsUrl", e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border border-input bg-background text-sm font-mono text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
              Google Maps Embed URL (iframe src)
            </label>
            <input
              type="text"
              value={settings.mapsEmbed}
              onChange={(e) => updateSetting("mapsEmbed", e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border border-input bg-background text-sm font-mono text-xs"
            />
          </div>

          {settings.mapsEmbed && (
            <div className="mt-4 rounded-2xl overflow-hidden border border-border aspect-[21/9]">
              <iframe
                src={settings.mapsEmbed}
                className="w-full h-full"
                title="Preview Map"
                loading="lazy"
              />
            </div>
          )}
        </div>
      </section>

      {/* ── Sticky Publish Bar ───────────────────────────────────── */}
      <PublishBar
        isSaving={isSaving}
        isDirty={isDirty}
        lastSaved={lastSaved}
        onPublish={handlePublish}
        onReset={() => {
          setPageData(initialData.contactPage);
          setSettings(initialData.settings);
          setIsDirty(false);
        }}
      />
    </div>
  );
}
