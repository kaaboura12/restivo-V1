import { requireManagedRestaurant } from "@/lib/restaurants/access";
import { toRestaurantErrorResponse } from "@/lib/restaurants/errors";
import { completeManagerChat } from "@/lib/ai/groq";
import { parseChatBody } from "@/lib/ai/validation";

export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ restaurantId: string }> };

export async function POST(request: Request, context: RouteContext): Promise<Response> {
  try {
    const { restaurantId } = await context.params;
    const { restaurant } = await requireManagedRestaurant(request, restaurantId);
    const { messages } = await parseChatBody(request);
    const reply = await completeManagerChat(restaurant.name, messages);
    return Response.json({ ok: true, reply });
  } catch (err) {
    return toRestaurantErrorResponse(err);
  }
}
