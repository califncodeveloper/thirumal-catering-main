import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import type { EventProject } from "../data/events";

function ParallaxCard({ event, index, total }: { event: EventProject; index: number; total: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "start start"] });
  const scale = useTransform(scrollYProgress, [0, 1], [0.85, 1]);
  const opacity = useTransform(scrollYProgress, [0, 1], [0.4, 1]);

  const targetScale = 1 - (total - index) * 0.03;

  return (
    <div ref={ref} className="sticky top-24 md:top-28" style={{ paddingTop: `${index * 24}px` }}>
      <motion.div
        style={{ scale, opacity, top: `calc(-5vh + ${index * 20}px)` }}
        className="relative w-full max-w-6xl mx-auto rounded-3xl overflow-hidden shadow-2xl bg-card border border-gold/40"
      >
        <motion.div
          initial={{ scale: 1 }}
          whileInView={{ scale: targetScale }}
          viewport={{ amount: 0.5 }}
        >
          <div className="grid md:grid-cols-2">
            <div className="aspect-[4/3] md:aspect-auto md:min-h-[500px] relative overflow-hidden">
              <img src={event.image} alt={event.title} className="w-full h-full object-cover" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-t from-maroon-deep/60 to-transparent" />
              <span className="absolute top-4 left-4 gold-gradient text-maroon-deep text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">
                {event.category}
              </span>
            </div>
            <div className="p-8 md:p-12 flex flex-col justify-center bg-cream">
              <div className="text-xs uppercase tracking-[0.3em] text-primary font-semibold">{event.stat}</div>
              <h3 className="font-display text-3xl md:text-5xl font-bold text-foreground mt-3">{event.title}</h3>
              <p className="mt-5 text-muted-foreground leading-relaxed text-base md:text-lg">{event.desc}</p>
              <div className="mt-8 h-px gold-gradient" />
              <div className="mt-4 text-sm text-primary font-semibold tracking-wide">
                #{String(index + 1).padStart(2, "0")} · Thirumal Catering
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

export function ParallaxStack({ events }: { events: EventProject[] }) {
  return (
    <div className="relative">
      {events.map((e, i) => (
        <ParallaxCard key={e.id} event={e} index={i} total={events.length} />
      ))}
    </div>
  );
}
