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
      { title: "Your Orders — The Little Box" },
      {
        name: "description",
        content: "View your order history, track status, and access digital memory pages.",
      },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Your Orders — The Little Box" },
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

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <div className="flex flex-wrap items-baseline justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#231C18]">Your Dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Track your handcrafted gift box orders, letters, and memory QR links.
          </p>
        </div>
        <Link
          to="/build"
          className="rounded-full bg-[#B85B3A] px-5 py-2.5 text-sm font-semibold text-[#FBF8F3] transition hover:bg-[#B85B3A]/90"
        >
          + Build a new box
        </Link>
      </div>

      {ordersList.length === 0 ? (
        <div className="paper-card mt-10 p-12 text-center">
          <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-[#B85B3A]/10 text-[#B85B3A]">
            <PackageOpen className="size-7" aria-hidden />
          </div>
          <h2 className="mt-4 text-xl font-semibold text-[#231C18]">
            You haven't placed any orders yet
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
            Tell us who your gift is for and we'll handcraft a personalized box filled with photo
            cards and digital memory pages.
          </p>
          <div className="mt-6">
            <Link
              to="/build"
              className="inline-flex rounded-full bg-[#B85B3A] px-6 py-3 text-sm font-semibold text-[#FBF8F3] shadow-paper transition hover:bg-[#B85B3A]/90"
            >
              Start Building a Box
            </Link>
          </div>
        </div>
      ) : (
        <div className="mt-8 space-y-4">
          {ordersList.map((o: Record<string, unknown>) => {
            const rawId = String(o["id"]);
            const displayId = shortOrderId(rawId);
            const slug = data?.memories.find(
              (m: Record<string, unknown>) => m["order_id"] === o["id"],
            )?.["uuid_slug"] as string | undefined;

            return (
              <article key={rawId} className="paper-card p-5">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <span className="rounded-md bg-[#B85B3A]/10 px-2.5 py-1 font-mono text-xs font-bold text-[#B85B3A]">
                      #{displayId}
                    </span>
                    <h2 className="text-xl font-semibold text-[#231C18]">
                      {String(o["recipient_name"])} · {String(o["tier_selected"])}
                    </h2>
                  </div>
                  <span className="text-sm font-semibold text-[#B85B3A]">
                    {inr(Number(o["total_amount"]))}
                  </span>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  Status:{" "}
                  <span className="capitalize font-medium text-foreground">
                    {String(o["payment_status"])}
                  </span>{" "}
                  · Placed on {new Date(String(o["created_at"])).toLocaleString("en-IN")}
                </p>
                {Boolean(o["card_message"]) && (
                  <p className="mt-3 rounded-xl bg-background p-3 text-sm italic">
                    “{String(o["card_message"])}”
                  </p>
                )}
                <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-sm pt-1 border-t border-border/40">
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        void navigator.clipboard.writeText(String(o["card_message"] ?? ""));
                        toast.success("Letter text copied");
                      }}
                      className="rounded-full border border-border bg-background px-4 py-2 hover:border-accent"
                    >
                      Copy letter
                    </button>
                    {slug && (
                      <Link
                        to="/memory/$id"
                        params={{ id: slug }}
                        className="rounded-full border border-border bg-background px-4 py-2 hover:border-accent"
                      >
                        Open memory page
                      </Link>
                    )}
                    {slug && (
                      <a
                        href={`https://api.qrserver.com/v1/create-qr-code/?size=600x600&data=${encodeURIComponent(
                          `https://thelittlebox.gift/memory/${slug}`,
                        )}`}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-full border border-border bg-background px-4 py-2 hover:border-accent"
                      >
                        Print QR
                      </a>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => setOrderToCancel(o)}
                    className="inline-flex items-center gap-1.5 rounded-full border border-red-200 bg-red-50 px-4 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-100 hover:text-red-700"
                  >
                    <Trash2 className="size-3.5" /> Cancel Order
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Cancel Order Confirmation Modal */}
      {orderToCancel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="paper-card w-full max-w-md p-6 space-y-4 bg-white shadow-paper-lg">
            <h3 className="text-xl font-bold text-[#231C18]">Cancel Order</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Are you sure you want to cancel order{" "}
              <strong className="text-[#231C18]">
                #{shortOrderId(String(orderToCancel["id"]))}
              </strong>
              ? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                disabled={canceling}
                onClick={() => setOrderToCancel(null)}
                className="rounded-full border border-border px-4 py-2 text-sm font-medium hover:bg-accent disabled:opacity-50"
              >
                Keep Order
              </button>
              <button
                type="button"
                disabled={canceling}
                onClick={() => void handleConfirmCancel()}
                className="rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
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
