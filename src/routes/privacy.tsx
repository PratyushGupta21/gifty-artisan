import { createFileRoute } from "@tanstack/react-router";
import { ShieldCheck, Lock, Clock, CreditCard } from "lucide-react";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy & Media Safety Policy — The Little Box" },
      {
        name: "description",
        content: "How we handle your personal details, uploaded photos, and private memory links with care.",
      },
    ],
  }),
  component: PrivacyPage,
});

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 md:py-16">
      {/* Header */}
      <div className="space-y-2">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-[#B85B3A]/30 bg-[#B85B3A]/10 px-3.5 py-1 text-xs font-semibold text-[#B85B3A]">
          <ShieldCheck className="size-3.5" /> Media Safety & Data Policy
        </span>
        <h1 className="font-[family-name:var(--font-display)] text-3xl font-bold text-[#231C18] md:text-4xl">
          Privacy & Media Safety Policy
        </h1>
        <p className="text-base text-muted-foreground">
          How we handle your personal details, uploaded photos, and private memory links with care.
        </p>
      </div>

      {/* Policy Cards */}
      <div className="mt-10 space-y-6">
        {/* Section 1 */}
        <section className="paper-card p-6 md:p-8 space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#B85B3A]/10 text-[#B85B3A]">
              <Lock className="size-5" />
            </div>
            <h2 className="text-xl font-bold text-[#231C18]">
              1. Photo & Media Data Protection
            </h2>
          </div>
          <p className="text-sm leading-relaxed text-[#231C18]/80 md:text-base">
            When you build a gift box with us, you upload personal photos, voice letters, and custom messages. We use these strictly to print your physical photo cards and generate your private digital memory page. We never sell, share, or use your private memories for marketing or public display without explicit written permission.
          </p>
        </section>

        {/* Section 2 */}
        <section className="paper-card p-6 md:p-8 space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#B85B3A]/10 text-[#B85B3A]">
              <Clock className="size-5" />
            </div>
            <h2 className="text-xl font-bold text-[#231C18]">
              2. How Long We Keep Your Files
            </h2>
          </div>
          <ul className="space-y-3 text-sm text-[#231C18]/80 md:text-base">
            <li className="flex items-start gap-2">
              <span className="mt-1.5 size-2 shrink-0 rounded-full bg-[#B85B3A]" />
              <span>
                <strong className="text-[#231C18]">Physical Print Files:</strong> Photos uploaded for physical printing are automatically purged from our production servers 30 days after your order is delivered.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1.5 size-2 shrink-0 rounded-full bg-[#B85B3A]" />
              <span>
                <strong className="text-[#231C18]">Digital Memory Pages:</strong> Your digital QR memory link stays active permanently unless you request its deletion by emailing{" "}
                <a href="mailto:privacy@thelittlebox.in" className="font-semibold text-[#B85B3A] underline underline-offset-2 hover:text-[#B85B3A]/80">
                  privacy@thelittlebox.in
                </a>.
              </span>
            </li>
          </ul>
        </section>

        {/* Section 3 */}
        <section className="paper-card p-6 md:p-8 space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#B85B3A]/10 text-[#B85B3A]">
              <CreditCard className="size-5" />
            </div>
            <h2 className="text-xl font-bold text-[#231C18]">
              3. Account & Payment Security
            </h2>
          </div>
          <p className="text-sm leading-relaxed text-[#231C18]/80 md:text-base">
            We process payments securely through end-to-end encrypted gateways. We do not store credit/debit card numbers or UPI PINs on our servers. Your email address and phone number are used solely for order updates and tracking notifications.
          </p>
        </section>
      </div>
    </div>
  );
}
