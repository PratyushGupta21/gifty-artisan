import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { supabase } from "@/lib/supabase";
import { cn, shortOrderId } from "@/lib/utils";
import { inr } from "@/lib/gift";

export const Route = createFileRoute("/track")({
  head: () => ({
    meta: [
      { title: "Track your gift box — The Little Box" },
      {
        name: "description",
        content:
          "Follow your handcrafted box from received to delivered, with WhatsApp updates at every stage.",
      },
      { property: "og:title", content: "Track your gift box — The Little Box" },
      {
        property: "og:description",
        content: "See exactly where your handcrafted box is in our studio.",
      },
    ],
  }),
  component: TrackPage,
});

const STAGES = [
  { id: "received", label: "Order received" },
  { id: "crafting", label: "Being handcrafted" },
  { id: "packed", label: "Packed with love" },
  { id: "dispatched", label: "Dispatched" },
  { id: "delivered", label: "Delivered" },
];

export default function TrackPage() {
  const [orderId, setOrderId] = useState("");
  const [order, setOrder] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function lookup() {
    const input = orderId.trim();
    if (!input) {
      setMessage("Please enter an Order ID.");
      return;
    }

    setMessage(null);
    setOrder(null);
    setLoading(true);

    try {
      const cleanHex = input.replace(/^TLB-/i, "").toLowerCase();

      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .ilike("id", `${cleanHex}%`)
        .limit(1)
        .maybeSingle();

      if (error || !data) {
        setMessage("We couldn't find an order matching that ID. Please check your confirmation.");
        return;
      }
      setOrder(data as Record<string, unknown>);
    } catch {
      setMessage("An error occurred while tracking your order.");
    } finally {
      setLoading(false);
    }
  }

  const currentIndex = order
    ? Math.max(
        0,
        STAGES.findIndex((s) => s.id === (order["fulfilment_status"] as string)),
      )
    : 0;

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 md:py-16 space-y-8">
      {/* Editorial Header */}
      <div className="space-y-2 text-left">
        <span className="text-xs uppercase tracking-wider text-[#B85B3A] font-bold">
          Studio Fulfilment Tracker
        </span>
        <h1 className="font-[family-name:var(--font-serif)] text-3xl font-extrabold text-[#231C18] md:text-4xl">
          Track your box
        </h1>
        <p className="text-sm text-[#6B5E55]">
          Paste the order ID (e.g. <span className="font-mono font-semibold text-[#B85B3A]">TLB-8F4A2C</span>) from your confirmation screen or dashboard.
        </p>
      </div>

      {/* Lookup Card */}
      <div className="paper-card p-6 md:p-8">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void lookup();
          }}
          className="flex flex-col sm:flex-row gap-3"
        >
          <label className="sr-only" htmlFor="order-id">
            Order ID
          </label>
          <input
            id="order-id"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            placeholder="e.g. TLB-8F4A2C"
            className="w-full rounded-xl border border-[rgba(212,163,115,0.35)] bg-[rgba(207,167,113,0.92)] px-4 py-3 text-sm text-[#1C1612] outline-none transition duration-200 focus:border-[#B85B3A] focus:ring-2 focus:ring-[#D4A373]/30 focus:shadow-[0_0_15px_rgba(212,163,115,0.25)]"
          />
          <button
            type="submit"
            disabled={loading}
            className="rounded-full bg-[#B85B3A] px-7 py-3 text-sm font-semibold text-[#FAF7F2] shadow-md transition hover:bg-[#B85B3A]/90 hover:scale-[1.02] disabled:opacity-60 shrink-0"
          >
            {loading ? "Searching..." : "Track Order"}
          </button>
        </form>

        {message && <p className="mt-4 text-sm text-[#B91C18] font-medium">{message}</p>}
      </div>

      {order && (
        <div className="paper-card paper-card-hover p-6 md:p-8 space-y-6">
          <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-[rgba(212,163,115,0.25)] pb-5">
            <div>
              <span className="inline-block rounded-lg border border-[#B85B3A]/30 bg-[#B85B3A]/10 px-3 py-1 font-mono text-xs font-bold text-[#B85B3A]">
                #TLB-{shortOrderId(String(order["id"]))}
              </span>
              <h2 className="mt-2.5 font-[family-name:var(--font-serif)] text-2xl font-bold text-[#231C18]">
                {String(order["tier_selected"])} box for {String(order["recipient_name"])}
              </h2>
            </div>
            <span className="font-[family-name:var(--font-serif)] text-2xl font-bold text-[#B85B3A]">
              {inr(Number(order["total_amount"]))}
            </span>
          </div>

          <div className="space-y-4">
            <h3 className="text-xs uppercase tracking-wider text-[#6B5E55] font-bold">
              Crafting Stage Timeline
            </h3>
            <ol className="space-y-4">
              {STAGES.map((stage, i) => (
                <li key={stage.id} className="flex items-center gap-3.5">
                  <span
                    className={cn(
                      "size-4 rounded-full transition-all duration-300 flex items-center justify-center text-[9px] font-bold text-white",
                      i <= currentIndex ? "bg-[#B85B3A] shadow-sm shadow-[#B85B3A]/40 scale-110" : "bg-[rgba(212,163,115,0.3)]",
                    )}
                  >
                    {i <= currentIndex ? "✓" : ""}
                  </span>
                  <span
                    className={cn(
                      "text-sm font-semibold transition-colors",
                      i <= currentIndex ? "text-[#231C18]" : "text-[#6B5E55]/60",
                    )}
                  >
                    {stage.label}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      )}
    </div>
  );
}
