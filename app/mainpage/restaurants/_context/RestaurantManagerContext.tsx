"use client";

import React, { createContext, useContext, useState } from "react";

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
}

export const INITIAL_RESTAURANTS: ManagedRestaurant[] = [
  {
    id: "maison-olive",
    name: "Maison Olive",
    location: "Tunis, Tunisia",
    city: "Tunis",
    cuisine: "Tunisian & Mediterranean",
    role: "Owner",
    status: "Open",
    image: "/images/restaurant-ambient.jpg",
    tablesCount: 24,
    capacity: 96,
    floorsCount: 2,
    rating: 4.8,
  },
  {
    id: "dar-el-marsa",
    name: "Dar El Marsa",
    location: "La Marsa, Tunis",
    city: "La Marsa",
    cuisine: "Seafood & Mediterranean",
    role: "Owner",
    status: "Open",
    image: "/images/dar-el-marsa.jpg",
    tablesCount: 18,
    capacity: 72,
    floorsCount: 1,
    rating: 4.6,
  },
  {
    id: "le-comptoir",
    name: "Le Comptoir",
    location: "Centre Ville, Tunis",
    city: "Tunis",
    cuisine: "French & Fine Dining",
    role: "Manager",
    status: "Open",
    image: "/images/le-comptoir.jpg",
    tablesCount: 30,
    capacity: 110,
    floorsCount: 2,
    rating: 4.7,
  },
];

interface RestaurantManagerContextType {
  restaurants: ManagedRestaurant[];
  currentRestaurant: ManagedRestaurant;
  setCurrentRestaurant: (rest: ManagedRestaurant) => void;
  addRestaurant: (newRest: Omit<ManagedRestaurant, "id" | "role" | "rating">) => void;
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

export function RestaurantManagerProvider({ children }: { children: React.ReactNode }) {
  const [restaurants, setRestaurants] = useState<ManagedRestaurant[]>(INITIAL_RESTAURANTS);
  const [currentRestaurant, setCurrentRestaurant] = useState<ManagedRestaurant>(INITIAL_RESTAURANTS[0]);
  const [isAddRestaurantOpen, setIsAddRestaurantOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeNavTab, setActiveNavTab] = useState("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [restaurantStatus, setRestaurantStatus] = useState<"Open" | "Closed" | "Break">("Open");

  const addRestaurant = (newRestData: Omit<ManagedRestaurant, "id" | "role" | "rating">) => {
    const newRest: ManagedRestaurant = {
      ...newRestData,
      id: `rest-${Date.now()}`,
      role: "Owner",
      rating: 5.0,
    };
    setRestaurants((prev) => [newRest, ...prev]);
    setCurrentRestaurant(newRest);
  };

  return (
    <RestaurantManagerContext.Provider
      value={{
        restaurants,
        currentRestaurant,
        setCurrentRestaurant,
        addRestaurant,
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
  if (!ctx) {
    // Graceful fallback if rendered outside provider
    return {
      restaurants: INITIAL_RESTAURANTS,
      currentRestaurant: INITIAL_RESTAURANTS[0],
      setCurrentRestaurant: () => {},
      addRestaurant: () => {},
      isAddRestaurantOpen: false,
      setIsAddRestaurantOpen: () => {},
      mobileMenuOpen: false,
      setMobileMenuOpen: () => {},
      activeNavTab: "overview",
      setActiveNavTab: () => {},
      searchQuery: "",
      setSearchQuery: () => {},
      restaurantStatus: "Open" as const,
      setRestaurantStatus: () => {},
    };
  }
  return ctx;
}
