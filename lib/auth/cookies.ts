/**
 * Cookie helpers for the auth refresh token.
 *
 * All cookie manipulation goes through Next.js's `cookies()` (from
 * `next/headers`), which is async in Next.js 15 / 16.  Helpers here isolate
 * cookie options so they are consistent across every route handler.
 */
import { cookies } from "next/headers";
import {
  REFRESH_COOKIE_NAME,
  REFRESH_TOKEN_MAX_AGE_S,
  SESSION_HINT_COOKIE_NAME,
} from "./constants";

const IS_PRODUCTION = process.env.NODE_ENV === "production";

const cookieBase = {
  secure: IS_PRODUCTION,
  sameSite: "lax" as const,
  maxAge: REFRESH_TOKEN_MAX_AGE_S,
  path: "/",
};

/** Writes the refresh token (httpOnly) plus a JS-readable session hint. */
export async function setRefreshTokenCookie(token: string): Promise<void> {
  const jar = await cookies();
  jar.set(REFRESH_COOKIE_NAME, token, { ...cookieBase, httpOnly: true });
  jar.set(SESSION_HINT_COOKIE_NAME, "1", { ...cookieBase, httpOnly: false });
}

/** Reads the refresh token from the cookie jar. Returns `null` if absent. */
export async function getRefreshTokenCookie(): Promise<string | null> {
  const jar = await cookies();
  return jar.get(REFRESH_COOKIE_NAME)?.value ?? null;
}

/** Clears the refresh token cookie and the session hint (used on sign-out). */
export async function clearRefreshTokenCookie(): Promise<void> {
  const jar = await cookies();
  jar.delete(REFRESH_COOKIE_NAME);
  jar.delete(SESSION_HINT_COOKIE_NAME);
}
