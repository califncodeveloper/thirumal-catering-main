import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, ChefHat, Utensils, Users, Award, Heart, Building2, Cake, Home, Flame, Sparkles } from "lucide-react";
import { SectionHeading } from "../components/SectionHeading";
import { Reveal, staggerContainer, staggerItem } from "../components/Reveal";
import { TestimonialsMarquee } from "../components/Marquee";
import { StatCounter } from "../components/StatCounter";
import { ParallaxStack } from "../components/ParallaxStack";
import { MenuCard } from "../components/MenuCard";
import { getHomepageDataServerFn } from "../lib/content.server";

export const Route = createFileRoute("/")({
  loader: async () => {
    return await getHomepageDataServerFn();
  },
  head: () => ({
    meta: [
      { title: "Thirumal Catering — Authentic South Indian Catering in Chennai | Since 2008" },
      {
        name: "description",
        content:
          "Chennai's most trusted South Indian caterer since 2008. Weddings, receptions, temple utsavams, corporate events & housewarmings — traditional banana-leaf feasts with 150+ menu varieties. 1500+ events served.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://thirumalcatering.com" },
      { property: "og:title", content: "Thirumal Catering — Tradition in Every Taste | Chennai" },
      {
        property: "og:description",
        content: "Authentic South Indian catering in Chennai for weddings, temple utsavams & corporate events. 17 years of tradition.",
      },
      { property: "og:image", content: "https://thirumalcatering.com/logo-with-bg.png" },
      { name: "twitter:title", content: "Thirumal Catering — Tradition in Every Taste" },
      { name: "twitter:description", content: "Authentic South Indian catering in Chennai since 2008. 1500+ events, 150+ menu varieties." },
      { name: "twitter:image", content: "https://thirumalcatering.com/logo-with-bg.png" },
    ],
    links: [
      { rel: "canonical", href: "https://thirumalcatering.com" },
    ],
  }),
  component: HomePage,
});

const ICON_MAP: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  Heart,
  Building2,
  Cake,
  Home,
  Flame,
  Sparkles,
  ChefHat,
  Utensils,
  Users,
  Award,
};

