import { motion } from "framer-motion";
import { Utensils } from "lucide-react";
import type { PricedMenuCategory } from "../data/additionalMenu";
import { staggerContainer, staggerItem } from "./Reveal";

interface PricedMenuCardProps {
  category: PricedMenuCategory;
  variant?: "maroon" | "leaf";
}

export function PricedMenuCard({ category, variant = "maroon" }: PricedMenuCardProps) {
  const isLeaf = variant === "leaf";

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -4 }}
      className={`relative rounded-3xl overflow-hidden shadow-2xl border-2 ${
        isLeaf ? "bg-[#1f5c2a] border-gold/50" : "bg-[#B0421C] border-gold/50"
      }`}
    >
      {/* Ornate top ribbon */}
      <div className="relative pt-10 pb-6 px-6 text-center">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 gold-gradient px-8 py-2 rounded-b-2xl shadow-lg whitespace-nowrap">
          <span className="font-display font-bold text-maroon-deep text-lg tracking-wide">
            {category.tamil || category.title}
          </span>
        </div>
        <div className="mt-4 text-cream/90 text-xs uppercase tracking-[0.3em] font-semibold">
          {category.title}
        </div>
        {category.description && (
          <p className="mt-2 text-cream/80 text-xs md:text-sm max-w-xl mx-auto leading-relaxed">
            {category.description}
          </p>
        )}
      </div>

      {/* Items List / Grid */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="px-4 sm:px-6 md:px-10 pb-20 pt-2 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2"
      >
        {category.items.map((item) => (
          <motion.div
            key={item.id}
            variants={staggerItem}
            className="flex items-center justify-between gap-3 py-3 px-3 rounded-xl hover:bg-white/5 transition-colors border-b border-gold/15 group"
          >
            <div className="flex items-center gap-2.5 min-w-0 pr-2">
              <span className="text-gold-light text-xs shrink-0 select-none">◆</span>
              <span className="text-cream font-medium text-sm md:text-[15px] leading-snug group-hover:text-gold-light transition-colors break-words">
                {item.name}
              </span>
            </div>
            <div className="shrink-0 flex items-center">
              <span className="font-display font-bold text-gold-light text-base md:text-lg tracking-tight bg-black/25 px-2.5 py-1 rounded-lg border border-gold/25 shadow-inner">
                ₹{item.price}
              </span>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Items count badge */}
      <div className="absolute bottom-4 right-4">
        <motion.div
          animate={{ rotate: [0, 8, -8, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="gold-gradient text-maroon-deep w-16 h-16 rounded-full grid place-items-center shadow-xl border-2 border-cream"
          style={{
            clipPath:
              "polygon(50% 0%, 80% 10%, 100% 35%, 100% 65%, 80% 90%, 50% 100%, 20% 90%, 0% 65%, 0% 35%, 20% 10%)",
          }}
        >
          <div className="text-center leading-none">
            <div className="text-lg font-bold">{category.items.length}</div>
            <div className="text-[8px] uppercase tracking-wider font-bold">Items</div>
          </div>
        </motion.div>
      </div>

      <Utensils className="absolute bottom-4 left-4 text-gold/30" size={24} />
    </motion.div>
  );
}
