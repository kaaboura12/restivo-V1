export const FLOORS = ["Ground Floor", "First Floor", "Rooftop"] as const;
export type FloorName = (typeof FLOORS)[number];

export const VIEW_MODES = ["2D", "3D"] as const;
export type ViewMode = (typeof VIEW_MODES)[number];

export const LIST_TABS = ["Tables", "Zones"] as const;
export type ListTab = (typeof LIST_TABS)[number];

export type Zone = {
  id: string;
  name: string;
  count: number;
  color: string;
};

export type TableRow = {
  num: string;
  cap: number;
  shape: string;
  zone: string;
  status: string;
  statusColor: string;
};

export type StatusLegendItem = {
  name: string;
  color: string;
};

export const ZONES: Zone[] = [
  { id: "Main Dining", name: "Main Dining", count: 16, color: "bg-[#D35A3D]" },
  { id: "Terrace", name: "Terrace", count: 6, color: "bg-[#4B8B67]" },
  { id: "Bar Area", name: "Bar Area", count: 2, color: "bg-[#E6A935]" },
];

export const TABLE_ROWS: TableRow[] = [
  {
    num: "01",
    cap: 4,
    shape: "Square",
    zone: "Main Dining",
    status: "Available",
    statusColor: "text-green-700 bg-green-100",
  },
  {
    num: "02",
    cap: 2,
    shape: "Round",
    zone: "Main Dining",
    status: "Reserved",
    statusColor: "text-orange-700 bg-orange-100",
  },
  {
    num: "03",
    cap: 4,
    shape: "Square",
    zone: "Main Dining",
    status: "Available",
    statusColor: "text-green-700 bg-green-100",
  },
];

export const STATUS_LEGEND: StatusLegendItem[] = [
  { name: "Available", color: "bg-green-500" },
  { name: "Reserved", color: "bg-orange-400" },
  { name: "Occupied", color: "bg-red-500" },
  { name: "Cleaning", color: "bg-blue-500" },
];

export const FLOOR_PREVIEW_IMAGE =
  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=2070";

export const FLOOR_THUMB_IMAGE =
  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=200&h=200&fit=crop";

export const FLOOR_STATS = {
  tables: 24,
  zones: 2,
  seats: 86,
} as const;
