"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Compass,
  Calendar,
  ShoppingBag,
  Heart,
  X,
  UtensilsCrossed,
} from "lucide-react";
import { RestivoGlyph } from "./RestivoGlyph";
import { useMainpage } from "./MainpageProvider";
import { useAuth } from "@/contexts/AuthContext";

const NAV_ITEMS = [
  { id: "home", label: "Home", icon: Home, href: "/mainpage" },
  { id: "explore", label: "Explore", icon: Compass, href: "/mainpage/explore" },
  { id: "reservations", label: "Reservations", icon: Calendar, href: "/mainpage/reservations" },
  { id: "orders", label: "Orders", icon: ShoppingBag, href: "/mainpage/orders" },
  { id: "favorites", label: "Favorites", icon: Heart, href: "/mainpage/favorites" },
] as const;

const OWNER_ITEM = {
  id: "owner",
  label: "Owner / Manager",
  icon: UtensilsCrossed,
  href: "/mainpage/restaurants",
} as const;

function isActivePath(pathname: string, href: string): boolean {
  if (href === "/mainpage") return pathname === "/mainpage";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function navLinkClass(isActive: boolean): string {
  return `w-full flex items-center gap-3.5 px-4 py-2.5 rounded-xl text-[14px] font-medium transition-all duration-200 text-left ${
    isActive
      ? "bg-[#F5ECE5] text-[#B55234] font-semibold shadow-xs"
      : "text-[#6B6661] hover:text-[#1A1A1A] hover:bg-black/[0.03]"
  }`;
}

export function Sidebar() {
  const pathname = usePathname();
  const { mobileMenuOpen, closeMobileMenu } = useMainpage();
  const { user } = useAuth();
  const showOwnerNav = Boolean(user?.canManageRestaurants);
  const ownerActive = isActivePath(pathname, OWNER_ITEM.href);
  const OwnerIcon = OWNER_ITEM.icon;

  const content = (
    <div className="h-full flex flex-col justify-between py-6 px-4 md:px-5">
      <div>
        <div className="flex items-center justify-between px-2 mb-8">
          <Link href="/mainpage" className="flex items-center gap-3 group" onClick={closeMobileMenu}>
            <div className="relative h-8 w-auto">
              <Image
                src="/images/restivo-logo-primary.png"
                alt="RESTIVO"
                width={130}
                height={32}
                priority
                className="h-8 w-auto object-contain transition-transform group-hover:scale-102"
              />
            </div>
          </Link>

          <button
            onClick={closeMobileMenu}
            className="lg:hidden p-1.5 rounded-lg text-[#6B6661] hover:text-[#1A1A1A] hover:bg-black/5"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex flex-col gap-1.5" aria-label="Main Navigation">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = isActivePath(pathname, item.href);

            return (
              <Link
                key={item.id}
                href={item.href}
                onClick={closeMobileMenu}
                className={navLinkClass(isActive)}
              >
                <Icon
                  className={`w-4 h-4 transition-colors ${
                    isActive ? "text-[#B55234]" : "text-[#7B756E]"
                  }`}
                  strokeWidth={isActive ? 2.2 : 1.9}
                />
                <span>{item.label}</span>
              </Link>
            );
          })}

          {showOwnerNav && (
            <div className="mt-3 pt-3 border-t border-[#ECE7DC]">
              <Link
                href={OWNER_ITEM.href}
                onClick={closeMobileMenu}
                className={navLinkClass(ownerActive)}
              >
                <OwnerIcon
                  className={`w-4 h-4 transition-colors ${
                    ownerActive ? "text-[#B55234]" : "text-[#7B756E]"
                  }`}
                  strokeWidth={ownerActive ? 2.2 : 1.9}
                />
                <span>{OWNER_ITEM.label}</span>
              </Link>
            </div>
          )}
        </nav>
      </div>

      <div className="mt-8 px-1">
        <div className="bg-[#EFE9DF]/70 border border-[#E3DDD1] rounded-2xl p-4 relative overflow-hidden transition-all duration-200 hover:border-[#D8CFBF]">
          <div className="mb-2.5">
            <RestivoGlyph className="w-5 h-5 text-[#B55234]" color="#B55234" />
          </div>
          <p className="text-[13px] font-semibold text-[#2C2926] leading-snug">
            Good food
          </p>
          <p className="text-[12px] text-[#7A746B] leading-tight">
            brings people together
          </p>
          <div className="mt-2.5 w-6 h-[2px] bg-[#B55234] rounded-full" />
        </div>
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden lg:flex w-[220px] xl:w-[240px] shrink-0 flex-col border-r border-[#ECE7DC] bg-[#FAF7F2]/90 select-none">
        {content}
      </aside>

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={closeMobileMenu}
          />
          <div className="fixed inset-y-0 left-0 w-[260px] bg-[#FAF7F2] shadow-2xl z-10 animate-in slide-in-from-left duration-200">
            {content}
          </div>
        </div>
      )}
    </>
  );
}
