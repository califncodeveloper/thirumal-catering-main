import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Calendar,
  Check,
  Loader2,
  Image as ImageIcon,
  Users,
} from "lucide-react";
import {
  getAdminEventsDataServerFn,
  saveSingletonDocServerFn,
  deleteDocumentServerFn,
} from "../../lib/admin-actions.server";
import { ImageUploader } from "../../components/admin/ImageUploader";
import { ConfirmDialog } from "../../components/admin/ConfirmDialog";
import { events as fallbackEvents, galleryImages as fallbackGallery } from "../../data/events";
import type { EventItem } from "../../lib/sanity.types";

export const Route = createFileRoute("/admin/events")({
  loader: async () => {
    try {
      const data = (await getAdminEventsDataServerFn()) as EventItem[];
      if (data && data.length > 0) return { events: data };
    } catch {
      // fallback
    }
    const initial: EventItem[] = fallbackEvents.map((e, idx) => ({
      _id: `event-${e.id}`,
      _type: "event",
      title: e.title,
      category: e.category,
      stat: e.stat,
      description: e.desc,
      image: e.image,
      order: idx + 1,
      visible: true,
    }));
    return { events: initial };
  },
  head: () => ({
    meta: [{ title: "Events & Gallery — Thirumal Admin" }],
  }),
  component: AdminEventsPage,
});

