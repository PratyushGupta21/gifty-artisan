import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";
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

function TrackPage() {
  const [orderId, setOrderId] = useState("");
  const [order, setOrder] = useState<Record<string, unknown> | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  async function lookup() {
    setMessage(null);
    setOrder(null);
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("id", orderId.trim())
      .maybeSingle();
    if (error || !data) {
      setMessage("We couldn't find that order ID.");
      return;
    }
    setOrder(data as Record<string, unknown>);
  }

  const currentIndex = order
    ? Math.max(
        0,
        STAGES.findIndex((s) => s.id === (order["fulfilment_status"] as string)),
      )
    : -1;

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="text-3xl">Track your box</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Paste the order ID from your confirmation — we also send updates on WhatsApp.
      </p>

      <div className="mt-6 flex gap-2">
        <label className="sr-only" htmlFor="order-id">
          Order ID
        </label>
        <input
          id="order-id"
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
          placeholder="Order ID"
          className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-ring"
        />
        <button
          type="button"
          onClick={() => void lookup()}
          className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground"
        >
          Track
        </button>
      </div>

      {message && <p className="mt-4 text-sm text-muted-foreground">{message}</p>}

      {order && (
        <div className="paper-card mt-8 p-6">
          <p className="text-sm text-muted-foreground">
            {String(order["tier_selected"])} box for {String(order["recipient_name"])} ·{" "}
            {inr(Number(order["total_amount"]))}
          </p>
          <ol className="mt-6 space-y-4">
            {STAGES.map((stage, i) => (
              <li key={stage.id} className="flex items-center gap-3">
                <span
                  className={cn(
                    "size-3 rounded-full",
                    i <= currentIndex ? "bg-primary" : "bg-border",
                  )}
                />
                <span className={cn("text-sm", i <= currentIndex ? "" : "text-muted-foreground")}>
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
