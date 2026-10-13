import { ApiError } from "@/lib/auth/client";
import type { ChatTurn } from "./types";

export async function apiAskManager(
  accessToken: string,
  restaurantId: string,
  messages: ChatTurn[]
): Promise<string> {
  const res = await fetch(`/api/restaurants/${restaurantId}/ai`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ messages }),
  });
  const json = (await res.json().catch(() => ({}))) as { reply?: string; code?: string; message?: string };
  if (!res.ok || !json.reply) {
    throw new ApiError(json.code ?? "UNKNOWN_ERROR", json.message ?? "The assistant could not answer.", res.status);
  }
  return json.reply;
}
