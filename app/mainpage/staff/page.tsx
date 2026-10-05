"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { staffClock } from "./_lib/clock";
import { StaffWorkspace } from "./_components/StaffWorkspace";

export default function StaffPage() {
  const router = useRouter();
  const { user, isReady } = useAuth();

  useEffect(() => {
    if (!isReady) return;
    if (!user?.isStaff) router.replace("/mainpage");
  }, [isReady, user?.isStaff, router]);

  if (!isReady || !user?.isStaff) {
    return (
      <div className="flex items-center justify-center py-24 text-sm text-[#7A746B]">
        Loading your workspace…
      </div>
    );
  }

  const { greeting, dateLabel } = staffClock();

  return (
    <div className="py-1">
      <StaffWorkspace greeting={greeting} dateLabel={dateLabel} />
    </div>
  );
}
