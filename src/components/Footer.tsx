import { Link } from "@tanstack/react-router";
import { Mail, Phone, MapPin } from "lucide-react";
import { CONTACT } from "../lib/contact";

export function Footer() {
  return (
    <footer className="relative bg-maroon-deep text-cream mt-20 overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-px gold-gradient" />
      <div className="pointer-events-none absolute -top-32 -right-32 w-96 h-96 rounded-full bg-gold/10 blur-3xl" />
      <div className="mx-auto max-w-7xl px-6 py-16 grid gap-12 md:grid-cols-4">
        <div className="md:col-span-1">
          <div className="flex items-center gap-3">
            <img
              src="/logo-with-bg.png"
              alt="Thirumal Catering"
              className="w-14 h-14 rounded-full ring-2 ring-gold object-cover bg-white"
            />
            <div>
              <div className="font-display text-2xl font-bold">Thirumal</div>
              <div className="text-[10px] uppercase tracking-[0.25em] text-gold-light">Catering</div>
            </div>
          </div>
          <p className="mt-4 text-sm text-cream/70 italic font-display">"{CONTACT.tagline}"</p>
        </div>

        <div>
          <h4 className="font-display text-lg text-gold-light mb-4">Explore</h4>
          <ul className="space-y-2 text-sm">
            {([["/", "Home"], ["/about", "About"], ["/services", "Services"], ["/events", "Events"], ["/menu", "Menu"], ["/contact", "Contact"]] as const).map(([to, label]) => (
              <li key={to}><Link to={to} className="text-cream/70 hover:text-gold-light transition-colors">{label}</Link></li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-2">
          <h4 className="font-display text-lg text-gold-light mb-4">Reach Us</h4>
          <ul className="space-y-3 text-sm">
            <li>
              <a href={`tel:${CONTACT.phoneRaw}`} className="flex items-start gap-3 hover:text-gold-light transition-colors">
                <Phone size={18} className="mt-0.5 text-gold shrink-0" />
                <span>{CONTACT.phone}</span>
              </a>
            </li>
            <li>
              <a href={`mailto:${CONTACT.email}`} className="flex items-start gap-3 hover:text-gold-light transition-colors">
                <Mail size={18} className="mt-0.5 text-gold shrink-0" />
                <span>{CONTACT.email}</span>
              </a>
            </li>
            <li>
              <a href={CONTACT.mapsUrl} target="_blank" rel="noopener" className="flex items-start gap-3 hover:text-gold-light transition-colors">
                <MapPin size={18} className="mt-0.5 text-gold shrink-0" />
                <span>{CONTACT.address}</span>
              </a>
            </li>
          </ul>
          <div className="flex gap-3 mt-6">
            <a href="#" aria-label="Instagram" className="p-2.5 rounded-full border border-gold/40 hover:bg-gold hover:text-maroon-deep transition-all">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg>
            </a>
            <a href="#" aria-label="Facebook" className="p-2.5 rounded-full border border-gold/40 hover:bg-gold hover:text-maroon-deep transition-all">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M13 22v-8h3l1-4h-4V7.5c0-1.1.4-2 2-2h2V2h-3c-3 0-5 1.8-5 5v3H6v4h3v8h4z"/></svg>
            </a>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gold/20 py-5 px-6">
        <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-cream/60">
          <span>© {new Date().getFullYear()} Thirumal Catering Services · Tradition in Every Taste</span>
          <span>
            Developed by{" "}
            <a
              href="https://www.brandingdigit.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold-light hover:text-gold transition-colors font-medium"
            >
              Branding Digit
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}
