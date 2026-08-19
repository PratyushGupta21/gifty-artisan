import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats any UUID or ID into a clean, human-readable Short Order ID: "TLB-XXXXXX".
 */
export function shortOrderId(id?: string | null): string {
  if (!id) return "";
  if (id.startsWith("TLB-")) return id.toUpperCase();
  const cleanHex = id.replace(/-/g, "").slice(0, 6).toUpperCase();
  return `TLB-${cleanHex}`;
}

