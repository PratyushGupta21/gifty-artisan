import { cn } from "@/lib/utils";

export function Chip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "rounded-full border px-4 py-2 text-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        active
          ? "border-[#181310] bg-[#181310] text-[#FAF7F2] font-semibold shadow-md scale-[1.02]"
          : "border-[rgba(24,19,16,0.25)] bg-[#181310]/12 text-[#181310] font-medium hover:bg-[#181310]/22 hover:border-[#181310]/40",
      )}
    >
      {label}
    </button>
  );
}
