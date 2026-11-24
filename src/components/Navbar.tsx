import { Link, useRouterState } from "@tanstack/react-router";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";

const links = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/services", label: "Services" },
  { to: "/events", label: "Events" },
  { to: "/menu", label: "Menu" },
  { to: "/contact", label: "Contact" },
] as const;

export function Navbar() {
  const { scrollY } = useScroll();
  const pad = useTransform(scrollY, [0, 200], [20, 8]);
  const bg = useTransform(scrollY, [0, 120], ["rgba(122,31,31,0)", "rgba(122,31,31,0.92)"]);
  const shadow = useTransform(scrollY, [0, 120], ["0 0 0 rgba(0,0,0,0)", "0 10px 30px rgba(122,31,31,0.25)"]);
  const logoSize = useTransform(scrollY, [0, 200], [56, 40]);
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => { setOpen(false); }, [pathname]);

  return (
    <motion.header
      style={{ paddingTop: pad, paddingBottom: pad, backgroundColor: bg, boxShadow: shadow, backdropFilter: "blur(12px)" }}
      className="fixed inset-x-0 top-0 z-50 transition-colors"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 md:px-8">
        <Link to="/" className="flex items-center gap-3 min-w-0">
          <motion.img
            src="/logo-with-bg.png"
            alt="Thirumal Catering"
            style={{ width: logoSize, height: logoSize }}
            className="rounded-full shrink-0 ring-2 ring-[#C9A24C] object-cover bg-white"
          />
          <div className="hidden sm:flex flex-col leading-tight min-w-0">
            <span className="font-display text-xl font-bold text-cream tracking-wide truncate">Thirumal</span>
            <span className="text-[10px] uppercase tracking-[0.25em] text-gold-light">Catering Services</span>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {links.map((l) => {
            const active = l.to === "/" ? pathname === "/" : pathname.startsWith(l.to);
            return (
              <Link
                key={l.to}
                to={l.to}
                className={`relative px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  active ? "text-gold-light" : "text-cream/85 hover:text-gold-light"
                }`}
              >
                {l.label}
                {active && (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute inset-x-3 -bottom-0.5 h-0.5 bg-gold-light rounded-full"
                  />
                )}
              </Link>
            );
          })}
          <Link
            to="/contact"
            className="ml-3 gold-gradient text-maroon-deep font-semibold text-sm px-5 py-2.5 rounded-full hover:shadow-[0_8px_24px_rgba(201,162,76,0.5)] transition-shadow"
          >
            Book Now
          </Link>
        </nav>

        <button
          onClick={() => setOpen((v) => !v)}
          className="lg:hidden text-cream p-2"
          aria-label="Menu"
        >
          {open ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="lg:hidden mx-4 mt-3 rounded-2xl bg-maroon-deep/95 backdrop-blur-lg border border-gold/30 p-4 shadow-2xl"
          >
            <div className="flex flex-col gap-1">
              {links.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  className="px-4 py-3 rounded-xl text-cream hover:bg-maroon text-base font-medium"
                >
                  {l.label}
                </Link>
              ))}
              <Link to="/contact" className="mt-2 text-center gold-gradient text-maroon-deep font-semibold px-5 py-3 rounded-xl">
                Book Now
              </Link>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
