import { useRef, useState } from "react";
import { ImagePlus, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { supabase, MEMORY_BUCKET } from "@/lib/supabase";
import { cn } from "@/lib/utils";

/** 10 MB — prevents accidental uploads of raw camera files. */
const MAX_FILE_SIZE = 10 * 1024 * 1024;

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/heic"];

export function PhotoUploader({
  photos,
  onChange,
}: {
  photos: string[];
  onChange: (photos: string[]) => void;
}) {
  const [busy, setBusy] = useState(false);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function upload(files: FileList | null) {
    if (!files || files.length === 0) return;
    setBusy(true);
    const uploaded: string[] = [];
    for (const file of Array.from(files)) {
      // --- Guard: file size ---
      if (file.size > MAX_FILE_SIZE) {
        toast.error(`${file.name} is too large`, {
          description: `Max file size is ${MAX_FILE_SIZE / 1024 / 1024} MB.`,
        });
        continue;
      }

      // --- Guard: MIME type ---
      if (file.type && !ALLOWED_TYPES.includes(file.type)) {
        toast.error(`${file.name} isn't a supported image format`, {
          description: "Upload JPEG, PNG, WebP, GIF, or HEIC files.",
        });
        continue;
      }

      const ext = file.name.split(".").pop() ?? "jpg";
      const path = `${crypto.randomUUID()}.${ext}`;
      const { error } = await supabase.storage.from(MEMORY_BUCKET).upload(path, file, {
        cacheControl: "3600",
        upsert: false,
      });
      if (error) {
        toast.error(`Couldn't upload ${file.name}`, { description: error.message });
        continue;
      }
      const { data } = supabase.storage.from(MEMORY_BUCKET).getPublicUrl(path);
      uploaded.push(data.publicUrl);
    }
    if (uploaded.length) {
      onChange([...photos, ...uploaded]);
      toast.success(`${uploaded.length} photo(s) tucked into the box`);
    }
    setBusy(false);
  }

  return (
    <div className="space-y-4">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          void upload(e.dataTransfer.files);
        }}
        className={cn(
          "flex flex-col items-center justify-center gap-3.5 p-8 text-center rounded-2xl border-2 border-dashed border-[#8C6D4F] bg-[#FAF7F2]/40 backdrop-blur-sm transition-all duration-200",
          dragging && "border-[#C86240] bg-[#FAF7F2]/70 scale-[1.01]",
        )}
      >
        {busy ? (
          <Loader2 className="size-7 animate-spin text-[#C86240]" aria-hidden />
        ) : (
          <ImagePlus className="size-7 text-[#C86240]" aria-hidden />
        )}
        <p className="text-sm font-semibold text-[#1C1612]">
          Drag photos here, or pick them from your device
        </p>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="rounded-full bg-[#1C1612] px-5 py-2 text-sm font-semibold text-[#FAF7F2] shadow-md transition hover:bg-[#1C1612]/90 hover:scale-[1.02]"
        >
          Choose photos
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="sr-only"
          aria-label="Upload memory photos"
          onChange={(e) => void upload(e.target.files)}
        />
      </div>

      {photos.length > 0 && (
        <ul className="grid grid-cols-3 gap-3 sm:grid-cols-4">
          {photos.map((url) => (
            <li key={url} className="group relative overflow-hidden rounded-xl border border-border">
              <img src={url} alt="Uploaded memory" loading="lazy" className="aspect-square w-full object-cover" />
              <button
                type="button"
                aria-label="Remove photo"
                onClick={() => onChange(photos.filter((p) => p !== url))}
                className="absolute right-1 top-1 rounded-full bg-background/90 p-1 text-foreground shadow-paper"
              >
                <X className="size-3.5" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
