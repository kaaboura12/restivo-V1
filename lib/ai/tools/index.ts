import { getFloors } from "./floors/get-floors";
import { getMenu } from "./menu/get-menu";
import { getRestaurant } from "./restaurant/get-restaurant";
import { getStaff } from "./staff/get-staff";
import { createRegistry } from "./registry";

/** Allowlist. Append a tool here to expose it. Order is the order the model sees. */
const registry = createRegistry([getRestaurant, getFloors, getMenu, getStaff]);

export function groqTools() {
  return registry.schemas();
}

export function runManagerTool(name: string, restaurantId: string, rawArguments?: string) {
  return registry.run(name, restaurantId, rawArguments);
}
