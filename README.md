# Gifty Artisan

FINAL WEBSITE GENERATION PROMPT
Act as a Senior Full-Stack Engineer and Lead UI/UX Product Designer. Build a high-converting, production-ready, highly responsive web application for The Little Box, a person-first personalized, handmade, and memory-based gifting platform.

0. MANDATORY CUSTOM SUPABASE ENVIRONMENT CONFIGURATION
CRITICAL: Do NOT create a new Lovable Cloud Supabase project or use any auto-generated sandbox database. You MUST configure and build this application using my existing custom Supabase project credentials.

Set up the environment variables (.env) and initialize the client strictly with:

VITE_SUPABASE_URL: [https://vtzxwhrbtudflspmqjwl.supabase.co](https://vtzxwhrbtudflspmqjwl.supabase.co)

VITE_SUPABASE_ANON_KEY: sb_publishable_U3uT24E3Dh0ZGHiAqbVDtg_axMdY8ZH

Initialize the Supabase JS client (@supabase/supabase-js) using these explicit environment variables.

Create all SQL migrations, database tables, Row Level Security (RLS) policies, and storage bucket definitions so they execute directly against this specified external Supabase project.

1. BRANDING, DESIGN SYSTEM & ANTI-AI VISUAL IDENTITY
Aesthetic Direction: Warm, tactile, emotional, organic, and handcrafted. Completely avoid sterile corporate layouts, cold black/white contrasts, sharp high-tech borders, or neon AI gradients. The platform must feel like an artisan's studio or a tactile paper craft shop.

Custom Color Palette:

Primary (Warm Terracotta / Clay): #B85B3A — For primary CTAs, active steps, and key highlights.

Secondary (Dried Eucalyptus / Muted Sage): #6E7E65 — For subtle badges, secondary actions, and progress indicators.

Accent (Pressed Rose / Soft Blush): #E4A090 — For hover states, selection ring highlights, and icon accents.

Background Base (Warm Linen / Pressed Paper): #FBF8F3 — Soft, off-white paper canvas replacing harsh pure white (#FFFFFF).

Surface Neutral (Kraft Paper / Sand Tint): #F2EAE1 — For card containers, input backgrounds, and content blocks.

Text Primary (Deep Espresso Ink): #231C18 — Warm, readable dark tone replacing harsh black (#000000).

Text Muted (Warm Slate Ink): #6B5E55 — For subtitles, captions, and secondary details.

Borders & Dividers: #E8DED3 — Organic, subtle separation lines.

Typography & Styling:

Headings: Fraunces or Playfair Display (Warm, editorial serif).

Body & UI: Plus Jakarta Sans or Inter (Clean, highly legible sans-serif).

Borders & Shadows: Soft, rounded corners (rounded-2xl / 16px), micro-shadows that mimic stacked paper (shadow-[0_4px_20px_-2px_rgba(35,28,24,0.05)]).

Responsive Layout: Mobile-first architecture (60%+ traffic on mobile). Multi-step forms must use smooth bottom sheets or full-width swipeable card modules on mobile devices.

2. CORE SYSTEM ARCHITECTURE & TECH STACK
Frontend Framework: React (Vite), TypeScript, Tailwind CSS, Lucide React (Icons), Framer Motion (Page transitions and fluid micro-interactions), shadcn/ui or Radix UI primitives.

State Management: Zustand or React Context for multi-step questionnaire state, temporary media uploads, and cart calculations.

Backend & Database (External Supabase Instance):

Tables to create via SQL migration:

orders (id, recipient_name, relationship, occasion, personality_tags, inside_joke, spotify_url, card_message, tier_selected, add_ons, total_amount, payment_status, shipping_address, created_at)

memories (id, order_id, uuid_slug, recipient_name, sender_name, letter_text, spotify_url, created_at)

memory_photos (id, memory_id, photo_url, created_at)

Storage Bucket: Create a public storage bucket named gift-memories with RLS policies allowing authenticated/anon upload during checkout.

Integrations:

Payments: Razorpay / Cashfree integration supporting UPI, Credit/Debit cards, NetBanking, and Wallets with webhooks for payment verification.

WhatsApp & Dynamic QR: WhatsApp Business API integration for instant order tracking updates; automated dynamic QR code generator routing to unique digital memory sub-pages.

3. PAGE STRUCTURE & USER FLOWS
Page 1: Home / Landing Page
Hero Banner:

Headline: "You tell us who they are. We create what to give them."

Subheadline: "Move beyond generic catalogs. Turn their personality, photos, and favorite memories into a 100% handcrafted gift box."

Primary CTA: "Build Their Gift Box" (Opens multi-step builder directly).

Secondary CTA: "Explore Package Tiers".

Value Pillars (3-Column Interactive Grid):

Person-First Curation: Tell us about their quirks, hobbies, and favorite shared memories.

Artisan-Crafted: Handcrafted items made by verified, independent micro-creators.

Digital Memory Integration: Embedded QR codes linking to custom photo letters, video messages, or Spotify playlists.

Package Tier Showcase (Cards with "Select Package" Trigger):

The Little Box (₹399): Core personalized trinkets, 2 custom photo cards, handwritten letter card.

The Lovely Box (₹799): Everything in Little + artisan handmade product, custom acrylic Spotify plaque, 4 photo cards.

The Memory Box (₹1,299): Premium handmade keepsake, interactive dynamic QR memory page, custom outer box wrapping, photo album grid, premium custom gifts.

Social Proof Carousel: Verified customer unboxing photos, photo-card previews, and video reviews.

Creator Spotlight Banner: Direct message emphasizing independent artist empowerment and fair-trade craftsmanship.

Page 2: Recipient-First Gift Builder (Interactive Multi-Step Questionnaire)
Visual Progress Tracker: 4-Step Indicator (1. Recipient -> 2. Memories & Personalization -> 3. Choose Tier -> 4. Review & Order).

Step 1: Recipient Profile:

Inputs: Recipient's Name, Relationship (Partner, Best Friend, Sibling, Parent, Colleague), Occasion (Birthday, Anniversary, Apology, Graduation, "Just Because").

Personality Chips (Multi-select tag pills with #E4A090 active state): Coffee Lover, Nostalgic, Minimalist, Bookworm, Music Freak, Extrovert, Cinephile, Travel Enthusiast.

Step 2: Memories & Customization:

Text Area: "Describe an inside joke, cherished memory, or feeling you want this box to convey."

Photo Uploader: Drag-and-drop box for uploading high-res images directly to the external Supabase gift-memories bucket ([https://vtzxwhrbtudflspmqjwl.supabase.co](https://vtzxwhrbtudflspmqjwl.supabase.co)).

Text Input: Spotify Track/Playlist Link (for custom music plaque).

Text Area: Written message for the physical handwritten card (max 500 characters).

Step 3: Tier Selection & Add-Ons:

Interactive selection cards (Little ₹399 / Lovely ₹799 / Memory ₹1,299) updating live total.

Optional Add-ons (Checkbox toggles with live preview updates):

Dynamic QR Video Memory Page (+₹149)

Premium Velvet Gift Packaging (+₹99)

Express Priority Crafting & Shipping (+₹199)

Step 4: Live Mockup Preview & Checkout Summary:

Real-time visual rendering of the box contents with uploaded photos placed into visual card templates.

Cost breakdown: Package Tier + Add-ons + Shipping (Free over ₹999).

Pincode delivery estimation checker.

Page 3: Digital Memory Page (Accessed via Dynamic QR Code)
Route: /memory/[unique_id]

Fetches memory data from the custom Supabase memories table using the UUID slug.

Animated opening envelope revealing:

Personalized header: "A special memory box created for [Recipient Name] by [Sender Name]".

Integrated Spotify audio player / custom audio stream.

Responsive masonry photo gallery loaded from Supabase storage URLs.

Typewriter text animation rendering the personal letter.

Page 4: Order Tracking & Admin Queue (Lite)
Customer Tracker: Real-time progress bar (Order Received -> Being Handcrafted -> Packed with Love -> Dispatched -> Delivered).

Creator/Admin Queue: Dashboard allowing team members to view orders directly from the custom Supabase database, download uploaded images, copy letter text, print generated QR links, and manage shipping labels.

4. FUNCTIONAL REQUIREMENTS & CONSTRAINTS
Form Persistence: Save questionnaire responses in localStorage so user progress is preserved across refreshes.

Direct Cloud Storage Uploads: Photos must be uploaded directly to your external Supabase gift-memories bucket, generating public CDN URLs stored in memory_photos.

Validation: Require at least one photo upload if the selected package tier includes print cards or photo grids.

Privacy: Obfuscate memory page routes (/memory/[unique_id]) using UUIDv4 tokens to prevent unauthorized URL access.

5. NON-FUNCTIONAL PERFORMANCE TARGETS
Performance: Google Lighthouse Performance score >= 90; mobile payload under 2MB.

Accessibility: Full keyboard navigation support across the questionnaire; semantic HTML elements; proper ARIA labels.

SEO: OpenGraph cards with custom preview images and structured JSON-LD schemas for gift packages.

6. RESTRICTIONS & WHAT NOT TO BUILD
Do NOT build a standard, 100-item e-commerce grid with individual "Add to Cart" buttons. The entire platform must flow through the person-first questionnaire experience.

Do NOT use dark mode, stark white backgrounds, or high-tech neon aesthetics.

Do NOT prompt or redirect to Lovable Cloud Database creation modals.

7. EXPECTED CODE OUTPUT
Generate the production-ready code structure including:

.env / .env.example file populated with VITE_SUPABASE_URL=[https://vtzxwhrbtudflspmqjwl.supabase.co](https://vtzxwhrbtudflspmqjwl.supabase.co) and VITE_SUPABASE_ANON_KEY=sb_publishable_U3uT24E3Dh0ZGHiAqbVDtg_axMdY8ZH.

supabase/migrations/01_initial_schema.sql containing table definitions and storage bucket initialization for your custom Supabase instance.

tailwind.config.js with all custom craft colors (craft-primary, craft-bg, craft-surface, craft-ink, craft-secondary, craft-accent), typography (Fraunces / Plus Jakarta Sans), and soft box-shadow tokens.

Core reusable components (/components/ui): Button, Card, Multi-Step Form Container, Chip Selection, Photo Uploader connected to Supabase Storage.

Full page builds for Home Page (/), Gift Builder (/build), and Memory Page (/memory/[id]).

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/da2ebe27-f698-4df7-9f10-d43c4cc82664).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
