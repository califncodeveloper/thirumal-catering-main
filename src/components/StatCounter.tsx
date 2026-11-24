import { motion, useInView, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect, useRef } from "react";

export function StatCounter({ value, suffix = "+", label }: { value: number; suffix?: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const mv = useMotionValue(0);
  const spring = useSpring(mv, { duration: 2000, bounce: 0 });
  const rounded = useTransform(spring, (v) => Math.round(v).toLocaleString());

  useEffect(() => {
    if (inView) mv.set(value);
  }, [inView, value, mv]);

  return (
    <div ref={ref} className="text-center">
      <div className="font-display text-5xl md:text-6xl font-bold text-gold-gradient flex items-center justify-center">
        <motion.span>{rounded}</motion.span>
        <span>{suffix}</span>
      </div>
      <div className="mt-2 text-sm uppercase tracking-[0.2em] text-cream/70">{label}</div>
    </div>
  );
}
