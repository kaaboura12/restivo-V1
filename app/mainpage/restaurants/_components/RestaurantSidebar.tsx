"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  LayoutDashboard,
  CalendarDays,
  ShoppingBag,
  BookOpen,
  Armchair,
  Users2,
  BarChart3,
  Star,
  Settings,
  HelpCircle,
  LogOut,
  ChevronDown,
  Plus,
  Check,
  Store,
  X,
  ArrowRight,
} from "lucide-react";
import { useRestaurantManager } from "../_context/RestaurantManagerContext";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

const NAV_ITEMS = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "reservations", label: "Reservations", icon: CalendarDays },
  { id: "orders", label: "Orders", icon: ShoppingBag },
  { id: "menu", label: "Menu", icon: BookOpen },
  { id: "tables", label: "Tables", icon: Armchair },
  { id: "staff", label: "Staff", icon: Users2 },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "reviews", label: "Reviews", icon: Star },
  { id: "settings", label: "Settings", icon: Settings },
] as const;

export function RestaurantSidebar() {
  const {
    restaurants,
    currentRestaurant,
    setCurrentRestaurant,
    setIsAddRestaurantOpen,
    activeNavTab,
    setActiveNavTab,
    mobileMenuOpen,
    setMobileMenuOpen,
  } = useRestaurantManager();

  const { signOut } = useAuth();
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut();
    } catch {
      // Ignore
    }
    router.push("/auth/signin");
  };

  const sidebarContent = (
    <div className="h-full flex flex-col justify-between py-5 px-3 sm:px-4 bg-[#FAF7F2] select-none text-[#1A1A1A]">
      {/* Top Part */}
      <div className="flex flex-col gap-4">
        {/* Brand & Mobile Close */}
        <div className="flex items-center justify-between px-2 pt-1 pb-2">
          <Link
            href="/mainpage"
            className="flex items-center gap-2.5 group"
            onClick={() => setMobileMenuOpen(false)}
          >
            <div className="relative h-7 w-auto">
              <Image
                src="/images/restivo-logo-primary.png"
                alt="RESTIVO"
                width={120}
                height={28}
                priority
                className="h-7 w-auto object-contain transition-transform group-hover:scale-102"
              />
            </div>
          </Link>

          <button
            onClick={() => setMobileMenuOpen(false)}
            className="lg:hidden p-1.5 rounded-lg text-[#6B6661] hover:text-[#1A1A1A] hover:bg-black/5"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Restaurant Switcher Card */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="w-full flex items-center justify-between gap-2.5 p-2 rounded-2xl bg-white/70 hover:bg-white border border-[#E9E3D8] hover:border-[#DED5C7] shadow-2xs transition-all text-left group"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="relative w-9 h-9 rounded-xl overflow-hidden shrink-0 border border-[#E2DDD3] shadow-2xs">
                {currentRestaurant ? (
                  <Image
                    src={currentRestaurant.image || "/images/restaurant-ambient.jpg"}
                    alt={currentRestaurant.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-[#FAF0EA] flex items-center justify-center">
                    <Store className="w-4 h-4 text-[#B55234]" />
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-[13px] font-bold text-[#1A1A1A] truncate block">
                    {currentRestaurant?.name ?? "Add a restaurant"}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-[11px] text-[#78726A] truncate">
                    {currentRestaurant?.location ?? "No venue yet"}
                  </span>
                  {currentRestaurant && (
                    <span className="inline-block px-1.5 py-0.2 rounded-full text-[9px] font-semibold bg-[#FAF0EA] text-[#B55234] border border-[#F3DFD4]">
                      {currentRestaurant.role}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <ChevronDown
              className={`w-3.5 h-3.5 text-[#8A847C] group-hover:text-[#1A1A1A] transition-transform duration-200 shrink-0 ${
                dropdownOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Restaurant Switcher Dropdown */}
          {dropdownOpen && (
            <div className="absolute top-full left-0 right-0 mt-1.5 bg-white rounded-2xl border border-[#E5DEC9] shadow-xl p-2 z-40 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-[#8C857B]">
                Your Managed Restaurants
              </div>

              <div className="flex flex-col gap-1 my-1 max-h-48 overflow-y-auto">
                {restaurants.map((rest) => {
                  const isSelected = rest.id === currentRestaurant?.id;
                  return (
                    <button
                      key={rest.id}
                      onClick={() => {
                        setCurrentRestaurant(rest);
                        setDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between p-2 rounded-xl text-left text-xs transition-colors ${
                        isSelected
                          ? "bg-[#FAF0EA] text-[#B55234] font-semibold"
                          : "hover:bg-[#FAF7F2] text-[#2C2926]"
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="relative w-6 h-6 rounded-lg overflow-hidden shrink-0">
                          <Image
                            src={rest.image || "/images/restaurant-ambient.jpg"}
                            alt={rest.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="truncate">
                          <p className="truncate font-medium">{rest.name}</p>
                          <p className="text-[10px] text-[#7A746B]">{rest.city}</p>
                        </div>
                      </div>
                      {isSelected && <Check className="w-3.5 h-3.5 text-[#B55234] shrink-0" />}
                    </button>
                  );
                })}
              </div>

              <div className="pt-1.5 border-t border-[#EDE7DC] flex flex-col gap-1">
                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    setIsAddRestaurantOpen(true);
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-[#FAF0EA] hover:bg-[#F5E5DC] text-[#B55234] text-xs font-semibold transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add a restaurant</span>
                </button>

                <Link
                  href="/mainpage"
                  onClick={() => setDropdownOpen(false)}
                  className="w-full flex items-center justify-center gap-1.5 py-1.5 text-[11px] text-[#7A746B] hover:text-[#1A1A1A] transition-colors"
                >
                  <span>Switch to Diner View</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Items */}
        <nav className="flex flex-col gap-0.5 mt-1" aria-label="Restaurant Management Navigation">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeNavTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveNavTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[13.5px] font-medium transition-all text-left ${
                  isActive
                    ? "bg-[#FAF0EA] text-[#B55234] font-bold shadow-2xs"
                    : "text-[#666059] hover:text-[#1A1A1A] hover:bg-black/[0.03]"
                }`}
              >
                <Icon
                  className={`w-4 h-4 transition-colors ${
                    isActive ? "text-[#B55234]" : "text-[#7B756E]"
                  }`}
                  strokeWidth={isActive ? 2.3 : 1.9}
                />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Part: Help, Ahmed Profile, Logout */}
      <div className="flex flex-col gap-2 pt-4 border-t border-[#ECE7DC]">
        {/* Help & Support */}
        <button
          onClick={() => alert("Support desk: hello@restivo.app | +216 71 000 000")}
          className="w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-[13px] font-medium text-[#666059] hover:text-[#1A1A1A] hover:bg-black/[0.03] transition-colors text-left"
        >
          <HelpCircle className="w-4 h-4 text-[#7B756E]" strokeWidth={1.9} />
          <span>Help & Support</span>
        </button>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-[13px] font-medium text-[#C0392B] hover:bg-[#FDEEEC] transition-colors text-left"
        >
          <LogOut className="w-4 h-4" strokeWidth={1.9} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-[215px] xl:w-[235px] shrink-0 flex-col border-r border-[#ECE7DC] bg-[#FAF7F2] select-none h-full">
        {sidebarContent}
      </aside>

      {/* Mobile / Tablet Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 w-[260px] sm:w-[280px] bg-[#FAF7F2] shadow-2xl z-10 animate-in slide-in-from-left duration-200 h-full">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
