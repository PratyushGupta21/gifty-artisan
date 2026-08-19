import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart, Sparkles, Package, ArrowRight } from "lucide-react";
import creatorImg from "@/assets/creator.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Us — The Story Behind The Little Box" },
      {
        name: "description",
        content: "Moving past generic off-the-shelf gifts to craft physical-meets-digital keepsakes that tell real stories.",
      },
    ],
  }),
  component: AboutPage,
});

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 md:py-16 space-y-12">
      {/* Header */}
      <div className="space-y-2">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-[#B85B3A]/30 bg-[#B85B3A]/10 px-3.5 py-1 text-xs font-semibold text-[#B85B3A]">
          <Heart className="size-3.5" /> Person-First Craftsmanship
        </span>
        <h1 className="font-[family-name:var(--font-serif)] text-3xl font-extrabold text-[#FAF7F2] md:text-4xl">
          The Story Behind The Little Box
        </h1>
        <p className="text-base text-[#B8A99C] md:text-lg">
          Moving past generic off-the-shelf gifts to craft physical-meets-digital keepsakes that tell real stories.
        </p>
      </div>

      {/* Why We Started Card */}
      <section className="paper-card paper-card-hover p-6 md:p-8 space-y-4">
        <h2 className="font-[family-name:var(--font-serif)] text-2xl font-bold text-[#231C18]">Why We Started</h2>
        <p className="text-sm leading-relaxed text-[#6B5E55] md:text-base">
          Gift-giving should feel like a warm embrace, not a last-minute chore. Most store-bought gift hampers feel impersonal—filled with mass-produced clutter that gets forgotten in a drawer. We built The Little Box to combine physical artisan craftsmanship with digital storytelling, creating personal gift boxes centered around your recipient's personality.
        </p>
      </section>

      {/* How We Work Image Banner */}
      <div className="paper-card paper-card-hover overflow-hidden grid md:grid-cols-2 items-center">
        <img
          src={creatorImg}
          alt="Artisan tying twine around a kraft paper gift box"
          className="h-full w-full object-cover min-h-[240px]"
        />
        <div className="p-6 md:p-8 space-y-3">
          <span className="text-xs uppercase tracking-wider text-[#708238] font-bold">
            Handcrafted with Care
          </span>
          <h2 className="font-[family-name:var(--font-serif)] text-2xl font-bold text-[#231C18]">Made by hands, not warehouses</h2>
          <p className="text-sm text-[#6B5E55] leading-relaxed">
            Every keepsake inside a box is made by an independent maker we know by name, paid fairly and credited inside the box. When you gift, two stories get told.
          </p>
        </div>
      </div>

      {/* How We Work Cards */}
      <div className="space-y-4">
        <h2 className="font-[family-name:var(--font-serif)] text-2xl font-bold text-[#FAF7F2]">How We Work</h2>
        
        <div className="grid gap-6 md:grid-cols-3">
          <div className="paper-card paper-card-hover p-6 space-y-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-[#B85B3A]/10 text-[#B85B3A]">
              <Heart className="size-5" />
            </div>
            <h3 className="font-[family-name:var(--font-serif)] text-lg font-bold text-[#231C18]">Independent Micro-Creators</h3>
            <p className="text-xs leading-relaxed text-[#6B5E55] md:text-sm">
              We source handcrafted items, candles, and keepsakes directly from independent artisans across India.
            </p>
          </div>

          <div className="paper-card paper-card-hover p-6 space-y-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-[#D4A373]/20 text-[#B85B3A]">
              <Sparkles className="size-5" />
            </div>
            <h3 className="font-[family-name:var(--font-serif)] text-lg font-bold text-[#231C18]">Physical + Digital Fusion</h3>
            <p className="text-xs leading-relaxed text-[#6B5E55] md:text-sm">
              Every box includes high-quality printed photo cards alongside a custom QR memory page featuring audio notes, photo letters, and shared playlists.
            </p>
          </div>

          <div className="paper-card paper-card-hover p-6 space-y-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-[#708238]/15 text-[#708238]">
              <Package className="size-5" />
            </div>
            <h3 className="font-[family-name:var(--font-serif)] text-lg font-bold text-[#231C18]">Hand-Packed Precision</h3>
            <p className="text-xs leading-relaxed text-[#6B5E55] md:text-sm">
              Every box is carefully packed in our studio, wrapped in eco-friendly protective packaging, and inspected for quality before shipment.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Box */}
      <div className="paper-card paper-card-hover p-8 text-center space-y-4 bg-[#B85B3A]/5 border-[rgba(212,163,115,0.35)]">
        <h2 className="font-[family-name:var(--font-serif)] text-2xl font-bold text-[#231C18]">Ready to tell their story?</h2>
        <p className="text-sm text-[#6B5E55] max-w-md mx-auto">
          Choose a tier, answer a few questions about your recipient, and we'll craft a box they'll cherish forever.
        </p>
        <div>
          <Link
            to="/build"
            className="inline-flex items-center gap-2 rounded-full bg-[#B85B3A] px-7 py-3 text-sm font-semibold text-[#FAF7F2] shadow-md transition hover:bg-[#B85B3A]/90 hover:scale-[1.02]"
          >
            Build a Box Today <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
