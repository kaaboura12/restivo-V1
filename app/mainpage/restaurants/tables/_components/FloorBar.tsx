"use client";

import { ArrowUpDown, Copy, Edit2, LayoutGrid, Plus, Trash2, Users } from "lucide-react";
import { FLOORS, FLOOR_STATS, type FloorName } from "../_lib/tables-ui";

const ACTION_CLASS =
  "flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white border border-[#E5DFD3] hover:bg-[#F5F2EC] text-[13px] font-semibold text-[#1A1A1A] transition-colors";

export function FloorBar({
  activeFloor,
  onFloorChange,
}: {
  activeFloor: FloorName;
  onFloorChange: (floor: FloorName) => void;
}) {
  return (
    <>
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-3 mb-4">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-semibold text-[15px] mr-2">Floors</span>
          {FLOORS.map((floor) => (
            <button
              key={floor}
              type="button"
              onClick={() => onFloorChange(floor)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
                activeFloor === floor
                  ? "bg-[#B8573A] text-white shadow-sm"
                  : "bg-white border border-[#E5DFD3] text-[#6B665E] hover:bg-[#F5F2EC]"
              }`}
            >
              {floor}
            </button>
          ))}
          <button
            type="button"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-transparent text-[#6B665E] hover:bg-[#F5F2EC] transition-colors text-sm font-medium ml-1"
          >
            <Plus className="w-4 h-4" />
            Add floor
          </button>
        </div>
        <div className="flex items-center gap-6 text-[13px] text-[#6B665E] font-medium">
          <div className="flex items-center gap-1.5">
            <LayoutGrid className="w-4 h-4" />
            {FLOOR_STATS.tables} tables
          </div>
          <div className="flex items-center gap-1.5">
            <LayoutGrid className="w-4 h-4" />
            {FLOOR_STATS.zones} zones
          </div>
          <div className="flex items-center gap-1.5">
            <Users className="w-4 h-4" />
            {FLOOR_STATS.seats} seats
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-6 flex-wrap">
        <button type="button" className={ACTION_CLASS}>
          <Edit2 className="w-3.5 h-3.5 text-[#6B665E]" />
          Edit floor
        </button>
        <button type="button" className={ACTION_CLASS}>
          <Copy className="w-3.5 h-3.5 text-[#6B665E]" />
          Duplicate
        </button>
        <button type="button" className={ACTION_CLASS}>
          <Trash2 className="w-3.5 h-3.5 text-[#6B665E]" />
          Delete
        </button>
        <button type="button" className={`${ACTION_CLASS} ml-2`}>
          <ArrowUpDown className="w-3.5 h-3.5 text-[#6B665E]" />
          Reorder
        </button>
      </div>
    </>
  );
}
