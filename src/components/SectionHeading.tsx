import { motion } from "framer-motion";

type Props = {
  eyebrow?: string;
  title: string;
  desc?: string;
  center?: boolean;
  light?: boolean;
};

export function SectionHeading({ eyebrow, title, desc, center = true, light }: Props) {
  return (
    <div className={`${center ? "text-center mx-auto" : ""} max-w-3xl mb-14`}>
      {eyebrow && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className={`inline-flex items-center gap-3 text-xs uppercase tracking-[0.3em] ${
            light ? "text-gold-light" : "text-primary"
          }`}
        >
          <span className="h-px w-8 bg-gold" />
          {eyebrow}
          <span className="h-px w-8 bg-gold" />
        </motion.div>
      )}
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1, duration: 0.7 }}
        className={`font-display text-4xl md:text-5xl lg:text-6xl font-bold mt-4 ${
          light ? "text-cream" : "text-foreground"
        }`}
      >
        {title}
      </motion.h2>
      {desc && (
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.7 }}
          className={`mt-4 text-base md:text-lg ${light ? "text-cream/75" : "text-muted-foreground"}`}
        >
          {desc}
        </motion.p>
      )}
    </div>
  );
}
