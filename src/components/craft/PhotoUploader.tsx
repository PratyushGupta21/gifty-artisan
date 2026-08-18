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
          "paper-card flex flex-col items-center justify-center gap-3 p-8 text-center transition-colors",
          dragging && "border-accent bg-accent/20",
        )}
      >
        {busy ? (
          <Loader2 className="size-6 animate-spin text-primary" aria-hidden />
        ) : (
          <ImagePlus className="size-6 text-primary" aria-hidden />
        )}
        <p className="text-sm text-muted-foreground">
          Drag photos here, or pick them from your device
        </p>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="rounded-full border border-border bg-background px-4 py-2 text-sm font-medium hover:border-accent"
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
