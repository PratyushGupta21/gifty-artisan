import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useNavigate,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { Toaster, toast } from "sonner";
import type { User } from "@supabase/supabase-js";
import { BuilderProvider } from "@/lib/builder-store";
import { BrandLogo } from "@/components/craft/BrandLogo";
import { Footer } from "@/components/layout/Footer";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
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
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-full border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
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
      { title: "The Little Box — Personalised handmade gift boxes" },
      {
        name: "description",
        content:
          "Tell us who they are and we handcraft a gift box around their story — photo cards, artisan keepsakes and a digital memory page.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap",
      },
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
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

function SiteHeader() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (!isSupabaseConfigured) return;

    void supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    }
    setUser(null);
    toast.success("Signed out successfully");
    void navigate({ to: "/login" });
  };

  return (
    <header className="sticky top-0 z-40 border-b border-[rgba(212,163,115,0.15)] bg-[#181310]/90 backdrop-blur-lg">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 md:px-8">
        <div className="flex items-center gap-8">
          <Link to="/" aria-label="The Little Box Home">
            <BrandLogo />
          </Link>

          {/* Left/Center Navigation Links */}
          <div className="hidden items-center gap-6 text-sm font-medium md:flex">
            <Link
              to="/"
              hash="how-it-works"
              className="text-[#FAF7F2] transition-colors hover:text-[#D4A373]"
            >
              How it works
            </Link>
            <Link
              to="/"
              hash="pricing"
              className="text-[#FAF7F2] transition-colors hover:text-[#D4A373]"
            >
              Pricing
            </Link>
            <Link
              to="/faq"
              className="text-[#FAF7F2] transition-colors hover:text-[#D4A373]"
            >
              FAQ
            </Link>
            <Link
              to="/about"
              className="text-[#FAF7F2] transition-colors hover:text-[#D4A373]"
            >
              About
            </Link>
          </div>
        </div>

        {/* Right Action Items */}
        <div className="flex items-center gap-3.5 text-sm font-medium">
          <Link
            to="/admin"
            className="text-[#FAF7F2] transition-colors hover:text-[#D4A373]"
          >
            Dashboard
          </Link>
          <Link
            to="/track"
            className="text-[#FAF7F2]/80 transition-colors hover:text-[#D4A373]"
          >
            Track order
          </Link>

          {user ? (
            <div className="flex items-center gap-2 pl-1 border-l border-[rgba(212,163,115,0.25)]">
              <span className="hidden text-xs text-[#FAF7F2]/70 lg:inline-block max-w-[140px] truncate font-normal" title={user.email}>
                {user.email}
              </span>
              <button
                type="button"
                onClick={handleSignOut}
                className="rounded-full border border-[rgba(212,163,115,0.3)] bg-[#CFA771] px-3.5 py-1.5 text-xs font-semibold text-[#1C1612] transition hover:bg-[#B58A52]"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="rounded-full border border-[#B85B3A] px-3.5 py-1.5 text-xs font-semibold text-[#D4A373] transition hover:bg-[#B85B3A]/10"
            >
              Sign In
            </Link>
          )}

          <Link
            to="/build"
            className="rounded-full bg-[#B85B3A] px-4 py-2 text-xs font-semibold text-[#FAF7F2] shadow-sm transition hover:bg-[#B85B3A]/90 hover:shadow-md sm:text-sm"
          >
            Build a box
          </Link>
        </div>
      </nav>

      {/* Mobile sub-navigation bar */}
      <div className="flex items-center justify-around border-t border-[rgba(212,163,115,0.12)] bg-[#181310]/90 backdrop-blur-lg py-2 text-xs font-medium md:hidden">
        <Link to="/" hash="how-it-works" className="text-[#FAF7F2] transition-colors hover:text-[#D4A373]">
          How it works
        </Link>
        <Link to="/" hash="pricing" className="text-[#FAF7F2] transition-colors hover:text-[#D4A373]">
          Pricing
        </Link>
        <Link to="/faq" className="text-[#FAF7F2] transition-colors hover:text-[#D4A373]">
          FAQ
        </Link>
        <Link to="/about" className="text-[#FAF7F2] transition-colors hover:text-[#D4A373]">
          About
        </Link>
      </div>
    </header>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <BuilderProvider>
        <div className="relative flex min-h-screen flex-col bg-[#181310] text-[#FAF7F2] selection:bg-[#D4A373]/30 overflow-x-hidden">
          {/* ── Fixed Ambient Glow Radial Gradients ── */}
          <div
            className="fixed -top-32 -right-32 size-[450px] rounded-full pointer-events-none z-0"
            style={{
              background:
                "radial-gradient(circle, rgba(184, 91, 58, 0.09) 0%, transparent 65%)",
            }}
            aria-hidden
          />
          <div
            className="fixed top-[40%] -left-36 size-[550px] rounded-full pointer-events-none z-0"
            style={{
              background:
                "radial-gradient(circle, rgba(212, 163, 115, 0.08) 0%, transparent 65%)",
            }}
            aria-hidden
          />
          <div
            className="fixed -bottom-32 -right-24 size-[400px] rounded-full pointer-events-none z-0"
            style={{
              background:
                "radial-gradient(circle, rgba(112, 130, 56, 0.07) 0%, transparent 65%)",
            }}
            aria-hidden
          />

          {/* ── Ambient Floating Artisan Vector Accents ── */}
          <svg
            className="fixed top-28 right-6 size-32 pointer-events-none z-0 opacity-15 text-[#B85B3A]"
            viewBox="0 0 100 100"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            aria-hidden
          >
            <path d="M50 10 C50 35 15 50 10 50 C35 50 50 85 50 90 C50 65 85 50 90 50 C65 50 50 15 50 10 Z" />
          </svg>
          <svg
            className="fixed bottom-36 left-8 size-40 pointer-events-none z-0 opacity-15 text-[#708238]"
            viewBox="0 0 100 100"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.2"
            aria-hidden
          >
            <path d="M20 80 Q 50 20 80 80" />
            <path d="M35 50 Q 50 30 65 50" />
            <circle cx="50" cy="25" r="3" fill="currentColor" />
          </svg>

          {/* ── Main App Content ── */}
          <div className="relative z-10 flex min-h-screen flex-col">
            <SiteHeader />
            <main className="flex-1">
              <Outlet />
            </main>
            <Footer />
          </div>
        </div>
        <Toaster />
      </BuilderProvider>
    </QueryClientProvider>
  );
}
