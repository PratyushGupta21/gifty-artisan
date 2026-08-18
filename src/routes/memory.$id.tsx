import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Mail } from "lucide-react";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/memory/$id")({
  head: () => ({
    meta: [
      { title: "A memory box was made for you — The Little Box" },
      {
        name: "description",
        content: "A private digital memory page with photos, a letter and a song, made by hand.",
      },
      { property: "og:title", content: "A memory box was made for you" },
      {
        property: "og:description",
        content: "Open your personal photo letter, playlist and gallery.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: MemoryPage,
});

function spotifyEmbed(url: string) {
  try {
    const u = new URL(url);
    if (!u.hostname.includes("spotify.com")) return null;
    return `https://open.spotify.com/embed${u.pathname}`;
  } catch {
    return null;
  }
}

function Typewriter({ text }: { text: string }) {
  const [shown, setShown] = useState("");
  useEffect(() => {
    setShown("");
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setShown(text.slice(0, i));
      if (i >= text.length) clearInterval(id);
    }, 28);
    return () => clearInterval(id);
  }, [text]);
  return (
    <p className="whitespace-pre-wrap font-[family-name:var(--font-display)] text-lg leading-relaxed">
      {shown}
      <span className="animate-pulse">|</span>
    </p>
  );
}

function MemoryPage() {
  const { id } = Route.useParams();
  const [opened, setOpened] = useState(false);

  const { data, isLoading, error } = useQuery({
    queryKey: ["memory", id],
    queryFn: async () => {
      const { data: memory, error: memErr } = await supabase
        .from("memories")
        .select("*")
        .eq("uuid_slug", id)
        .maybeSingle();
      if (memErr) throw memErr;
      if (!memory) return null;
      const { data: photos } = await supabase
        .from("memory_photos")
        .select("photo_url")
        .eq("memory_id", memory.order_id ?? memory.id);
      return { memory, photos: photos ?? [] };
    },
  });

  if (isLoading) {
    return <p className="p-16 text-center text-muted-foreground">Unwrapping…</p>;
  }
  if (error || !data) {
    return (
      <div className="p-16 text-center">
        <h1 className="text-2xl">This memory page isn't available</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          The link may be mistyped or the box hasn't shipped yet.
        </p>
      </div>
    );
  }

  const { memory, photos } = data;
  const embed = memory.spotify_url ? spotifyEmbed(memory.spotify_url) : null;

  if (!opened) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
        <motion.button
          onClick={() => setOpened(true)}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ y: -6, rotate: -1 }}
          className="paper-card flex flex-col items-center gap-4 px-10 py-14"
        >
          <Mail className="size-10 text-primary" aria-hidden />
          <span className="font-[family-name:var(--font-display)] text-2xl">
            For {memory.recipient_name}
          </span>
          <span className="text-sm text-muted-foreground">Tap to open your envelope</span>
        </motion.button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto max-w-3xl px-4 py-12"
    >
      <h1 className="text-3xl">
        A special memory box created for {memory.recipient_name}
        {memory.sender_name ? ` by ${memory.sender_name}` : ""}
      </h1>

      {embed && (
        <iframe
          title="Their song"
          src={embed}
          className="mt-6 h-[152px] w-full rounded-2xl border border-border"
          loading="lazy"
          allow="encrypted-media"
        />
      )}

      {photos.length > 0 && (
        <div className="mt-8 columns-2 gap-4 sm:columns-3 [&>*]:mb-4">
          {photos.map((p: { photo_url: string }) => (
            <img
              key={p.photo_url}
              src={p.photo_url}
              alt="A shared memory"
              loading="lazy"
              className="w-full break-inside-avoid rounded-2xl border border-border shadow-paper"
            />
          ))}
        </div>
      )}

      {memory.letter_text && (
        <div className="paper-card mt-8 p-6 md:p-10">
          <Typewriter text={memory.letter_text} />
        </div>
      )}
    </motion.div>
  );
}
