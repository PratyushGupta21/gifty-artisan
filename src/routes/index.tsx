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
    <div>
      <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-12 md:grid-cols-2 md:py-20">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground">
            Handmade in small batches · Ships across India
          </span>
          <h1 className="mt-5 text-4xl leading-tight md:text-5xl">
            You tell us who they are. We create what to give them.
          </h1>
          <p className="mt-4 max-w-lg text-muted-foreground">
            Move beyond generic catalogs. Turn their personality, photos and favourite memories
            into a 100% handcrafted gift box.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              to="/build"
              className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-paper transition hover:bg-primary/90"
            >
              Build their gift box
            </Link>
            <a
              href="#tiers"
              className="rounded-full border border-border bg-card px-6 py-3 text-sm font-semibold hover:border-accent"
            >
              Explore package tiers
            </a>
          </div>
        </motion.div>
        <motion.img
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          src={heroBox}
          width={1200}
          height={1200}
          alt="An open kraft paper gift box with photo cards, pressed flowers and a music plaque"
          className="rounded-3xl border border-border shadow-paper-lg"
        />
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10">
        <div className="grid gap-4 md:grid-cols-3">
          {PILLARS.map(({ icon: Icon, title, body }) => (
            <article
              key={title}
              className="paper-card p-6 transition hover:-translate-y-1 hover:shadow-paper-lg"
            >
              <Icon className="size-6 text-primary" aria-hidden />
              <h2 className="mt-4 text-xl">{title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{body}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="tiers" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-12">
        <h2 className="text-3xl">Three ways to say it</h2>
        <p className="mt-2 text-muted-foreground">
          Every tier is built around the answers you give us — nothing is off-the-shelf.
        </p>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {TIERS.map((tier) => (
            <article key={tier.id} className="paper-card flex flex-col p-6">
              <h3 className="text-2xl">{tier.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{tier.blurb}</p>
              <p className="mt-4 font-[family-name:var(--font-display)] text-3xl text-primary">
                {inr(tier.price)}
              </p>
              <ul className="mt-5 flex-1 space-y-2 text-sm text-muted-foreground">
                {tier.includes.map((line) => (
                  <li key={line} className="flex gap-2">
                    <span className="mt-2 size-1.5 shrink-0 rounded-full bg-secondary" />
                    {line}
                  </li>
                ))}
              </ul>
              <Link
                to="/build"
                search={{ tier: tier.id }}
                className="mt-6 rounded-full bg-primary px-5 py-3 text-center text-sm font-semibold text-primary-foreground hover:bg-primary/90"
              >
                Select package
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="text-3xl">Unboxed by real people</h2>
        <div className="mt-6 flex snap-x gap-4 overflow-x-auto pb-4">
          {REVIEWS.map((r) => (
            <blockquote
              key={r.name}
              className="paper-card w-[280px] shrink-0 snap-start p-6 sm:w-[340px]"
            >
              <div className="flex gap-1 text-primary" aria-label="5 out of 5 stars">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="size-4 fill-current" aria-hidden />
                ))}
              </div>
              <p className="mt-3 text-sm">{r.text}</p>
              <footer className="mt-4 text-xs text-muted-foreground">{r.name}</footer>
            </blockquote>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16">
        <div className="paper-card grid items-center gap-6 overflow-hidden md:grid-cols-2">
          <img
            src={creatorImg}
            width={1200}
            height={800}
            loading="lazy"
            alt="An artisan tying twine around a kraft paper parcel"
            className="h-full w-full object-cover"
          />
          <div className="p-6 md:p-10">
            <h2 className="text-2xl">Made by hands, not warehouses</h2>
            <p className="mt-3 text-sm text-muted-foreground">
              Every keepsake in a box is made by an independent maker we know by name, paid fairly
              and credited inside the box. When you gift, two stories get told.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
