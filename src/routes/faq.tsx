import { createFileRoute, Link } from "@tanstack/react-router";
import { HelpCircle, QrCode, Calendar, Clock, Truck } from "lucide-react";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "Frequently Asked Questions — The Little Box" },
      {
        name: "description",
        content: "Everything you need to know about building, customizing, and delivering your handcrafted box.",
      },
    ],
  }),
  component: FAQPage,
});

const FAQS = [
  {
    icon: QrCode,
    q: "How does the digital memory page work?",
    a: "Inside your physical gift box, your recipient will find an elegant printed card featuring a unique QR code. When scanned with any smartphone camera, it opens a private web page displaying your custom photo gallery, audio messages, written note, and a curated Spotify playlist.",
  },
  {
    icon: Calendar,
    q: "Can I schedule a box to deliver on a specific date?",
    a: "Yes! During checkout, you can select a preferred delivery date. We will time our artisan crafting and shipping dispatch so that the package arrives as close to your chosen date as possible.",
  },
  {
    icon: Clock,
    q: "What if I don't have all the photos or audio ready right now?",
    a: "No problem. You can start building your box today, save your draft in your dashboard, and finish uploading your photos and audio before clicking submit.",
  },
  {
    icon: Truck,
    q: "Where do you ship, and how long does it take?",
    a: "We ship across India. Standard delivery takes 3 to 5 business days after dispatch depending on your city. Express shipping options (1-2 days) are available at checkout for tier-1 metropolitan cities.",
  },
];

export default function FAQPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 md:py-16 space-y-10">
      {/* Header */}
      <div className="space-y-2">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-[#B85B3A]/30 bg-[#B85B3A]/10 px-3.5 py-1 text-xs font-semibold text-[#B85B3A]">
          <HelpCircle className="size-3.5" /> Studio Support & FAQs
        </span>
        <h1 className="font-[family-name:var(--font-serif)] text-3xl font-extrabold text-[#FAF7F2] md:text-4xl">
          Frequently Asked Questions
        </h1>
        <p className="text-base text-[#B8A99C]">
          Everything you need to know about building, customizing, and delivering your handcrafted box.
        </p>
      </div>

      {/* FAQ Cards */}
      <div className="space-y-6">
        {FAQS.map((faq, i) => {
          const Icon = faq.icon;
          return (
            <section key={i} className="paper-card paper-card-hover p-6 md:p-8 space-y-3">
              <div className="flex items-center gap-3.5">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#B85B3A]/10 text-[#B85B3A]">
                  <Icon className="size-5" />
                </div>
                <h2 className="font-[family-name:var(--font-serif)] text-lg font-bold text-[#231C18] md:text-xl">
                  {faq.q}
                </h2>
              </div>
              <p className="pl-13 text-sm leading-relaxed text-[#6B5E55] md:text-base">
                {faq.a}
              </p>
            </section>
          );
        })}
      </div>

      {/* Bottom Assistance Box */}
      <div className="paper-card paper-card-hover p-8 md:p-10 text-center space-y-4">
        <h2 className="font-[family-name:var(--font-serif)] text-2xl font-bold text-[#231C18]">Still have questions?</h2>
        <p className="text-sm text-[#6B5E55] max-w-md mx-auto">
          We're here to help you craft the perfect gift memory. Get in touch or start building your box.
        </p>
        <div className="pt-2 flex flex-wrap justify-center gap-4">
          <Link
            to="/build"
            className="rounded-full bg-[#B85B3A] px-7 py-3 text-sm font-semibold text-[#FAF7F2] shadow-md transition hover:bg-[#B85B3A]/90 hover:scale-[1.02]"
          >
            Start Building a Box
          </Link>
          <a
            href="mailto:support@thelittlebox.in"
            className="rounded-full border border-[rgba(212,163,115,0.35)] bg-[#CFA771] px-7 py-3 text-sm font-semibold text-[#1C1612] transition hover:bg-[#B58A52] hover:scale-[1.02]"
          >
            Contact Support
          </a>
        </div>
      </div>
    </div>
  );
}
