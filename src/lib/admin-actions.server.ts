import { createServerFn } from "@tanstack/react-start";
import {
  verifySession,
  SESSION_COOKIE_NAME,
} from "./auth.server";
import {
  sanityFetch,
  sanityCreate,
  sanityCreateOrReplace,
  sanityPatch,
  sanityDelete,
  sanityUploadImage,
} from "./sanity.server";
import {
  DASHBOARD_STATS_QUERY,
  MEDIA_LIBRARY_QUERY,
  IMAGE_REFERENCES_QUERY,
  ALL_SERVICES_QUERY,
  ALL_EVENTS_QUERY,
  ALL_MENU_CATEGORIES_QUERY,
  ALL_MENU_SETS_QUERY,
  ALL_MENU_ITEMS_QUERY,
  ALL_TESTIMONIALS_QUERY,
  ALL_SEO_SETTINGS_QUERY,
  HOMEPAGE_QUERY,
  ABOUT_PAGE_QUERY,
  CONTACT_PAGE_QUERY,
  HEADER_SETTINGS_QUERY,
  FOOTER_SETTINGS_QUERY,
} from "./sanity.queries";
import type { DashboardStats } from "./sanity.types";

/** Helper to enforce admin authorization in server functions.
 *  Uses dynamic import to avoid top-level @tanstack/react-start/server import
 *  which triggers the import-protection plugin in client bundles. */
async function assertAdminSession(): Promise<string> {
  const { getCookie } = await import("@tanstack/react-start/server");
  const token = getCookie(SESSION_COOKIE_NAME);
  if (!token) {
    throw new Error("Unauthorized: Admin session required");
  }
  const session = await verifySession(token);
  if (!session || !session.email) {
    throw new Error("Unauthorized: Invalid or expired admin session");
  }
  return session.email;
}

/** Get stats for Admin Dashboard */
export const getAdminStatsServerFn = createServerFn({ method: "GET" }).handler(
  async (): Promise<DashboardStats> => {
    await assertAdminSession();
    try {
      const stats = await sanityFetch<DashboardStats>(DASHBOARD_STATS_QUERY);
      return stats;
    } catch (err) {
      console.error("[admin] Failed to fetch stats from Sanity:", err);
      return {
        totalServices: 6,
        totalEvents: 6,
        totalMenuCategories: 7,
        totalMenuItems: 38,
        totalMenuSets: 14,
        totalTestimonials: 8,
        totalImages: 0,
      };
    }
  },
);

/** Generic single-document updater */
export const saveSingletonDocServerFn = createServerFn({ method: "POST" })
  .validator((data: unknown) => {
    if (!data || typeof data !== "object") throw new Error("Invalid payload");
    const { doc } = data as { doc: Record<string, unknown> };
    if (!doc || !doc._id || !doc._type) {
      throw new Error("Document must have _id and _type");
    }
    return { doc };
  })
  .handler(async ({ data }) => {
    const admin = await assertAdminSession();
    const { doc } = data;
    console.log(
      `[audit] Admin ${admin} updating document ${doc._id} (${doc._type}) at ${new Date().toISOString()}`,
    );
    const result = await sanityCreateOrReplace(doc);
    return { success: true, result };
  });

/** Generic document delete */
export const deleteDocumentServerFn = createServerFn({ method: "POST" })
  .validator((data: unknown) => {
    if (!data || typeof data !== "object") throw new Error("Invalid payload");
    const { id } = data as { id: string };
    if (!id || typeof id !== "string") throw new Error("Document ID required");
    return { id };
  })
  .handler(async ({ data }) => {
    const admin = await assertAdminSession();
    console.log(`[audit] Admin ${admin} deleting document ${data.id}`);
    await sanityDelete(data.id);
    return { success: true };
  });

/** Generic document create */
export const createDocumentServerFn = createServerFn({ method: "POST" })
  .validator((data: unknown) => {
    if (!data || typeof data !== "object") throw new Error("Invalid payload");
    const { doc } = data as { doc: Record<string, unknown> };
    if (!doc || !doc._type) throw new Error("Document _type required");
    return { doc };
  })
  .handler(async ({ data }) => {
    const admin = await assertAdminSession();
    console.log(`[audit] Admin ${admin} creating document of type ${data.doc._type}`);
    const result = await sanityCreate(data.doc);
    return { success: true, result };
  });

