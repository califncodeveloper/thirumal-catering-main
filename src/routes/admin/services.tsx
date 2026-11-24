import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  Briefcase,
  Check,
  Loader2,
  ArrowUpDown,
} from "lucide-react";
import {
  getAdminServicesDataServerFn,
  createDocumentServerFn,
  saveSingletonDocServerFn,
  deleteDocumentServerFn,
} from "../../lib/admin-actions.server";
import { ImageUploader } from "../../components/admin/ImageUploader";
import { ConfirmDialog } from "../../components/admin/ConfirmDialog";
import { services as fallbackServices } from "../../data/services";
import type { ServiceItem } from "../../lib/sanity.types";

export const Route = createFileRoute("/admin/services")({
  loader: async () => {
    try {
      const data = (await getAdminServicesDataServerFn()) as ServiceItem[];
      if (data && data.length > 0) return { services: data };
    } catch {
      // fallback
    }
    // format fallback
    const initial: ServiceItem[] = fallbackServices.map((s, idx) => ({
      _id: `service-${s.id}`,
      _type: "service",
      title: s.title,
      description: s.desc,
      image: s.image,
      iconName: s.icon.name || "Heart",
      order: idx + 1,
      visible: true,
    }));
    return { services: initial };
  },
  head: () => ({
    meta: [{ title: "Services Management — Thirumal Admin" }],
  }),
  component: AdminServicesPage,
});

