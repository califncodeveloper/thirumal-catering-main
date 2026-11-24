import {
  createFileRoute,
  Outlet,
  Link,
  useRouterState,
  useNavigate,
  redirect,
} from "@tanstack/react-router";
import { useState } from "react";
import {
  LayoutDashboard,
  Home,
  Info,
  Briefcase,
  Calendar,
  UtensilsCrossed,
  Phone,
  Layout,
  Image as ImageIcon,
  Search,
  LogOut,
  Menu as MenuIcon,
  X,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";
import { checkAdminAuthServerFn, logoutServerFn } from "../lib/admin-api.server";

export const Route = createFileRoute("/admin")({
  beforeLoad: async ({ location }) => {
    // Skip auth check on login route
    if (location.pathname === "/admin/login") {
      return { auth: { authenticated: false } };
    }
    const auth = await checkAdminAuthServerFn();
    if (!auth.authenticated) {
      throw redirect({
        to: "/admin/login",
      });
    }
    return { auth };
  },
  head: () => ({
    meta: [
      { title: "Thirumal Catering Admin Panel" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminLayoutRoute,
});

const NAV_ITEMS = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/homepage", label: "Homepage", icon: Home },
  { to: "/admin/about", label: "About Page", icon: Info },
  { to: "/admin/services", label: "Services", icon: Briefcase },
  { to: "/admin/events", label: "Events & Gallery", icon: Calendar },
  { to: "/admin/menu", label: "Menu Management", icon: UtensilsCrossed },
  { to: "/admin/contact", label: "Contact Details", icon: Phone },
  { to: "/admin/header-footer", label: "Header & Footer", icon: Layout },
  { to: "/admin/media", label: "Media Library", icon: ImageIcon },
  { to: "/admin/seo", label: "SEO Settings", icon: Search },
] as const;

function AdminLayoutRoute() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // If on login route, render cleanly without the dashboard shell
  if (pathname === "/admin/login") {
    return <Outlet />;
  }

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logoutServerFn();
      navigate({ to: "/admin/login" });
    } catch (e) {
      console.error("Logout failed:", e);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="min-h-screen bg-muted/30 flex">
      {/* ── Sidebar (Desktop) ────────────────────────────────────── */}
      <aside className="hidden lg:flex flex-col w-72 bg-maroon-deep text-cream border-r border-gold/20 shrink-0 sticky top-0 h-screen z-30">
        {/* Brand header */}
        <div className="p-6 border-b border-gold/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="/logo-with-bg.png"
              alt="Thirumal Catering Logo"
              className="w-11 h-11 rounded-full ring-2 ring-gold bg-white object-cover"
            />
            <div>
              <h2 className="font-display text-lg font-bold text-cream tracking-wide">
                Thirumal
              </h2>
              <p className="text-[10px] uppercase tracking-[0.2em] text-gold-light flex items-center gap-1 font-semibold">
                <ShieldCheck size={11} className="text-gold" /> Admin Console
              </p>
            </div>
          </div>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-1.5 scrollbar-thin">
          {NAV_ITEMS.map((item) => {
            const isActive =
              item.to === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all ${
                  isActive
                    ? "gold-gradient text-maroon-deep shadow-lg font-bold"
                    : "text-cream/80 hover:text-gold-light hover:bg-white/5"
                }`}
              >
                <item.icon size={18} className={isActive ? "text-maroon-deep" : "text-gold"} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User bar & logout */}
        <div className="p-4 border-t border-gold/20 space-y-3">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-cream/90 transition-colors"
          >
            <span className="flex items-center gap-2">
              <ExternalLink size={14} className="text-gold" /> View Live Site
            </span>
            <span className="text-[10px] text-gold-light uppercase tracking-wider font-semibold">
              Live
            </span>
          </a>

          <button
            type="button"
            disabled={isLoggingOut}
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-destructive/40 text-destructive-foreground bg-destructive/15 hover:bg-destructive hover:text-white transition-all text-xs font-bold"
          >
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </aside>

      {/* ── Main Layout Column ───────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Bar */}
        <header className="sticky top-0 z-20 bg-background/95 backdrop-blur-md border-b border-border h-16 px-4 md:px-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-xl text-foreground hover:bg-muted"
              aria-label="Open menu"
            >
              <MenuIcon size={22} />
            </button>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="font-display font-bold text-foreground">Admin</span>
              <span>/</span>
              <span className="capitalize font-medium text-foreground">
                {pathname.replace("/admin/", "").replace("/admin", "Dashboard") || "Dashboard"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gold/40 text-xs font-semibold hover:bg-gold/10 transition-colors text-foreground"
            >
              <ExternalLink size={13} className="text-primary" /> Live Website
            </a>
            <div className="flex items-center gap-2 pl-3 border-l border-border">
              <div className="w-8 h-8 rounded-full gold-gradient text-maroon-deep font-bold text-xs grid place-items-center">
                A
              </div>
              <span className="hidden md:inline text-xs font-semibold text-foreground">
                Administrator
              </span>
            </div>
          </div>
        </header>

        {/* Mobile drawer */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setMobileMenuOpen(false)}
            />
            <div className="relative w-72 max-w-[85%] bg-maroon-deep text-cream h-full flex flex-col z-10 shadow-2xl">
              <div className="p-5 border-b border-gold/20 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <img
                    src="/logo-with-bg.png"
                    alt="Logo"
                    className="w-10 h-10 rounded-full ring-2 ring-gold bg-white"
                  />
                  <span className="font-display font-bold text-lg">Thirumal Admin</span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 text-cream/70 hover:text-white"
                >
                  <X size={20} />
                </button>
              </div>

              <nav className="flex-1 overflow-y-auto p-4 space-y-1">
                {NAV_ITEMS.map((item) => {
                  const isActive =
                    item.to === "/admin"
                      ? pathname === "/admin"
                      : pathname.startsWith(item.to);
                  return (
                    <Link
                      key={item.to}
                      to={item.to}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all ${
                        isActive
                          ? "gold-gradient text-maroon-deep font-bold"
                          : "text-cream/80 hover:bg-white/5"
                      }`}
                    >
                      <item.icon size={18} className={isActive ? "text-maroon-deep" : "text-gold"} />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>

              <div className="p-4 border-t border-gold/20">
                <button
                  onClick={handleLogout}
                  className="w-full py-3 rounded-xl bg-destructive text-white text-xs font-bold flex items-center justify-center gap-2"
                >
                  <LogOut size={16} /> Sign Out
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto pb-28">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
