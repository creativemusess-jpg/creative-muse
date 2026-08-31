import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useLocation,
  useNavigate,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { lazy, Suspense, useEffect, useState, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { AuthProvider } from "@/lib/auth";
import { AddressProvider } from "@/lib/addresses";
import { SiteChrome } from "@/components/site/SiteChrome";

const NewsletterPopup = lazy(() => import("@/components/site/NewsletterPopup").then((m) => ({ default: m.NewsletterPopup })));

function NotFoundComponent() {
  return (
    <SiteChrome>
      <div className="flex min-h-[60vh] items-center justify-center px-4 py-24">
        <div className="max-w-md text-center">
          <h1 className="font-display text-7xl text-[#1a1a2e]">404</h1>
          <p className="mt-4 text-[#7a6e64]">
            We couldn't find that piece. Let's get you back to the showroom.
          </p>
          <Link to="/" className="btn-primary mt-8 inline-flex">
            Back to Home
          </Link>
        </div>
      </div>
    </SiteChrome>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#fdf8f3] px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-2xl text-[#1a1a2e]">Something went wrong</h1>
        <p className="mt-2 text-sm text-[#7a6e64]">Please try again in a moment.</p>
        <div className="mt-6 flex justify-center gap-3">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="btn-primary"
          >
            Try again
          </button>
          <a href="/" className="btn-secondary">
            Go home
          </a>
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
      { title: "Creative Muse Fine Jewellery — Where Every Gem Tells Your Story" },
      {
        name: "description",
        content:
          "Discover handcrafted fine jewellery from Vadodara. BIS Hallmarked gold, IGI certified diamonds, bridal collections and everyday luxury.",
      },
      { name: "author", content: "Creative Muse Fine Jewellery" },
      { property: "og:title", content: "Creative Muse Fine Jewellery — Where Every Gem Tells Your Story" },
      {
        property: "og:description",
        content: "Discover handcrafted fine jewellery from Vadodara. BIS Hallmarked gold, IGI certified diamonds, bridal collections and everyday luxury.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Creative Muse Fine Jewellery — Where Every Gem Tells Your Story" },
      { name: "description", content: "Discover handcrafted fine jewellery from Vadodara. BIS Hallmarked gold, IGI certified diamonds, bridal collections and everyday luxury." },
      { property: "og:description", content: "Discover handcrafted fine jewellery from Vadodara. BIS Hallmarked gold, IGI certified diamonds, bridal collections and everyday luxury." },
      { name: "twitter:description", content: "Discover handcrafted fine jewellery from Vadodara. BIS Hallmarked gold, IGI certified diamonds, bridal collections and everyday luxury." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/1869e11e-6ff3-4375-826e-0f139a12213c/id-preview-0ff5cf96--81d62c91-1c7a-403d-bf94-b2e6932241d2.lovable.app-1782737695056.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/1869e11e-6ff3-4375-826e-0f139a12213c/id-preview-0ff5cf96--81d62c91-1c7a-403d-bf94-b2e6932241d2.lovable.app-1782737695056.png" },
    ],
    links: [
      { rel: "icon", href: "/favicon.ico", sizes: "48x48" },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
      { rel: "icon", href: "/favicon.ico", type: "image/vnd.microsoft.icon" },
      { rel: "apple-touch-icon", href: "/favicon.ico" },
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=Montserrat:wght@300;400;500;600;700&display=swap",
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
  const location = useLocation();
  const navigate = useNavigate();
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const errorCode = params.get("error_code");
    const errorDescription = params.get("error_description");
    if (errorCode) {
      const message = errorDescription || "Authentication failed. Please try again.";
      setAuthError(message);
      params.delete("error");
      params.delete("error_code");
      params.delete("error_description");
      const clean = params.toString()
        ? `${window.location.pathname}?${params.toString()}`
        : window.location.pathname;
      window.history.replaceState({}, "", clean);
      const timer = setTimeout(() => setAuthError(null), 8000);
      return () => clearTimeout(timer);
    }
  }, [location.search]);

  const isAdminRoute = location.pathname.startsWith("/admin");
  const isStandaloneAuthRoute =
    location.pathname === "/forgot-password" || location.pathname === "/reset-password";

  return (
    <QueryClientProvider client={queryClient}>
      {authError && !isAdminRoute && (
        <div className="fixed top-4 left-1/2 z-[9999] max-w-md -translate-x-1/2 rounded-xl border border-red-200 bg-white px-5 py-3 shadow-lg">
          <p className="text-sm text-red-600">{authError}</p>
        </div>
      )}
      {isAdminRoute ? (
        <Outlet />
      ) : isStandaloneAuthRoute ? (
        <AuthProvider>
          <AddressProvider>
            <Outlet />
          </AddressProvider>
        </AuthProvider>
      ) : (
        <AuthProvider>
          <AddressProvider>
            <SiteChrome>
              <Outlet />
              <Suspense fallback={null}>
                <NewsletterPopup />
              </Suspense>
            </SiteChrome>
          </AddressProvider>
        </AuthProvider>
      )}
    </QueryClientProvider>
  );
}
