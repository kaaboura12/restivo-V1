import { RestaurantError } from "@/lib/restaurants/errors";
import { managerPrompt } from "./prompt";
import { groqTools, runManagerTool } from "./tools";
import type { ChatTurn } from "./types";

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const DEFAULT_MODEL = "openai/gpt-oss-120b";
const TOOL_ROUNDS = 3;

type ToolCall = {
  id: string;
  type?: string;
  function?: { name?: string; arguments?: string };
};

type GroqMessage = {
  role: string;
  content?: string | null;
  tool_calls?: ToolCall[];
  tool_call_id?: string;
};

function groqKey(): string | null {
  const value = process.env.GROQ_API_KEY ?? process.env.Groq_API_Key;
  const key = value?.trim();
  return key ? key : null;
}

function visibleReply(content: string): string {
  return content.replace(/<think>[\s\S]*?<\/think>/gi, "").trim();
}

export async function completeManagerChat(
  restaurantId: string,
  restaurantName: string,
  messages: ChatTurn[]
): Promise<string> {
  const key = groqKey();
  if (!key) throw new RestaurantError("INTERNAL_ERROR", "The assistant is not configured.");

  const model = process.env.GROQ_MODEL?.trim() || DEFAULT_MODEL;
  const thread: GroqMessage[] = [
    { role: "system", content: managerPrompt(restaurantName) },
    ...messages.map((message) => ({ role: message.role, content: message.content })),
  ];

  for (let round = 0; round <= TOOL_ROUNDS; round += 1) {
    const message = await createCompletion(key, model, thread, round < TOOL_ROUNDS);
    const calls = (message.tool_calls ?? []).filter((call) => call.id && call.function?.name);
    if (calls.length === 0) {
      const reply = visibleReply(message.content ?? "");
      if (!reply) throw new RestaurantError("INTERNAL_ERROR", "The assistant returned an empty answer.");
      return reply;
    }

    thread.push({ role: "assistant", content: message.content ?? null, tool_calls: calls });
    for (const call of calls) {
      const result = await runManagerTool(call.function?.name ?? "", restaurantId, call.function?.arguments);
      thread.push({ role: "tool", tool_call_id: call.id, content: JSON.stringify(result) });
    }
  }

  throw new RestaurantError("INTERNAL_ERROR", "The assistant could not answer.");
}

async function createCompletion(
  key: string,
  model: string,
  messages: GroqMessage[],
  allowTools: boolean
): Promise<GroqMessage> {
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
        temperature: 0.3,
        max_completion_tokens: 900,
        messages,
        ...(allowTools ? { tools: groqTools(), tool_choice: "auto" } : {}),
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

  const payload = (await response.json()) as { choices?: { message?: GroqMessage }[] };
  const message = payload.choices?.[0]?.message;
  if (!message) throw new RestaurantError("INTERNAL_ERROR", "The assistant returned an empty answer.");
  return message;
}