function AdminServicesPage() {
  const { services: initialServices } = Route.useLoaderData();
  const [servicesList, setServicesList] = useState<ServiceItem[]>(initialServices);
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<ServiceItem | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(null), 3000);
  };

  const handleSaveService = async (service: ServiceItem) => {
    setIsSaving(true);
    try {
      await saveSingletonDocServerFn({ data: { doc: service } });
      if (isCreating) {
        setServicesList([...servicesList, service]);
        showToast("Service created successfully!");
      } else {
        setServicesList(
          servicesList.map((s) => (s._id === service._id ? service : s)),
        );
        showToast("Service updated successfully!");
      }
      setEditingService(null);
      setIsCreating(false);
    } catch (err) {
      console.error(err);
      alert("Failed to save service. Check console.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteService = async () => {
    if (!deleteTarget) return;
    setIsSaving(true);
    try {
      await deleteDocumentServerFn({ data: { id: deleteTarget._id } });
      setServicesList(servicesList.filter((s) => s._id !== deleteTarget._id));
      showToast("Service deleted successfully.");
      setDeleteTarget(null);
    } catch (err) {
      console.error(err);
      alert("Failed to delete service.");
    } finally {
      setIsSaving(false);
    }
  };

  const toggleVisibility = async (service: ServiceItem) => {
    const updated = { ...service, visible: !service.visible };
    try {
      await saveSingletonDocServerFn({ data: { doc: updated } });
      setServicesList(
        servicesList.map((s) => (s._id === service._id ? updated : s)),
      );
      showToast(`Service ${updated.visible ? "enabled" : "hidden"}!`);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-8">
      {/* ── Page Header ────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground">
            Services Management
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Create, update, reorder and publish catering service categories.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setEditingService({
              _id: `service-${Date.now()}`,
              _type: "service",
              title: "",
              description: "",
              image: "/images/wedding-event-hall.jpg",
              iconName: "Heart",
              order: servicesList.length + 1,
              visible: true,
            });
            setIsCreating(true);
          }}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full gold-gradient text-maroon-deep font-bold text-xs uppercase tracking-wider shadow-lg hover:brightness-105"
        >
          <Plus size={16} /> Add New Service
        </button>
      </div>

      {successToast && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <Check size={16} /> {successToast}
        </div>
      )}

      {/* ── Services Grid ───────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {servicesList.map((service, index) => (
          <div
            key={service._id}
            className={`rounded-3xl bg-card border overflow-hidden shadow-lg hover:shadow-xl transition-all flex flex-col justify-between ${
              service.visible ? "border-border" : "border-dashed opacity-60"
            }`}
          >
            <div>
              <div className="relative aspect-[16/10] bg-muted overflow-hidden">
                <img
                  src={
                    typeof service.image === "string"
                      ? service.image
                      : "/images/wedding-event-hall.jpg"
                  }
                  alt={service.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 px-3 py-1 rounded-full gold-gradient text-maroon-deep font-bold text-[10px] uppercase tracking-wider shadow">
                  Order #{service.order ?? index + 1}
                </div>
                <div className="absolute top-3 right-3 flex items-center gap-1.5">
                  <button
                    onClick={() => toggleVisibility(service)}
                    className="p-2 rounded-full bg-black/60 text-white backdrop-blur-sm hover:scale-105 transition-transform"
                    title={service.visible ? "Click to hide" : "Click to show"}
                  >
                    {service.visible ? <Eye size={14} /> : <EyeOff size={14} />}
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl gold-gradient text-maroon-deep grid place-items-center shrink-0">
                    <Briefcase size={16} />
                  </div>
                  <h3 className="font-display text-xl font-bold text-foreground">
                    {service.title || "Untitled Service"}
                  </h3>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                  {service.description || "No description provided."}
                </p>
              </div>
            </div>

            <div className="p-4 bg-muted/30 border-t border-border flex items-center justify-between">
              <span className="text-[11px] font-semibold text-muted-foreground">
                Icon: {service.iconName || "Heart"}
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setEditingService(service);
                    setIsCreating(false);
                  }}
                  className="p-2 rounded-xl border border-border hover:border-gold hover:bg-gold/10 text-foreground transition-colors"
                  title="Edit service"
                >
                  <Pencil size={15} />
                </button>
                <button
                  type="button"
                  onClick={() => setDeleteTarget(service)}
                  className="p-2 rounded-xl border border-destructive/30 hover:bg-destructive/10 text-destructive transition-colors"
                  title="Delete service"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Edit / Create Modal ─────────────────────────────────── */}
      {editingService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-card border border-border rounded-3xl p-6 md:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl space-y-6">
            <h2 className="font-display text-2xl font-bold text-foreground">
              {isCreating ? "Create Catering Service" : "Edit Catering Service"}
            </h2>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSaveService(editingService);
              }}
              className="space-y-5"
            >
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                  Service Title
                </label>
                <input
                  type="text"
                  required
                  value={editingService.title}
                  onChange={(e) =>
                    setEditingService({ ...editingService, title: e.target.value })
                  }
                  placeholder="e.g. Grand Weddings"
                  className="w-full px-4 py-3 rounded-2xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                  Description
                </label>
                <textarea
                  rows={4}
                  required
                  value={editingService.description}
                  onChange={(e) =>
                    setEditingService({
                      ...editingService,
                      description: e.target.value,
                    })
                  }
                  placeholder="Describe this catering service in detail..."
                  className="w-full px-4 py-3 rounded-2xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                    Icon Name
                  </label>
                  <select
                    value={editingService.iconName}
                    onChange={(e) =>
                      setEditingService({
                        ...editingService,
                        iconName: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 rounded-2xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="Heart">Heart (Wedding)</option>
                    <option value="Building2">Building2 (Corporate)</option>
                    <option value="Cake">Cake (Birthday)</option>
                    <option value="Home">Home (Housewarming)</option>
                    <option value="Flame">Flame (Temple)</option>
                    <option value="Sparkles">Sparkles (Custom)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                    Display Order
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={editingService.order}
                    onChange={(e) =>
                      setEditingService({
                        ...editingService,
                        order: parseInt(e.target.value) || 1,
                      })
                    }
                    className="w-full px-4 py-3 rounded-2xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <ImageUploader
                label="Service Cover Image"
                value={
                  typeof editingService.image === "string"
                    ? editingService.image
                    : ""
                }
                onChange={(url) =>
                  setEditingService({ ...editingService, image: url })
                }
              />

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={() => {
                    setEditingService(null);
                    setIsCreating(false);
                  }}
                  className="px-5 py-2.5 rounded-full border border-border text-xs font-semibold hover:bg-muted"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-7 py-2.5 rounded-full gold-gradient text-maroon-deep font-bold text-xs uppercase tracking-wider shadow-lg hover:brightness-105 flex items-center gap-2"
                >
                  {isSaving && <Loader2 size={14} className="animate-spin" />}
                  Save Service
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Delete Confirmation ─────────────────────────────────── */}
      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete Service?"
        description={`Are you sure you want to delete "${deleteTarget?.title}"? This will remove the service from the public website.`}
        confirmLabel="Yes, Delete"
        destructive
        onConfirm={handleDeleteService}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
