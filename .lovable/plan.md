# Thirumal Catering – Portfolio Website Plan

A premium, animation-rich catering portfolio using the logo's regal red + gold + banana-leaf-green palette. Built with TanStack Start + Tailwind v4 + framer-motion.

## Brand & Design System

**Palette (from logo)**
- Deep Maroon `#7A1F1F` (primary)
- Royal Red `#B02323` (primary hover / accents)
- Antique Gold `#C9A24C` (secondary / borders / dividers)
- Warm Gold Light `#F0D78C` (highlights)
- Banana Leaf Green `#2E6B3A` (accent tag)
- Cream `#FDF7E9` (background)
- Ink `#1A0F0A` (text)

Tokens defined in `src/styles.css` via `@theme inline` + oklch equivalents; all components use semantic classes (`bg-primary`, `text-gold`, etc.).

**Typography**
- Display: **Cormorant Garamond** (elegant serif — banners, hero, section titles)
- Body: **Plus Jakarta Sans** (clean modern sans)
- Tamil accents: **Noto Serif Tamil** (for menu items rendered in Tamil)
- Loaded via `<link>` in `__root.tsx` head (not `@import`)

**Motif elements**
- Gold filigree dividers (SVG)
- Banana leaf textures on section backdrops
- Ornate temple-arch decorative headers on card sections

## Pages & Routes

```
/            Home
/about       About
/services    Services
/events      Events (with parallax project cards)
/menu        Menu (Tamil menus from uploads)
/contact     Contact
*            404 (custom NotFound)
```

All routes use `head()` with unique title/description/og tags.

## Global Elements

- **Navbar** — shrink-on-scroll (`useScroll` + `useTransform` reduces height/padding/logo size, adds glass blur backdrop). Mobile: hamburger with slide-in sheet.
- **Footer** — gold-on-maroon, clickable contact info, social, quick links.
- **Floating WhatsApp** — bottom-right pulsing FAB → `https://wa.me/918189873332`, hover tooltip, entrance spring animation.
- **ScrollToTop** — `useEffect` on route change: `window.scrollTo({ top: 0, behavior: 'instant' })` so scroll-reveals fire fresh. Implemented via a small component mounted in `__root.tsx` reading `useRouterState`.
- **Page transitions** — `AnimatePresence` fade/slide between routes.

## Animation Library (framer-motion)

- Hero: autoplay muted looped video background + parallax overlay text
- Scroll reveals: `whileInView` fade-up with stagger on children
- Parallax cards (Events page): sticky-scroll with `useScroll` + `useTransform` for scale/rotate/translate stacking effect
- Marquee: infinite testimonials strip (two rows, opposite directions)
- Navbar shrink: scroll-driven height/opacity
- Staggered menu items, section reveals
- Hover: `whileHover` scale + shadow on cards
- Number counters (stats: "500+ events", "15+ years")
- Text reveal (character stagger) on section headings

## Page-by-Page

### Home (`/`)
1. **Hero** — full-screen autoplay video bg (South Indian feast footage from Pexels CDN), maroon gradient overlay, animated tagline "Tradition in Every Taste", gold CTA "Book Your Event" + "View Menu"
2. **About preview** — split with chef/thali imagery, stat counters
3. **Services grid** — 6 cards with icons (Weddings, Corporate, Birthdays, Housewarming, Temple Events, Custom)
4. **Signature Menu preview** — banana-leaf styled cards
5. **Events parallax showcase** — stacked scaling cards
6. **Testimonials marquee** — two-row infinite scroll
7. **CTA banner** — book now
8. **Footer**

### About (`/about`)
- Story section (image left, text right on desktop; image between title & desc on mobile)
- Values grid (Purity, Tradition, Hospitality, Hygiene)
- Timeline (est. year → milestones) with scroll reveal
- Team preview

### Services (`/services`)
- Hero banner
- Detailed service cards (alternating zigzag layout desktop; stacked title→image→desc mobile)
- Process steps (Consultation → Menu Design → Setup → Serve → Cleanup)

### Events (`/events`)
- Parallax stacked project cards (Weddings, Receptions, Corporate, Temple Functions, Birthdays, Housewarming) — each a scroll-pinned scaling card with hero image + description
- Gallery masonry grid below with lightbox-style hover

### Menu (`/menu`)
- Tabs: Tiffin (டிபன் 1–5), Lunch (சாப்பாடு 1–5), Dinner (டின்னர் 1–4)
- Each set as an ornate card matching the uploaded menu layout (alternating maroon/green cards, gold ribbon header, item count badge)
- Data transcribed from the 3 uploaded menu images into a typed TS data file
- Framed with banana-leaf motif; reveal stagger per item

### Contact (`/contact`)
- Hero
- Two-column: contact info card + form
- Info card: phone (tel:), email (mailto:), address (Google Maps link) — all clickable
- Form fields: Name, Phone, Event Type, Date, Guests, Message
- Submit → opens `https://wa.me/918189873332?text=<url-encoded pre-filled message>` in new tab
- Zod validation client-side
- Embedded Google Maps iframe

### 404
- Ornate maroon/gold themed, back-home CTA, subtle floating thali illustration

## Assets

- **Logo** — uploaded logo saved via lovable-assets, used in navbar/footer/hero
- **Menu images** — used as reference only (data transcribed, not embedded)
- **Hero video** — royalty-free Indian food/catering clip from Pexels (hosted URL)
- **Photography** — curated Unsplash CDN URLs (thali, wedding feasts, banana leaf, sweets, chefs) — no downloads; direct `<img>` with lazy loading
- **3D illustrations** — free SVG/PNG food illustrations from public CDN (or generated). Used as floating decorative elements with subtle `y` motion loops
- **Decorative SVGs** — hand-authored gold filigree dividers and temple-arch shapes as inline React components

## Responsive Rules

- Mobile-first Tailwind
- Section content order on mobile: **Title → Image → Description** (except hero sections which keep video/image as background)
- Grid uses `grid-cols-[minmax(0,1fr)_auto]` + `min-w-0` / `shrink-0` per responsive-layout rules
- Navbar collapses to hamburger < md

## Contact Data (used everywhere)

- Phone: `+91 81898 73332` → `tel:+918189873332` / WhatsApp `wa.me/918189873332`
- Email: `info@thirumalcatering.com` → `mailto:`
- Address: `72/3 4th Cross St, Ranganathapuram West, Tambaram, Chennai - 600045` → Google Maps link

Centralized in `src/lib/contact.ts`.

## Technical Notes

- `bun add framer-motion` (motion) + `bun add react-intersection-observer` (optional; framer's `whileInView` may suffice)
- New files under `src/components/` (Navbar, Footer, WhatsAppFab, ScrollToTop, PageTransition, Marquee, ParallaxStack, SectionHeading, RevealOnScroll, StatCounter, MenuCard, ServiceCard, EventCard, ContactForm, decorative SVGs)
- Route files replace `src/routes/index.tsx` placeholder and add siblings
- Each route sets full `head()` metadata (title, description, og:title, og:description; og:image only on leaf routes with hero image)
- `__root.tsx` gets Navbar/Footer/WhatsAppFab/ScrollToTop wrapping `<Outlet />`
- Data files: `src/data/menu.ts`, `src/data/services.ts`, `src/data/events.ts`, `src/data/testimonials.ts`

## Out of Scope (this build)

- No backend / Lovable Cloud (contact form goes straight to WhatsApp)
- No admin CMS — menu/events content lives in typed TS files
- No i18n framework — Tamil menu names rendered as literal strings with Noto Serif Tamil font

Ready to build on approval.