import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";
import { z } from "zod";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { waLink } from "../lib/contact";
import { Reveal } from "../components/Reveal";
import { getContactDataServerFn } from "../lib/content.server";

export const Route = createFileRoute("/contact")({
  loader: async () => {
    return await getContactDataServerFn();
  },
  head: () => ({
    meta: [
      { title: "Contact & Book | Thirumal Catering — South Indian Catering Chennai" },
      { name: "description", content: "Book Thirumal Catering for your event in Chennai. Call or WhatsApp for weddings, corporate events, temple functions and housewarmings. Get a custom quote today." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://thirumalcatering.com/contact" },
      { property: "og:title", content: "Contact Thirumal Catering | Book Your Event" },
      { property: "og:description", content: "Book your next event with Chennai's trusted South Indian caterer. Call, WhatsApp or fill the form for a custom quote." },
      { property: "og:image", content: "https://thirumalcatering.com/logo-with-bg.png" },
      { name: "twitter:title", content: "Contact Thirumal Catering | Book Your Event" },
      { name: "twitter:description", content: "Get in touch with Chennai's trusted South Indian caterer. WhatsApp, call or fill the enquiry form." },
    ],
    links: [
      { rel: "canonical", href: "https://thirumalcatering.com/contact" },
    ],
  }),
  component: ContactPage,
});

const schema = z.object({
  name: z.string().trim().min(2, "Name is required").max(80),
  phone: z.string().trim().min(8, "Valid phone required").max(20),
  eventType: z.string().min(1, "Select event type"),
  date: z.string().min(1, "Pick a date"),
  guests: z.string().min(1, "Guest count required"),
  message: z.string().trim().max(500).optional(),
});

const eventTypes = ["Wedding", "Reception", "Birthday", "Housewarming", "Corporate", "Temple Function", "Other"];

function ContactPage() {
  const { settings, page } = Route.useLoaderData();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data = Object.fromEntries(fd.entries()) as Record<string, string>;
    const parsed = schema.safeParse(data);
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      parsed.error.issues.forEach((i) => { errs[i.path[0] as string] = i.message; });
      setErrors(errs);
      return;
    }
    setErrors({});
    const d = parsed.data;
    const msg = `Hi Thirumal Catering!%0A%0AI'd like to book an event.%0A%0A*Name:* ${d.name}%0A*Phone:* ${d.phone}%0A*Event:* ${d.eventType}%0A*Date:* ${d.date}%0A*Guests:* ${d.guests}${d.message ? `%0A*Notes:* ${d.message}` : ""}`;
    window.open(`https://wa.me/${settings.whatsappNumber}?text=${msg}`, "_blank");
  };

  return (
    <div>
      <section className="relative pt-40 pb-20 bg-maroon-deep text-cream overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1567337710282-00832b415979?w=1920&q=80')] bg-cover bg-center" />
        <div className="relative mx-auto max-w-5xl px-6 text-center">
          <div className="text-xs uppercase tracking-[0.4em] text-gold-light">{page.heroEyebrow || "Get in Touch"}</div>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="mt-6 font-display text-5xl md:text-7xl font-bold">
            {page.heroHeading || "Let's Plan Your"}{" "}
            <span className="italic text-gold-gradient">{page.heroHeadingAccent || "Feast"}</span>
          </motion.h1>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="mx-auto max-w-6xl px-6 grid gap-10 md:grid-cols-5">
          {/* Info */}
          <Reveal className="md:col-span-2">
            <div className="p-8 rounded-3xl maroon-gradient text-cream shadow-2xl h-full">
              <h2 className="font-display text-3xl font-bold">{page.reachUsHeading || "Reach Us"}</h2>
              <p className="text-cream/80 mt-2 text-sm">{page.reachUsDescription || "We respond within an hour on WhatsApp."}</p>
              <div className="mt-8 space-y-5">
                <a href={`tel:${settings.phoneRaw}`} className="flex items-start gap-4 group">
                  <div className="p-3 rounded-full gold-gradient text-maroon-deep shrink-0 group-hover:scale-110 transition-transform"><Phone size={18} /></div>
                  <div><div className="text-xs text-gold-light uppercase tracking-wider">Call</div><div className="font-semibold group-hover:text-gold-light">{settings.phone}</div></div>
                </a>
                <a href={`mailto:${settings.email}`} className="flex items-start gap-4 group">
                  <div className="p-3 rounded-full gold-gradient text-maroon-deep shrink-0 group-hover:scale-110 transition-transform"><Mail size={18} /></div>
                  <div className="min-w-0"><div className="text-xs text-gold-light uppercase tracking-wider">Email</div><div className="font-semibold group-hover:text-gold-light break-all">{settings.email}</div></div>
                </a>
                <a href={settings.mapsUrl} target="_blank" rel="noopener" className="flex items-start gap-4 group">
                  <div className="p-3 rounded-full gold-gradient text-maroon-deep shrink-0 group-hover:scale-110 transition-transform"><MapPin size={18} /></div>
                  <div className="min-w-0"><div className="text-xs text-gold-light uppercase tracking-wider">Visit</div><div className="font-semibold group-hover:text-gold-light">{settings.address}</div></div>
                </a>
              </div>
              <a href={waLink("Hi Thirumal, I'd like to enquire.")} target="_blank" rel="noopener" className="mt-8 inline-flex items-center gap-2 bg-[#25D366] text-white font-bold px-6 py-3 rounded-full">
                Chat on WhatsApp
              </a>
            </div>
          </Reveal>

          {/* Form */}
          <Reveal className="md:col-span-3">
            <form onSubmit={onSubmit} className="p-8 rounded-3xl bg-card border border-border shadow-xl space-y-5">
              <h2 className="font-display text-3xl font-bold">{page.formHeading || "Send an Enquiry"}</h2>
              <p className="text-sm text-muted-foreground">{page.formDescription || "Your details will open a pre-filled WhatsApp chat with us."}</p>

              <div className="grid gap-4 md:grid-cols-2">
                <Field name="name" label="Your Name" error={errors.name} />
                <Field name="phone" label="Phone" type="tel" error={errors.phone} />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">Event Type</label>
                  <select name="eventType" className="w-full px-4 py-3 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary">
                    <option value="">Select…</option>
                    {eventTypes.map((t) => <option key={t}>{t}</option>)}
                  </select>
                  {errors.eventType && <p className="text-xs text-destructive mt-1">{errors.eventType}</p>}
                </div>
                <Field name="date" label="Event Date" type="date" error={errors.date} />
              </div>
              <Field name="guests" label="Guest Count" type="number" error={errors.guests} />
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">Notes (optional)</label>
                <textarea name="message" rows={4} className="w-full px-4 py-3 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-none" placeholder="Any preferences, menu ideas, or questions?" />
              </div>

              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" className="w-full flex items-center justify-center gap-2 maroon-gradient text-cream font-bold py-4 rounded-xl shadow-lg">
                Send via WhatsApp <Send size={18} />
              </motion.button>
            </form>
          </Reveal>
        </div>
      </section>

      {/* Map */}
      <section className="pb-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="rounded-3xl overflow-hidden border-4 border-gold/30 shadow-2xl aspect-[16/9]">
            <iframe src={settings.mapsEmbed} className="w-full h-full" loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Thirumal Catering Location" />
          </div>
        </div>
      </section>
    </div>
  );
}

function Field({ name, label, type = "text", error }: { name: string; label: string; type?: string; error?: string }) {
  return (
    <div>
      <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">{label}</label>
      <input name={name} type={type} className="w-full px-4 py-3 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary" />
      {error && <p className="text-xs text-destructive mt-1">{error}</p>}
    </div>
  );
}
