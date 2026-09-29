"use client";

import React, { useState } from "react";
import Image from "next/image";
import { X, Store, Check, Sparkles, MapPin, Users, Armchair, Layers } from "lucide-react";
import { useRestaurantManager } from "../_context/RestaurantManagerContext";

const PRESET_PHOTOS = [
  { label: "Mediterranean Terrace", src: "/images/restaurant-ambient.jpg" },
  { label: "Bistrot Charm", src: "/images/le-bistrot.jpg" },
  { label: "Coastal Seaside", src: "/images/dar-el-marsa.jpg" },
  { label: "Artisan Cafe", src: "/images/cafe-des-arts.jpg" },
  { label: "Fine Dining Lounge", src: "/images/le-comptoir.jpg" },
];

export function AddRestaurantModal() {
  const { isAddRestaurantOpen, setIsAddRestaurantOpen, addRestaurant } = useRestaurantManager();

  const [name, setName] = useState("");
  const [cuisine, setCuisine] = useState("Tunisian & Mediterranean");
  const [city, setCity] = useState("Tunis");
  const [address, setAddress] = useState("");
  const [tablesCount, setTablesCount] = useState(20);
  const [capacity, setCapacity] = useState(80);
  const [floorsCount, setFloorsCount] = useState(1);
  const [selectedPhoto, setSelectedPhoto] = useState(PRESET_PHOTOS[0].src);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successToast, setSuccessToast] = useState(false);

  if (!isAddRestaurantOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);

    setTimeout(() => {
      addRestaurant({
        name: name.trim(),
        location: address ? `${address}, ${city}` : `${city}, Tunisia`,
        city: city,
        cuisine: cuisine,
        status: "Open",
        image: selectedPhoto,
        tablesCount: Number(tablesCount) || 16,
        capacity: Number(capacity) || 64,
        floorsCount: Number(floorsCount) || 1,
      });

      setIsSubmitting(false);
      setSuccessToast(true);

      setTimeout(() => {
        setSuccessToast(false);
        setIsAddRestaurantOpen(false);
        // Reset form
        setName("");
        setAddress("");
      }, 1000);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-[#FAF7F2] rounded-3xl border border-[#E8E2D7] w-full max-w-lg max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#ECE7DC] bg-white/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#FAF0EA] flex items-center justify-center text-[#B55234]">
              <Store className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#1A1A1A]">
                Add New Restaurant
              </h3>
              <p className="text-xs text-[#7A746B]">
                Create and manage a new dining venue in your dashboard
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsAddRestaurantOpen(false)}
            className="p-1.5 rounded-full hover:bg-black/5 text-[#6B6661] hover:text-[#1A1A1A] transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
          {successToast ? (
            <div className="py-12 flex flex-col items-center justify-center text-center">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-3 animate-bounce">
                <Check className="w-7 h-7" strokeWidth={2.5} />
              </div>
              <h4 className="text-lg font-bold text-[#1A1A1A]">
                Restaurant Created Successfully!
              </h4>
              <p className="text-xs text-[#7A746B] mt-1">
                Switching you to your new restaurant dashboard...
              </p>
            </div>
          ) : (
            <>
              {/* Restaurant Name */}
              <div>
                <label className="block text-xs font-bold text-[#2A2621] uppercase tracking-wider mb-1.5">
                  Restaurant Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Villa Didon, Dar Zarrouk, Le Gourmet"
                  className="w-full bg-white rounded-xl border border-[#DFD8CC] px-3.5 py-2.5 text-xs sm:text-sm text-[#1A1A1A] focus:outline-none focus:border-[#B55234] focus:ring-2 focus:ring-[#B55234]/15 transition-all"
                />
              </div>

              {/* Cuisine & City */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#2A2621] uppercase tracking-wider mb-1.5">
                    Cuisine Type
                  </label>
                  <select
                    value={cuisine}
                    onChange={(e) => setCuisine(e.target.value)}
                    className="w-full bg-white rounded-xl border border-[#DFD8CC] px-3 py-2 text-xs sm:text-sm text-[#1A1A1A] focus:outline-none focus:border-[#B55234]"
                  >
                    <option value="Tunisian & Mediterranean">Tunisian & Mediterranean</option>
                    <option value="Italian & Woodfired">Italian & Woodfired</option>
                    <option value="French & Fine Dining">French & Fine Dining</option>
                    <option value="Seafood & Grill">Seafood & Grill</option>
                    <option value="Japanese & Sushi">Japanese & Sushi</option>
                    <option value="Cafe, Brunch & Pastries">Cafe, Brunch & Pastries</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#2A2621] uppercase tracking-wider mb-1.5">
                    City / Area
                  </label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-white rounded-xl border border-[#DFD8CC] px-3 py-2 text-xs sm:text-sm text-[#1A1A1A] focus:outline-none focus:border-[#B55234]"
                  >
                    <option value="Tunis">Tunis (Les Berges du Lac)</option>
                    <option value="La Marsa">La Marsa</option>
                    <option value="Sidi Bou Saïd">Sidi Bou Saïd</option>
                    <option value="Carthage">Carthage</option>
                    <option value="Gammarth">Gammarth</option>
                    <option value="Ennasr">Ennasr</option>
                  </select>
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="block text-xs font-bold text-[#2A2621] uppercase tracking-wider mb-1.5">
                  Street Address
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9E988F]" />
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="e.g. 14 Avenue Habib Bourguiba"
                    className="w-full bg-white rounded-xl border border-[#DFD8CC] pl-9 pr-3.5 py-2 text-xs text-[#1A1A1A] focus:outline-none focus:border-[#B55234]"
                  />
                </div>
              </div>

              {/* Tables & Capacity & Floors */}
              <div className="grid grid-cols-3 gap-2.5">
                <div>
                  <label className="block text-[11px] font-bold text-[#2A2621] mb-1">
                    Tables Count
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="150"
                    value={tablesCount}
                    onChange={(e) => setTablesCount(Number(e.target.value))}
                    className="w-full bg-white rounded-xl border border-[#DFD8CC] px-3 py-2 text-xs text-[#1A1A1A] focus:outline-none focus:border-[#B55234]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#2A2621] mb-1">
                    Total Seats
                  </label>
                  <input
                    type="number"
                    min="2"
                    max="600"
                    value={capacity}
                    onChange={(e) => setCapacity(Number(e.target.value))}
                    className="w-full bg-white rounded-xl border border-[#DFD8CC] px-3 py-2 text-xs text-[#1A1A1A] focus:outline-none focus:border-[#B55234]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#2A2621] mb-1">
                    Floors
                  </label>
                  <select
                    value={floorsCount}
                    onChange={(e) => setFloorsCount(Number(e.target.value))}
                    className="w-full bg-white rounded-xl border border-[#DFD8CC] px-2.5 py-2 text-xs text-[#1A1A1A] focus:outline-none focus:border-[#B55234]"
                  >
                    <option value={1}>1 Floor</option>
                    <option value={2}>2 Floors</option>
                    <option value={3}>3 Floors</option>
                  </select>
                </div>
              </div>

              {/* Venue Cover Image Selection */}
              <div>
                <label className="block text-xs font-bold text-[#2A2621] uppercase tracking-wider mb-2">
                  Venue Atmosphere Photo
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {PRESET_PHOTOS.map((p, idx) => {
                    const isSelected = selectedPhoto === p.src;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setSelectedPhoto(p.src)}
                        className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                          isSelected
                            ? "border-[#B55234] ring-2 ring-[#B55234]/30 scale-102"
                            : "border-transparent opacity-75 hover:opacity-100"
                        }`}
                      >
                        <Image
                          src={p.src}
                          alt={p.label}
                          fill
                          className="object-cover"
                        />
                        {isSelected && (
                          <div className="absolute inset-0 bg-[#B55234]/30 flex items-center justify-center">
                            <Check className="w-4 h-4 text-white drop-shadow" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Actions */}
              <div className="pt-3 border-t border-[#ECE7DC] flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsAddRestaurantOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[#DFD8CC] text-xs font-semibold text-[#666059] hover:bg-black/5 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !name.trim()}
                  className="px-5 py-2 rounded-xl bg-[#B55234] hover:bg-[#994127] active:scale-95 text-white text-xs font-bold transition-all shadow-xs disabled:opacity-50 flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? "Creating Venue..." : "Create Restaurant"}</span>
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
}
