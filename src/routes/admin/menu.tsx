import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  UtensilsCrossed,
  Plus,
  Pencil,
  Trash2,
  Check,
  Loader2,
  DollarSign,
  Languages,
  Eye,
  EyeOff,
  Sparkles,
} from "lucide-react";
import {
  getAdminMenuDataServerFn,
  saveSingletonDocServerFn,
  deleteDocumentServerFn,
} from "../../lib/admin-actions.server";
import { ConfirmDialog } from "../../components/admin/ConfirmDialog";
import { tiffinSets, lunchSets, dinnerSets, type MenuSet } from "../../data/menu";
import {
  friedRiceNoodles,
  indianBreads,
  northIndianGravy,
  grillTandooriBBQ,
  type PricedMenuItem,
  type PricedMenuCategory,
} from "../../data/additionalMenu";
import type { MenuCategory, CmsMenuSet, CmsMenuItem } from "../../lib/sanity.types";

interface MenuLoaderData {
  categories: MenuCategory[];
  sets: CmsMenuSet[];
  items: CmsMenuItem[];
}

export const Route = createFileRoute("/admin/menu")({
  loader: async (): Promise<MenuLoaderData> => {
    try {
      const data = (await getAdminMenuDataServerFn()) as MenuLoaderData;
      if (data && data.categories && data.categories.length > 0) {
        return data;
      }
    } catch {
      // fallback
    }

    // Default 7 Categories
    const categories: MenuCategory[] = [
      {
        _id: "cat-tiffin",
        _type: "menuCategory",
        title: "Tiffin",
        tamil: "டிபன்",
        menuType: "sets",
        order: 1,
        visible: true,
      },
      {
        _id: "cat-lunch",
        _type: "menuCategory",
        title: "Lunch",
        tamil: "சாப்பாடு",
        menuType: "sets",
        order: 2,
        visible: true,
      },
      {
        _id: "cat-dinner",
        _type: "menuCategory",
        title: "Dinner",
        tamil: "டின்னர்",
        menuType: "sets",
        order: 3,
        visible: true,
      },
      {
        _id: "cat-fried-rice-noodles",
        _type: "menuCategory",
        title: friedRiceNoodles.title,
        tamil: friedRiceNoodles.tamil || "ப்ரைட் ரைஸ் & நூடுல்ஸ்",
        description: friedRiceNoodles.description,
        menuType: "priced",
        order: 4,
        visible: true,
      },
      {
        _id: "cat-indian-breads",
        _type: "menuCategory",
        title: indianBreads.title,
        tamil: indianBreads.tamil || "இந்தியன் பிரெட்ஸ்",
        description: indianBreads.description,
        menuType: "priced",
        order: 5,
        visible: true,
      },
      {
        _id: "cat-north-indian-gravy",
        _type: "menuCategory",
        title: northIndianGravy.title,
        tamil: northIndianGravy.tamil || "வட இந்திய கிரேவி",
        description: northIndianGravy.description,
        menuType: "priced",
        order: 6,
        visible: true,
      },
      {
        _id: "cat-grill-tandoori-bbq",
        _type: "menuCategory",
        title: grillTandooriBBQ.title,
        tamil: grillTandooriBBQ.tamil || "கிரில், தந்தூரி & BBQ",
        description: grillTandooriBBQ.description,
        menuType: "priced",
        order: 7,
        visible: true,
      },
    ];

    // Default 14 Sets
    const sets: CmsMenuSet[] = [
      ...tiffinSets.map((s, idx) => ({
        _id: `set-${s.id}`,
        _type: "menuSet",
        title: s.title,
        tamil: s.tamil,
        items: s.items,
        variant: s.variant,
        categoryId: "cat-tiffin",
        order: idx + 1,
      })),
      ...lunchSets.map((s, idx) => ({
        _id: `set-${s.id}`,
        _type: "menuSet",
        title: s.title,
        tamil: s.tamil,
        items: s.items,
        variant: s.variant,
        categoryId: "cat-lunch",
        order: idx + 1,
      })),
      ...dinnerSets.map((s, idx) => ({
        _id: `set-${s.id}`,
        _type: "menuSet",
        title: s.title,
        tamil: s.tamil,
        items: s.items,
        variant: s.variant,
        categoryId: "cat-dinner",
        order: idx + 1,
      })),
    ];

    // Default 38 Priced Items
    const items: CmsMenuItem[] = [
      ...friedRiceNoodles.items.map((i, idx) => ({
        _id: `item-${i.id}`,
        _type: "menuItem",
        name: i.name,
        price: i.price,
        categoryId: "cat-fried-rice-noodles",
        order: idx + 1,
      })),
      ...indianBreads.items.map((i, idx) => ({
        _id: `item-${i.id}`,
        _type: "menuItem",
        name: i.name,
        price: i.price,
        categoryId: "cat-indian-breads",
        order: idx + 1,
      })),
      ...northIndianGravy.items.map((i, idx) => ({
        _id: `item-${i.id}`,
        _type: "menuItem",
        name: i.name,
        price: i.price,
        categoryId: "cat-north-indian-gravy",
        order: idx + 1,
      })),
      ...grillTandooriBBQ.items.map((i, idx) => ({
        _id: `item-${i.id}`,
        _type: "menuItem",
        name: i.name,
        price: i.price,
        categoryId: "cat-grill-tandoori-bbq",
        order: idx + 1,
      })),
    ];

    return { categories, sets, items };
  },
  head: () => ({
    meta: [{ title: "Menu Management — Thirumal Admin" }],
  }),
  component: AdminMenuPage,
});

