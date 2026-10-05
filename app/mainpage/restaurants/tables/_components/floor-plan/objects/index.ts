export { TableRound } from "./tables/TableRound";
export { TableSquare } from "./tables/TableSquare";
export { RectangleTable } from "./tables/RectangleTable";
export { BarTable } from "./tables/BarTable";
export { Chair } from "./seating/Chair";
export { Bench } from "./seating/Bench";
export { Wall } from "./structure/Wall";
export { Door } from "./structure/Door";
export { Window } from "./structure/Window";
export { Bar } from "./areas/Bar";
export { Kitchen } from "./areas/Kitchen";
export { Toilet } from "./areas/Toilet";
export type { FloorObjectProps, TableObjectProps } from "./shared";

export const FLOOR_OBJECT_PRESETS = [
  { id: "table-round", label: "Round table", group: "Tables", width: 0.9, height: 0.9, capacity: 4 },
  { id: "table-square", label: "Square table", group: "Tables", width: 0.9, height: 0.9, capacity: 4 },
  { id: "table-rectangle", label: "Rectangle table", group: "Tables", width: 1.6, height: 0.85, capacity: 6 },
  { id: "bar-table", label: "Bar table", group: "Tables", width: 0.65, height: 0.65, capacity: 2 },
  { id: "chair", label: "Chair", group: "Seating", width: 0.45, height: 0.5 },
  { id: "bench", label: "Bench", group: "Seating", width: 1.8, height: 0.48, capacity: 3 },
  { id: "wall", label: "Wall", group: "Structure", width: 2, height: 0.2 },
  { id: "door", label: "Door", group: "Structure", width: 0.9, height: 0.9 },
  { id: "window", label: "Window", group: "Structure", width: 1.4, height: 0.2 },
  { id: "bar", label: "Bar", group: "Areas", width: 3.2, height: 1.15, capacity: 6 },
  { id: "kitchen", label: "Kitchen", group: "Areas", width: 3.4, height: 2.6 },
  { id: "toilet", label: "Toilet", group: "Areas", width: 1.35, height: 1.8 },
] as const;
