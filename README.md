🎁 The Gift Architects — Person-First Gifting Platform
A full-stack, personalized gifting application engineered with a luxury craft design system. Built with modern web technologies, The Gift Architects delivers a seamless, high-contrast, tactile e-commerce experience—combining bespoke custom builder workflows, dynamic memory pages, and real-time order tracking.

🌟 Key Features
Multi-Step Gift Builder: An interactive flow letting users personalize gift cards, choose personality tags, attach custom Spotify tracks, and write handwritten card messages.

Luxury Design System: Tailored typography and a warm aesthetic featuring dark espresso (#181310), rich terracotta (#C86240), and light cream (#FAF9F6) palettes with responsive glassmorphism accents.

Tiered Pricing Model:

📦 The Little Box — ₹250

💖 The Lovely Box — ₹550

📸 The Memory Box — ₹850

Instant Order Tracking: Unique human-readable Order IDs (e.g., #TLB-86BB18) paired with a live tracking dashboard and digital memory preview pages.

Secure Authentication: Native integration with Supabase Auth supporting Google OAuth and passwordless sessions.

Media & Photo Management: Drag-and-drop client uploads stored directly in secure Supabase storage buckets.

🛠️ Tech Stack
Frontend & UX
Framework: React + TypeScript

Styling: Tailwind CSS

Icons: Lucide React

Build Tool: Vite

Backend & Database
BaaS: Supabase

Database: PostgreSQL

Authentication: Supabase Auth (Google OAuth)

Storage: Supabase Object Storage

🚀 Getting Started
Prerequisites
Ensure you have the following installed on your machine:

Node.js (v18.0 or higher)

npm or pnpm

Installation
Clone the Repository
git clone https://github.com/PratyushGupta21/gifty-artisan.git
cd gifty-artisan

Install Dependencies
npm install

Configure Environment Variables
Create a .env.local file in the root directory and add your Supabase keys:
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

Run Development Server
npm run dev
Open http://localhost:5173 in your browser to preview the app.

📂 Project Structure
gifty-artisan/
├── src/
│   ├── components/      # Reusable UI elements (Buttons, Inputs, Cards)
│   ├── pages/           # Application views (Build, Order, Dashboard, Privacy, Terms)
│   ├── data/            # Static configuration & tier pricing definitions
│   ├── lib/             # Supabase client setup & helper utilities
│   └── styles/          # Global CSS overrides & Tailwind utilities
├── public/              # Static assets and favicons
├── supabase/            # Database migrations & schema definitions
└── package.json

📊 Database Schema Summary
The application relies on three core entities in PostgreSQL via Supabase:

profiles: Stores user account details and OAuth metadata.

orders: Tracks order IDs, box tier, recipient details, custom Spotify links, handwritten card messages, total price, and fulfillment status (Pending, Processing, Delivered).

storage/memories: Bucket hosting customer-uploaded photo assets.

📄 License
Distributed under the MIT License. See LICENSE for more information.

Crafted with care by Pratyush Gupta