import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import { testimonials } from "../data/testimonials";

function Row({ reverse = false, speed = 40 }: { reverse?: boolean; speed?: number }) {
  const items = [...testimonials, ...testimonials];
  return (
    <div className="overflow-hidden py-3">
      <motion.div
        animate={{ x: reverse ? ["-50%", "0%"] : ["0%", "-50%"] }}
        transition={{ duration: speed, ease: "linear", repeat: Infinity }}
        className="flex gap-6 w-max"
      >
        {items.map((t, i) => (
          <div
            key={i}
            className="w-[320px] md:w-[380px] shrink-0 rounded-2xl bg-card border border-gold/30 p-6 shadow-lg"
          >
            <Quote className="text-gold mb-3" size={22} />
            <p className="text-sm md:text-base text-foreground/85 leading-relaxed italic font-display">
              "{t.quote}"
            </p>
            <div className="mt-4 pt-4 border-t border-border">
              <div className="font-semibold text-primary">{t.name}</div>
              <div className="text-xs text-muted-foreground">{t.event}</div>
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
}

export function TestimonialsMarquee() {
  return (
    <div className="space-y-2">
      <Row speed={50} />
      <Row reverse speed={60} />
    </div>
  );
}
