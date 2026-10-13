"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useRestaurantManager } from "../_context/RestaurantManagerContext";
import { ManagerChat } from "./_components/ManagerChat";

export default function AiManagerPage() {
  const router = useRouter();
  const { user, isReady } = useAuth();
  const { currentRestaurant, isLoadingRestaurants } = useRestaurantManager();

  useEffect(() => {
    if (!isReady) return;
    if (!user?.canManageRestaurants) router.replace("/mainpage");
  }, [isReady, user?.canManageRestaurants, router]);

  if (!isReady || isLoadingRestaurants || !user?.canManageRestaurants) {
    return <p className="py-24 text-center text-sm text-[#7A746B]">Loading…</p>;
  }

  const ownerName =
    user.displayName || [user.firstName, user.lastName].filter(Boolean).join(" ") || "Owner";

  return (
    <div className="h-full min-h-0 py-4">
      <ManagerChat
        key={currentRestaurant?.id ?? "restaurant"}
        restaurantName={currentRestaurant?.name ?? "your restaurant"}
        ownerName={ownerName}
      />
    </div>
  );
}
