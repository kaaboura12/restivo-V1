import { db } from "@/lib/db";
import { AuthError } from "@/lib/auth/errors";
import { requireUserId } from "@/lib/auth/session";
import { resolveRestaurantAccess, type RestaurantAccess } from "@/lib/auth/access";

type UserRow = {
  id: string;
  email: string;
  status: "ACTIVE" | "SUSPENDED" | "DELETED";
  managementRole: "OWNER" | "MANAGER" | "STAFF" | null;
};

export async function requireRestaurantManagerUser(request: Request): Promise<{
  user: UserRow;
  access: RestaurantAccess;
}> {
  const userId = await requireUserId(request);
  const user = await db.orm.public.User.where({ id: userId }).first();

  if (!user) throw new AuthError("INVALID_TOKEN");
  if (user.status === "SUSPENDED") throw new AuthError("USER_SUSPENDED");
  if (user.status === "DELETED") throw new AuthError("USER_DELETED");

  const access = await resolveRestaurantAccess(user.id, user.managementRole ?? null);
  if (!access.canManageRestaurants) {
    throw new AuthError("FORBIDDEN", "Only owners and managers can manage restaurants.");
  }

  return { user, access };
}
