import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { BrandLogo } from "@/components/craft/BrandLogo";
import heroBox from "@/assets/hero-box.jpg";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";

const loginSearchSchema = z.object({
  redirect: z.string().optional(),
});

export const Route = createFileRoute("/login")({
  validateSearch: loginSearchSchema,
  head: () => ({
    meta: [
      { title: "Sign In or Register — The Gift Architects" },
      {
        name: "description",
        content: "Sign in or create an account to start building personalized handcrafted gift boxes.",
      },
    ],
  }),
  component: LoginPage,
});

export default function LoginPage() {
  const search = Route.useSearch();
  const navigate = useNavigate();
  const redirectUrl = search.redirect || "/build";

  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please enter email and password.");
      return;
    }
    if (isSignUp && !fullName.trim()) {
      toast.error("Please enter your full name.");
      return;
    }

    setLoading(true);

    try {
      if (!isSupabaseConfigured) {
        toast.info("Supabase is in demo mode. Simulating sign in.");
        toast.success(isSignUp ? "Account created successfully!" : "Welcome back!");
        void navigate({ to: redirectUrl });
        return;
      }

      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: fullName } },
        });

        if (error) {
          toast.error(error.message);
        } else {
          toast.success("Account created successfully! Check your email to confirm or proceed.");
          if (data.session) {
            void navigate({ to: redirectUrl });
          }
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          toast.error(error.message);
        } else {
          toast.success("Welcome back!");
          if (data.session) {
            void navigate({ to: redirectUrl });
          }
        }
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Authentication failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      if (!isSupabaseConfigured) {
        toast.info("Supabase is in demo mode. Simulating Google sign in.");
        void navigate({ to: redirectUrl });
        return;
      }

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}${redirectUrl}`,
        },
      });
      if (error) toast.error(error.message);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Google sign in failed.");
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-65px)] w-full">
      {/* ─── LEFT DESKTOP HERO PANEL ─── */}
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-[#1C1612] p-12 text-[#FAF7F2] lg:flex">
        {/* Background Editorial Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src={heroBox}
            alt="Handcrafted Memory Gift Box"
            className="h-full w-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1C1612] via-[#1C1612]/80 to-[#1C1612]/90 backdrop-blur-[2px]" />
        </div>

        {/* Header Branding */}
        <div className="relative z-10">
          <BrandLogo />
        </div>

        {/* Content Body */}
        <div className="relative z-10 my-auto max-w-lg space-y-6">
          <span className="inline-flex items-center gap-2 rounded-full border border-[rgba(212,163,115,0.35)] bg-[rgba(212,163,115,0.12)] px-4 py-1 text-xs font-semibold uppercase tracking-wider text-[#D4A373]">
            ✦ Artisan Gift Curation Studio
          </span>

          <h1 className="font-[family-name:var(--font-serif)] text-4xl leading-tight font-extrabold text-[#FAF7F2] md:text-5xl">
            You tell us who they are. <span className="text-[#D4A373]">We create what to give them.</span>
          </h1>

          <ul className="space-y-4 pt-2 text-sm text-[#FAF7F2]/85">
            <li className="flex items-start gap-3">
              <span className="text-lg">🎁</span>
              <span>
                <strong className="text-[#FAF7F2]">Custom physical memory box & photo prints</strong> — tailored around their personality and your shared story.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-lg">✉️</span>
              <span>
                <strong className="text-[#FAF7F2]">Interactive digital memory envelope</strong> — with custom photo cards, letters & Spotify track integration.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-lg">📦</span>
              <span>
                <strong className="text-[#FAF7F2]">Hand-assembled with care</strong> — crafted by verified micro-creators & shipped across India.
              </span>
            </li>
          </ul>
        </div>

        {/* Footer info */}
        <div className="relative z-10 text-xs text-[#FAF7F2]/50">
          © {new Date().getFullYear()} The Gift Architects. All rights reserved.
        </div>
      </div>

      {/* ─── RIGHT FORM PANEL ─── */}
      <div className="flex w-full items-center justify-center bg-[#181310] p-6 lg:w-1/2 lg:p-12">
        <div className="w-full max-w-md space-y-6">
          {/* Header */}
          <div className="space-y-2 text-left">
            <span className="text-xs uppercase tracking-wider text-[#B85B3A] font-bold">
              Account Access
            </span>
            <h2 className="font-[family-name:var(--font-serif)] text-3xl font-extrabold text-[#FAF7F2]">
              {isSignUp ? "Create your account" : "Welcome back"}
            </h2>
            <p className="text-sm text-[#B8A99C]">
              {isSignUp
                ? "Enter your details to save your gift boxes & track orders."
                : "Sign in to continue building your handcrafted gift box."}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleEmailAuth} className="space-y-4">
            {isSignUp && (
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#FAF7F2]">
                  Full Name
                </label>
                <input
                  type="text"
                  required={isSignUp}
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Aarohi Sharma"
                  className="mt-1.5 w-full rounded-xl border border-[rgba(212,163,115,0.35)] bg-[#FAF9F6] px-4 py-3 text-sm font-medium text-[#1C1612] placeholder:text-[#5C4A3E] outline-none transition duration-200 focus:border-[#B85B3A] focus:ring-2 focus:ring-[#D4A373]/30 focus:shadow-[0_0_15px_rgba(212,163,115,0.25)]"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#FAF7F2]">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="mt-1.5 w-full rounded-xl border border-[rgba(212,163,115,0.35)] bg-[#FAF9F6] px-4 py-3 text-sm font-medium text-[#1C1612] placeholder:text-[#5C4A3E] outline-none transition duration-200 focus:border-[#B85B3A] focus:ring-2 focus:ring-[#D4A373]/30 focus:shadow-[0_0_15px_rgba(212,163,115,0.25)]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#FAF7F2]">
                Password
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="mt-1.5 w-full rounded-xl border border-[rgba(212,163,115,0.35)] bg-[#FAF9F6] px-4 py-3 text-sm font-medium text-[#1C1612] placeholder:text-[#5C4A3E] outline-none transition duration-200 focus:border-[#B85B3A] focus:ring-2 focus:ring-[#D4A373]/30 focus:shadow-[0_0_15px_rgba(212,163,115,0.25)]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-full bg-[#B85B3A] px-6 py-3.5 text-sm font-semibold text-[#FAF7F2] shadow-md transition hover:bg-[#B85B3A]/90 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60"
            >
              {loading && <Loader2 className="size-4 animate-spin" />}
              {isSignUp ? "Create Account" : "Sign in"}
            </button>
          </form>

          {/* Divider */}
          <div className="relative flex items-center justify-center py-2">
            <div className="w-full border-t border-[rgba(212,163,115,0.3)]" />
            <span className="absolute bg-[#181310] px-3 text-xs uppercase tracking-wider text-[#B8A99C] font-semibold">
              OR
            </span>
          </div>

          {/* Google OAuth Button */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            className="flex w-full items-center justify-center gap-3 rounded-full border border-[rgba(212,163,115,0.35)] bg-[#CFA771] px-6 py-3 text-sm font-semibold text-[#1C1612] transition hover:bg-[#B58A52] hover:scale-[1.01]"
          >
            <svg className="size-5" viewBox="0 0 24 24" aria-hidden>
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                fill="#EA4335"
              />
            </svg>
            Continue with Google
          </button>

          {/* Toggle link */}
          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => setIsSignUp((prev) => !prev)}
              className="text-sm font-semibold text-[#D4A373] hover:text-[#B85B3A] transition-colors"
            >
              {isSignUp
                ? "Already have an account? Sign in"
                : "New to The Gift Architects? Create an account"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
