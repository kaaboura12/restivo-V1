/**
 * Request-scoped auth helpers for route handlers.
 *
 * Reads the access token from `Authorization: Bearer …`, verifies it,
 * and returns the authenticated user id. Never exposes jose errors.
 */
import { AuthError } from "./errors";
import { verifyAccessToken } from "./jwt";

export async function requireUserId(request: Request): Promise<string> {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    throw new AuthError("MISSING_TOKEN");
  }

  const token = authHeader.slice(7).trim();
  if (!token) throw new AuthError("MISSING_TOKEN");

  const payload = await verifyAccessToken(token);
  if (!payload.sub) throw new AuthError("INVALID_TOKEN");

  return payload.sub;
}
