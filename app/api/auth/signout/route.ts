/**
 * POST /api/auth/signout
 *
 * Signs the current user out by clearing the httpOnly refresh token cookie.
 *
 * The client is responsible for discarding the in-memory access token.
 * Because access tokens are short-lived (15 min) and we don't maintain a
 * server-side denylist, revoking the refresh cookie is sufficient for the
 * vast majority of use cases.
 */
import { clearRefreshTokenCookie } from "@/lib/auth/cookies";
import { toErrorResponse } from "@/lib/auth/errors";

export const dynamic = "force-dynamic";

export async function POST(): Promise<Response> {
  try {
    await clearRefreshTokenCookie();
    return Response.json({ ok: true });
  } catch (err) {
    return toErrorResponse(err);
  }
}
