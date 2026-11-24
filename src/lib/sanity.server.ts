// Server-side Sanity client — NEVER import this file on the client
import { createClient, type SanityClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";

/* ------------------------------------------------------------------ */
/*  Environment helpers                                                */
/* ------------------------------------------------------------------ */
function env(key: string, fallback?: string): string {
  // Vite injects import.meta.env for VITE_* vars only.
  // Server-side env vars come from process.env (Vercel/Node) or globalThis (edge).
  const val =
    (typeof process !== "undefined" ? process.env?.[key] : undefined) ??
    fallback;
  if (!val) throw new Error(`Missing environment variable: ${key}`);
  return val;
}

/* ------------------------------------------------------------------ */
/*  Clients                                                            */
/* ------------------------------------------------------------------ */
const projectId = () => env("SANITY_PROJECT_ID");
const dataset = () => env("SANITY_DATASET", "production");
const apiVersion = () => env("SANITY_API_VERSION", "2026-11-24");

/** Read-only client — no token, uses CDN, returns published docs only */
let _readClient: SanityClient | undefined;
export function getReadClient(): SanityClient {
  if (!_readClient) {
    _readClient = createClient({
      projectId: projectId(),
      dataset: dataset(),
      apiVersion: apiVersion(),
      useCdn: true,
      perspective: "published",
    });
  }
  return _readClient;
}

/** Authenticated write client — includes token, no CDN */
let _writeClient: SanityClient | undefined;
export function getWriteClient(): SanityClient {
  if (!_writeClient) {
    _writeClient = createClient({
      projectId: projectId(),
      dataset: dataset(),
      apiVersion: apiVersion(),
      token: env("SANITY_API_TOKEN"),
      useCdn: false,
    });
  }
  return _writeClient;
}

/* ------------------------------------------------------------------ */
/*  Fetching                                                           */
/* ------------------------------------------------------------------ */
export async function sanityFetch<T = unknown>(
  query: string,
  params: Record<string, unknown> = {},
): Promise<T> {
  try {
    return await getReadClient().fetch<T>(query, params);
  } catch (error) {
    console.error("[sanity] fetch error:", error);
    throw error;
  }
}

/* ------------------------------------------------------------------ */
/*  Mutations (write)                                                  */
/* ------------------------------------------------------------------ */
export async function sanityMutate(
  mutations: Array<Record<string, unknown>>,
) {
  try {
    return await getWriteClient().mutate(mutations as never);
  } catch (error) {
    console.error("[sanity] mutate error:", error);
    throw error;
  }
}

export async function sanityCreateOrReplace(doc: Record<string, unknown>) {
  try {
    return await getWriteClient().createOrReplace(doc as never);
  } catch (error) {
    console.error("[sanity] createOrReplace error:", error);
    throw error;
  }
}

export async function sanityCreate(doc: Record<string, unknown>) {
  try {
    return await getWriteClient().create(doc as never);
  } catch (error) {
    console.error("[sanity] create error:", error);
    throw error;
  }
}

export async function sanityPatch(
  id: string,
  patch: Record<string, unknown>,
) {
  try {
    return await getWriteClient().patch(id).set(patch).commit();
  } catch (error) {
    console.error("[sanity] patch error:", error);
    throw error;
  }
}

export async function sanityDelete(id: string) {
  try {
    return await getWriteClient().delete(id);
  } catch (error) {
    console.error("[sanity] delete error:", error);
    throw error;
  }
}

/* ------------------------------------------------------------------ */
/*  Image uploads                                                      */
/* ------------------------------------------------------------------ */
export async function sanityUploadImage(
  file: Buffer | Blob | ReadableStream,
  filename?: string,
) {
  try {
    return await getWriteClient().assets.upload("image", file as never, {
      filename,
    });
  } catch (error) {
    console.error("[sanity] image upload error:", error);
    throw error;
  }
}

/* ------------------------------------------------------------------ */
/*  Image URL builder                                                  */
/* ------------------------------------------------------------------ */
let _builder: ReturnType<typeof imageUrlBuilder> | undefined;
export function getImageBuilder() {
  if (!_builder) {
    _builder = imageUrlBuilder({
      projectId: projectId(),
      dataset: dataset(),
    });
  }
  return _builder;
}

export function imageUrl(source: SanityImageSource): string {
  if (!source) return "";
  // Handle plain string URLs (local images or already-resolved URLs)
  if (typeof source === "string") return source;
  try {
    return getImageBuilder().image(source).auto("format").url();
  } catch {
    return "";
  }
}

export function imageUrlWithSize(
  source: SanityImageSource,
  width: number,
  height?: number,
): string {
  if (!source) return "";
  if (typeof source === "string") return source;
  try {
    let b = getImageBuilder().image(source).width(width).auto("format");
    if (height) b = b.height(height);
    return b.url();
  } catch {
    return "";
  }
}
