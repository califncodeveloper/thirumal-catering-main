import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { WhatsAppFab } from "../components/WhatsAppFab";
import { ScrollToTop } from "../components/ScrollToTop";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <div className="font-display text-[10rem] leading-none font-bold text-gold-gradient">404</div>
        <h2 className="mt-2 font-display text-3xl font-bold text-foreground">Page not found</h2>
        <p className="mt-3 text-muted-foreground">
          Looks like this dish isn't on our menu. Let's get you back to the feast.
        </p>
        <Link
          to="/"
          className="mt-8 inline-flex items-center justify-center rounded-full gold-gradient text-maroon-deep font-semibold px-6 py-3 hover:shadow-xl transition-shadow"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-3xl font-bold text-foreground">Something went wrong</h1>
        <p className="mt-2 text-sm text-muted-foreground">Please try again or head home.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => { router.invalidate(); reset(); }}
            className="rounded-full bg-primary text-primary-foreground font-semibold px-5 py-2.5"
          >
            Try again
          </button>
          <a href="/" className="rounded-full border border-input px-5 py-2.5 font-semibold">Go home</a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Thirumal Catering — Tradition in Every Taste | Chennai" },
      {
        name: "description",
        content:
          "Thirumal Catering Services — authentic South Indian catering for weddings, receptions, corporate events and temple functions in Chennai since 2008. Book now for banana-leaf feasts.",
      },
      { name: "author", content: "Thirumal Catering Services" },
      { name: "robots", content: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" },
      { name: "googlebot", content: "index, follow" },

      /* ── Keywords ── */
      {
        name: "keywords",
        content:
          "catering services chennai, south indian catering, wedding catering chennai, banana leaf catering, tamil catering, temple catering, corporate catering chennai, thirumal catering, kalyana saapadu chennai",
      },

      /* ── Geo / Local SEO ── */
      { name: "geo.region", content: "IN-TN" },
      { name: "geo.placename", content: "Chennai, Tamil Nadu, India" },
      { name: "geo.position", content: "13.0827;80.2707" },
      { name: "ICBM", content: "13.0827, 80.2707" },

      /* ── Open Graph ── */
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "Thirumal Catering Services" },
      { property: "og:url", content: "https://thirumalcatering.com" },
      { property: "og:title", content: "Thirumal Catering — Tradition in Every Taste | Chennai" },
      {
        property: "og:description",
        content:
          "Authentic South Indian catering in Chennai for weddings, receptions, temple utsavams & corporate events. 17 years of tradition, 1500+ events served.",
      },
      { property: "og:image", content: "https://thirumalcatering.com/logo-with-bg.png" },
      { property: "og:image:width", content: "1024" },
      { property: "og:image:height", content: "1024" },
      { property: "og:image:alt", content: "Thirumal Catering Services Logo" },
      { property: "og:locale", content: "en_IN" },

      /* ── Twitter Card ── */
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Thirumal Catering — Tradition in Every Taste" },
      {
        name: "twitter:description",
        content: "Authentic South Indian catering in Chennai. Weddings, temple functions, corporate events — 17 years of tradition.",
      },
      { name: "twitter:image", content: "https://thirumalcatering.com/logo-with-bg.png" },

      /* ── Business / Contact ── */
      { name: "contact", content: "Thirumal Catering Services, Chennai, Tamil Nadu" },
      { name: "category", content: "Catering Services" },
      { name: "coverage", content: "Chennai, Tamil Nadu, India" },
      { name: "revisit-after", content: "7 days" },
      { name: "language", content: "English" },
      { name: "rating", content: "general" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      /* Favicon — using the brand logo as a PNG icon (rounded via CSS) */
      { rel: "icon", href: "/logo-with-bg.png", type: "image/png" },
      { rel: "apple-touch-icon", href: "/logo-with-bg.png" },
      { rel: "shortcut icon", href: "/logo-with-bg.png" },
      /* Canonical */
      { rel: "canonical", href: "https://thirumalcatering.com" },
      /* Fonts */
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Noto+Serif+Tamil:wght@400;500;600;700&display=swap",
      },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FoodEstablishment",
          name: "Thirumal Catering Services",
          alternateName: "Thirumal Catering",
          description:
            "Authentic South Indian catering for weddings, receptions, corporate events and temple functions in Chennai since 2008.",
          url: "https://thirumalcatering.com",
          logo: "https://thirumalcatering.com/logo-with-bg.png",
          image: "https://thirumalcatering.com/logo-with-bg.png",
          telephone: "+91-98765-43210",
          email: "info@thirumalcatering.com",
          foundingDate: "2008",
          slogan: "Tradition in Every Taste",
          servesCuisine: ["South Indian", "Tamil", "Vegetarian"],
          priceRange: "₹₹",
          currenciesAccepted: "INR",
          paymentAccepted: "Cash, UPI, Bank Transfer",
          address: {
            "@type": "PostalAddress",
            streetAddress: "Ranganathapuram, Tambaram",
            addressLocality: "Chennai",
            addressRegion: "Tamil Nadu",
            postalCode: "600045",
            addressCountry: "IN",
          },
          geo: {
            "@type": "GeoCoordinates",
            latitude: 13.0827,
            longitude: 80.2707,
          },
          openingHoursSpecification: {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
            opens: "06:00",
            closes: "22:00",
          },
          sameAs: [],
          hasOfferCatalog: {
            "@type": "OfferCatalog",
            name: "Catering Services",
            itemListElement: [
              { "@type": "Offer", itemOffered: { "@type": "Service", name: "Wedding Catering" } },
              { "@type": "Offer", itemOffered: { "@type": "Service", name: "Corporate Event Catering" } },
              { "@type": "Offer", itemOffered: { "@type": "Service", name: "Temple Function Catering" } },
              { "@type": "Offer", itemOffered: { "@type": "Service", name: "Birthday Catering" } },
              { "@type": "Offer", itemOffered: { "@type": "Service", name: "Housewarming Catering" } },
            ],
          },
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: "4.9",
            reviewCount: "1500",
            bestRating: "5",
          },
        }),
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) {
    return (
      <QueryClientProvider client={queryClient}>
        <Outlet />
      </QueryClientProvider>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ScrollToTop />
      <Navbar />
      <main className="min-h-screen">
        <Outlet />
      </main>
      <Footer />
      <WhatsAppFab />
    </QueryClientProvider>
  );
}

