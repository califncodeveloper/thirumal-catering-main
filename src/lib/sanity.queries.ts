// GROQ queries for fetching Sanity CMS content

/* ── Singleton pages ────────────────────────────────────────────── */

export const SITE_SETTINGS_QUERY = `*[_type == "siteSettings"][0]`;

export const HOMEPAGE_QUERY = `*[_type == "homepage"][0]`;

export const ABOUT_PAGE_QUERY = `*[_type == "aboutPage"][0]`;

export const SERVICES_PAGE_QUERY = `*[_type == "servicesPage"][0]`;

export const EVENTS_PAGE_QUERY = `*[_type == "eventsPage"][0]`;

export const MENU_PAGE_QUERY = `*[_type == "menuPage"][0]`;

export const CONTACT_PAGE_QUERY = `*[_type == "contactPage"][0]`;

export const HEADER_SETTINGS_QUERY = `*[_type == "headerSettings"][0]`;

export const FOOTER_SETTINGS_QUERY = `*[_type == "footerSettings"][0]`;

/* ── Collections ────────────────────────────────────────────────── */

export const ALL_SERVICES_QUERY = `*[_type == "service"] | order(order asc) {
  _id, _type, _createdAt, _updatedAt,
  title, description, image, iconName, order, visible
}`;

export const VISIBLE_SERVICES_QUERY = `*[_type == "service" && visible == true] | order(order asc) {
  _id, title, description, image, iconName, order
}`;

export const ALL_EVENTS_QUERY = `*[_type == "event"] | order(order asc) {
  _id, _type, _createdAt, _updatedAt,
  title, category, description, stat, image, order, visible
}`;

export const VISIBLE_EVENTS_QUERY = `*[_type == "event" && visible == true] | order(order asc) {
  _id, title, category, description, stat, image, order
}`;

export const ALL_MENU_CATEGORIES_QUERY = `*[_type == "menuCategory"] | order(order asc) {
  _id, _type, title, tamil, description, menuType, order, visible
}`;

export const VISIBLE_MENU_CATEGORIES_QUERY = `*[_type == "menuCategory" && visible == true] | order(order asc) {
  _id, title, tamil, description, menuType, order
}`;

export const MENU_SETS_BY_CATEGORY_QUERY = `*[_type == "menuSet" && categoryId == $categoryId] | order(order asc) {
  _id, _type, title, tamil, items, variant, categoryId, order
}`;

export const ALL_MENU_SETS_QUERY = `*[_type == "menuSet"] | order(order asc) {
  _id, _type, title, tamil, items, variant, categoryId, order
}`;

export const MENU_ITEMS_BY_CATEGORY_QUERY = `*[_type == "menuItem" && categoryId == $categoryId] | order(order asc) {
  _id, _type, name, price, categoryId, order
}`;

export const ALL_MENU_ITEMS_QUERY = `*[_type == "menuItem"] | order(order asc) {
  _id, _type, name, price, categoryId, order
}`;

export const ALL_MENU_DATA_QUERY = `{
  "categories": *[_type == "menuCategory" && visible == true] | order(order asc),
  "sets": *[_type == "menuSet"] | order(order asc),
  "items": *[_type == "menuItem"] | order(order asc),
  "pageSettings": *[_type == "menuPage"][0]
}`;

export const ALL_TESTIMONIALS_QUERY = `*[_type == "testimonial"] | order(order asc) {
  _id, _type, name, event, quote, order, visible
}`;

export const VISIBLE_TESTIMONIALS_QUERY = `*[_type == "testimonial" && visible == true] | order(order asc) {
  _id, name, event, quote
}`;

/* ── SEO ────────────────────────────────────────────────────────── */

export const SEO_SETTINGS_QUERY = `*[_type == "seoSettings" && pageId == $pageId][0]`;

export const ALL_SEO_SETTINGS_QUERY = `*[_type == "seoSettings"] | order(pageId asc)`;

/* ── Dashboard stats ────────────────────────────────────────────── */

export const DASHBOARD_STATS_QUERY = `{
  "totalServices": count(*[_type == "service"]),
  "totalEvents": count(*[_type == "event"]),
  "totalMenuCategories": count(*[_type == "menuCategory"]),
  "totalMenuItems": count(*[_type == "menuItem"]),
  "totalMenuSets": count(*[_type == "menuSet"]),
  "totalTestimonials": count(*[_type == "testimonial"]),
  "totalImages": count(*[_type == "sanity.imageAsset"])
}`;

/* ── Media library ──────────────────────────────────────────────── */

export const MEDIA_LIBRARY_QUERY = `*[_type == "sanity.imageAsset"] | order(_createdAt desc) {
  _id, url, originalFilename, mimeType, size,
  metadata { dimensions { width, height } },
  altText, _createdAt
}`;

export const IMAGE_REFERENCES_QUERY = `*[references($assetId)] {
  _id, _type, title
}`;

/* ── Single document by ID ──────────────────────────────────────── */

export const DOCUMENT_BY_ID_QUERY = `*[_id == $id][0]`;
