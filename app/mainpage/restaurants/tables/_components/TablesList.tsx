"use client";

import { ChevronDown, Edit2, MoreVertical, Search, Square, Users } from "lucide-react";
import { LIST_TABS, TABLE_ROWS, type ListTab } from "../_lib/tables-ui";

export function TablesList({
  activeTab,
  onTabChange,
}: {
  activeTab: ListTab;
  onTabChange: (tab: ListTab) => void;
}) {
  return (
    <section className="mt-8 bg-white rounded-2xl border border-[#E5DFD3] shadow-sm overflow-hidden">
      <div className="px-6 border-b border-[#E5DFD3] flex flex-col sm:flex-row sm:justify-between sm:items-end gap-3 pt-4">
        <div className="flex gap-8 h-full">
          {LIST_TABS.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => onTabChange(tab)}
              className={`pb-3 text-[14px] font-semibold border-b-2 transition-colors ${
                activeTab === tab
                  ? "border-[#B8573A] text-[#B8573A]"
                  : "border-transparent text-[#6B665E] hover:text-[#1A1A1A]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="flex gap-4 pb-3 flex-wrap">
          <div className="relative">
            <Search className="w-4 h-4 text-[#8C877D] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search tables..."
              className="pl-9 pr-4 py-1.5 w-64 bg-[#F5F2EC] rounded-lg text-[13px] focus:outline-none focus:ring-1 focus:ring-[#B8573A]"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[13px] text-[#6B665E]">Sort by</span>
            <button
              type="button"
              className="flex items-center gap-2 px-3 py-1.5 bg-[#F5F2EC] rounded-lg text-[13px] font-medium text-[#1A1A1A]"
            >
              Table number
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {activeTab === "Tables" ? <TablesTable /> : <ZonesEmpty />}
    </section>
  );
}

function TablesTable() {
  return (
    <table className="w-full text-left border-collapse">
      <thead>
        <tr className="border-b border-[#E5DFD3]">
          <th className="py-3 px-6 text-[12px] font-bold text-[#8C877D] uppercase tracking-wider w-1/6">
            Table
          </th>
          <th className="py-3 px-6 text-[12px] font-bold text-[#8C877D] uppercase tracking-wider w-1/6">
            Capacity
          </th>
          <th className="py-3 px-6 text-[12px] font-bold text-[#8C877D] uppercase tracking-wider w-1/6">
            Shape
          </th>
          <th className="py-3 px-6 text-[12px] font-bold text-[#8C877D] uppercase tracking-wider w-1/4">
            Zone
          </th>
          <th className="py-3 px-6 text-[12px] font-bold text-[#8C877D] uppercase tracking-wider w-1/6">
            Status
          </th>
          <th className="py-3 px-6 text-[12px] font-bold text-[#8C877D] uppercase tracking-wider w-1/12 text-right">
            Actions
          </th>
        </tr>
      </thead>
      <tbody>
        {TABLE_ROWS.map((table) => (
          <tr
            key={table.num}
            className="border-b border-[#E5DFD3] last:border-0 hover:bg-[#F9F7F4] transition-colors"
          >
            <td className="py-3 px-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#E8D9C8] flex items-center justify-center border border-[#D5C2AD]">
                  <div className="w-3 h-3 bg-[#8B6B4D] rounded-sm" />
                </div>
                <span className="font-semibold text-[14px]">{table.num}</span>
              </div>
            </td>
            <td className="py-3 px-6">
              <div className="flex items-center gap-1.5 text-[14px] text-[#6B665E]">
                <Users className="w-4 h-4" />
                {table.cap}
              </div>
            </td>
            <td className="py-3 px-6 text-[14px] text-[#6B665E]">
              <div className="flex items-center gap-1.5">
                <Square className="w-4 h-4" />
                {table.shape}
              </div>
            </td>
            <td className="py-3 px-6">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#D35A3D]" />
                <span className="text-[14px] text-[#1A1A1A]">{table.zone}</span>
              </div>
            </td>
            <td className="py-3 px-6">
              <span className={`px-2.5 py-1 rounded-md text-[12px] font-bold ${table.statusColor}`}>
                {table.status}
              </span>
            </td>
            <td className="py-3 px-6 text-right">
              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  className="p-1.5 text-[#8C877D] hover:text-[#1A1A1A] hover:bg-[#F5F2EC] rounded-md transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  className="p-1.5 text-[#8C877D] hover:text-[#1A1A1A] hover:bg-[#F5F2EC] rounded-md transition-colors"
                >
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function ZonesEmpty() {
  return (
    <p className="px-6 py-10 text-sm text-[#736D65]">
      Zones are managed in the left panel. Select a zone to focus it on the floor canvas.
    </p>
  );
}
