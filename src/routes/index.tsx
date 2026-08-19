import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { HeartHandshake, QrCode, Sparkles, Star } from "lucide-react";
import heroBox from "@/assets/hero-box.jpg";
import creatorImg from "@/assets/creator.jpg";
import { TIERS, inr } from "@/lib/gift";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "The Little Box — Person-first handmade gift boxes" },
      {
        name: "description",
        content:
          "You tell us who they are. We create what to give them. Handcrafted, personalised gift boxes with photo cards, artisan keepsakes and QR memory pages from ₹399.",
      },
      { property: "og:title", content: "The Little Box — Person-first handmade gift boxes" },
      {
        property: "og:description",
        content:
          "Turn their personality, photos and favourite memories into a 100% handcrafted gift box.",
      },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "The Little Box gift packages",
          itemListElement: TIERS.map((t, i) => ({
            "@type": "ListItem",
            position: i + 1,
            item: {
              "@type": "Product",
              name: t.name,
              description: t.includes.join(", "),
              offers: {
                "@type": "Offer",
                price: t.price,
                priceCurrency: "INR",
                availability: "https://schema.org/InStock",
              },
            },
          })),
        }),
      },
    ],
  }),
  component: Home,
});

const PILLARS = [
  {
    icon: HeartHandshake,
    title: "Person-first curation",
    body: "Tell us about their quirks, hobbies and the memories you two keep coming back to.",
  },
  {
    icon: Sparkles,
    title: "Artisan-crafted",
    body: "Every item is made by hand by verified, independent micro-creators — never mass-picked.",
  },
  {
    icon: QrCode,
    title: "Digital memory integration",
    body: "A tiny QR code opens a photo letter, a video message or your shared Spotify playlist.",
  },
];

const REVIEWS = [
  {
    name: "Ananya, Pune",
    text: "She cried at the photo cards. The letter card in real handwriting was the part that got her.",
  },
  {
    name: "Rohit, Bengaluru",
    text: "Scanned the QR and our whole trip playlist started playing. Worth every rupee.",
  },
  {
    name: "Meher, Delhi",
    text: "It genuinely looked like someone made it for my sister, not like something I ordered.",
  },
];