function AdminMenuPage() {
  const data = Route.useLoaderData();
  const [categories, setCategories] = useState<MenuCategory[]>(data.categories);
  const [sets, setSets] = useState<CmsMenuSet[]>(data.sets);
  const [items, setItems] = useState<CmsMenuItem[]>(data.items);

  const [activeCategoryId, setActiveCategoryId] = useState<string>(
    categories[0]?._id || "cat-tiffin",
  );

  const currentCategory = categories.find((c) => c._id === activeCategoryId);
  const isSetCategory = currentCategory?.menuType === "sets";

  // Modal edit states
  const [editingCategory, setEditingCategory] = useState<MenuCategory | null>(null);
  const [editingSet, setEditingSet] = useState<CmsMenuSet | null>(null);
  const [isCreatingSet, setIsCreatingSet] = useState(false);
  const [editingItem, setEditingItem] = useState<CmsMenuItem | null>(null);
  const [isCreatingItem, setIsCreatingItem] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);

  const [isSaving, setIsSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  /* ── Save Handlers ────────────────────────────────────────────── */

  const handleSaveCategory = async (cat: MenuCategory) => {
    setIsSaving(true);
    try {
      await saveSingletonDocServerFn({ data: { doc: cat } });
      setCategories(categories.map((c) => (c._id === cat._id ? cat : c)));
      setEditingCategory(null);
      showToast("Category updated successfully!");
    } catch (e) {
      console.error(e);
      alert("Failed to save category.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveSet = async (s: CmsMenuSet) => {
    setIsSaving(true);
    try {
      await saveSingletonDocServerFn({ data: { doc: s } });
      if (isCreatingSet) {
        setSets([...sets, s]);
        showToast("Menu set created!");
      } else {
        setSets(sets.map((item) => (item._id === s._id ? s : item)));
        showToast("Menu set updated!");
      }
      setEditingSet(null);
      setIsCreatingSet(false);
    } catch (e) {
      console.error(e);
      alert("Failed to save set.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveItem = async (it: CmsMenuItem) => {
    setIsSaving(true);
    try {
      await saveSingletonDocServerFn({ data: { doc: it } });
      if (isCreatingItem) {
        setItems([...items, it]);
        showToast("Priced item added!");
      } else {
        setItems(items.map((i) => (i._id === it._id ? it : i)));
        showToast("Price updated successfully!");
      }
      setEditingItem(null);
      setIsCreatingItem(false);
    } catch (e) {
      console.error(e);
      alert("Failed to save item.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteConfirmed = async () => {
    if (!deleteTarget) return;
    setIsSaving(true);
    try {
      await deleteDocumentServerFn({ data: { id: deleteTarget.id } });
      setSets(sets.filter((s) => s._id !== deleteTarget.id));
      setItems(items.filter((i) => i._id !== deleteTarget.id));
      showToast("Item deleted.");
      setDeleteTarget(null);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSaving(false);
    }
  };

  const activeSets = sets.filter((s) => s.categoryId === activeCategoryId);
  const activeItems = items.filter((i) => i.categoryId === activeCategoryId);

  return (
    <div className="space-y-8">
      {/* ── Page Header ────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground">
            Menu Management
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage 7 categories, 14 traditional banana leaf sets, and 38 priced items with Tamil typography.
          </p>
        </div>

        {isSetCategory ? (
          <button
            type="button"
            onClick={() => {
              setEditingSet({
                _id: `set-${Date.now()}`,
                _type: "menuSet",
                title: `New Set ${activeSets.length + 1}`,
                tamil: "புதிய தொகுப்பு",
                items: ["சாம்பார்", "ரசம்", "சாதம்", "வாட்டர் பாட்டல்"],
                variant: "maroon",
                categoryId: activeCategoryId,
                order: activeSets.length + 1,
              });
              setIsCreatingSet(true);
            }}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full gold-gradient text-maroon-deep font-bold text-xs uppercase tracking-wider shadow-lg hover:brightness-105"
          >
            <Plus size={16} /> Add Menu Set
          </button>
        ) : (
          <button
            type="button"
            onClick={() => {
              setEditingItem({
                _id: `item-${Date.now()}`,
                _type: "menuItem",
                name: "New Dish Name",
                price: 150,
                categoryId: activeCategoryId,
                order: activeItems.length + 1,
              });
              setIsCreatingItem(true);
            }}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full gold-gradient text-maroon-deep font-bold text-xs uppercase tracking-wider shadow-lg hover:brightness-105"
          >
            <Plus size={16} /> Add Priced Dish
          </button>
        )}
      </div>

      {toastMessage && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <Check size={16} /> {toastMessage}
        </div>
      )}

      {/* ── Category Pill Tabs (7 Categories) ───────────────────── */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
        {categories.map((cat) => {
          const isActive = cat._id === activeCategoryId;
          return (
            <button
              key={cat._id}
              onClick={() => setActiveCategoryId(cat._id)}
              className={`shrink-0 px-5 py-3 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 ${
                isActive
                  ? "gold-gradient text-maroon-deep shadow-lg"
                  : "bg-card border border-border text-foreground hover:border-gold"
              }`}
            >
              <span>{cat.title}</span>
              {cat.tamil && <span className="opacity-75">· {cat.tamil}</span>}
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full ${
                  cat.menuType === "sets"
                    ? "bg-maroon-deep text-cream"
                    : "bg-leaf text-white"
                }`}
              >
                {cat.menuType === "sets" ? "Sets" : "Priced"}
              </span>
            </button>
          );
        })}
      </div>

      {/* ── Active Category Header Banner ───────────────────────── */}
      {currentCategory && (
        <div className="p-6 rounded-3xl bg-card border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="font-display text-2xl font-bold text-foreground">
                {currentCategory.title}
              </h2>
              {currentCategory.tamil && (
                <span className="font-tamil text-lg font-bold text-primary">
                  {currentCategory.tamil}
                </span>
              )}
            </div>
            {currentCategory.description && (
              <p className="text-xs text-muted-foreground mt-1 max-w-2xl leading-relaxed">
                {currentCategory.description}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={() => setEditingCategory(currentCategory)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-border hover:border-gold text-xs font-bold text-foreground"
          >
            <Pencil size={14} /> Edit Category Info
          </button>
        </div>
      )}

      {/* ── Category Content: Traditional Sets ──────────────────── */}
      {isSetCategory ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeSets.map((s, idx) => {
            const isLeaf = s.variant === "leaf";
            return (
              <div
                key={s._id}
                className={`rounded-3xl border-2 p-6 shadow-xl flex flex-col justify-between text-cream relative ${
                  isLeaf ? "bg-[#1f5c2a] border-gold/50" : "bg-[#7A1F1F] border-gold/50"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between border-b border-gold/30 pb-3 mb-4">
                    <div>
                      <span className="font-tamil text-xl font-bold text-gold-light">
                        {s.tamil}
                      </span>
                      <p className="text-xs uppercase tracking-wider text-cream/80">
                        {s.title}
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => {
                          setEditingSet(s);
                          setIsCreatingSet(false);
                        }}
                        className="p-2 rounded-xl bg-black/30 hover:bg-black/50 text-white"
                        title="Edit Set"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => setDeleteTarget({ id: s._id, name: s.title })}
                        className="p-2 rounded-xl bg-destructive/60 hover:bg-destructive text-white"
                        title="Delete Set"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  <ul className="space-y-1.5 text-sm font-tamil">
                    {s.items.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-cream/90">
                        <span className="text-gold-light text-xs mt-1">◆</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-6 pt-3 border-t border-gold/20 flex items-center justify-between text-xs text-gold-light font-bold">
                  <span>{s.items.length} Traditional Items</span>
                  <span className="capitalize">{s.variant} Theme</span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* ── Category Content: Priced Ala-carte Dishes ────────── */
        <div className="bg-card border border-border rounded-3xl p-6 shadow-lg space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Dish Name ({activeItems.length} items)
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground pr-12">
              Price (INR)
            </span>
          </div>

          <div className="divide-y divide-border/60">
            {activeItems.map((item) => (
              <div
                key={item._id}
                className="py-3.5 flex items-center justify-between gap-4 hover:bg-muted/30 px-3 rounded-2xl transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-gold-light text-xs">◆</span>
                  <span className="font-semibold text-sm text-foreground">
                    {item.name}
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  <span className="font-display font-bold text-lg text-primary bg-primary/10 px-3 py-1 rounded-xl">
                    ₹{item.price}
                  </span>

                  <button
                    onClick={() => {
                      setEditingItem(item);
                      setIsCreatingItem(false);
                    }}
                    className="p-2 rounded-xl border border-border hover:border-gold hover:bg-gold/10 text-foreground"
                    title="Edit Item"
                  >
                    <Pencil size={15} />
                  </button>
                  <button
                    onClick={() => setDeleteTarget({ id: item._id, name: item.name })}
                    className="p-2 rounded-xl border border-destructive/30 hover:bg-destructive/10 text-destructive"
                    title="Delete Item"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Edit Category Modal ─────────────────────────────────── */}
      {editingCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-card border border-border rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl space-y-5">
            <h3 className="font-display text-2xl font-bold">Edit Category</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSaveCategory(editingCategory);
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                  Title (English)
                </label>
                <input
                  type="text"
                  required
                  value={editingCategory.title}
                  onChange={(e) =>
                    setEditingCategory({ ...editingCategory, title: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl border border-input bg-background text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                  Tamil Title
                </label>
                <input
                  type="text"
                  value={editingCategory.tamil}
                  onChange={(e) =>
                    setEditingCategory({ ...editingCategory, tamil: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl border border-input bg-background text-sm font-tamil"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={editingCategory.description || ""}
                  onChange={(e) =>
                    setEditingCategory({
                      ...editingCategory,
                      description: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 rounded-xl border border-input bg-background text-sm resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setEditingCategory(null)}
                  className="px-5 py-2.5 rounded-full border border-border text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2.5 rounded-full gold-gradient text-maroon-deep font-bold text-xs uppercase"
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Edit Menu Set Modal ─────────────────────────────────── */}
      {editingSet && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-card border border-border rounded-3xl p-6 md:p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl space-y-5">
            <h3 className="font-display text-2xl font-bold">
              {isCreatingSet ? "Add Menu Set" : "Edit Menu Set"}
            </h3>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSaveSet(editingSet);
              }}
              className="space-y-4"
            >
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                    Set Title
                  </label>
                  <input
                    type="text"
                    required
                    value={editingSet.title}
                    onChange={(e) =>
                      setEditingSet({ ...editingSet, title: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded-xl border border-input bg-background text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                    Tamil Title
                  </label>
                  <input
                    type="text"
                    required
                    value={editingSet.tamil}
                    onChange={(e) =>
                      setEditingSet({ ...editingSet, tamil: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded-xl border border-input bg-background text-sm font-tamil"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                  Card Theme
                </label>
                <select
                  value={editingSet.variant}
                  onChange={(e) =>
                    setEditingSet({
                      ...editingSet,
                      variant: e.target.value as "maroon" | "leaf",
                    })
                  }
                  className="w-full px-4 py-2.5 rounded-xl border border-input bg-background text-sm"
                >
                  <option value="maroon">Maroon Rich</option>
                  <option value="leaf">Banana Leaf Green</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                  Menu Items (One per line in Tamil)
                </label>
                <textarea
                  rows={8}
                  required
                  value={editingSet.items.join("\n")}
                  onChange={(e) =>
                    setEditingSet({
                      ...editingSet,
                      items: e.target.value
                        .split("\n")
                        .map((l) => l.trim())
                        .filter(Boolean),
                    })
                  }
                  className="w-full px-4 py-3 rounded-xl border border-input bg-background text-sm font-tamil resize-none leading-relaxed"
                />
                <p className="text-[11px] text-muted-foreground mt-1">
                  Enter each course item on a new line. Tamil script preserved.
                </p>
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => {
                    setEditingSet(null);
                    setIsCreatingSet(false);
                  }}
                  className="px-5 py-2.5 rounded-full border border-border text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2.5 rounded-full gold-gradient text-maroon-deep font-bold text-xs uppercase"
                >
                  Save Set
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Edit Priced Item Modal ──────────────────────────────── */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-card border border-border rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl space-y-5">
            <h3 className="font-display text-2xl font-bold">
              {isCreatingItem ? "Add Dish" : "Edit Dish & Price"}
            </h3>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSaveItem(editingItem);
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                  Dish Name
                </label>
                <input
                  type="text"
                  required
                  value={editingItem.name}
                  onChange={(e) =>
                    setEditingItem({ ...editingItem, name: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl border border-input bg-background text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                  Price in Rupees (₹)
                </label>
                <input
                  type="number"
                  required
                  min={0}
                  value={editingItem.price}
                  onChange={(e) =>
                    setEditingItem({
                      ...editingItem,
                      price: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="w-full px-4 py-3 rounded-xl border border-input bg-background text-sm font-bold"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => {
                    setEditingItem(null);
                    setIsCreatingItem(false);
                  }}
                  className="px-5 py-2.5 rounded-full border border-border text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2.5 rounded-full gold-gradient text-maroon-deep font-bold text-xs uppercase"
                >
                  Save Dish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Confirm Delete ──────────────────────────────────────── */}
      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete Item?"
        description={`Are you sure you want to delete "${deleteTarget?.name}"?`}
        confirmLabel="Yes, Delete"
        destructive
        onConfirm={handleDeleteConfirmed}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
