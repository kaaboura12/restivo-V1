/**
 * GET /api/auth/me
 *
 * Returns the currently authenticated user's public profile.
 *
 * Expects the access token in the Authorization header:
 *   Authorization: Bearer <accessToken>
 *
 * The route re-fetches the user and their profile from the database on every
 * call so the data is always fresh (no stale JWT payload).  The access token
 * is only used for authentication, not as a data source.
 */
import { db } from "@/lib/db";
import { AuthError, toErrorResponse } from "@/lib/auth/errors";
import { verifyAccessToken } from "@/lib/auth/jwt";

export const dynamic = "force-dynamic";

export async function GET(request: Request): Promise<Response> {
  try {
    // ── 1. Extract Bearer token ────────────────────────────────────────────
    const authHeader = request.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      throw new AuthError("MISSING_TOKEN");
    }
    const token = authHeader.slice(7).trim();
    if (!token) throw new AuthError("MISSING_TOKEN");

    // ── 2. Verify token ────────────────────────────────────────────────────
    const payload = await verifyAccessToken(token);
    const userId = payload.sub!;

    // ── 3. Load current user + profile ────────────────────────────────────
    const [user, profile] = await Promise.all([
      db.orm.public.User.where({ id: userId }).first(),
      db.orm.public.Profile.where({ userId }).first(),
    ]);

    if (!user) throw new AuthError("INVALID_TOKEN");
    if (user.status === "SUSPENDED") throw new AuthError("USER_SUSPENDED");
    if (user.status === "DELETED") throw new AuthError("USER_DELETED");

    // ── 4. Respond ─────────────────────────────────────────────────────────
    return Response.json({
      ok: true,
      user: {
        id: user.id,
        email: user.email,
        status: user.status,
        emailVerifiedAt: user.emailVerifiedAt ?? null,
        firstName: profile?.firstName ?? null,
        lastName: profile?.lastName ?? null,
        displayName: profile?.displayName ?? null,
        avatarUrl: profile?.avatarUrl ?? null,
        phone: profile?.phone ?? null,
        bio: profile?.bio ?? null,
        createdAt: user.createdAt,
      },
    });
  } catch (err) {
    return toErrorResponse(err);
  }
}
