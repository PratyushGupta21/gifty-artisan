import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — The Little Box" },
    ],
  }),
  component: PrivacyPage,
});

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <h1 className="text-4xl font-bold text-[#231C18]">Privacy Policy</h1>
      <p className="mt-4 text-sm text-[#231C18]/80 leading-relaxed">
        At The Little Box, we respect your privacy and protect your personal information and photo uploads.
        Photos and stories uploaded for memory pages are strictly private and accessible only via your custom link.
      </p>
    </div>
  );
}
