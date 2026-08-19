export type TierId = "little" | "lovely" | "memory";

export const TIERS: {
  id: TierId;
  name: string;
  price: number;
  blurb: string;
  includes: string[];
  needsPhotos: boolean;
}[] = [
  {
    id: "little",
    name: "The Little Box",
    price: 250,
    blurb: "A small, sincere hello.",
    includes: [
      "Core personalized trinkets",
      "2 custom photo cards",
      "Handwritten letter card",
    ],
    needsPhotos: true,
  },
  {
    id: "lovely",
    name: "The Lovely Box",
    price: 550,
    blurb: "For the people you think about often.",
    includes: [
      "Everything in The Little Box",
      "Artisan handmade product",
      "Custom acrylic Spotify plaque",
      "4 photo cards",
    ],
    needsPhotos: true,
  },
  {
    id: "memory",
    name: "The Memory Box",
    price: 850,
    blurb: "The whole story, boxed.",
    includes: [
      "Premium handmade keepsake",
      "Interactive dynamic QR memory page",
      "Custom outer box wrapping",
      "Photo album grid",
      "Premium custom gifts",
    ],
    needsPhotos: true,
  },
];

export const ADD_ONS: { id: string; label: string; price: number }[] = [
  { id: "qr-video", label: "Dynamic QR video memory page", price: 149 },
  { id: "velvet", label: "Premium velvet gift packaging", price: 99 },
  { id: "express", label: "Express priority crafting & shipping", price: 199 },
];

export const PERSONALITY_TAGS = [
  "Coffee Lover",
  "Nostalgic",
  "Minimalist",
  "Bookworm",
  "Music Freak",
  "Extrovert",
  "Cinephile",
  "Travel Enthusiast",
];

export const RELATIONSHIPS = ["Partner", "Best Friend", "Sibling", "Parent", "Colleague"];
export const OCCASIONS = ["Birthday", "Anniversary", "Apology", "Graduation", "Just Because"];

export const SHIPPING_FEE = 79;
export const FREE_SHIPPING_OVER = 999;

export function priceBreakdown(tier: TierId | null, addOns: string[]) {
  const tierPrice = TIERS.find((t) => t.id === tier)?.price ?? 0;
  const addOnTotal = ADD_ONS.filter((a) => addOns.includes(a.id)).reduce(
    (sum, a) => sum + a.price,
    0,
  );
  const subtotal = tierPrice + addOnTotal;
  const shipping = subtotal === 0 || subtotal >= FREE_SHIPPING_OVER ? 0 : SHIPPING_FEE;
  return { tierPrice, addOnTotal, subtotal, shipping, total: subtotal + shipping };
}

export const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;
