"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useAuth } from "@/contexts/AuthContext";
import { apiListRestaurants } from "@/lib/restaurants/client";
import type { PublicRestaurant } from "@/lib/restaurants/serialize";

export interface ManagedRestaurant {
  id: string;
  name: string;
  location: string;
  city: string;
  cuisine: string;
  role: string;
  status: "Open" | "Closed" | "Break";
  image: string;
  tablesCount: number;
  capacity: number;
  floorsCount: number;
  rating: number;
  slug: string;
  dbStatus: PublicRestaurant["status"];
}

export function toManagedRestaurant(row: PublicRestaurant): ManagedRestaurant {
  const location =
    [row.address, row.city, row.country].filter(Boolean).join(", ") ||
    row.city ||
    "Location not set";

  return {
    id: row.id,
    name: row.name,
    location,
    city: row.city ?? "",
    cuisine: row.description?.slice(0, 48) || "Restaurant",
    role: row.role === "OWNER" ? "Owner" : "Manager",
    status: row.status === "ACTIVE" ? "Open" : "Closed",
    image: row.coverUrl || "/images/restaurant-ambient.jpg",
    tablesCount: row.tablesCount,
    capacity: row.capacity,
    floorsCount: row.floorsCount,
    rating: 0,
    slug: row.slug,
    dbStatus: row.status,
  };
}

interface RestaurantManagerContextType {
  restaurants: ManagedRestaurant[];
  currentRestaurant: ManagedRestaurant | null;
  setCurrentRestaurant: (rest: ManagedRestaurant) => void;
  upsertRestaurant: (rest: ManagedRestaurant) => void;
  isLoadingRestaurants: boolean;
  isAddRestaurantOpen: boolean;
  setIsAddRestaurantOpen: (open: boolean) => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  activeNavTab: string;
  setActiveNavTab: (tab: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  restaurantStatus: "Open" | "Closed" | "Break";
  setRestaurantStatus: (status: "Open" | "Closed" | "Break") => void;
}

const RestaurantManagerContext = createContext<RestaurantManagerContextType | null>(null);

const EMPTY: RestaurantManagerContextType = {
  restaurants: [],
  currentRestaurant: null,
  setCurrentRestaurant: () => {},
  upsertRestaurant: () => {},
  isLoadingRestaurants: false,
  isAddRestaurantOpen: false,
  setIsAddRestaurantOpen: () => {},
  mobileMenuOpen: false,
  setMobileMenuOpen: () => {},
  activeNavTab: "overview",
  setActiveNavTab: () => {},
  searchQuery: "",
  setSearchQuery: () => {},
  restaurantStatus: "Open",
  setRestaurantStatus: () => {},
};

export function RestaurantManagerProvider({ children }: { children: React.ReactNode }) {
  const { user, isReady, getAccessToken } = useAuth();
  const [restaurants, setRestaurants] = useState<ManagedRestaurant[]>([]);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [isLoadingRestaurants, setIsLoadingRestaurants] = useState(true);
  const [isAddRestaurantOpen, setIsAddRestaurantOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeNavTab, setActiveNavTab] = useState("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [restaurantStatus, setRestaurantStatus] = useState<"Open" | "Closed" | "Break">("Open");

  const currentRestaurant = useMemo(
    () => restaurants.find((row) => row.id === currentId) ?? restaurants[0] ?? null,
    [restaurants, currentId]
  );

  useEffect(() => {
    if (!isReady) return;
    if (!user?.canManageRestaurants) {
      setRestaurants([]);
      setIsLoadingRestaurants(false);
      return;
    }

    const token = getAccessToken();
    if (!token) {
      setIsLoadingRestaurants(false);
      return;
    }

    let cancelled = false;
    setIsLoadingRestaurants(true);

    apiListRestaurants(token)
      .then((rows) => {
        if (cancelled) return;
        const mapped = rows.map(toManagedRestaurant);
        setRestaurants(mapped);
        setCurrentId((prev) => {
          if (prev && mapped.some((row) => row.id === prev)) return prev;
          return mapped[0]?.id ?? null;
        });
      })
      .catch(() => {
        if (!cancelled) setRestaurants([]);
      })
      .finally(() => {
        if (!cancelled) setIsLoadingRestaurants(false);
      });

    return () => {
      cancelled = true;
    };
  }, [isReady, user?.canManageRestaurants, user?.id, getAccessToken]);

  const setCurrentRestaurant = useCallback((rest: ManagedRestaurant) => {
    setCurrentId(rest.id);
  }, []);

  const upsertRestaurant = useCallback((rest: ManagedRestaurant) => {
    setRestaurants((prev) => [rest, ...prev.filter((row) => row.id !== rest.id)]);
    setCurrentId(rest.id);
  }, []);

  return (
    <RestaurantManagerContext.Provider
      value={{
        restaurants,
        currentRestaurant,
        setCurrentRestaurant,
        upsertRestaurant,
        isLoadingRestaurants,
        isAddRestaurantOpen,
        setIsAddRestaurantOpen,
        mobileMenuOpen,
        setMobileMenuOpen,
        activeNavTab,
        setActiveNavTab,
        searchQuery,
        setSearchQuery,
        restaurantStatus,
        setRestaurantStatus,
      }}
    >
      {children}
    </RestaurantManagerContext.Provider>
  );
}

export function useRestaurantManager() {
  const ctx = useContext(RestaurantManagerContext);
  return ctx ?? EMPTY;
}
