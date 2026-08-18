import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { inr } from "@/lib/gift";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Studio queue — The Little Box" },
      {
        name: "description",
        content: "Internal crafting queue: orders, letters, photo downloads and memory QR links.",
      },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Studio queue — The Little Box" },
      { property: "og:description", content: "Internal crafting queue for the studio team." },
    ],
  }),
  component: AdminPage,
});

function AdminPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["admin-orders"],
    queryFn: async () => {
      const { data: orders, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50);
      if (error) throw error;
      const { data: memories } = await supabase.from("memories").select("order_id, uuid_slug");
      return { orders: orders ?? [], memories: memories ?? [] };
    },
  });

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="text-3xl">Studio queue</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Latest 50 orders. Copy letter text, open photos and grab the memory link for QR printing.
      </p>

      {isLoading && <p className="mt-8 text-sm text-muted-foreground">Loading queue…</p>}

      <div className="mt-8 space-y-4">
        {data?.orders.map((o: Record<string, unknown>) => {
          const slug = data.memories.find(
            (m: Record<string, unknown>) => m["order_id"] === o["id"],
          )?.["uuid_slug"] as string | undefined;
          return (
            <article key={String(o["id"])} className="paper-card p-5">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h2 className="text-xl">
                  {String(o["recipient_name"])} · {String(o["tier_selected"])}
                </h2>
                <span className="text-sm text-primary">{inr(Number(o["total_amount"]))}</span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                {String(o["id"])} · {String(o["payment_status"])} ·{" "}
                {new Date(String(o["created_at"])).toLocaleString("en-IN")}
              </p>
              {Boolean(o["card_message"]) && (
                <p className="mt-3 rounded-xl bg-background p-3 text-sm italic">
                  {String(o["card_message"])}
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
                  <a
                    href={`/memory/${slug}`}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full border border-border bg-background px-4 py-2 hover:border-accent"
                  >
                    Open memory page
                  </a>
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
    </div>
  );
}
