import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "FAQ — Frequently Asked Questions" },
      { name: "description", content: "Answers to common questions about customization, delivery, and digital memory pages." },
    ],
  }),
  component: FAQPage,
});

const FAQS = [
  {
    q: "How does the gift box personalization work?",
    a: "You answer a few quick questions about the recipient's personality, favorite memories, and preferences. Our team curates and handcrafts a custom box around their story.",
  },
  {
    q: "What is included in the digital memory page?",
    a: "Each box includes a unique QR code link to a private digital page where you can upload photo letters, audio messages, or shared Spotify playlists.",
  },
  {
    q: "How long does shipping take?",
    a: "Standard shipping takes 3–5 business days across India. Express options are available at checkout.",
  },
  {
    q: "Can I track my order status?",
    a: "Yes! You can check your delivery status anytime on our Track Order page using your order ID.",
  },
];

export default function FAQPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <h1 className="text-4xl font-bold text-[#231C18]">Frequently Asked Questions</h1>
      <p className="mt-2 text-muted-foreground">Everything you need to know about our handcrafted gift boxes.</p>
      
      <div className="mt-10 space-y-6">
        {FAQS.map((faq, i) => (
          <div key={i} className="paper-card p-6">
            <h2 className="text-lg font-semibold text-[#231C18]">{faq.q}</h2>
            <p className="mt-2 text-sm text-[#231C18]/80">{faq.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
