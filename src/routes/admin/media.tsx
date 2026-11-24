import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Image as ImageIcon,
  Upload,
  Search,
  Trash2,
  Copy,
  Check,
  ExternalLink,
  ShieldAlert,
  Loader2,
} from "lucide-react";
import {
  getAdminMediaDataServerFn,
  deleteDocumentServerFn,
  checkImageReferencesServerFn,
} from "../../lib/admin-actions.server";
import { ImageUploader } from "../../components/admin/ImageUploader";
import { ConfirmDialog } from "../../components/admin/ConfirmDialog";

interface MediaAsset {
  _id: string;
  url: string;
  originalFilename?: string;
  mimeType?: string;
  size?: number;
  metadata?: {
    dimensions?: { width: number; height: number };
  };
  altText?: string;
  _createdAt?: string;
}

export const Route = createFileRoute("/admin/media")({
  loader: async (): Promise<{ assets: MediaAsset[] }> => {
    try {
      const data = (await getAdminMediaDataServerFn()) as MediaAsset[];
      if (Array.isArray(data)) return { assets: data };
    } catch {
      // fallback
    }
    return { assets: [] };
  },
  head: () => ({
    meta: [{ title: "Media Library — Thirumal Admin" }],
  }),
  component: AdminMediaPage,
});

function AdminMediaPage() {
  const { assets: initialAssets } = Route.useLoaderData();
  const [assets, setAssets] = useState<MediaAsset[]>(initialAssets);
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<MediaAsset | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [refWarning, setRefWarning] = useState<string | null>(null);
  const [previewAsset, setPreviewAsset] = useState<MediaAsset | null>(null);

  const handleCopyUrl = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCheckAndDelete = async (asset: MediaAsset) => {
    setRefWarning(null);
    try {
      const refs = (await checkImageReferencesServerFn({
        data: { assetId: asset._id },
      })) as unknown[];
      if (Array.isArray(refs) && refs.length > 0) {
        setRefWarning(
          `This asset is referenced in ${refs.length} document(s). Deleting it might cause broken images on the public site!`,
        );
      }
    } catch {
      // ignore
    }
    setDeleteTarget(asset);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await deleteDocumentServerFn({ data: { id: deleteTarget._id } });
      setAssets(assets.filter((a) => a._id !== deleteTarget._id));
      setDeleteTarget(null);
      setPreviewAsset(null);
    } catch (e) {
      console.error(e);
      alert("Failed to delete asset from Sanity.");
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredAssets = assets.filter((a) => {
    const q = searchQuery.toLowerCase();
    return (
      (a.originalFilename || "").toLowerCase().includes(q) ||
      (a.altText || "").toLowerCase().includes(q) ||
      (a.url || "").toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-8">
      {/* ── Page Header ────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground">
            Sanity Media Library
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Upload, preview, optimize and manage high-resolution image assets hosted on the Sanity CDN.
          </p>
        </div>
      </div>

      {/* ── Upload Area ─────────────────────────────────────────── */}
      <div className="p-6 md:p-8 rounded-3xl bg-card border border-border shadow-lg space-y-4">
        <h2 className="font-display text-xl font-bold text-foreground flex items-center gap-2">
          <Upload size={18} className="text-gold" /> Upload New Media
        </h2>
        <ImageUploader
          label="Drag & Drop or Choose Image"
          placeholder="Upload high-res photo to Sanity CDN (JPEG, PNG, WebP, AVIF up to 10MB)"
          onChange={(newUrl) => {
            if (newUrl) {
              const newAsset: MediaAsset = {
                _id: `image-${Date.now()}`,
                url: newUrl,
                originalFilename: "Uploaded via Admin",
                _createdAt: new Date().toISOString(),
              };
              setAssets([newAsset, ...assets]);
            }
          }}
        />
      </div>

      {/* ── Search & Filter ─────────────────────────────────────── */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative max-w-md w-full">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search images by name or keyword..."
            className="w-full pl-11 pr-4 py-3 rounded-2xl border border-input bg-background text-sm"
          />
        </div>
        <span className="text-xs font-semibold text-muted-foreground">
          {filteredAssets.length} of {assets.length} image(s)
        </span>
      </div>

      {/* ── Asset Grid ──────────────────────────────────────────── */}
      {filteredAssets.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filteredAssets.map((asset) => (
            <div
              key={asset._id}
              className="group relative rounded-2xl overflow-hidden border border-border bg-card shadow-md aspect-square flex flex-col justify-between"
            >
              <img
                src={asset.url}
                alt={asset.altText || "Sanity asset"}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />

              {/* Hover overlay actions */}
              <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity p-3 flex flex-col justify-between text-white text-xs">
                <div className="flex items-center justify-between">
                  <span className="truncate text-[10px] opacity-80 max-w-[100px]">
                    {asset.originalFilename || "Asset"}
                  </span>
                  <button
                    onClick={() => handleCheckAndDelete(asset)}
                    className="p-1.5 rounded-full bg-destructive/80 hover:bg-destructive text-white"
                    title="Delete image"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>

                <div className="space-y-1.5">
                  <button
                    onClick={() => handleCopyUrl(asset.url, asset._id)}
                    className="w-full py-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-[10px] font-bold flex items-center justify-center gap-1"
                  >
                    {copiedId === asset._id ? (
                      <>
                        <Check size={12} className="text-emerald-400" /> Copied!
                      </>
                    ) : (
                      <>
                        <Copy size={12} /> Copy URL
                      </>
                    )}
                  </button>
                  <a
                    href={asset.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-[10px] font-semibold flex items-center justify-center gap-1"
                  >
                    <ExternalLink size={12} /> Full View
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-12 text-center rounded-3xl border border-dashed border-border text-muted-foreground space-y-3">
          <ImageIcon size={36} className="mx-auto text-gold/60" />
          <p className="text-sm font-semibold text-foreground">
            No media assets found
          </p>
          <p className="text-xs text-muted-foreground">
            {searchQuery
              ? "Try adjusting your search keywords."
              : "Upload your first image above to store it in Sanity CMS."}
          </p>
        </div>
      )}

      {/* ── Confirm Delete Dialog ───────────────────────────────── */}
      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete Image Asset?"
        description={
          refWarning
            ? `${refWarning} Are you absolutely sure you want to permanently delete this image asset from Sanity?`
            : "Are you sure you want to remove this image asset from the Sanity Media Library?"
        }
        confirmLabel={isDeleting ? "Deleting..." : "Yes, Delete Asset"}
        destructive
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setDeleteTarget(null);
          setRefWarning(null);
        }}
      />
    </div>
  );
}
