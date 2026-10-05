"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Store } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useRestaurantManager } from "../_context/RestaurantManagerContext";
import type { FloorName, ListTab } from "./_lib/tables-ui";
import { TablesHeader } from "./_components/TablesHeader";
import { FloorBar } from "./_components/FloorBar";
import { ZonesPanel } from "./_components/ZonesPanel";
import { FloorEditor } from "./_components/floor-plan/FloorEditor";
import { TablesList } from "./_components/TablesList";
import type { FloorObject } from "./_components/floor-plan/floor-object";

const FLOOR_OBJECTS: FloorObject[] = [
  {
    id: "table-1",
    type: "ROUND_TABLE",
    x: 3,
    y: 2,
    width: 0.9,
    height: 0.9,
    rotation: 0,
    zIndex: 1,
    locked: false,
  },
  {
    id: "kitchen-1",
    type: "KITCHEN",
    x: 8,
    y: 2,
    width: 5,
    height: 4,
    rotation: 0,
    zIndex: 1,
    locked: false,
  },
];

export default function TablesAndFloorsPage() {
  const router = useRouter();
  const { user, isReady } = useAuth();
  const { currentRestaurant, isLoadingRestaurants, setIsAddRestaurantOpen } =
    useRestaurantManager();

  const [activeFloor, setActiveFloor] = useState<FloorName>("Ground Floor");
  const [activeZone, setActiveZone] = useState("Main Dining");
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
      <div className="flex h-[760px] gap-4">
        <ZonesPanel activeZone={activeZone} onZoneChange={setActiveZone} />
        <FloorEditor width={18} height={12} objects={FLOOR_OBJECTS} />
      </div>
      <TablesList activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}
