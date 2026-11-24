import { createServerFn } from "@tanstack/react-start";
import {
  verifyAdminCredentials,
  createSession,
  verifySession,
  checkRateLimit,
  recordFailedLogin,
  clearLoginAttempts,
  SESSION_COOKIE_NAME,
} from "./auth.server";

export interface AuthStatus {
  authenticated: boolean;
  email?: string;
}

/** Check if current request has a valid admin session */
export const checkAdminAuthServerFn = createServerFn({ method: "GET" }).handler(
  async (): Promise<AuthStatus> => {
    const { getCookie } = await import("@tanstack/react-start/server");
    try {
      const token = getCookie(SESSION_COOKIE_NAME);
      if (!token) {
        return { authenticated: false };
      }
      const session = await verifySession(token);
      if (!session || !session.email) {
        return { authenticated: false };
      }
      return { authenticated: true, email: session.email };
    } catch {
      return { authenticated: false };
    }
  },
);

/** Admin login server function */
export const loginServerFn = createServerFn({ method: "POST" })
  .validator((data: unknown) => {
    if (!data || typeof data !== "object") {
      throw new Error("Invalid request body");
    }
    const { email, password } = data as { email?: string; password?: string };
    if (!email || typeof email !== "string" || !email.trim()) {
      throw new Error("Email is required");
    }
    if (!password || typeof password !== "string") {
      throw new Error("Password is required");
    }
    return { email: email.trim(), password };
  })
  .handler(async ({ data }) => {
    const { getCookie, setCookie } = await import("@tanstack/react-start/server");
    const { email, password } = data;
    const rateLimitKey = email.toLowerCase();

    // 1. Check rate limiting
    const rateCheck = checkRateLimit(rateLimitKey);
    if (!rateCheck.allowed) {
      const mins = Math.ceil((rateCheck.remainingMs ?? 0) / 60000);
      throw new Error(
        `Too many failed attempts. Please try again in ${mins} minute(s).`,
      );
    }

    // 2. Verify credentials
    const isValid = await verifyAdminCredentials(email, password);
    if (!isValid) {
      recordFailedLogin(rateLimitKey);
      throw new Error("Invalid email or password");
    }

    // 3. Clear failed attempts & create session token
    clearLoginAttempts(rateLimitKey);
    const token = await createSession(email);

    // 4. Set HttpOnly session cookie
    setCookie(SESSION_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 24 * 60 * 60, // 24 hours
    });

    console.log(`[audit] Admin logged in: ${email} at ${new Date().toISOString()}`);
    return { success: true, email };
  });

/** Admin logout server function */
export const logoutServerFn = createServerFn({ method: "POST" }).handler(
  async () => {
    const { deleteCookie } = await import("@tanstack/react-start/server");
    deleteCookie(SESSION_COOKIE_NAME, {
      path: "/",
    });
    return { success: true };
  },
);
