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
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="text-3xl font-bold text-[#231C18]">Track your box</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Paste the order ID (e.g. <span className="font-mono font-semibold text-[#B85B3A]">TLB-8F4A2C</span>) from your confirmation screen.
      </p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          void lookup();
        }}
        className="mt-6 flex gap-2"
      >
        <label className="sr-only" htmlFor="order-id">
          Order ID
        </label>
        <input
          id="order-id"
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
          placeholder="e.g. TLB-8F4A2C"
          className="w-full rounded-xl border border-[#E8DFC8] bg-card px-4 py-3 text-sm outline-none transition focus:border-[#B85B3A] focus:ring-2 focus:ring-[#B85B3A]/20"
        />
        <button
          type="submit"
          disabled={loading}
          className="rounded-full bg-[#B85B3A] px-6 py-3 text-sm font-semibold text-[#FBF8F3] transition hover:bg-[#B85B3A]/90 disabled:opacity-60"
        >
          {loading ? "Searching..." : "Track"}
        </button>
      </form>

      {message && <p className="mt-4 text-sm text-muted-foreground">{message}</p>}

      {order && (
        <div className="paper-card mt-8 p-6 space-y-6">
          <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-border/50 pb-4">
            <div>
              <span className="inline-block rounded-md bg-[#B85B3A]/10 px-2.5 py-1 font-mono text-xs font-bold text-[#B85B3A]">
                #{shortOrderId(String(order["id"]))}
              </span>
              <h2 className="mt-2 text-xl font-bold text-[#231C18]">
                {String(order["tier_selected"])} box for {String(order["recipient_name"])}
              </h2>
            </div>
            <span className="text-lg font-bold text-[#B85B3A]">
              {inr(Number(order["total_amount"]))}
            </span>
          </div>

          <ol className="space-y-4">
            {STAGES.map((stage, i) => (
              <li key={stage.id} className="flex items-center gap-3">
                <span
                  className={cn(
                    "size-3.5 rounded-full transition-colors",
                    i <= currentIndex ? "bg-[#B85B3A]" : "bg-border",
                  )}
                />
                <span
                  className={cn(
                    "text-sm font-medium",
                    i <= currentIndex ? "text-[#231C18]" : "text-muted-foreground",
                  )}
                >
                  {stage.label}
                </span>
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}
