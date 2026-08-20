import { useEffect, useMemo, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Loader2, Truck } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { Chip } from "@/components/craft/Chip";
import { PhotoUploader } from "@/components/craft/PhotoUploader";
import { useBuilder } from "@/lib/builder-store";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";
import {
  ADD_ONS,
  OCCASIONS,
  PERSONALITY_TAGS,
  RELATIONSHIPS,
  TIERS,
  inr,
  priceBreakdown,
  type TierId,
} from "@/lib/gift";
import { cn } from "@/lib/utils";

const searchSchema = z.object({
  tier: z.enum(["little", "lovely", "memory"]).optional(),
});

export const Route = createFileRoute("/build")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Build their gift box — The Gift Architects" },
      {
        name: "description",
        content:
          "A four-step builder: tell us about them, add photos and memories, pick a tier, and we handcraft the rest.",
      },
      { property: "og:title", content: "Build their gift box — The Gift Architects" },
      {
        property: "og:description",
        content: "Answer a few questions about them and we'll handcraft a gift box around it.",
      },
    ],
  }),
  component: BuildPage,
});

const STEPS = ["Recipient", "Memories", "Choose tier", "Review & order"];

const inputClass =
  "w-full rounded-xl border border-[rgba(24,19,16,0.25)] bg-[#FAF7F2] px-4 py-3 text-sm font-medium text-[#1C1612] placeholder:text-[#5C4A3E] outline-none transition duration-200 focus:border-[#B85B3A] focus:ring-2 focus:ring-[#B85B3A]/25 focus:shadow-[0_0_15px_rgba(184,91,58,0.15)]";

