import { useMemo, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Loader2, Truck } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { Chip } from "@/components/craft/Chip";
import { PhotoUploader } from "@/components/craft/PhotoUploader";
import { useBuilder } from "@/lib/builder-store";
import { supabase } from "@/lib/supabase";
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
      { title: "Build their gift box — The Little Box" },
      {
        name: "description",
        content:
          "A four-step builder: tell us about them, add photos and memories, pick a tier, and we handcraft the rest.",
      },
      { property: "og:title", content: "Build their gift box — The Little Box" },
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
  "w-full rounded-xl border border-border bg-card px-4 py-3 text-sm outline-none transition focus:border-accent focus:ring-2 focus:ring-ring";

function BuildPage() {
  const search = Route.useSearch();
  const navigate = useNavigate();
  const { state, set, toggle, reset } = useBuilder();
  const [step, setStep] = useState(search.tier ? 2 : 0);
  const [submitting, setSubmitting] = useState(false);
  const [pinResult, setPinResult] = useState<string | null>(null);

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
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
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
        await supabase.from("memory_photos").insert(
          state.photos.map((photo_url) => ({ memory_id: memory.id, photo_url })),
        );
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
    <div className="mx-auto max-w-3xl px-4 py-8 md:py-12">
      <h1 className="text-3xl">Build their gift box</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Four short steps. Your answers save automatically.
      </p>

      <ol className="mt-6 flex flex-wrap gap-2" aria-label="Progress">
        {STEPS.map((label, i) => (
          <li key={label} className="flex-1">
            <button
              type="button"
              onClick={() => setStep(i)}
              aria-current={step === i ? "step" : undefined}
              className={cn(
                "w-full rounded-full border px-3 py-2 text-xs font-medium transition",
                i === step
                  ? "border-primary bg-primary text-primary-foreground"
                  : i < step
                    ? "border-secondary bg-secondary/15 text-foreground"
                    : "border-border bg-card text-muted-foreground",
              )}
            >
              {i + 1}. {label}
            </button>
          </li>
        ))}
      </ol>

      <AnimatePresence mode="wait">
        <motion.section
          key={step}
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -24 }}
          transition={{ duration: 0.25 }}
          className="paper-card mt-6 space-y-6 p-5 md:p-8"
        >
          {step === 0 && (
            <>
              <h2 className="text-2xl">Who is this for?</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-sm">
                  <span className="mb-1.5 block font-medium">Recipient's name</span>
                  <input
                    className={inputClass}
                    value={state.recipientName}
                    onChange={(e) => set({ recipientName: e.target.value })}
                    placeholder="Aarohi"
                  />
                </label>
                <label className="block text-sm">
                  <span className="mb-1.5 block font-medium">Your name</span>
                  <input
                    className={inputClass}
                    value={state.senderName}
                    onChange={(e) => set({ senderName: e.target.value })}
                    placeholder="Kabir"
                  />
                </label>
                <label className="block text-sm">
                  <span className="mb-1.5 block font-medium">Relationship</span>
                  <select
                    className={inputClass}
                    value={state.relationship}
                    onChange={(e) => set({ relationship: e.target.value })}
                  >
                    <option value="">Select</option>
                    {RELATIONSHIPS.map((r) => (
                      <option key={r}>{r}</option>
                    ))}
                  </select>
                </label>
                <label className="block text-sm">
                  <span className="mb-1.5 block font-medium">Occasion</span>
                  <select
                    className={inputClass}
                    value={state.occasion}
                    onChange={(e) => set({ occasion: e.target.value })}
                  >
                    <option value="">Select</option>
                    {OCCASIONS.map((o) => (
                      <option key={o}>{o}</option>
                    ))}
                  </select>
                </label>
              </div>
              <fieldset>
                <legend className="mb-3 text-sm font-medium">What are they like?</legend>
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
              <h2 className="text-2xl">Memories & personalisation</h2>
              <label className="block text-sm">
                <span className="mb-1.5 block font-medium">
                  Describe an inside joke, cherished memory, or the feeling you want this box to
                  carry
                </span>
                <textarea
                  className={cn(inputClass, "min-h-32")}
                  value={state.insideJoke}
                  onChange={(e) => set({ insideJoke: e.target.value })}
                />
              </label>
              <div>
                <p className="mb-2 text-sm font-medium">Photos for their cards</p>
                <PhotoUploader photos={state.photos} onChange={(photos) => set({ photos })} />
              </div>
              <label className="block text-sm">
                <span className="mb-1.5 block font-medium">Spotify track or playlist link</span>
                <input
                  className={inputClass}
                  value={state.spotifyUrl}
                  onChange={(e) => set({ spotifyUrl: e.target.value })}
                  placeholder="https://open.spotify.com/track/..."
                />
              </label>
              <label className="block text-sm">
                <span className="mb-1.5 block font-medium">
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
              <h2 className="text-2xl">Choose a tier</h2>
              <div className="grid gap-4">
                {TIERS.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => set({ tier: t.id as TierId })}
                    aria-pressed={tier === t.id}
                    className={cn(
                      "rounded-2xl border p-5 text-left transition",
                      tier === t.id
                        ? "border-primary bg-accent/20 ring-2 ring-ring"
                        : "border-border bg-background hover:border-accent",
                    )}
                  >
                    <div className="flex items-baseline justify-between gap-3">
                      <span className="font-[family-name:var(--font-display)] text-xl">
                        {t.name}
                      </span>
                      <span className="font-semibold text-primary">{inr(t.price)}</span>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">{t.includes.join(" · ")}</p>
                  </button>
                ))}
              </div>
              <fieldset className="space-y-3">
                <legend className="text-sm font-medium">Add-ons</legend>
                {ADD_ONS.map((a) => (
                  <label
                    key={a.id}
                    className="flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-border bg-background px-4 py-3 text-sm"
                  >
                    <span className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        className="size-4 accent-[var(--color-primary)]"
                        checked={state.addOns.includes(a.id)}
                        onChange={() => toggle("addOns", a.id)}
                      />
                      {a.label}
                    </span>
                    <span className="text-muted-foreground">+{inr(a.price)}</span>
                  </label>
                ))}
              </fieldset>
              <p className="text-right font-[family-name:var(--font-display)] text-2xl">
                {inr(totals.total)}
              </p>
            </>
          )}

          {step === 3 && (
            <>
              <h2 className="text-2xl">Review your box</h2>
              <div className="rounded-2xl border border-border bg-background p-5">
                <p className="text-sm text-muted-foreground">
                  For <strong className="text-foreground">{state.recipientName || "—"}</strong>
                  {state.occasion ? ` · ${state.occasion}` : ""}
                  {state.relationship ? ` · ${state.relationship}` : ""}
                </p>
                {state.photos.length > 0 && (
                  <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {state.photos.slice(0, 8).map((p) => (
                      <li
                        key={p}
                        className="rounded-lg border border-border bg-card p-2 shadow-paper"
                      >
                        <img
                          src={p}
                          alt="Photo card preview"
                          loading="lazy"
                          className="aspect-square w-full rounded object-cover"
                        />
                        <span className="mt-1 block truncate text-[10px] text-muted-foreground">
                          photo card
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
                {state.cardMessage && (
                  <p className="mt-4 rounded-xl bg-card p-4 text-sm italic">
                    “{state.cardMessage}”
                  </p>
                )}
              </div>

              <dl className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt>Package</dt>
                  <dd>{inr(totals.tierPrice)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt>Add-ons</dt>
                  <dd>{inr(totals.addOnTotal)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt>Shipping {totals.shipping === 0 && "(free over ₹999)"}</dt>
                  <dd>{inr(totals.shipping)}</dd>
                </div>
                <div className="flex justify-between border-t border-border pt-2 text-base font-semibold">
                  <dt>Total</dt>
                  <dd>{inr(totals.total)}</dd>
                </div>
              </dl>

              <div className="flex flex-wrap items-center gap-2">
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
                  className="rounded-full border border-border bg-card px-4 py-3 text-sm hover:border-accent"
                >
                  Check delivery
                </button>
                {pinResult && (
                  <span className="flex items-center gap-2 text-sm text-secondary">
                    <Truck className="size-4" aria-hidden /> {pinResult}
                  </span>
                )}
              </div>

              <button
                type="button"
                disabled={submitting}
                onClick={() => void placeOrder()}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 font-semibold text-primary-foreground disabled:opacity-60"
              >
                {submitting ? (
                  <Loader2 className="size-4 animate-spin" aria-hidden />
                ) : (
                  <Check className="size-4" aria-hidden />
                )}
                Place order · {inr(totals.total)}
              </button>
              <p className="text-center text-xs text-muted-foreground">
                UPI, cards, netbanking and wallets supported at payment.
              </p>
            </>
          )}

          <div className="flex justify-between gap-3 pt-2">
            <button
              type="button"
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              disabled={step === 0}
              className="rounded-full border border-border bg-background px-5 py-2.5 text-sm disabled:opacity-40"
            >
              Back
            </button>
            {step < 3 && (
              <button
                type="button"
                onClick={next}
                className="rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground"
              >
                Continue
              </button>
            )}
          </div>
        </motion.section>
      </AnimatePresence>
    </div>
  );
}
