import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Briefcase,
  Calendar,
  UtensilsCrossed,
  Image as ImageIcon,
  Home,
  Info,
  Phone,
  Layout,
  Search,
  Sparkles,
  ArrowRight,
  PlusCircle,
  Upload,
} from "lucide-react";
import { getAdminStatsServerFn } from "../../lib/admin-actions.server";

export const Route = createFileRoute("/admin/")({
  loader: async () => {
    const stats = await getAdminStatsServerFn();
    return { stats };
  },
  head: () => ({
    meta: [{ title: "Dashboard — Thirumal Catering Admin" }],
  }),
  component: AdminDashboardPage,
});

function AdminDashboardPage() {
  const { stats } = Route.useLoaderData();

  const STAT_CARDS = [
    {
      title: "Services",
      count: stats?.totalServices ?? 6,
      desc: "Active catering services",
      icon: Briefcase,
      to: "/admin/services",
      color: "from-amber-600/20 to-amber-500/10 text-amber-600",
    },
    {
      title: "Events",
      count: stats?.totalEvents ?? 6,
      desc: "Portfolio showcase events",
      icon: Calendar,
      to: "/admin/events",
      color: "from-blue-600/20 to-blue-500/10 text-blue-600",
    },
    {
      title: "Menu Categories",
      count: stats?.totalMenuCategories ?? 7,
      desc: "Tiffin, Lunch, Dinner & Grills",
      icon: UtensilsCrossed,
      to: "/admin/menu",
      color: "from-emerald-600/20 to-emerald-500/10 text-emerald-600",
    },
    {
      title: "Priced Menu Items",
      count: stats?.totalMenuItems ?? 38,
      desc: "Breads, gravies & BBQ dishes",
      icon: UtensilsCrossed,
      to: "/admin/menu",
      color: "from-rose-600/20 to-rose-500/10 text-rose-600",
    },
    {
      title: "Traditional Sets",
      count: stats?.totalMenuSets ?? 14,
      desc: "Full banana-leaf course sets",
      icon: UtensilsCrossed,
      to: "/admin/menu",
      color: "from-purple-600/20 to-purple-500/10 text-purple-600",
    },
    {
      title: "Media Assets",
      count: stats?.totalImages ?? 0,
      desc: "Uploaded images in CMS",
      icon: ImageIcon,
      to: "/admin/media",
      color: "from-teal-600/20 to-teal-500/10 text-teal-600",
    },
  ];

  const QUICK_MANAGEMENT = [
    {
      title: "Homepage Editor",
      desc: "Hero banners, stats counter, story section, why-us and call-to-action blocks.",
      to: "/admin/homepage",
      icon: Home,
      badge: "Primary Content",
    },
    {
      title: "About Page",
      desc: "Family legacy history, core values, kitchen standards and company milestones.",
      to: "/admin/about",
      icon: Info,
      badge: "Story & Brand",
    },
    {
      title: "Services Catalog",
      desc: "Manage wedding, corporate, birthday, housewarming and temple catering services.",
      to: "/admin/services",
      icon: Briefcase,
      badge: "Full CRUD",
    },
    {
      title: "Events Portfolio & Gallery",
      desc: "Update recent catered functions, guest statistics, descriptions and photo gallery.",
      to: "/admin/events",
      icon: Calendar,
      badge: "Full CRUD",
    },
    {
      title: "Menu System",
      desc: "Manage traditional banana leaf meal sets, priced ala-carte items, prices & Tamil text.",
      to: "/admin/menu",
      icon: UtensilsCrossed,
      badge: "7 Categories",
    },
    {
      title: "Contact & Location",
      desc: "Phone, WhatsApp, email, physical address, and Google Maps embed location.",
      to: "/admin/contact",
      icon: Phone,
      badge: "Enquiries",
    },
    {
      title: "Header & Footer",
      desc: "Navigation links, brand slogans, social media channels, and copyright notices.",
      to: "/admin/header-footer",
      icon: Layout,
      badge: "Global Shell",
    },
    {
      title: "Media Library",
      desc: "Upload high-res JPEG/PNG/WebP photos to Sanity CDN and replace section images.",
      to: "/admin/media",
      icon: ImageIcon,
      badge: "Sanity CDN",
    },
    {
      title: "SEO & Social Sharing",
      desc: "Meta titles, search descriptions, OpenGraph social preview images and URLs.",
      to: "/admin/seo",
      icon: Search,
      badge: "Search Ranking",
    },
  ];

  return (
    <div className="space-y-10">
      {/* ── Welcome Banner ───────────────────────────────────────── */}
      <div className="relative rounded-3xl p-8 md:p-10 bg-maroon-deep text-cream overflow-hidden border-2 border-gold/30 shadow-2xl">
        <div className="absolute inset-0 opacity-15 bg-[url('/images/wedding-event-hall.jpg')] bg-cover bg-center" />
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gold/20 text-gold-light text-xs font-bold uppercase tracking-wider">
            <Sparkles size={14} className="text-gold" /> Sanity CMS Connected
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight text-cream">
            Welcome to Thirumal Admin
          </h1>
          <p className="text-cream/80 text-sm md:text-base leading-relaxed">
            Manage your website content, traditional meal sets, priced dishes, event portfolios, and media assets in real time without code modifications or rebuilds.
          </p>
          <div className="pt-2 flex flex-wrap gap-3">
            <Link
              to="/admin/services"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full gold-gradient text-maroon-deep font-bold text-xs uppercase tracking-wider shadow-lg hover:brightness-105"
            >
              <PlusCircle size={15} /> Add Service
            </Link>
            <Link
              to="/admin/menu"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-cream font-bold text-xs uppercase tracking-wider border border-gold/30 transition-colors"
            >
              <UtensilsCrossed size={15} /> Manage Menu
            </Link>
            <Link
              to="/admin/media"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-cream font-bold text-xs uppercase tracking-wider border border-gold/30 transition-colors"
            >
              <Upload size={15} /> Upload Media
            </Link>
          </div>
        </div>
      </div>

      {/* ── Metric Cards Grid ────────────────────────────────────── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-2xl font-bold text-foreground">
            Overview Statistics
          </h2>
          <span className="text-xs text-muted-foreground font-semibold">
            Real-time Sanity Metrics
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {STAT_CARDS.map((stat) => (
            <Link
              key={stat.title}
              to={stat.to}
              className="group p-6 rounded-3xl bg-card border border-border hover:border-gold shadow-md hover:shadow-xl transition-all relative overflow-hidden"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    {stat.title}
                  </p>
                  <p className="font-display text-4xl font-bold text-foreground mt-2">
                    {stat.count}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {stat.desc}
                  </p>
                </div>
                <div
                  className={`w-12 h-12 rounded-2xl grid place-items-center bg-gradient-to-br ${stat.color} group-hover:scale-110 transition-transform`}
                >
                  <stat.icon size={22} />
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-border flex items-center justify-between text-xs font-semibold text-primary group-hover:text-gold transition-colors">
                <span>Manage {stat.title}</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* ── Content Management Modules ───────────────────────────── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-2xl font-bold text-foreground">
            Website Content Modules
          </h2>
          <span className="text-xs text-muted-foreground font-semibold">
            Select a module to edit
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {QUICK_MANAGEMENT.map((mod) => (
            <Link
              key={mod.title}
              to={mod.to}
              className="group p-6 rounded-3xl bg-card border border-border hover:border-gold hover:shadow-xl transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-2xl gold-gradient text-maroon-deep grid place-items-center">
                    <mod.icon size={20} />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-muted text-muted-foreground group-hover:bg-gold/15 group-hover:text-primary transition-colors">
                    {mod.badge}
                  </span>
                </div>
                <h3 className="font-display text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                  {mod.title}
                </h3>
                <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                  {mod.desc}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-border flex items-center justify-between text-xs font-bold text-primary">
                <span>Open Editor</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
