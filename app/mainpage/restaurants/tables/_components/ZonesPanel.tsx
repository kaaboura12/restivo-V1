"use client";

import { Plus } from "lucide-react";
import { ZONES } from "../_lib/tables-ui";

export function ZonesPanel({
  activeZone,
  onZoneChange,
}: {
  activeZone: string;
  onZoneChange: (zoneId: string) => void;
}) {
  return (
    <aside className="w-[280px] flex-shrink-0 bg-white rounded-2xl border border-[#E5DFD3] shadow-sm flex flex-col overflow-hidden">
      <div className="p-4 flex justify-between items-center border-b border-[#E5DFD3]">
        <h3 className="font-semibold text-[15px]">Zones</h3>
        <button
          type="button"
          className="flex items-center gap-1 text-[13px] font-medium text-[#6B665E] hover:text-[#1A1A1A]"
        >
          <Plus className="w-3.5 h-3.5" />
          Add zone
        </button>
      </div>
      <div className="p-3 flex flex-col gap-1 overflow-y-auto">
        {ZONES.map((zone) => (
          <button
            key={zone.id}
            type="button"
            onClick={() => onZoneChange(zone.id)}
            className={`w-full flex items-center justify-between p-3 rounded-xl transition-colors ${
              activeZone === zone.id
                ? "bg-[#FFF8F5] border border-[#F1D8CF]"
                : "hover:bg-[#F9F7F4] border border-transparent"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-3.5 h-3.5 rounded-full ${zone.color}`} />
              <div className="flex flex-col items-start">
                <span className="text-[14px] font-semibold text-[#1A1A1A]">{zone.name}</span>
                <span className="text-[12px] text-[#8C877D]">{zone.count} tables</span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </aside>
  );
}
