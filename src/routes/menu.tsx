import { createFileRoute } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { MenuCard } from "../components/MenuCard";
import { PricedMenuCard } from "../components/PricedMenuCard";
import { getMenuDataServerFn } from "../lib/content.server";

export const Route = createFileRoute("/menu")({
  loader: async () => {
    return await getMenuDataServerFn();
  },
  head: () => ({
    meta: [
      {
        title: "Our Menus — Tiffin, Lunch, Dinner, Breads & Grills | Thirumal Catering Chennai",
      },
      {
        name: "description",
        content:
          "Browse Thirumal Catering's authentic Tamil menus: 5 Tiffin sets, 5 Lunch spreads, 4 Dinner menus, Fried Rice & Noodles, Indian Breads, North Indian Gravy, and Grill, Tandoori & BBQ selections.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://thirumalcatering.com/menu" },
      {
        property: "og:title",
        content: "Our Menus | Thirumal Catering — Feasts, Breads, Gravies & Grills",
      },
      {
        property: "og:description",
        content:
          "Traditional Tamil menus for every occasion — Tiffin, Lunch and Dinner sets, Fried Rice & Noodles, Indian Breads, North Indian Gravies, and Tandoori & BBQ in Chennai.",
      },
      {
        property: "og:image",
        content: "https://thirumalcatering.com/logo-with-bg.png",
      },
      {
        name: "twitter:title",
        content: "Menus | Thirumal Catering — Traditional Tamil Food & Grills",
      },
      {
        name: "twitter:description",
        content:
          "Authentic Tamil catering menus — Tiffin, Lunch & Dinner sets, Fried Rice & Noodles, Indian Breads, North Indian Gravies, and Grill & BBQ.",
      },
    ],
    links: [{ rel: "canonical", href: "https://thirumalcatering.com/menu" }],
  }),
  component: MenuPage,
});

function MenuPage() {
  const { categories, sets, items, pageSettings } = Route.useLoaderData();

  // Build unified tab configs from CMS
  const tabs = categories.map((cat: any) => {
    const catId = cat.id || cat._id.replace("cat-", "");
    const isSets = cat.menuType === "sets";

    if (isSets) {
      // Find matching sets for this category
      const matchingSets = sets
        .filter((s: any) => s.categoryId === cat._id || s.categoryId === catId)
        .map((s: any) => ({
          id: s._id || s.id,
          title: s.title,
          tamil: s.tamil,
          items: s.items,
          variant: s.variant || "leaf",
        }));

      return {
        type: "sets" as const,
        id: catId,
        label: cat.title,
        tamil: cat.tamil,
        sets: matchingSets,
      };
    } else {
      // Priced category
      const matchingItems = items
        .filter((i: any) => i.categoryId === cat._id || i.categoryId === catId)
        .map((i: any) => ({
          id: i._id || i.id,
          name: i.name,
          price: i.price,
        }));

      return {
        type: "priced" as const,
        id: catId,
        label: cat.title,
        tamil: cat.tamil,
        category: {
          id: catId,
          title: cat.title,
          tamil: cat.tamil,
          description: cat.description,
          items: matchingItems,
        },
        variant: catId.includes("fried") ? ("leaf" as const) : ("maroon" as const),
      };
    }
  });

  const [active, setActive] = useState<string>(tabs[1]?.id || "lunch");
  const activeTab = tabs.find((t: any) => t.id === active) || tabs[0];

  return (
    <div>
      <section className="relative pt-40 pb-20 bg-maroon-deep text-cream overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=1920&q=80')] bg-cover bg-center" />
        <div className="relative mx-auto max-w-5xl px-6 text-center">
          <div className="text-xs uppercase tracking-[0.4em] text-gold-light">
            {pageSettings?.heroEyebrow || "Our Menus"}
          </div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 font-display text-5xl md:text-7xl font-bold"
          >
            {pageSettings?.heroHeading || "A Feast"}{" "}
            <span className="italic text-gold-gradient">
              {pageSettings?.heroHeadingAccent || "on Banana Leaf"}
            </span>
          </motion.h1>
          <p className="mt-6 text-cream/80 max-w-2xl mx-auto">
            {pageSettings?.heroDescription ||
              "Choose from carefully curated Tiffin, Lunch, Dinner, Indian Breads, Gravies, and Tandoori specialties — or ask us to design a custom feast for your event."}
          </p>
        </div>
      </section>

      {/* Tabs */}
      <section className="sticky top-20 z-30 bg-background/95 backdrop-blur-lg border-b border-border py-3 md:py-4">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 md:flex-wrap md:justify-center scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {tabs.map((t: any) => (
              <button
                key={t.id}
                onClick={() => setActive(t.id)}
                className={`relative shrink-0 px-4 md:px-6 py-2.5 md:py-3 rounded-full font-semibold text-xs sm:text-sm md:text-base transition-colors whitespace-nowrap ${
                  active === t.id ? "text-cream" : "text-foreground hover:text-primary"
                }`}
              >
                {active === t.id && (
                  <motion.div
                    layoutId="menu-pill"
                    className="absolute inset-0 maroon-gradient rounded-full shadow-lg"
                    transition={{ type: "spring", bounce: 0.2 }}
                  />
                )}
                <span className="relative">
                  {t.label} {t.tamil && <span className="opacity-70 text-xs">· {t.tamil}</span>}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <AnimatePresence mode="wait">
            {activeTab?.type === "sets" ? (
              <motion.div
                key={activeTab.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
              >
                {activeTab.sets.map((s: any) => (
                  <MenuCard key={s.id} set={s} />
                ))}
              </motion.div>
            ) : activeTab ? (
              <motion.div
                key={activeTab.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="max-w-4xl mx-auto"
              >
                <PricedMenuCard
                  category={activeTab.category}
                  variant={activeTab.variant}
                />
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </section>
    </div>
  );
}
