"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Store } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useRestaurantManager } from "../_context/RestaurantManagerContext";
import type { FloorName, ListTab, ViewMode } from "./_lib/tables-ui";
import { TablesHeader } from "./_components/TablesHeader";
import { FloorBar } from "./_components/FloorBar";
import { ZonesPanel } from "./_components/ZonesPanel";
import { FloorCanvas } from "./_components/FloorCanvas";
import { FloorSettingsPanel } from "./_components/FloorSettingsPanel";
import { TablesList } from "./_components/TablesList";

export default function TablesAndFloorsPage() {
  const router = useRouter();
  const { user, isReady } = useAuth();
  const { currentRestaurant, isLoadingRestaurants, setIsAddRestaurantOpen } =
    useRestaurantManager();

  const [activeFloor, setActiveFloor] = useState<FloorName>("Ground Floor");
  const [activeZone, setActiveZone] = useState("Main Dining");
  const [viewMode, setViewMode] = useState<ViewMode>("2D");
  const [activeTab, setActiveTab] = useState<ListTab>("Tables");

  useEffect(() => {
    if (!isReady) return;
    if (!user?.canManageRestaurants) router.replace("/mainpage");
  }, [isReady, user?.canManageRestaurants, router]);

  if (!isReady || isLoadingRestaurants) {
    return (
      <div className="flex items-center justify-center py-24 text-sm text-[#7A746B]">
        Loading tables…
      </div>
    );
  }

  if (!currentRestaurant) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-20 px-4">
        <div className="w-14 h-14 rounded-2xl bg-[#FAF0EA] text-[#B55234] flex items-center justify-center mb-4">
          <Store className="w-7 h-7" />
        </div>
        <h1 className="text-2xl font-extrabold text-[#1A1A1A]">Create a restaurant first</h1>
        <p className="text-sm text-[#736D65] mt-2 max-w-md">
          Tables belong to a venue. Add a restaurant, then come back to design the floor plan.
        </p>
        <button
          type="button"
          onClick={() => setIsAddRestaurantOpen(true)}
          className="mt-5 inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#B55234] hover:bg-[#9E4328] text-white text-sm font-bold"
        >
          Add a restaurant
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-0 select-none animate-in fade-in duration-300 pb-6">
      <TablesHeader />
      <FloorBar activeFloor={activeFloor} onFloorChange={setActiveFloor} />
      <div className="flex gap-6 h-[600px]">
        <ZonesPanel activeZone={activeZone} onZoneChange={setActiveZone} />
        <FloorCanvas viewMode={viewMode} onViewModeChange={setViewMode} />
        <FloorSettingsPanel floorName={activeFloor} />
      </div>
      <TablesList activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}