export default function Home() {
  return (
    <div className="space-y-12 pb-16">
      {/* ─── ATMOSPHERIC DARK STUDIO HERO ─── */}
      <section className="relative overflow-hidden bg-[#1C1612] px-4 py-16 text-[#FAF7F2] md:py-24">
        {/* Ambient Dark Studio Overlay Gradients */}
        <div
          className="pointer-events-none absolute -top-32 -left-32 size-[500px] rounded-full opacity-30"
          style={{
            background:
              "radial-gradient(circle, rgba(184, 91, 58, 0.35) 0%, transparent 70%)",
          }}
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -bottom-32 -right-32 size-[500px] rounded-full opacity-30"
          style={{
            background:
              "radial-gradient(circle, rgba(212, 163, 115, 0.3) 0%, transparent 70%)",
          }}
          aria-hidden
        />

        <div className="relative z-10 mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-[rgba(212,163,115,0.35)] bg-[rgba(212,163,115,0.12)] px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-[#D4A373]">
              ✨ Handmade in small batches · Ships across India
            </span>

            <h1 className="font-[family-name:var(--font-serif)] text-4xl font-extrabold leading-tight text-[#FAF7F2] md:text-5xl lg:text-6xl">
              You tell us who they are. <br className="hidden lg:inline" />
              <span className="text-[#D4A373]">We create what to give them.</span>
            </h1>

            <p className="max-w-lg text-base leading-relaxed text-[#FAF7F2]/80 md:text-lg">
              Move beyond generic catalogs. Turn their personality, photos, and favourite memories
              into a 100% handcrafted gift box.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                to="/build"
                className="rounded-full bg-[#B85B3A] px-7 py-3.5 text-sm font-semibold text-[#FAF7F2] shadow-lg shadow-[#B85B3A]/25 transition hover:scale-[1.02] hover:bg-[#B85B3A]/90 active:scale-[0.98]"
              >
                Build their gift box
              </Link>
              <a
                href="#pricing"
                className="rounded-full border border-[rgba(212,163,115,0.35)] bg-[rgba(35,28,24,0.6)] px-7 py-3.5 text-sm font-semibold text-[#FAF7F2] backdrop-blur-md transition hover:border-[#D4A373] hover:bg-[rgba(35,28,24,0.85)] hover:scale-[1.02]"
              >
                Explore package tiers
              </a>
            </div>
          </motion.div>

          {/* Floating Glassmorphism Preview Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="relative"
          >
            <div className="paper-card-hover relative rounded-3xl border border-[rgba(212,163,115,0.35)] bg-[rgba(35,28,24,0.7)] p-3 backdrop-blur-lg shadow-2xl">
              <img
                src={heroBox}
                width={1200}
                height={1200}
                alt="An open kraft paper gift box with photo cards, pressed flowers and a music plaque"
                className="rounded-2xl border border-[rgba(212,163,115,0.2)] object-cover shadow-inner"
              />
              <div className="absolute -bottom-4 -left-4 rounded-2xl border border-[rgba(212,163,115,0.35)] bg-[#1C1612]/90 p-4 text-xs backdrop-blur-md shadow-xl text-[#FAF7F2] flex items-center gap-3">
                <span className="flex size-8 items-center justify-center rounded-full bg-[#B85B3A]/20 text-[#D4A373]">
                  ✦
                </span>
                <div>
                  <p className="font-semibold text-[#D4A373]">Hand-Assembled Memory Box</p>
                  <p className="text-[#FAF7F2]/70">Photo cards · Artisan keepsakes · QR Memory</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── HOW IT WORKS SECTION ─── */}
      <section id="how-it-works" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-8">
        <div className="grid gap-6 md:grid-cols-3">
          {PILLARS.map(({ icon: Icon, title, body }) => (
            <article
              key={title}
              className="paper-card paper-card-hover p-7 transition hover:scale-[1.02] hover:border-[#D4A373]/50"
            >
              <div className="flex size-12 items-center justify-center rounded-2xl bg-[#B85B3A]/10 text-[#B85B3A]">
                <Icon className="size-6" aria-hidden />
              </div>
              <h2 className="mt-5 text-xl font-bold text-[#231C18]">{title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-[#6B5E55]">{body}</p>
            </article>
          ))}
        </div>
      </section>

      {/* ─── PRICING TIERS SECTION ─── */}
      <section id="pricing" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-10">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs uppercase tracking-wider text-[#B85B3A] font-semibold">
            Tailored Experiences
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#FAF7F2]">Three ways to say it</h2>
          <p className="text-sm text-[#B8A99C]">
            Every tier is built around the answers you give us — nothing is off-the-shelf.
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {TIERS.map((tier) => (
            <article
              key={tier.id}
              className="paper-card paper-card-hover flex flex-col p-7 transition hover:scale-[1.02]"
            >
              <h3 className="text-2xl font-bold text-[#231C18]">{tier.name}</h3>
              <p className="mt-1.5 text-xs text-[#6B5E55]">{tier.blurb}</p>
              <p className="mt-5 font-[family-name:var(--font-serif)] text-3xl font-bold text-[#B85B3A]">
                {inr(tier.price)}
              </p>
              <ul className="mt-6 flex-1 space-y-2.5 text-sm text-[#6B5E55]">
                {tier.includes.map((line) => (
                  <li key={line} className="flex items-start gap-2.5">
                    <span className="mt-1.5 size-2 shrink-0 rounded-full bg-[#708238]" />
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
              <Link
                to="/build"
                search={{ tier: tier.id }}
                className="mt-8 rounded-full bg-[#B85B3A] px-5 py-3 text-center text-sm font-semibold text-[#FAF7F2] transition hover:bg-[#B85B3A]/90 hover:shadow-md"
              >
                Select package
              </Link>
            </article>
          ))}
        </div>
      </section>

      {/* ─── REVIEWS CAROUSEL / GRID SECTION ─── */}
      <section className="mx-auto max-w-6xl px-4 py-8">
        <h2 className="text-3xl font-bold text-[#FAF7F2]">Unboxed by real people</h2>
        <div className="mt-6 flex snap-x gap-5 overflow-x-auto pb-4">
          {REVIEWS.map((r) => (
            <blockquote
              key={r.name}
              className="paper-card paper-card-hover w-[290px] shrink-0 snap-start p-7 sm:w-[350px]"
            >
              <div className="flex gap-1 text-[#D4A373]" aria-label="5 out of 5 stars">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="size-4 fill-current" aria-hidden />
                ))}
              </div>
              <p className="mt-4 text-sm leading-relaxed text-[#231C18] italic">“{r.text}”</p>
              <footer className="mt-5 text-xs font-semibold text-[#B85B3A]">— {r.name}</footer>
            </blockquote>
          ))}
        </div>
      </section>

      {/* ─── CREATOR BANNER SECTION ─── */}
      <section className="mx-auto max-w-6xl px-4 pt-4">
        <div className="paper-card paper-card-hover grid items-center gap-6 overflow-hidden md:grid-cols-2">
          <img
            src={creatorImg}
            width={1200}
            height={800}
            loading="lazy"
            alt="An artisan tying twine around a kraft paper parcel"
            className="h-full w-full object-cover min-h-[260px]"
          />
          <div className="p-8 md:p-12 space-y-3">
            <span className="text-xs uppercase tracking-wider text-[#708238] font-bold">
              Fair & Artisanal
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-[#231C18]">Made by hands, not warehouses</h2>
            <p className="text-sm leading-relaxed text-[#6B5E55]">
              Every keepsake in a box is made by an independent maker we know by name, paid fairly
              and credited inside the box. When you gift, two stories get told.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
