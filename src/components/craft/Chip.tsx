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
          ? "border-accent bg-accent text-accent-foreground shadow-paper"
          : "border-border bg-card text-muted-foreground hover:border-accent hover:text-foreground",
      )}
    >
      {label}
    </button>
  );
}
