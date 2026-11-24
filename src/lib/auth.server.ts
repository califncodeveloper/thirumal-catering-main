// Server-side authentication utilities for the admin panel
import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify, type JWTPayload } from "jose";

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */
export const SESSION_COOKIE_NAME = "tc_admin_session";
const SESSION_EXPIRY = "24h";

function getSessionSecret(): Uint8Array {
  const secret =
    typeof process !== "undefined"
      ? process.env?.SESSION_SECRET
      : undefined;
  if (!secret) throw new Error("SESSION_SECRET env var is required");
  return new TextEncoder().encode(secret);
}

function getAdminEmail(): string {
  const email =
    typeof process !== "undefined" ? process.env?.ADMIN_EMAIL : undefined;
  if (!email) throw new Error("ADMIN_EMAIL env var is required");
  return email;
}

function getAdminPasswordHash(): string {
  const hash =
    typeof process !== "undefined"
      ? process.env?.ADMIN_PASSWORD_HASH
      : undefined;
  if (!hash) throw new Error("ADMIN_PASSWORD_HASH env var is required");
  return hash;
}

/* ------------------------------------------------------------------ */
/*  Rate limiting (in-memory)                                          */
/* ------------------------------------------------------------------ */
interface RateLimitEntry {
  count: number;
  lastAttempt: number;
}

const loginAttempts = new Map<string, RateLimitEntry>();
const MAX_ATTEMPTS = 5;
const LOCKOUT_MS = 15 * 60 * 1000; // 15 minutes

export function checkRateLimit(identifier: string): {
  allowed: boolean;
  remainingMs?: number;
} {
  const entry = loginAttempts.get(identifier);
  if (!entry) return { allowed: true };

  const elapsed = Date.now() - entry.lastAttempt;
  if (entry.count >= MAX_ATTEMPTS && elapsed < LOCKOUT_MS) {
    return { allowed: false, remainingMs: LOCKOUT_MS - elapsed };
  }

  // Reset if lockout period has passed
  if (elapsed >= LOCKOUT_MS) {
    loginAttempts.delete(identifier);
    return { allowed: true };
  }

  return { allowed: true };
}

export function recordFailedLogin(identifier: string) {
  const entry = loginAttempts.get(identifier) ?? { count: 0, lastAttempt: 0 };
  entry.count += 1;
  entry.lastAttempt = Date.now();
  loginAttempts.set(identifier, entry);
}

export function clearLoginAttempts(identifier: string) {
  loginAttempts.delete(identifier);
}

/* ------------------------------------------------------------------ */
/*  Password hashing                                                   */
/* ------------------------------------------------------------------ */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(
  password: string,
  hash: string,
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/* ------------------------------------------------------------------ */
/*  Session / JWT                                                      */
/* ------------------------------------------------------------------ */
interface SessionPayload extends JWTPayload {
  email: string;
}

export async function createSession(email: string): Promise<string> {
  return new SignJWT({ email } satisfies SessionPayload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(SESSION_EXPIRY)
    .sign(getSessionSecret());
}

export async function verifySession(
  token: string,
): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSessionSecret());
    return payload as SessionPayload;
  } catch {
    return null;
  }
}

/* ------------------------------------------------------------------ */
/*  Cookie helpers                                                     */
/* ------------------------------------------------------------------ */
export function buildSessionCookie(token: string): string {
  const maxAge = 24 * 60 * 60; // 24 hours in seconds
  return `${SESSION_COOKIE_NAME}=${token}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=${maxAge}`;
}

export function buildLogoutCookie(): string {
  return `${SESSION_COOKIE_NAME}=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0`;
}

export function extractSessionToken(request: Request): string | null {
  const cookieHeader = request.headers.get("cookie");
  if (!cookieHeader) return null;

  const cookies = cookieHeader.split(";").map((c) => c.trim());
  const sessionCookie = cookies.find((c) =>
    c.startsWith(`${SESSION_COOKIE_NAME}=`),
  );
  if (!sessionCookie) return null;

  return sessionCookie.substring(SESSION_COOKIE_NAME.length + 1);
}

/* ------------------------------------------------------------------ */
/*  Request-level auth check                                           */
/* ------------------------------------------------------------------ */
export async function getSessionFromRequest(
  request: Request,
): Promise<SessionPayload | null> {
  const token = extractSessionToken(request);
  if (!token) return null;
  return verifySession(token);
}

/* ------------------------------------------------------------------ */
/*  Credential verification                                            */
/* ------------------------------------------------------------------ */
export async function verifyAdminCredentials(
  email: string,
  password: string,
): Promise<boolean> {
  const adminEmail = getAdminEmail();
  const adminHash = getAdminPasswordHash();

  if (email.toLowerCase() !== adminEmail.toLowerCase()) return false;
  return verifyPassword(password, adminHash);
}
