import { useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { PackageOpen, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";
import { inr } from "@/lib/gift";
import { shortOrderId } from "@/lib/utils";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Your Orders — The Gift Architects" },
      {
        name: "description",
        content: "View your order history, track status, and access digital memory pages.",
      },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Your Orders — The Gift Architects" },
    ],
  }),
  component: AdminPage,
});

export default function AdminPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  const [orderToCancel, setOrderToCancel] = useState<Record<string, unknown> | null>(null);
  const [canceling, setCanceling] = useState(false);

  useEffect(() => {
    async function checkUser() {
      if (!isSupabaseConfigured) {
        setCheckingAuth(false);
        return;
      }
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        toast.error("Please sign in to view your orders.");
        void navigate({ to: "/login", search: { redirect: "/admin" } });
      } else {
        setUserId(user.id);
        setCheckingAuth(false);
      }
    }
    void checkUser();
  }, [navigate]);

  const { data, isLoading } = useQuery({
    queryKey: ["user-orders", userId],
    enabled: !checkingAuth,
    queryFn: async () => {
      if (!isSupabaseConfigured) {
        return { orders: [], memories: [] };
      }

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        return { orders: [], memories: [] };
      }

      const { data: orders, error } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      const orderIds = orders?.map((o) => o.id) ?? [];
      let memories: Array<Record<string, unknown>> = [];

      if (orderIds.length > 0) {
        const { data: memoryData } = await supabase
          .from("memories")
          .select("order_id, uuid_slug")
          .in("order_id", orderIds);
        memories = memoryData ?? [];
      }

      return { orders: orders ?? [], memories };
    },
  });

  const handleConfirmCancel = async () => {
    if (!orderToCancel) return;
    setCanceling(true);
    try {
      const orderIdVal = String(orderToCancel["id"]);
      const { error } = await supabase.from("orders").delete().eq("id", orderIdVal);
      if (error) throw error;

      toast.success(`Order #${shortOrderId(orderIdVal)} cancelled successfully`);
      setOrderToCancel(null);
      void queryClient.invalidateQueries({ queryKey: ["user-orders"] });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to cancel order");
    } finally {
      setCanceling(false);
    }
  };

  if (checkingAuth || isLoading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-16 text-center text-sm text-muted-foreground">
        Loading your order dashboard…
      </div>
    );
  }

  const ordersList = data?.orders ?? [];
  const memoriesCount = data?.memories?.length ?? 0;

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 md:py-16 space-y-10">
      {/* Editorial Header */}
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-[rgba(212,163,115,0.25)] pb-6">
        <div className="space-y-1.5">
          <span className="text-xs uppercase tracking-wider text-[#B85B3A] font-bold">
            Studio Orders Dashboard
          </span>
          <h1 className="font-[family-name:var(--font-serif)] text-3xl font-extrabold text-[#FAF7F2] md:text-4xl">
            Your Orders & Memories
          </h1>
          <p className="text-sm text-[#B8A99C]">
            Track your handcrafted gift box orders, letters, and digital memory links.
          </p>
        </div>
        <Link
          to="/build"
          className="rounded-full bg-[#B85B3A] px-6 py-3 text-sm font-semibold text-[#FAF7F2] shadow-md transition hover:bg-[#B85B3A]/90 hover:scale-[1.02]"
        >
          + Build a new box
        </Link>
      </div>

      {/* Translucent Glassmorphism Stat Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="paper-card paper-card-hover p-5 space-y-2">
          <span className="text-xs font-semibold text-[#6B5E55]">Total Gift Boxes</span>
          <p className="font-[family-name:var(--font-serif)] text-3xl font-bold text-[#231C18]">
            {ordersList.length}
          </p>
        </div>
        <div className="paper-card paper-card-hover p-5 space-y-2">
          <span className="text-xs font-semibold text-[#6B5E55]">Digital Memory Pages</span>
          <p className="font-[family-name:var(--font-serif)] text-3xl font-bold text-[#B85B3A]">
            {memoriesCount}
          </p>
        </div>
        <div className="paper-card paper-card-hover p-5 space-y-2">
          <span className="text-xs font-semibold text-[#6B5E55]">Studio Status</span>
          <div className="flex items-center gap-2 pt-1">
            <span className="size-2.5 rounded-full bg-[#708238] animate-pulse" />
            <span className="text-sm font-bold text-[#708238]">Active Dispatch</span>
          </div>
        </div>
      </div>

      {ordersList.length === 0 ? (
        <div className="paper-card p-12 text-center space-y-4">
          <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-[#B85B3A]/10 text-[#B85B3A]">
            <PackageOpen className="size-8" aria-hidden />
          </div>
          <h2 className="font-[family-name:var(--font-serif)] text-2xl font-bold text-[#231C18]">
            You haven't placed any orders yet
          </h2>
          <p className="mx-auto max-w-md text-sm text-[#6B5E55] leading-relaxed">
            Tell us who your gift is for and we'll handcraft a personalized box filled with photo
            cards and digital memory pages.
          </p>
          <div className="pt-2">
            <Link
              to="/build"
              className="inline-flex rounded-full bg-[#B85B3A] px-7 py-3.5 text-sm font-semibold text-[#FAF7F2] shadow-md transition hover:bg-[#B85B3A]/90 hover:scale-[1.02]"
            >
              Start Building a Box
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <h2 className="text-xs uppercase tracking-wider text-[#6B5E55] font-bold">
            Order History
          </h2>
          {ordersList.map((o: Record<string, unknown>) => {
            const rawId = String(o["id"]);
            const displayId = shortOrderId(rawId);
            const slug = data?.memories.find(
              (m: Record<string, unknown>) => m["order_id"] === o["id"],
            )?.["uuid_slug"] as string | undefined;

            return (
              <article key={rawId} className="paper-card paper-card-hover p-6 space-y-4">
                <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-[rgba(212,163,115,0.2)] pb-4">
                  <div className="flex items-center gap-3">
                    <span className="rounded-lg border border-[#B85B3A]/30 bg-[#B85B3A]/10 px-3 py-1 font-mono text-xs font-bold text-[#B85B3A]">
                      #TLB-{displayId}
                    </span>
                    <h3 className="font-[family-name:var(--font-serif)] text-xl font-bold text-[#231C18]">
                      {String(o["recipient_name"])} · {String(o["tier_selected"])} Tier
                    </h3>
                  </div>
                  <span className="font-[family-name:var(--font-serif)] text-xl font-bold text-[#B85B3A]">
                    {inr(Number(o["total_amount"]))}
                  </span>
                </div>

                <p className="text-xs text-[#2C221E] font-medium">
                  Status:{" "}
                  <span className="capitalize font-bold text-[#181310]">
                    {String(o["payment_status"])}
                  </span>{" "}
                  · Placed on {new Date(String(o["created_at"])).toLocaleString("en-IN")}
                </p>

                {Boolean(o["card_message"]) && (
                  <p className="rounded-xl bg-[#FAF9F6] border border-[rgba(24,19,16,0.15)] p-4 text-sm italic font-medium text-[#1C1612]">
                    “{String(o["card_message"])}”
                  </p>
                )}

                <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm pt-2 border-t border-[rgba(212,163,115,0.2)]">
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        void navigator.clipboard.writeText(String(o["card_message"] ?? ""));
                        toast.success("Letter text copied");
                      }}
                      className="rounded-full border border-[rgba(212,163,115,0.35)] bg-[#CFA771] px-4 py-2 text-xs font-semibold text-[#1C1612] transition hover:bg-[#B58A52]"
                    >
                      Copy letter
                    </button>
                    {slug && (
                      <Link
                        to="/memory/$id"
                        params={{ id: slug }}
                        className="rounded-full border border-[rgba(212,163,115,0.35)] bg-[#CFA771] px-4 py-2 text-xs font-semibold text-[#1C1612] transition hover:bg-[#B58A52]"
                      >
                        Open memory page
                      </Link>
                    )}
                    {slug && (
                      <a
                        href={`https://api.qrserver.com/v1/create-qr-code/?size=600x600&data=${encodeURIComponent(
                          `https://thegiftarchitects.gift/memory/${slug}`,
                        )}`}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-full border border-[rgba(212,163,115,0.35)] bg-[#CFA771] px-4 py-2 text-xs font-semibold text-[#1C1612] transition hover:bg-[#B58A52]"
                      >
                        Print QR Code
                      </a>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => setOrderToCancel(o)}
                    className="inline-flex items-center gap-1.5 rounded-full border border-red-200 bg-red-50/80 px-4 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-100 hover:text-red-700"
                  >
                    <Trash2 className="size-3.5" /> Cancel Order
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Cancel Order Confirmation Modal with subtle Backdrop Blur */}
      {orderToCancel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#181310]/80 p-4 backdrop-blur-lg">
          <div className="paper-card w-full max-w-md p-7 space-y-5 shadow-2xl border border-[rgba(24,19,16,0.3)]">
            <h3 className="font-[family-name:var(--font-serif)] text-2xl font-bold text-[#231C18]">
              Cancel Order
            </h3>
            <p className="text-sm text-[#6B5E55] leading-relaxed">
              Are you sure you want to cancel order{" "}
              <strong className="text-[#B85B3A] font-mono">
                #TLB-{shortOrderId(String(orderToCancel["id"]))}
              </strong>
              ? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                disabled={canceling}
                onClick={() => setOrderToCancel(null)}
                className="rounded-full border border-[rgba(212,163,115,0.35)] bg-[#CFA771] px-5 py-2.5 text-sm font-semibold text-[#1C1612] hover:bg-[#B58A52] disabled:opacity-50 transition"
              >
                Keep Order
              </button>
              <button
                type="button"
                disabled={canceling}
                onClick={() => void handleConfirmCancel()}
                className="rounded-full bg-red-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60 transition"
              >
                {canceling ? "Cancelling..." : "Yes, Cancel Order"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