function HomePage() {
  const { home, services, events, tiffinPreviewSets } = Route.useLoaderData();

  return (
    <div>
      {/* HERO */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <video
          autoPlay muted loop playsInline
          poster={typeof home.heroPosterImage === "string" ? home.heroPosterImage : "/images/services-hero-bg.jpg"}
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src={home.heroVideoUrl || "/Cinematic_aerial_drone_shot_sl.mp4"} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-maroon-deep/85 via-maroon-deep/70 to-maroon-deep/95" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,rgba(0,0,0,0.6))]" />

        <div className="relative z-10 mx-auto max-w-6xl px-6 py-32 text-center text-cream">
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-3 text-xs uppercase tracking-[0.4em] text-gold-light"
          >
            <span className="h-px w-10 bg-gold" />
            {home.heroEyebrow || "Since 2008 · Chennai"}
            <span className="h-px w-10 bg-gold" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.15 }}
            className="mt-6 font-display text-6xl md:text-8xl lg:text-9xl font-bold leading-[0.95]"
          >
            {home.heroHeading || "Tradition"}
            <br />
            <span className="text-gold-gradient italic">{home.heroHeadingAccent || "in Every Taste"}</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-8 max-w-2xl mx-auto text-lg md:text-xl text-cream/80 leading-relaxed"
          >
            {home.heroDescription || "Authentic South Indian catering for weddings, receptions, temple utsavams and every occasion worth celebrating."}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.55 }}
            className="mt-10 flex flex-wrap items-center justify-center gap-4"
          >
            <Link to={home.heroCtaLink || "/contact"} className="group inline-flex items-center gap-2 gold-gradient text-maroon-deep font-bold px-8 py-4 rounded-full text-base shadow-2xl hover:shadow-[0_20px_40px_rgba(201,162,76,0.5)] transition-shadow">
              {home.heroCtaText || "Book Your Event"}
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to={home.heroSecondaryCtaLink || "/menu"} className="inline-flex items-center gap-2 border-2 border-gold text-gold-light font-semibold px-8 py-4 rounded-full text-base hover:bg-gold hover:text-maroon-deep transition-colors">
              {home.heroSecondaryCtaText || "View Menu"}
            </Link>
          </motion.div>
        </div>

        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 text-cream/60 text-xs uppercase tracking-widest"
        >
          Scroll ↓
        </motion.div>
      </section>

      {/* STATS */}
      <section className="bg-maroon-deep text-cream py-20 relative overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-px gold-gradient" />
        <div className="mx-auto max-w-6xl px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          {(home.stats || []).map((st, i) => (
            <StatCounter key={i} value={st.value} suffix={st.suffix} label={st.label} />
          ))}
        </div>
        <div className="absolute inset-x-0 bottom-0 h-px gold-gradient" />
      </section>

      {/* ABOUT PREVIEW */}
      <section className="py-24 bg-background">
        <div className="mx-auto max-w-7xl px-6 grid gap-12 md:grid-cols-2 items-center">
          <Reveal className="order-1">
            <div className="text-xs uppercase tracking-[0.3em] text-primary font-semibold">{home.storyEyebrow || "Our Story"}</div>
            <h2 className="mt-4 font-display text-4xl md:text-5xl font-bold text-foreground">
              {home.storyHeading || "A Legacy of"} <span className="italic text-primary">{home.storyHeadingAccent || "Flavor & Devotion"}</span>
            </h2>
          </Reveal>
          <Reveal className="order-2 md:order-3">
            <img
              src={typeof home.storyImage === "string" ? home.storyImage : "/images/about-hero-feast.jpg"}
              alt="Traditional South Indian thali"
              className="rounded-3xl shadow-2xl w-full aspect-[4/3] object-cover border-4 border-gold/30"
              loading="lazy"
            />
          </Reveal>
          <Reveal className="order-3 md:order-2 md:col-start-1">
            {(home.storyParagraphs || []).map((para, i) => (
              <p key={i} className={`${i > 0 ? "mt-4" : ""} text-muted-foreground ${i === 0 ? "text-lg" : ""} leading-relaxed`}>
                {para}
              </p>
            ))}
            <Link to={home.storyCtaLink || "/about"} className="mt-8 inline-flex items-center gap-2 font-semibold text-primary group">
              {home.storyCtaText || "Discover Our Journey"} <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* SERVICES */}
      <section className="py-24 bg-muted">
        <div className="mx-auto max-w-7xl px-6">
          <SectionHeading
            eyebrow={home.servicesEyebrow || "What We Cater"}
            title={home.servicesHeading || "Every Occasion, Perfected"}
            desc={home.servicesDesc || "From intimate family functions to grand thousand-guest weddings — we bring the same devotion to every event."}
          />
          <motion.div variants={staggerContainer} initial="hidden" whileInView="show" viewport={{ once: true }} className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {services.map((s) => {
              const IconComp = ICON_MAP[s.iconName || "Heart"] || Heart;
              return (
                <motion.div key={s._id} variants={staggerItem} whileHover={{ y: -8 }} className="group relative bg-card rounded-3xl overflow-hidden shadow-lg border border-border hover:border-gold transition-all">
                  <div className="aspect-[16/10] overflow-hidden">
                    <img src={typeof s.image === "string" ? s.image : "/images/wedding-event-hall.jpg"} alt={s.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" loading="lazy" />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl gold-gradient text-maroon-deep">
                        <IconComp size={20} />
                      </div>
                      <h3 className="font-display text-2xl font-bold text-foreground">{s.title}</h3>
                    </div>
                    <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{s.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* MENU PREVIEW */}
      <section className="py-24 bg-background">
        <div className="mx-auto max-w-7xl px-6">
          <SectionHeading
            eyebrow={home.menuPreviewEyebrow || "Signature Menus"}
            title={home.menuPreviewHeading || "A Feast on Banana Leaf"}
            desc={home.menuPreviewDesc || "Traditional Tamil menus crafted for every appetite and occasion."}
          />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {tiffinPreviewSets.map((s: any) => <MenuCard key={s.id} set={s} />)}
          </div>
          <div className="text-center mt-12">
            <Link to="/menu" className="inline-flex items-center gap-2 border-2 border-primary text-primary font-semibold px-8 py-3.5 rounded-full hover:bg-primary hover:text-primary-foreground transition-colors">
              {home.menuPreviewCtaText || "Explore Full Menu"} <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* EVENTS PARALLAX */}
      <section className="py-24 bg-maroon-deep text-cream relative">
        <div className="mx-auto max-w-7xl px-6">
          <SectionHeading
            light
            eyebrow={home.eventsEyebrow || "Recent Events"}
            title={home.eventsHeading || "Where We've Feasted"}
            desc={home.eventsDesc || "A glimpse into the celebrations we've had the honor of serving."}
          />
        </div>
        <div className="px-4">
          <ParallaxStack events={events.slice(0, 4) as any} />
        </div>
        <div className="mx-auto max-w-7xl px-6 text-center mt-16">
          <Link to="/events" className="inline-flex items-center gap-2 gold-gradient text-maroon-deep font-bold px-8 py-3.5 rounded-full">
            {home.eventsCtaText || "See All Events"} <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* WHY US */}
      <section className="py-24 bg-cream">
        <div className="mx-auto max-w-7xl px-6">
          <SectionHeading eyebrow={home.whyUsEyebrow || "Why Thirumal"} title={home.whyUsHeading || "Detail is Our Devotion"} />
          <div className="grid gap-8 md:grid-cols-4">
            {(home.whyUsFeatures || []).map((f, i) => {
              const IconComp = ICON_MAP[f.iconName] || Award;
              return (
                <Reveal key={f.title} delay={i * 0.1}>
                  <div className="text-center p-6 rounded-2xl bg-card border border-border hover:border-gold hover:shadow-xl transition-all h-full">
                    <div className="mx-auto w-16 h-16 rounded-full gold-gradient grid place-items-center text-maroon-deep">
                      <IconComp size={26} />
                    </div>
                    <h3 className="font-display text-2xl font-bold mt-4 text-foreground">{f.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-24 bg-muted">
        <div className="mx-auto max-w-7xl px-6">
          <SectionHeading eyebrow={home.testimonialsEyebrow || "Kind Words"} title={home.testimonialsHeading || "Loved by Chennai's Families"} />
        </div>
        <TestimonialsMarquee />
      </section>

      {/* CTA */}
      <section className="relative py-32 overflow-hidden maroon-gradient text-cream">
        <div
          className="absolute inset-0 opacity-20 bg-cover bg-center"
          style={{
            backgroundImage: `url(${typeof home.ctaBackgroundImage === "string" ? home.ctaBackgroundImage : "/images/cta-section-bg.jpg"})`,
          }}
        />
        <div className="relative mx-auto max-w-4xl px-6 text-center">
          <Reveal>
            <h2 className="font-display text-5xl md:text-7xl font-bold">
              {home.ctaHeading || "Let's Cater Your"}{" "}
              <span className="text-gold-gradient italic">{home.ctaHeadingAccent || "Next Celebration"}</span>
            </h2>
            <p className="mt-6 text-lg text-cream/80">
              {home.ctaDescription || "Tell us about your event and we'll craft a menu that turns guests into family."}
            </p>
            <Link to={home.ctaButtonLink || "/contact"} className="mt-10 inline-flex items-center gap-2 gold-gradient text-maroon-deep font-bold px-10 py-4 rounded-full text-lg shadow-2xl">
              {home.ctaButtonText || "Get Your Custom Quote"} <ArrowRight size={20} />
            </Link>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
