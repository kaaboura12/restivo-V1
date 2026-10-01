"use client";

import { Eye, Plus, Save } from "lucide-react";

export function TablesHeader() {
  return (
    <section className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
      <div>
        <h1 className="text-[32px] font-bold tracking-tight text-[#111111]">Tables & floors</h1>
        <p className="text-[#6B665E] mt-1 text-[15px]">
          Design your restaurant layout and manage your tables.
        </p>
        <div className="flex items-center gap-2 mt-3">
          <div className="w-2 h-2 rounded-full bg-green-500" />
          <span className="text-[13px] text-green-600 font-medium">All changes saved</span>
        </div>
      </div>
      <div className="flex items-center gap-3 flex-wrap">
        <button
          type="button"
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-[#E5DFD3] hover:bg-[#F5F2EC] transition-colors text-sm font-semibold shadow-sm"
        >
          <Eye className="w-4 h-4 text-[#6B665E]" />
          Preview layout
        </button>
        <button
          type="button"
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-[#E5DFD3] hover:bg-[#F5F2EC] transition-colors text-sm font-semibold shadow-sm"
        >
          <Save className="w-4 h-4 text-[#6B665E]" />
          Save changes
        </button>
        <button
          type="button"
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#B8573A] hover:bg-[#A34B30] text-white transition-colors text-sm font-semibold shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Add table
        </button>
      </div>
    </section>
  );
}
