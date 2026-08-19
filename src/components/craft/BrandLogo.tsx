interface BrandLogoProps {
  className?: string;
  /** Hide the text on small screens. Defaults to false. */
  hideTextOnMobile?: boolean;
  /** Custom text color for brand text. Defaults to text-[#231C18] unless specified in className. */
  textColor?: string;
}

/**
 * BrandLogo — "Memory Bloom"
 *
 * A stylised open gift box with organic petal shapes rising from it,
 * representing the emotion of unboxing a memory. Built entirely with
 * nested divs + Tailwind so it scales with a single size change on the
 * outer wrapper.
 */
export function BrandLogo({ className = "", hideTextOnMobile = false, textColor }: BrandLogoProps) {
  const textClr = textColor || (className.includes("text-") ? "" : "text-[#231C18]");

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* ─── Icon Mark ─── */}
      <div className="relative size-9 shrink-0" aria-hidden>
        {/* Box body — organic rounded rectangle */}
        <div className="absolute inset-x-0.5 bottom-0 h-[58%] rounded-[5px] bg-[#B85B3A]" />

        {/* Left box ear — the structural lip giving depth */}
        <div className="absolute bottom-[52%] left-0.5 h-[3px] w-[45%] rounded-full bg-[#B85B3A]" />

        {/* Open lid — rotated to feel "just lifted" */}
        <div className="absolute left-0 top-[18%] h-[3px] w-[55%] origin-bottom-left -rotate-[32deg] rounded-full bg-[#B85B3A]" />

        {/* ── Memory bloom petals (blush) ── */}
        {/* Large rising petal — the main memory unfolding */}
        <div className="absolute left-[30%] top-[2%] h-[42%] w-[32%] rounded-[50%_50%_50%_50%/60%_60%_40%_40%] bg-[#E4A090] opacity-90" />

        {/* Small companion petal — offset for asymmetry */}
        <div className="absolute right-[14%] top-[10%] h-[28%] w-[22%] rotate-[18deg] rounded-[50%] bg-[#E4A090] opacity-70" />

        {/* Tiny sparkle accent — a pinpoint of warmth */}
        <div className="absolute right-[8%] top-[4%] size-[12%] rounded-full bg-[#B85B3A] opacity-60" />

        {/* Inner box shadow line — gives the box a "peek inside" feel */}
        <div className="absolute inset-x-2 bottom-[14%] h-[2px] rounded-full bg-[#231C18] opacity-[0.07]" />
      </div>

      {/* ─── Brand Typography ─── */}
      <span
        className={`font-[family-name:var(--font-display)] text-lg font-semibold tracking-tight ${textClr} ${
          hideTextOnMobile ? "hidden sm:inline" : ""
        }`}
      >
        The Little Box
      </span>
    </div>
  );
}

export default BrandLogo;
