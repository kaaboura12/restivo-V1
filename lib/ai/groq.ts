import { RestaurantError } from "@/lib/restaurants/errors";
import { managerPrompt } from "./prompt";
import type { ChatTurn } from "./types";

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const DEFAULT_MODEL = "openai/gpt-oss-120b";

type GroqChoice = {
  message?: { content?: string | null };
};

function groqKey(): string | null {
  const value = process.env.GROQ_API_KEY ?? process.env.Groq_API_Key;
  const key = value?.trim();
  return key ? key : null;
}

function visibleReply(content: string): string {
  return content.replace(/<think>[\s\S]*?<\/think>/gi, "").trim();
}

export async function completeManagerChat(restaurantName: string, messages: ChatTurn[]): Promise<string> {
  const key = groqKey();
  if (!key) {
    throw new RestaurantError("INTERNAL_ERROR", "The assistant is not configured.");
  }

  const model = process.env.GROQ_MODEL?.trim() || DEFAULT_MODEL;
  let response: Response;
  try {
    response = await fetch(GROQ_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        temperature: 0.4,
        max_completion_tokens: 700,
        messages: [{ role: "system", content: managerPrompt(restaurantName) }, ...messages],
      }),
      signal: AbortSignal.timeout(25_000),
    });
  } catch {
    throw new RestaurantError("INTERNAL_ERROR", "The assistant could not be reached.");
  }

  if (response.status === 429) {
    throw new RestaurantError("INTERNAL_ERROR", "The assistant is busy. Try again in a moment.");
  }
  if (!response.ok) {
    console.error("[ai] Groq request failed", response.status);
    throw new RestaurantError("INTERNAL_ERROR", "The assistant could not answer.");
  }

  const payload = (await response.json()) as { choices?: GroqChoice[] };
  const reply = visibleReply(payload.choices?.[0]?.message?.content ?? "");
  if (!reply) {
    throw new RestaurantError("INTERNAL_ERROR", "The assistant returned an empty answer.");
  }
  return reply;
}
