import { useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { PackageOpen } from "lucide-react";
import { toast } from "sonner";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";
import { inr } from "@/lib/gift";

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
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

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
            const slug = data?.memories.find(
              (m: Record<string, unknown>) => m["order_id"] === o["id"],
            )?.["uuid_slug"] as string | undefined;
            return (
              <article key={String(o["id"])} className="paper-card p-5">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h2 className="text-xl font-semibold text-[#231C18]">
                    {String(o["recipient_name"])} · {String(o["tier_selected"])}
                  </h2>
                  <span className="text-sm font-semibold text-[#B85B3A]">
                    {inr(Number(o["total_amount"]))}
                  </span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  Order #{String(o["id"])} · Status:{" "}
                  <span className="capitalize font-medium text-foreground">
                    {String(o["payment_status"])}
                  </span>{" "}
                  · {new Date(String(o["created_at"])).toLocaleString("en-IN")}
                </p>
                {Boolean(o["card_message"]) && (
                  <p className="mt-3 rounded-xl bg-background p-3 text-sm italic">
                    “{String(o["card_message"])}”
                  </p>
                )}
                <div className="mt-4 flex flex-wrap gap-2 text-sm">
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
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
