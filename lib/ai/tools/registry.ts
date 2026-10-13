import type { AiTool } from "./types";
import { toGroqTool } from "./types";

const BLOCKED_KEYS = new Set(["restaurantId", "restaurant_id", "userId", "user_id"]);

export function createRegistry(tools: AiTool[]) {
  const allowed = new Map(tools.map((tool) => [tool.name, tool]));

  return {
    schemas() {
      return tools.map(toGroqTool);
    },
    async run(name: string, restaurantId: string, rawArguments?: string) {
      if (!restaurantId) return { error: "Missing restaurant access." };

      const tool = allowed.get(name);
      if (!tool) return { error: "That tool is not allowed." };

      const parsed = parseArguments(rawArguments);
      if (!parsed.ok) return { error: parsed.error };

      const blocked = blockedKey(parsed.value);
      if (blocked) {
        return { error: "Restaurant access comes from the signed-in manager, not from the model." };
      }

      const args = tool.schema.safeParse(parsed.value);
      if (!args.success) {
        return { error: args.error.issues[0]?.message ?? "Invalid tool arguments." };
      }

      try {
        return await tool.run(restaurantId, args.data as never);
      } catch (err) {
        console.error("[ai] tool failed", name, err instanceof Error ? err.message : "");
        return { error: "This lookup failed." };
      }
    },
  };
}

function parseArguments(raw?: string): { ok: true; value: unknown } | { ok: false; error: string } {
  if (!raw?.trim()) return { ok: true, value: {} };
  try {
    const value = JSON.parse(raw) as unknown;
    if (!value || typeof value !== "object" || Array.isArray(value)) {
      return { ok: false, error: "Tool arguments must be an object." };
    }
    return { ok: true, value };
  } catch {
    return { ok: false, error: "Tool arguments must be valid JSON." };
  }
}

function blockedKey(value: unknown): boolean {
  if (!value || typeof value !== "object") return false;
  return Object.keys(value).some((key) => BLOCKED_KEYS.has(key));
}
