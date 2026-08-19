import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Service — The Little Box" },
    ],
  }),
  component: TermsPage,
});

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <h1 className="text-4xl font-bold text-[#231C18]">Terms of Service</h1>
      <p className="mt-4 text-sm text-[#231C18]/80 leading-relaxed">
        Welcome to The Little Box. By using our website and placing orders, you agree to our terms regarding
        order processing, artisan crafting timelines, and delivery policies.
      </p>
    </div>
  );
}
