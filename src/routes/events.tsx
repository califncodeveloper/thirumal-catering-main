import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ParallaxStack } from "../components/ParallaxStack";
import { SectionHeading } from "../components/SectionHeading";
import { getEventsDataServerFn } from "../lib/content.server";

export const Route = createFileRoute("/events")({
  loader: async () => {
    return await getEventsDataServerFn();
  },
  head: () => ({
    meta: [
      { title: "Events We've Catered — Weddings, Receptions, Corporate, Temple | Thirumal Catering" },
      { name: "description", content: "Highlights from 1500+ weddings, receptions, corporate launches and temple utsavams Thirumal Catering has proudly served across Chennai. View our event portfolio and gallery." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://thirumalcatering.com/events" },
      { property: "og:title", content: "Our Events Portfolio | Thirumal Catering Chennai" },
      { property: "og:description", content: "A showcase of 1500+ memorable celebrations catered by Thirumal across Chennai." },
      { property: "og:image", content: "https://thirumalcatering.com/logo-with-bg.png" },
      { name: "twitter:title", content: "Events | Thirumal Catering Chennai" },
      { name: "twitter:description", content: "See our portfolio of 1500+ events — weddings, temple functions, corporate events across Chennai." },
    ],
    links: [
      { rel: "canonical", href: "https://thirumalcatering.com/events" },
    ],
  }),
  component: EventsPage,
});

function EventsPage() {
  const { events, gallery } = Route.useLoaderData();

  // Normalize events for ParallaxStack
  const normalizedEvents = events.map((e) => ({
    id: e._id || e.title,
    title: e.title,
    category: e.category,
    desc: e.description,
    image: typeof e.image === "string" ? e.image : "/images/wedding-event-hall.jpg",
    stat: e.stat,
  }));

  return (
    <div>
      <section className="relative pt-40 pb-24 bg-maroon-deep text-cream overflow-hidden">
        <div className="absolute inset-0 opacity-25 bg-[url('/images/services-hero-bg.jpg')] bg-cover bg-center" />
        <div className="relative mx-auto max-w-5xl px-6 text-center">
          <div className="text-xs uppercase tracking-[0.4em] text-gold-light">Portfolio</div>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="mt-6 font-display text-5xl md:text-7xl font-bold">
            Events We've <span className="italic text-gold-gradient">Feasted</span>
          </motion.h1>
        </div>
      </section>

      <section className="py-24 bg-background">
        <ParallaxStack events={normalizedEvents} />
      </section>

      <section className="py-24 bg-muted">
        <div className="mx-auto max-w-7xl px-6">
          <SectionHeading eyebrow="Gallery" title="Moments From Our Kitchen" />
          <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
            {gallery.map((src: string, i: number) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: (i % 4) * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="break-inside-avoid rounded-2xl overflow-hidden shadow-lg border border-border"
              >
                <img src={src} alt="" loading="lazy" className="w-full h-auto block" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