/** Generic document patch */
export const patchDocumentServerFn = createServerFn({ method: "POST" })
  .validator((data: unknown) => {
    if (!data || typeof data !== "object") throw new Error("Invalid payload");
    const { id, patch } = data as {
      id: string;
      patch: Record<string, unknown>;
    };
    if (!id || !patch) throw new Error("ID and patch required");
    return { id, patch };
  })
  .handler(async ({ data }) => {
    const admin = await assertAdminSession();
    console.log(`[audit] Admin ${admin} patching document ${data.id}`);
    const result = await sanityPatch(data.id, data.patch);
    return { success: true, result };
  });

/* ── Fetch functions for Admin Editors ───────────────────────────── */

export const getAdminHomepageDataServerFn = createServerFn({ method: "GET" }).handler(
  async () => {
    await assertAdminSession();
    return sanityFetch(HOMEPAGE_QUERY);
  },
);

export const getAdminAboutDataServerFn = createServerFn({ method: "GET" }).handler(
  async () => {
    await assertAdminSession();
    return sanityFetch(ABOUT_PAGE_QUERY);
  },
);

export const getAdminServicesDataServerFn = createServerFn({ method: "GET" }).handler(
  async () => {
    await assertAdminSession();
    return sanityFetch(ALL_SERVICES_QUERY);
  },
);

export const getAdminEventsDataServerFn = createServerFn({ method: "GET" }).handler(
  async () => {
    await assertAdminSession();
    return sanityFetch(ALL_EVENTS_QUERY);
  },
);

export const getAdminMenuDataServerFn = createServerFn({ method: "GET" }).handler(
  async () => {
    await assertAdminSession();
    const [categories, sets, items] = await Promise.all([
      sanityFetch(ALL_MENU_CATEGORIES_QUERY),
      sanityFetch(ALL_MENU_SETS_QUERY),
      sanityFetch(ALL_MENU_ITEMS_QUERY),
    ]);
    return { categories, sets, items };
  },
);

export const getAdminContactDataServerFn = createServerFn({ method: "GET" }).handler(
  async () => {
    await assertAdminSession();
    return sanityFetch(CONTACT_PAGE_QUERY);
  },
);

export const getAdminHeaderFooterDataServerFn = createServerFn({ method: "GET" }).handler(
  async () => {
    await assertAdminSession();
    const [header, footer] = await Promise.all([
      sanityFetch(HEADER_SETTINGS_QUERY),
      sanityFetch(FOOTER_SETTINGS_QUERY),
    ]);
    return { header, footer };
  },
);

export const getAdminSeoDataServerFn = createServerFn({ method: "GET" }).handler(
  async () => {
    await assertAdminSession();
    return sanityFetch(ALL_SEO_SETTINGS_QUERY);
  },
);

export const getAdminMediaDataServerFn = createServerFn({ method: "GET" }).handler(
  async () => {
    await assertAdminSession();
    return sanityFetch(MEDIA_LIBRARY_QUERY);
  },
);

export const checkImageReferencesServerFn = createServerFn({ method: "POST" })
  .validator((data: unknown) => {
    const { assetId } = data as { assetId: string };
    if (!assetId) throw new Error("assetId required");
    return { assetId };
  })
  .handler(async ({ data }) => {
    await assertAdminSession();
    const refs = await sanityFetch(IMAGE_REFERENCES_QUERY, {
      assetId: data.assetId,
    });
    return refs;
  });

/** Upload image asset to Sanity via Base64 buffer */
export const uploadImageAssetServerFn = createServerFn({ method: "POST" })
  .validator((data: unknown) => {
    if (!data || typeof data !== "object") throw new Error("Invalid payload");
    const { base64Data, filename, mimeType } = data as {
      base64Data: string;
      filename: string;
      mimeType: string;
    };
    if (!base64Data || !filename) {
      throw new Error("base64Data and filename required");
    }
    return { base64Data, filename, mimeType };
  })
  .handler(async ({ data }) => {
    const admin = await assertAdminSession();
    const { base64Data, filename } = data;

    // Remove data URL prefix if present
    const base64Clean = base64Data.replace(/^data:image\/[a-z0-9+.-]+;base64,/, "");
    const buffer = Buffer.from(base64Clean, "base64");

    // Enforce 10MB limit
    if (buffer.length > 10 * 1024 * 1024) {
      throw new Error("File size exceeds 10MB limit");
    }

    console.log(`[audit] Admin ${admin} uploading image: ${filename} (${buffer.length} bytes)`);
    const asset = await sanityUploadImage(buffer, filename);
    return {
      success: true,
      asset: {
        _id: asset._id,
        url: asset.url,
      },
    };
  });
