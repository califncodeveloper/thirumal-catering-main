import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Reveal } from "../components/Reveal";
import { SectionHeading } from "../components/SectionHeading";
import { ArrowRight, MessageSquare, ChefHat, Truck, Sparkles, Users, Heart, Building2, Cake, Home, Flame } from "lucide-react";
import { getServicesDataServerFn } from "../lib/content.server";

export const Route = createFileRoute("/services")({
  loader: async () => {
    return await getServicesDataServerFn();
  },
  head: () => ({
    meta: [
      { title: "Catering Services — Weddings, Corporate, Temple, Birthday | Thirumal Catering Chennai" },
      { name: "description", content: "Full-service South Indian catering for weddings, corporate events, temple functions, birthdays, housewarmings and custom occasions across Chennai. Traditional banana-leaf service with trained staff." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://thirumalcatering.com/services" },
      { property: "og:title", content: "Our Catering Services | Thirumal Catering Chennai" },
      { property: "og:description", content: "Every occasion, catered with tradition and care. Weddings, corporate events, temple functions and more across Chennai." },
      { property: "og:image", content: "https://thirumalcatering.com/logo-with-bg.png" },
      { name: "twitter:title", content: "Catering Services | Thirumal Catering Chennai" },
      { name: "twitter:description", content: "Traditional South Indian catering for every occasion across Chennai. Weddings, temple functions, corporate events and more." },
    ],
    links: [
      { rel: "canonical", href: "https://thirumalcatering.com/services" },
    ],
  }),
  component: ServicesPage,
});

const ICON_MAP: Record<string, React.ComponentType<{ size?: number }>> = {
  Heart,
  Building2,
  Cake,
  Home,
  Flame,
  Sparkles,
};

const process = [
  { icon: MessageSquare, title: "Consultation", desc: "Share your vision, guest count, and dietary preferences." },
  { icon: ChefHat, title: "Menu Design", desc: "We craft a custom menu tailored to your event and taste." },
  { icon: Truck, title: "Setup", desc: "Punctual arrival with all serving equipment and station setup." },
  { icon: Users, title: "Serve", desc: "Trained servers deliver a warm banana-leaf experience." },
  { icon: Sparkles, title: "Cleanup", desc: "Spotless departure — you enjoy the memories, not the mess." },
];

function ServicesPage() {
  const { services } = Route.useLoaderData();

  return (
    <div>
      <section className="relative pt-40 pb-24 bg-maroon-deep text-cream overflow-hidden">
        <div className="absolute inset-0 opacity-25 bg-[url('/images/services-hero-bg.jpg')] bg-cover bg-center" />
        <div className="relative mx-auto max-w-5xl px-6 text-center">
          <div className="text-xs uppercase tracking-[0.4em] text-gold-light">What We Do</div>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="mt-6 font-display text-5xl md:text-7xl font-bold">
            Services <span className="italic text-gold-gradient">for Every Occasion</span>
          </motion.h1>
        </div>
      </section>

      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6 space-y-24">
          {services.map((s, i) => {
            const reverse = i % 2 === 1;
            const IconComp = ICON_MAP[s.iconName || "Heart"] || Heart;
            const imgSrc = typeof s.image === "string" ? s.image : "/images/wedding-event-hall.jpg";

            return (
              <Reveal key={s._id}>
                <div className="grid gap-10 md:grid-cols-2 items-center">
                  {/* Title always first */}
                  <div className={`order-1 md:${reverse ? "order-2" : "order-1"} md:col-start-${reverse ? 2 : 1}`}>
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-2xl gold-gradient text-maroon-deep">
                        <IconComp size={22} />
                      </div>
                      <div className="text-xs uppercase tracking-[0.3em] text-primary font-semibold">
                        Service {String(i + 1).padStart(2, "0")}
                      </div>
                    </div>
                    <h3 className="mt-4 font-display text-4xl md:text-5xl font-bold text-foreground">{s.title}</h3>
                  </div>
                  {/* Image second on mobile, alternates on desktop */}
                  <div className={`order-2 md:${reverse ? "md:order-1 md:col-start-1 md:row-start-1" : "md:order-2"}`}>
                    <img src={imgSrc} alt={s.title} className="rounded-3xl shadow-2xl w-full aspect-[4/3] object-cover border-4 border-gold/30" loading="lazy" />
                  </div>
                  {/* Desc last on mobile */}
                  <div className={`order-3 md:${reverse ? "md:order-2 md:col-start-2 md:row-start-1" : ""}`}>
                    <p className="text-muted-foreground text-lg leading-relaxed">{s.description}</p>
                    <Link to="/contact" className="mt-6 inline-flex items-center gap-2 font-semibold text-primary group">
                      Enquire About {s.title} <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      <section className="py-24 bg-maroon-deep text-cream">
        <div className="mx-auto max-w-7xl px-6">
          <SectionHeading light eyebrow="How We Work" title="Our Process" />
          <div className="grid gap-4 md:grid-cols-5">
            {process.map((p, i) => (
              <Reveal key={p.title} delay={i * 0.1}>
                <div className="text-center p-6 rounded-2xl bg-maroon border border-gold/30 h-full">
                  <div className="mx-auto w-14 h-14 rounded-full gold-gradient grid place-items-center text-maroon-deep">
                    <p.icon size={22} />
                  </div>
                  <div className="text-xs text-gold-light mt-3">Step {i + 1}</div>
                  <div className="font-display text-xl font-bold mt-1">{p.title}</div>
                  <p className="text-xs text-cream/70 mt-2 leading-relaxed">{p.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
