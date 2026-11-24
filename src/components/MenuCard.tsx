import { motion } from "framer-motion";
import { Utensils } from "lucide-react";
import type { MenuSet } from "../data/menu";
import { staggerContainer, staggerItem } from "./Reveal";

export function MenuCard({ set }: { set: MenuSet }) {
  const isLeaf = set.variant === "leaf";
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -6 }}
      className={`relative rounded-3xl overflow-hidden shadow-2xl border-2 ${
        isLeaf ? "bg-[#1f5c2a] border-gold/50" : "bg-[#B0421C] border-gold/50"
      }`}
    >
      {/* Ornate top ribbon */}
      <div className="relative pt-10 pb-6 px-6 text-center">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 gold-gradient px-8 py-2 rounded-b-2xl shadow-lg">
          <span className="font-display font-bold text-maroon-deep text-lg tracking-wide">
            {set.tamil}
          </span>
        </div>
        <div className="mt-4 text-cream/90 text-xs uppercase tracking-[0.3em] font-semibold">
          {set.title}
        </div>
      </div>

      {/* Items */}
      <motion.ul
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="px-6 pb-16 space-y-1.5"
      >
        {set.items.map((item, i) => (
          <motion.li
            key={i}
            variants={staggerItem}
            className="flex items-start gap-2 text-cream font-tamil text-[15px] leading-relaxed"
          >
            <span className="text-gold-light text-xs mt-1.5">◆</span>
            <span>{item}</span>
          </motion.li>
        ))}
      </motion.ul>

      {/* Items badge */}
      <div className="absolute bottom-4 right-4">
        <motion.div
          animate={{ rotate: [0, 8, -8, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="gold-gradient text-maroon-deep w-16 h-16 rounded-full grid place-items-center shadow-xl border-2 border-cream"
          style={{ clipPath: "polygon(50% 0%, 80% 10%, 100% 35%, 100% 65%, 80% 90%, 50% 100%, 20% 90%, 0% 65%, 0% 35%, 20% 10%)" }}
        >
          <div className="text-center leading-none">
            <div className="text-lg font-bold">{set.items.length}</div>
            <div className="text-[8px] uppercase tracking-wider font-bold">Items</div>
          </div>
        </motion.div>
      </div>

      <Utensils className="absolute bottom-4 left-4 text-gold/30" size={24} />
    </motion.div>
  );
}
