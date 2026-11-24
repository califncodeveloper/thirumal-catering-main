import React, { useState, useRef } from "react";
import { Upload, X, Check, Loader2, Image as ImageIcon } from "lucide-react";
import { uploadImageAssetServerFn } from "../../lib/admin-actions.server";

interface ImageUploaderProps {
  label?: string;
  value?: string;
  onChange: (url: string) => void;
  aspectRatio?: "square" | "video" | "wide";
  placeholder?: string;
}

const ALLOWED_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/avif",
];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export function ImageUploader({
  label = "Upload Image",
  value,
  onChange,
  aspectRatio = "video",
  placeholder = "Click or drag an image here to upload (Max 10MB)",
}: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileProcess = async (file: File) => {
    setError(null);

    if (!ALLOWED_TYPES.includes(file.type)) {
      setError("Please select a valid image format: JPEG, PNG, WebP, or AVIF");
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setError("Image size exceeds 10MB limit");
      return;
    }

    setIsUploading(true);
    try {
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve, reject) => {
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (e) => reject(e);
      });
      reader.readAsDataURL(file);
      const base64Data = await base64Promise;

      const res = await uploadImageAssetServerFn({
        data: {
          base64Data,
          filename: file.name,
          mimeType: file.type,
        },
      });

      if (res.success && res.asset?.url) {
        onChange(res.asset.url);
      } else {
        throw new Error("Upload failed");
      }
    } catch (err: unknown) {
      console.error("Upload error:", err);
      setError((err as Error)?.message || "Failed to upload image. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileProcess(file);
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileProcess(file);
  };

  const aspectClass =
    aspectRatio === "square"
      ? "aspect-square"
      : aspectRatio === "wide"
      ? "aspect-[21/9]"
      : "aspect-[16/9]";

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {label}
        </label>
      )}

      {value ? (
        <div className={`relative rounded-2xl overflow-hidden border-2 border-gold/40 shadow-md ${aspectClass} bg-black/10 group`}>
          <img
            src={value}
            alt="Uploaded preview"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 rounded-full gold-gradient text-maroon-deep font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-lg hover:brightness-105"
            >
              <Upload size={14} /> Replace
            </button>
            <button
              type="button"
              onClick={() => onChange("")}
              className="p-2 rounded-full bg-destructive text-destructive-foreground hover:brightness-110"
              title="Remove image"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      ) : (
        <div
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
            isDragging
              ? "border-primary bg-primary/10"
              : "border-border hover:border-gold hover:bg-muted/50"
          } ${aspectClass} flex flex-col items-center justify-center`}
        >
          {isUploading ? (
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="animate-spin text-primary" size={32} />
              <p className="text-sm font-medium text-foreground">Uploading to Sanity CMS...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
              <div className="w-12 h-12 rounded-full gold-gradient text-maroon-deep grid place-items-center mb-1">
                <ImageIcon size={22} />
              </div>
              <p className="text-sm font-semibold text-foreground">{placeholder}</p>
              <p className="text-xs text-muted-foreground">Supports JPEG, PNG, WebP, AVIF</p>
            </div>
          )}
        </div>
      )}

      {error && <p className="text-xs text-destructive font-medium mt-1">{error}</p>}

      <input
        ref={fileInputRef}
        type="file"
        accept={ALLOWED_TYPES.join(",")}
        onChange={onFileChange}
        className="hidden"
      />
    </div>
  );
}
