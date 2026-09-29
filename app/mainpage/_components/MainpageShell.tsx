"use client";

/**
 * Persistent app chrome for /mainpage/*.
 *
 * The outer card, sidebar and top nav mount once in the layout. Only
 * `{children}` (the page body) is replaced on navigation.
 */
import React from "react";
import { Sidebar } from "./Sidebar";
import { TopNav } from "./TopNav";

export function MainpageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen w-full font-sans antialiased text-[#1A1A1A]">
      <div
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: "url('/VisualIdentity/microPattern.png')",
          backgroundRepeat: "repeat",
          backgroundSize: "880px auto",
          backgroundColor: "#FAF7F2",
        }}
      />
      <div className="fixed inset-0 z-0 bg-[#FAF7F2]/40 backdrop-blur-[0.5px] pointer-events-none" />

      <div className="relative z-10 flex min-h-screen w-full items-center justify-center p-2 sm:p-4 md:p-6 lg:p-8">
        <div className="w-full max-w-[1440px] bg-[#FAF7F2] rounded-3xl md:rounded-[32px] border border-[#E8E2D7] shadow-2xl flex overflow-hidden h-[min(90vh,900px)] min-h-[640px]">
          <Sidebar />

          <div className="flex-1 flex flex-col min-w-0 min-h-0">
            <div className="shrink-0 px-4 sm:px-6 lg:px-8 pt-5 sm:pt-6">
              <TopNav />
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-4 sm:px-6 lg:px-8 pb-5 sm:pb-6">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
