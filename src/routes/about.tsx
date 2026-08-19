import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Us — The Little Box" },
      {
        name: "description",
        content: "Learn about our mission to craft person-first, artisan gift boxes with digital memory integration.",
      },
    ],
  }),
  component: AboutPage,
});

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <h1 className="text-4xl font-bold text-[#231C18]">About The Little Box</h1>
      <p className="mt-4 text-lg text-[#231C18]/80 leading-relaxed">
        We believe that every gift should tell a unique story. Instead of generic off-the-shelf presents,
        we craft personalized, person-first gift boxes filled with photo cards, artisan keepsakes, and digital memory pages.
      </p>
      
      <div className="mt-10 grid gap-6 md:grid-cols-2">
        <div className="paper-card p-6">
          <h2 className="text-xl font-semibold text-[#231C18]">Handcrafted Care</h2>
          <p className="mt-2 text-sm text-[#231C18]/70">
            Every item in our boxes is handcrafted by verified independent micro-creators and artisans across India.
          </p>
        </div>
        <div className="paper-card p-6">
          <h2 className="text-xl font-semibold text-[#231C18]">Digital Keepsakes</h2>
          <p className="mt-2 text-sm text-[#231C18]/70">
            With built-in QR memory pages, your recipient can scan and listen to custom playlists, view photo letters, or watch video notes.
          </p>
        </div>
      </div>

      <div className="mt-12">
        <Link
          to="/build"
          className="inline-flex rounded-full bg-[#B85B3A] px-6 py-3 text-sm font-semibold text-[#FBF8F3] hover:bg-[#B85B3A]/90 transition-colors"
        >
          Build a Box Today
        </Link>
      </div>
    </div>
  );
}