function AdminEventsPage() {
  const { events: initialEvents } = Route.useLoaderData();
  const [eventsList, setEventsList] = useState<EventItem[]>(initialEvents);
  const [galleryList, setGalleryList] = useState<string[]>(fallbackGallery);
  const [editingEvent, setEditingEvent] = useState<EventItem | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<EventItem | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"events" | "gallery">("events");

  const showToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(null), 3000);
  };

  const handleSaveEvent = async (event: EventItem) => {
    setIsSaving(true);
    try {
      await saveSingletonDocServerFn({ data: { doc: event } });
      if (isCreating) {
        setEventsList([...eventsList, event]);
        showToast("Event created successfully!");
      } else {
        setEventsList(
          eventsList.map((e) => (e._id === event._id ? event : e)),
        );
        showToast("Event updated successfully!");
      }
      setEditingEvent(null);
      setIsCreating(false);
    } catch (err) {
      console.error(err);
      alert("Failed to save event.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteEvent = async () => {
    if (!deleteTarget) return;
    setIsSaving(true);
    try {
      await deleteDocumentServerFn({ data: { id: deleteTarget._id } });
      setEventsList(eventsList.filter((e) => e._id !== deleteTarget._id));
      showToast("Event deleted successfully.");
      setDeleteTarget(null);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* ── Page Header ────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground">
            Events Portfolio & Gallery
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Showcase past catering celebrations and kitchen gallery photos.
          </p>
        </div>

        {activeTab === "events" && (
          <button
            type="button"
            onClick={() => {
              setEditingEvent({
                _id: `event-${Date.now()}`,
                _type: "event",
                title: "",
                category: "Wedding",
                stat: "500 guests",
                description: "",
                image: "/images/wedding-event-hall.jpg",
                order: eventsList.length + 1,
                visible: true,
              });
              setIsCreating(true);
            }}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full gold-gradient text-maroon-deep font-bold text-xs uppercase tracking-wider shadow-lg hover:brightness-105"
          >
            <Plus size={16} /> Add New Event
          </button>
        )}
      </div>

      {successToast && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <Check size={16} /> {successToast}
        </div>
      )}

      {/* ── Tabs ────────────────────────────────────────────────── */}
      <div className="flex items-center gap-2 border-b border-border pb-3">
        <button
          onClick={() => setActiveTab("events")}
          className={`px-6 py-2.5 rounded-full text-xs font-bold transition-all ${
            activeTab === "events"
              ? "gold-gradient text-maroon-deep shadow-md"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Featured Events ({eventsList.length})
        </button>
        <button
          onClick={() => setActiveTab("gallery")}
          className={`px-6 py-2.5 rounded-full text-xs font-bold transition-all ${
            activeTab === "gallery"
              ? "gold-gradient text-maroon-deep shadow-md"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Photo Gallery ({galleryList.length})
        </button>
      </div>

      {/* ── Events Tab ─────────────────────────────────────────── */}
      {activeTab === "events" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {eventsList.map((event, idx) => (
            <div
              key={event._id}
              className="rounded-3xl bg-card border border-border overflow-hidden shadow-lg hover:shadow-xl transition-all flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-[16/10] bg-muted overflow-hidden">
                  <img
                    src={
                      typeof event.image === "string"
                        ? event.image
                        : "/images/wedding-event-hall.jpg"
                    }
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 px-3 py-1 rounded-full gold-gradient text-maroon-deep font-bold text-[10px] uppercase tracking-wider shadow">
                    {event.category}
                  </div>
                  <div className="absolute bottom-3 left-3 px-3 py-1 rounded-full bg-black/70 text-white font-semibold text-[10px] flex items-center gap-1 backdrop-blur-sm">
                    <Users size={11} /> {event.stat}
                  </div>
                </div>

                <div className="p-6 space-y-2">
                  <h3 className="font-display text-xl font-bold text-foreground">
                    {event.title}
                  </h3>
                  <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                    {event.description}
                  </p>
                </div>
              </div>

              <div className="p-4 bg-muted/30 border-t border-border flex items-center justify-between">
                <span className="text-[11px] font-semibold text-muted-foreground">
                  Order #{event.order ?? idx + 1}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingEvent(event);
                      setIsCreating(false);
                    }}
                    className="p-2 rounded-xl border border-border hover:border-gold hover:bg-gold/10 text-foreground transition-colors"
                  >
                    <Pencil size={15} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteTarget(event)}
                    className="p-2 rounded-xl border border-destructive/30 hover:bg-destructive/10 text-destructive transition-colors"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Gallery Tab ─────────────────────────────────────────── */}
      {activeTab === "gallery" && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-card border border-border space-y-4">
            <h3 className="font-display text-xl font-bold">Add Gallery Image</h3>
            <ImageUploader
              label="Upload new kitchen / event photo"
              onChange={(url) => {
                if (url) {
                  setGalleryList([url, ...galleryList]);
                  showToast("Photo added to gallery!");
                }
              }}
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {galleryList.map((img, i) => (
              <div
                key={i}
                className="relative rounded-2xl overflow-hidden aspect-square border border-border group"
              >
                <img
                  src={img}
                  alt={`Gallery ${i}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                <button
                  type="button"
                  onClick={() => {
                    setGalleryList(galleryList.filter((_, idx) => idx !== i));
                    showToast("Photo removed from gallery.");
                  }}
                  className="absolute top-2 right-2 p-1.5 rounded-full bg-destructive text-white opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Remove photo"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Edit / Create Event Modal ───────────────────────────── */}
      {editingEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-card border border-border rounded-3xl p-6 md:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl space-y-6">
            <h2 className="font-display text-2xl font-bold text-foreground">
              {isCreating ? "Add Event Portfolio" : "Edit Event Portfolio"}
            </h2>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSaveEvent(editingEvent);
              }}
              className="space-y-5"
            >
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                  Event Title
                </label>
                <input
                  type="text"
                  required
                  value={editingEvent.title}
                  onChange={(e) =>
                    setEditingEvent({ ...editingEvent, title: e.target.value })
                  }
                  placeholder="e.g. Grand Tambaram Wedding"
                  className="w-full px-4 py-3 rounded-2xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                    Category
                  </label>
                  <input
                    type="text"
                    required
                    value={editingEvent.category}
                    onChange={(e) =>
                      setEditingEvent({
                        ...editingEvent,
                        category: e.target.value,
                      })
                    }
                    placeholder="Wedding, Reception, Corporate..."
                    className="w-full px-4 py-3 rounded-2xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                    Guest Stat Badge
                  </label>
                  <input
                    type="text"
                    required
                    value={editingEvent.stat}
                    onChange={(e) =>
                      setEditingEvent({ ...editingEvent, stat: e.target.value })
                    }
                    placeholder="e.g. 800 guests"
                    className="w-full px-4 py-3 rounded-2xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                  Event Story / Details
                </label>
                <textarea
                  rows={4}
                  required
                  value={editingEvent.description}
                  onChange={(e) =>
                    setEditingEvent({
                      ...editingEvent,
                      description: e.target.value,
                    })
                  }
                  placeholder="Describe the occasion, dishes served, and atmosphere..."
                  className="w-full px-4 py-3 rounded-2xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                />
              </div>

              <ImageUploader
                label="Event Photo"
                value={
                  typeof editingEvent.image === "string"
                    ? editingEvent.image
                    : ""
                }
                onChange={(url) =>
                  setEditingEvent({ ...editingEvent, image: url })
                }
              />

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={() => {
                    setEditingEvent(null);
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
                  Save Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Delete Confirmation ─────────────────────────────────── */}
      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete Event Entry?"
        description={`Are you sure you want to delete "${deleteTarget?.title}"?`}
        confirmLabel="Yes, Delete"
        destructive
        onConfirm={handleDeleteEvent}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
