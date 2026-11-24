import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { SectionHeading } from "../components/SectionHeading";
import { Reveal, staggerContainer, staggerItem } from "../components/Reveal";
import { Sparkles, Heart, Leaf, HandHeart } from "lucide-react";
import { getAboutDataServerFn } from "../lib/content.server";

export const Route = createFileRoute("/about")({
  loader: async () => {
    return await getAboutDataServerFn();
  },
  head: () => ({
    meta: [
      { title: "About Us — Thirumal Catering | 17 Years of South Indian Catering Tradition" },
      { name: "description", content: "Meet the family behind Thirumal Catering — Chennai's trusted South Indian caterer since 2008. Three generations of recipes, 1500+ events served with devotion and tradition." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://thirumalcatering.com/about" },
      { property: "og:title", content: "About Thirumal Catering | A Family Legacy Since 2008" },
      { property: "og:description", content: "A family legacy of authentic South Indian catering in Chennai. Three generations of tradition, 1500+ events served." },
      { property: "og:image", content: "https://thirumalcatering.com/logo-with-bg.png" },
      { name: "twitter:title", content: "About Thirumal Catering | 17 Years of Tradition" },
      { name: "twitter:description", content: "Three generations of South Indian cooking tradition. 1500+ events, Chennai's trusted caterer since 2008." },
    ],
    links: [
      { rel: "canonical", href: "https://thirumalcatering.com/about" },
    ],
  }),
  component: AboutPage,
});

const ICON_MAP: Record<string, React.ComponentType<{ size?: number }>> = {
  Leaf,
  Heart,
  HandHeart,
  Sparkles,
};

function AboutPage() {
  const { about } = Route.useLoaderData();

  return (
    <div>
      {/* HERO */}
      <section className="relative pt-40 pb-24 bg-maroon-deep text-cream overflow-hidden">
        <div
          className="absolute inset-0 opacity-20 bg-cover bg-center"
          style={{
            backgroundImage: `url(${typeof about.heroBackgroundImage === "string" ? about.heroBackgroundImage : "/images/about-hero-feast.jpg"})`,
          }}
        />
        <div className="relative mx-auto max-w-5xl px-6 text-center">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs uppercase tracking-[0.4em] text-gold-light">
            {about.heroEyebrow || "Our Story"}
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="mt-6 font-display text-5xl md:text-7xl font-bold">
            {about.heroHeading || "A Family,"} <span className="italic text-gold-gradient">{about.heroHeadingAccent || "A Legacy"}</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="mt-6 max-w-2xl mx-auto text-cream/80 text-lg">
            {about.heroDescription || "What began as one family's love for feeding people has grown into Chennai's most trusted South Indian catering service."}
          </motion.p>
        </div>
      </section>

      {/* STORY */}
      <section className="py-24">
        <div className="mx-auto max-w-6xl px-6 grid gap-12 md:grid-cols-2 items-center">
          <Reveal className="order-1">
            <div className="text-xs uppercase tracking-[0.3em] text-primary font-semibold">{about.storyEyebrow || "Est. 2008"}</div>
            <h2 className="mt-3 font-display text-4xl md:text-5xl font-bold">{about.storyHeading || "Rooted in Ranganathapuram"}</h2>
          </Reveal>
          <Reveal className="order-2 md:order-3">
            <img
              src={typeof about.storyImage === "string" ? about.storyImage : "/images/chef-traditional-kitchen.jpg"}
              alt="Chef"
              className="rounded-3xl shadow-2xl w-full aspect-[4/3] object-cover border-4 border-gold/30"
              loading="lazy"
            />
          </Reveal>
          <Reveal className="order-3 md:order-2 md:col-start-1">
            {(about.storyParagraphs || []).map((para, i) => (
              <p key={i} className={`${i > 0 ? "mt-4" : ""} text-muted-foreground ${i === 0 ? "text-lg" : ""} leading-relaxed`}>
                {para}
              </p>
            ))}
          </Reveal>
        </div>
      </section>

      {/* VALUES */}
      <section className="py-24 bg-muted">
        <div className="mx-auto max-w-7xl px-6">
          <SectionHeading eyebrow={about.valuesEyebrow || "Our Values"} title={about.valuesHeading || "What We Stand For"} />
          <motion.div variants={staggerContainer} initial="hidden" whileInView="show" viewport={{ once: true }} className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {(about.values || []).map((v) => {
              const IconComp = ICON_MAP[v.iconName] || Heart;
              return (
                <motion.div key={v.title} variants={staggerItem} whileHover={{ y: -6 }} className="text-center p-8 rounded-3xl bg-card border border-border hover:border-gold hover:shadow-xl transition-all">
                  <div className="mx-auto w-16 h-16 rounded-full gold-gradient grid place-items-center text-maroon-deep">
                    <IconComp size={28} />
                  </div>
                  <h3 className="font-display text-2xl font-bold mt-5">{v.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{v.desc}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* TIMELINE */}
      <section className="py-24">
        <div className="mx-auto max-w-4xl px-6">
          <SectionHeading eyebrow={about.milestonesEyebrow || "Milestones"} title={about.milestonesHeading || "Our Journey"} />
          <div className="relative">
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 gold-gradient" />
            {(about.milestones || []).map((m, i) => (
              <Reveal key={m.year} delay={i * 0.1}>
                <div className={`relative flex gap-6 md:gap-0 mb-12 md:items-center ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}>
                  <div className="hidden md:block md:w-1/2" />
                  <div className="absolute left-4 md:left-1/2 -translate-x-1/2 w-4 h-4 rounded-full gold-gradient ring-4 ring-background" />
                  <div className="pl-12 md:pl-0 md:w-1/2 md:px-8">
                    <div className="p-6 bg-card rounded-2xl shadow-lg border border-border">
                      <div className="font-display text-3xl font-bold text-primary">{m.year}</div>
                      <div className="font-semibold text-foreground mt-1">{m.title}</div>
                      <p className="text-sm text-muted-foreground mt-2">{m.desc}</p>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
