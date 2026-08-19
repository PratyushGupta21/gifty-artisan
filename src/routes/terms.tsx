import { createFileRoute } from "@tanstack/react-router";
import { FileText, Hammer, ShieldAlert, RotateCcw } from "lucide-react";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Service — The Little Box" },
      {
        name: "description",
        content: "Clear, human guidelines on handcrafting timelines, customization, and delivery.",
      },
    ],
  }),
  component: TermsPage,
});

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 md:py-16">
      {/* Header */}
      <div className="space-y-2">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-[#B85B3A]/30 bg-[#B85B3A]/10 px-3.5 py-1 text-xs font-semibold text-[#B85B3A]">
          <FileText className="size-3.5" /> Customer Agreement
        </span>
        <h1 className="font-[family-name:var(--font-display)] text-3xl font-bold text-[#FAF7F2] md:text-4xl">
          Terms of Service
        </h1>
        <p className="text-base text-[#D4A373]">
          Clear, human guidelines on handcrafting timelines, customization, and delivery.
        </p>
      </div>

      {/* Terms Cards */}
      <div className="mt-10 space-y-6">
        {/* Section 1 */}
        <section className="paper-card p-6 md:p-8 space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#B85B3A]/10 text-[#B85B3A]">
              <Hammer className="size-5" />
            </div>
            <h2 className="text-xl font-bold text-[#231C18]">
              1. Artisan Crafting & Processing Timelines
            </h2>
          </div>
          <p className="text-sm leading-relaxed text-[#231C18]/80 md:text-base">
            Every gift box is assembled by hand upon order. Standard crafting takes 1-2 business days before dispatch. During peak festive seasons (Diwali, Valentine's, Christmas), please allow up to 3 business days for order creation.
          </p>
        </section>

        {/* Section 2 */}
        <section className="paper-card p-6 md:p-8 space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#B85B3A]/10 text-[#B85B3A]">
              <ShieldAlert className="size-5" />
            </div>
            <h2 className="text-xl font-bold text-[#231C18]">
              2. Custom Content & Media Guidelines
            </h2>
          </div>
          <p className="text-sm leading-relaxed text-[#231C18]/80 md:text-base">
            You are responsible for ensuring that the content you upload (photos, written messages, audio recordings) does not infringe on copyrights or contain illegal material. We reserve the right to decline printing content that violates basic community safety standards.
          </p>
        </section>

        {/* Section 3 */}
        <section className="paper-card p-6 md:p-8 space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#B85B3A]/10 text-[#B85B3A]">
              <RotateCcw className="size-5" />
            </div>
            <h2 className="text-xl font-bold text-[#231C18]">
              3. Returns, Exchanges & Damaged Items
            </h2>
          </div>
          <p className="text-sm leading-relaxed text-[#231C18]/80 md:text-base">
            Because every box contains personalized, custom-printed items, we cannot accept returns for change of mind. However, if your package arrives damaged in transit or if there is a printing error on our end, contact us within 48 hours of delivery with photo proof, and we will ship a free replacement immediately.
          </p>
        </section>
      </div>
    </div>
  );
}
