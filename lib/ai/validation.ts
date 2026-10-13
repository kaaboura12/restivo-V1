import { z } from "zod";
import { RestaurantError } from "@/lib/restaurants/errors";
import type { ChatTurn } from "./types";

const chatSchema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().trim().min(1).max(2000),
      })
    )
    .min(1)
    .max(16),
});

export async function parseChatBody(request: Request): Promise<{ messages: ChatTurn[] }> {
  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    throw new RestaurantError("VALIDATION_ERROR", "Request body must be valid JSON.");
  }

  const result = chatSchema.safeParse(raw);
  if (!result.success) {
    throw new RestaurantError(
      "VALIDATION_ERROR",
      result.error.issues[0]?.message ?? "Send a short message."
    );
  }

  const messages = result.data.messages;
  if (messages[messages.length - 1]?.role !== "user") {
    throw new RestaurantError("VALIDATION_ERROR", "The latest message must be yours.");
  }

  return { messages };
}
