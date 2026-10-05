"use client";

import { createContext, useContext, useMemo, useState } from "react";
import type { StaffSectionId } from "../_lib/types";

type StaffChrome = {
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
  section: StaffSectionId;
  setSection: (section: StaffSectionId) => void;
  search: string;
  setSearch: (value: string) => void;
};

const StaffChromeContext = createContext<StaffChrome | null>(null);

export function StaffChromeProvider({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [section, setSection] = useState<StaffSectionId>("overview");
  const [search, setSearch] = useState("");

  const value = useMemo(
    () => ({ mobileOpen, setMobileOpen, section, setSection, search, setSearch }),
    [mobileOpen, section, search]
  );

  return <StaffChromeContext.Provider value={value}>{children}</StaffChromeContext.Provider>;
}

export function useStaffChrome(): StaffChrome {
  const chrome = useContext(StaffChromeContext);
  if (!chrome) throw new Error("useStaffChrome must be used inside StaffChromeProvider.");
  return chrome;
}