function BuildPage() {
  const search = Route.useSearch();
  const navigate = useNavigate();
  const { state, set, toggle, reset } = useBuilder();
  const [step, setStep] = useState(search.tier ? 2 : 0);
  const [submitting, setSubmitting] = useState(false);
  const [pinResult, setPinResult] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    async function checkAuth() {
      if (!isSupabaseConfigured) return;
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        toast.error("Please sign in or create an account to start building your gift box.");
        void navigate({ to: "/login", search: { redirect: "/build" } });
      } else {
        setUserId(session.user.id);
      }
    }
    void checkAuth();
  }, [navigate]);

  const tier = state.tier ?? search.tier ?? null;
  const totals = useMemo(() => priceBreakdown(tier, state.addOns), [tier, state.addOns]);
  const needsPhotos = TIERS.find((t) => t.id === tier)?.needsPhotos ?? false;

  function next() {
    if (step === 0 && !state.recipientName.trim()) {
      toast.error("Who is this box for?");
      return;
    }
    if (step === 2 && !tier) {
      toast.error("Pick a package tier to continue");
      return;
    }
    if (step === 2 && needsPhotos && state.photos.length === 0) {
      toast.error("This tier includes printed photo cards — add at least one photo in step 2.");
      return;
    }
    setStep((s) => Math.min(s + 1, 3));
  }

  async function placeOrder() {
    if (!tier) return;
    setSubmitting(true);
    try {
      const activeSession = isSupabaseConfigured
        ? (await supabase.auth.getSession()).data.session
        : null;
      const activeUserId = activeSession?.user?.id ?? userId;

      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          ...(activeUserId ? { user_id: activeUserId } : {}),
          recipient_name: state.recipientName,
          relationship: state.relationship,
          occasion: state.occasion,
          personality_tags: state.personalityTags,
          inside_joke: state.insideJoke,
          spotify_url: state.spotifyUrl,
          card_message: state.cardMessage,
          tier_selected: tier,
          add_ons: state.addOns,
          total_amount: totals.total,
          payment_status: "pending",
        })
        .select("id")
        .single();
      if (orderError) throw orderError;

      const { data: memory, error: memoryError } = await supabase
        .from("memories")
        .insert({
          order_id: order.id,
          recipient_name: state.recipientName,
          sender_name: state.senderName,
          letter_text: state.cardMessage || state.insideJoke,
          spotify_url: state.spotifyUrl,
        })
        .select("id, uuid_slug")
        .single();
      if (memoryError) throw memoryError;

      if (state.photos.length) {
        const { error: photoError } = await supabase.from("memory_photos").insert(
          state.photos.map((photo_url) => ({ memory_id: memory.id, photo_url })),
        );
        if (photoError) {
          toast.warning("Order saved but photos couldn't be linked", {
            description: photoError.message,
          });
        }
      }

      toast.success("Order placed — payment link is on its way on WhatsApp.");
      reset();
      void navigate({ to: "/memory/$id", params: { id: memory.uuid_slug as string } });
    } catch (err) {
      toast.error("Couldn't save your box", {
        description: err instanceof Error ? err.message : "Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 md:py-12">
      <div className="space-y-2">
        <span className="text-xs uppercase tracking-wider text-[#B85B3A] font-bold">
          Step-by-Step Artisan Builder
        </span>
        <h1 className="font-[family-name:var(--font-serif)] text-3xl font-extrabold text-[#FAF7F2] md:text-4xl">
          Build their gift box
        </h1>
        <p className="text-sm text-[#D4A373]">
          Four short steps. Your answers update your live box summary in real time.
        </p>
      </div>

      <ol className="mt-8 flex flex-wrap gap-2.5" aria-label="Progress">
        {STEPS.map((label, i) => (
          <li key={label} className="flex-1 min-w-[120px]">
            <button
              type="button"
              onClick={() => setStep(i)}
              aria-current={step === i ? "step" : undefined}
              className={cn(
                "w-full rounded-full border px-4 py-2.5 text-xs font-semibold transition-all duration-200",
                i === step
                  ? "border-[#B85B3A] bg-[#B85B3A] text-[#FAF7F2] shadow-md scale-[1.02]"
                  : i < step
                    ? "border-[#708238]/60 bg-[#708238]/20 text-[#FAF7F2]"
                    : "border-[rgba(24,19,16,0.3)] bg-[#CFA771] text-[#181310] font-bold hover:bg-[#E0BC88]",
              )}
            >
              {i + 1}. {label}
            </button>
          </li>
        ))}
      </ol>

      <div className="mt-8 grid gap-8 lg:grid-cols-12 items-start">
        {/* Main 4-step wizard card container */}
        <div className="lg:col-span-7 xl:col-span-8">
          <AnimatePresence mode="wait">
            <motion.section
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
              className="paper-card space-y-6 p-6 md:p-8"
            >
              {step === 0 && (
                <>
                  <h2 className="font-[family-name:var(--font-serif)] text-2xl font-bold text-[#231C18]">
                    Who is this for?
                  </h2>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="block text-sm">
                      <span className="mb-1.5 block font-medium text-[#231C18]">Recipient's name</span>
                      <input
                        className={inputClass}
                        value={state.recipientName}
                        onChange={(e) => set({ recipientName: e.target.value })}
                        placeholder="Aarohi"
                      />
                    </label>
                    <label className="block text-sm">
                      <span className="mb-1.5 block font-medium text-[#231C18]">Your name</span>
                      <input
                        className={inputClass}
                        value={state.senderName}
                        onChange={(e) => set({ senderName: e.target.value })}
                        placeholder="Kabir"
                      />
                    </label>
                    <label className="block text-sm">
                      <span className="mb-1.5 block font-medium text-[#231C18]">Relationship</span>
                      <select
                        className={inputClass}
                        value={state.relationship}
                        onChange={(e) => set({ relationship: e.target.value })}
                      >
                        <option value="">Select relationship</option>
                        {RELATIONSHIPS.map((r) => (
                          <option key={r}>{r}</option>
                        ))}
                      </select>
                    </label>
                    <label className="block text-sm">
                      <span className="mb-1.5 block font-medium text-[#231C18]">Occasion</span>
                      <select
                        className={inputClass}
                        value={state.occasion}
                        onChange={(e) => set({ occasion: e.target.value })}
                      >
                        <option value="">Select occasion</option>
                        {OCCASIONS.map((o) => (
                          <option key={o}>{o}</option>
                        ))}
                      </select>
                    </label>
                  </div>
                  <fieldset>
                    <legend className="mb-3 text-sm font-medium text-[#231C18]">What are they like?</legend>
                    <div className="flex flex-wrap gap-2">
                      {PERSONALITY_TAGS.map((t) => (
                        <Chip
                          key={t}
                          label={t}
                          active={state.personalityTags.includes(t)}
                          onClick={() => toggle("personalityTags", t)}
                        />
                      ))}
                    </div>
                  </fieldset>
                </>
              )}

              {step === 1 && (
                <>
                  <h2 className="font-[family-name:var(--font-serif)] text-2xl font-bold text-[#231C18]">
                    Memories & personalisation
                  </h2>
                  <label className="block text-sm">
                    <span className="mb-1.5 block font-medium text-[#231C18]">
                      Describe an inside joke, cherished memory, or the feeling you want this box to carry
                    </span>
                    <textarea
                      className={cn(inputClass, "min-h-32")}
                      value={state.insideJoke}
                      onChange={(e) => set({ insideJoke: e.target.value })}
                    />
                  </label>
                  <div>
                    <p className="mb-2 text-sm font-medium text-[#231C18]">Photos for their cards</p>
                    <PhotoUploader photos={state.photos} onChange={(photos) => set({ photos })} />
                  </div>
                  <label className="block text-sm">
                    <span className="mb-1.5 block font-medium text-[#231C18]">Spotify track or playlist link</span>
                    <input
                      className={inputClass}
                      value={state.spotifyUrl}
                      onChange={(e) => set({ spotifyUrl: e.target.value })}
                      placeholder="https://open.spotify.com/track/..."
                    />
                  </label>
                  <label className="block text-sm">
                    <span className="mb-1.5 block font-medium text-[#231C18]">
                      Message for the handwritten card ({state.cardMessage.length}/500)
                    </span>
                    <textarea
                      maxLength={500}
                      className={cn(inputClass, "min-h-32")}
                      value={state.cardMessage}
                      onChange={(e) => set({ cardMessage: e.target.value })}
                    />
                  </label>
                </>
              )}

              {step === 2 && (
                <>
                  <h2 className="font-[family-name:var(--font-serif)] text-2xl font-bold text-[#231C18]">
                    Choose a tier
                  </h2>
                  <div className="grid gap-4">
                    {TIERS.map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => set({ tier: t.id as TierId })}
                        aria-pressed={tier === t.id}
                        className={cn(
                          "rounded-2xl border p-5 text-left transition-all duration-200 hover:scale-[1.01]",
                          tier === t.id
                            ? "border-[#B85B3A] bg-[#D4A373]/15 ring-2 ring-[#B85B3A]"
                            : "border-[rgba(212,163,115,0.3)] bg-[rgba(207,167,113,0.85)] hover:border-[#D4A373]",
                        )}
                      >
                        <div className="flex items-baseline justify-between gap-3">
                          <span className="font-[family-name:var(--font-serif)] text-xl font-bold text-[#231C18]">
                            {t.name}
                          </span>
                          <span className="font-bold text-[#B85B3A]">{inr(t.price)}</span>
                        </div>
                        <p className="mt-2 text-xs text-[#6B5E55]">{t.includes.join(" · ")}</p>
                      </button>
                    ))}
                  </div>
                  <fieldset className="space-y-3 pt-2">
                    <legend className="text-sm font-medium text-[#231C18]">Add-ons</legend>
                    {ADD_ONS.map((a) => (
                      <label
                        key={a.id}
                        className="flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-[rgba(212,163,115,0.3)] bg-[rgba(207,167,113,0.85)] px-4 py-3 text-sm transition hover:border-[#D4A373]"
                      >
                        <span className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            className="size-4 accent-[#B85B3A]"
                            checked={state.addOns.includes(a.id)}
                            onChange={() => toggle("addOns", a.id)}
                          />
                          {a.label}
                        </span>
                        <span className="text-[#6B5E55]">+{inr(a.price)}</span>
                      </label>
                    ))}
                  </fieldset>
                </>
              )}

              {step === 3 && (
                <>
                  <h2 className="font-[family-name:var(--font-serif)] text-2xl font-bold text-[#231C18]">
                    Review your box
                  </h2>
                  <div className="rounded-2xl border border-[rgba(212,163,115,0.3)] bg-[rgba(207,167,113,0.92)] p-5">
                    <p className="text-sm text-[#6B5E55]">
                      For <strong className="text-[#231C18]">{state.recipientName || "—"}</strong>
                      {state.occasion ? ` · ${state.occasion}` : ""}
                      {state.relationship ? ` · ${state.relationship}` : ""}
                    </p>
                    {state.photos.length > 0 && (
                      <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                        {state.photos.slice(0, 8).map((p) => (
                          <li
                            key={p}
                            className="rounded-lg border border-[rgba(212,163,115,0.3)] bg-[#CFA771] p-2 shadow-sm hover:scale-[1.02] transition"
                          >
                            <img
                              src={p}
                              alt="Photo card preview"
                              loading="lazy"
                              className="aspect-square w-full rounded object-cover"
                            />
                            <span className="mt-1 block truncate text-[10px] text-[#6B5E55]">
                              photo card
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}
                    {state.cardMessage && (
                      <p className="mt-4 rounded-xl bg-[#FAF7F2] p-4 text-sm italic text-[#231C18]">
                        “{state.cardMessage}”
                      </p>
                    )}
                  </div>

                  <dl className="space-y-2 text-sm text-[#231C18]">
                    <div className="flex justify-between">
                      <dt className="text-[#6B5E55]">Package</dt>
                      <dd className="font-semibold">{inr(totals.tierPrice)}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-[#6B5E55]">Add-ons</dt>
                      <dd className="font-semibold">{inr(totals.addOnTotal)}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-[#6B5E55]">Shipping {totals.shipping === 0 && "(free over ₹999)"}</dt>
                      <dd className="font-semibold">{inr(totals.shipping)}</dd>
                    </div>
                    <div className="flex justify-between border-t border-[rgba(212,163,115,0.3)] pt-2 text-base font-bold text-[#B85B3A]">
                      <dt>Total</dt>
                      <dd className="font-[family-name:var(--font-serif)] text-xl">{inr(totals.total)}</dd>
                    </div>
                  </dl>

                  <div className="flex flex-wrap items-center gap-2 pt-2">
                    <label className="sr-only" htmlFor="pincode">
                      Delivery pincode
                    </label>
                    <input
                      id="pincode"
                      inputMode="numeric"
                      maxLength={6}
                      placeholder="Delivery pincode"
                      className={cn(inputClass, "max-w-48")}
                      value={state.pincode}
                      onChange={(e) => set({ pincode: e.target.value.replace(/\D/g, "") })}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setPinResult(
                          state.pincode.length === 6
                            ? `Crafted and delivered in ${state.addOns.includes("express") ? "3–4" : "6–8"} days`
                            : "Enter a valid 6-digit pincode",
                        )
                      }
                      className="rounded-full border border-[#8C6D4F]/30 bg-[#FAF7F2]/50 px-5 py-3 text-sm font-semibold text-[#1C1612] hover:bg-[#FAF7F2] transition"
                    >
                      Check delivery
                    </button>
                    {pinResult && (
                      <span className="flex items-center gap-2 text-sm text-[#708238] font-semibold">
                        <Truck className="size-4" aria-hidden /> {pinResult}
                      </span>
                    )}
                  </div>

                  <button
                    type="button"
                    disabled={submitting}
                    onClick={() => void placeOrder()}
                    className="flex w-full items-center justify-center gap-2 rounded-full bg-[#B85B3A] px-6 py-3.5 font-semibold text-[#FAF7F2] shadow-lg shadow-[#B85B3A]/20 transition hover:bg-[#B85B3A]/90 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60"
                  >
                    {submitting ? (
                      <Loader2 className="size-4 animate-spin" aria-hidden />
                    ) : (
                      <Check className="size-4" aria-hidden />
                    )}
                    Place order · {inr(totals.total)}
                  </button>
                  <p className="text-center text-xs text-[#6B5E55]">
                    UPI, cards, netbanking and wallets supported at payment.
                  </p>
                </>
              )}

              <div className="flex justify-between gap-3 pt-4 border-t border-[rgba(212,163,115,0.2)]">
                <button
                  type="button"
                  onClick={() => setStep((s) => Math.max(0, s - 1))}
                  disabled={step === 0}
                  className="rounded-full border border-[#8C6D4F]/30 bg-[#FAF7F2]/50 px-6 py-2.5 text-sm font-semibold text-[#1C1612] transition hover:bg-[#FAF7F2] disabled:opacity-40"
                >
                  Back
                </button>
                {step < 3 && (
                  <button
                    type="button"
                    onClick={next}
                    className="rounded-full bg-[#B85B3A] px-7 py-2.5 text-sm font-semibold text-[#FAF7F2] shadow-sm transition hover:bg-[#B85B3A]/90 hover:scale-[1.02]"
                  >
                    Continue
                  </button>
                )}
              </div>
            </motion.section>
          </AnimatePresence>
        </div>

        {/* Dark Luxury Live-Summary Side Panel */}
        <aside className="lg:col-span-5 xl:col-span-4 lg:sticky lg:top-24">
          <div className="dark-luxury-card rounded-3xl p-6 md:p-7 space-y-6">
            <div className="flex items-center justify-between border-b border-[rgba(212,163,115,0.25)] pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#D4A373]">
                  Live Box Summary
                </span>
                <h3 className="font-[family-name:var(--font-serif)] text-xl font-bold text-[#FAF7F2]">
                  {state.recipientName ? `${state.recipientName}'s Box` : "Handcrafted Box"}
                </h3>
              </div>
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#B85B3A]/25 text-[#D4A373] border border-[#B85B3A]/40">
                {tier ? TIERS.find((t) => t.id === tier)?.name : "Pick Tier"}
              </span>
            </div>

            <div className="space-y-3.5 text-xs text-[#FAF7F2]/80">
              <div className="flex justify-between py-1 border-b border-white/10">
                <span className="text-[#FAF7F2]/60">For</span>
                <span className="font-semibold text-[#FAF7F2]">{state.recipientName || "—"}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/10">
                <span className="text-[#FAF7F2]/60">From</span>
                <span className="font-semibold text-[#FAF7F2]">{state.senderName || "—"}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/10">
                <span className="text-[#FAF7F2]/60">Occasion</span>
                <span className="font-semibold text-[#FAF7F2]">{state.occasion || "—"}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/10">
                <span className="text-[#FAF7F2]/60">Photo Cards</span>
                <span className="font-semibold text-[#D4A373]">{state.photos.length} uploaded</span>
              </div>
              {state.personalityTags.length > 0 && (
                <div className="pt-1">
                  <span className="block text-[11px] text-[#FAF7F2]/60 mb-2">Personality Tags</span>
                  <div className="flex flex-wrap gap-1.5">
                    {state.personalityTags.map((t) => (
                      <span key={t} className="rounded-md bg-[rgba(207,167,113,0.15)] px-2.5 py-1 text-[10px] font-medium text-[#D4A373] border border-[rgba(207,167,113,0.1)]">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-2 pt-3 border-t border-[rgba(212,163,115,0.25)]">
              <div className="flex justify-between text-xs text-[#FAF7F2]/70">
                <span>Tier Package</span>
                <span>{inr(totals.tierPrice)}</span>
              </div>
              {totals.addOnTotal > 0 && (
                <div className="flex justify-between text-xs text-[#FAF7F2]/70">
                  <span>Add-ons Total</span>
                  <span>+{inr(totals.addOnTotal)}</span>
                </div>
              )}
              <div className="flex justify-between text-xs text-[#FAF7F2]/70">
                <span>Shipping</span>
                <span>{totals.shipping === 0 ? "FREE" : inr(totals.shipping)}</span>
              </div>
              <div className="flex justify-between pt-3 text-base font-bold text-[#D4A373]">
                <span>Estimated Total</span>
                <span className="font-[family-name:var(--font-serif)] text-2xl text-[#D4A373]">{inr(totals.total)}</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
