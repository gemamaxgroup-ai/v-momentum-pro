"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import OverviewClient from "./OverviewClient";
import { Ga4Site, Ga4DateRange } from "@/lib/ga4/overview";
import { clearAuth } from "@/lib/auth";

export function OverviewSection() {
  const router = useRouter();
  const [site, setSite] = useState<Ga4Site>("filamentrank");
  const [range, setRange] = useState<Ga4DateRange>("last_7_days");
  const [isLoggingOut, setIsLoggingOut] = useState<boolean>(false);
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      // Clear client-side auth
      clearAuth();
      
      // Call logout API (idempotent)
      await fetch("/api/auth/logout", { method: "POST" });
      
      // Redirect to login
      router.push("/login");
    } catch {
      // Even if API fails, clear local auth and redirect
      clearAuth();
      router.push("/login");
    }
  };

  const handleUpdateNow = () => {
    if (isUpdating) return; // Prevent multiple simultaneous requests
    
    setIsUpdating(true);
    // Trigger refresh by incrementing refreshTrigger
    // This will cause OverviewClient's useEffect to re-run
    setRefreshTrigger((prev) => prev + 1);
    
    // Reset updating state after a reasonable delay to allow the fetch to complete
    // The actual loading state is handled by OverviewClient
    setTimeout(() => {
      setIsUpdating(false);
    }, 2000); // 2 seconds should be enough for most API calls
  };

  return (
    <div className="flex flex-col h-full">
      {/* Topbar */}
      <header className="border-b border-vm-border/60 bg-vm-bg/80 backdrop-blur px-4 sm:px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-vm-textMain">Overview</h1>
          <p className="text-xs sm:text-sm text-vm-textMuted mt-1">
            FilamentRank & CamPrices performance at a glance.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Logout button */}
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="px-4 py-1.5 text-xs sm:text-sm text-vm-textMuted hover:text-vm-textMain border border-vm-border rounded-full hover:border-vm-primary/60 hover:bg-vm-card/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoggingOut ? "Logging out..." : "Log out"}
          </button>
          
          {/* Selector de sitio */}
          <div className="relative inline-flex items-center">
            <select
              className="vm-select appearance-none bg-vm-card/80 border border-vm-border text-xs sm:text-sm text-vm-textMain rounded-full px-3 pr-7 py-1.5 leading-tight focus:outline-none focus:ring-2 focus:ring-vm-primary/70 focus:border-vm-primary/70 cursor-pointer"
              value={site}
              onChange={(e) => setSite(e.target.value as Ga4Site)}
            >
              <option value="filamentrank">FilamentRank</option>
              <option value="camprices">CamPrices</option>
            </select>
            <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-vm-textMuted">
              ▼
            </span>
          </div>
          {/* Selector de rango */}
          <div className="relative inline-flex items-center">
            <select
              className="vm-select appearance-none bg-vm-bg/80 border border-vm-border text-xs sm:text-sm text-vm-textMuted rounded-full px-3 pr-7 py-1.5 leading-tight focus:outline-none focus:ring-2 focus:ring-vm-primary/50 focus:border-vm-primary/50 cursor-pointer ml-2"
              value={range}
              onChange={(e) => setRange(e.target.value as Ga4DateRange)}
            >
              <option value="last_7_days">Last 7 days</option>
              <option value="last_24_hours">Last 24 hours</option>
              <option value="last_30_days">Last 30 days</option>
            </select>
            <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-vm-textMuted">
              ▼
            </span>
          </div>
          
          {/* Update Now button */}
          <button
            onClick={handleUpdateNow}
            disabled={isUpdating}
            className="px-4 py-1.5 text-xs sm:text-sm text-vm-textMain bg-vm-primary/20 border border-vm-primary/50 rounded-full hover:bg-vm-primary/30 hover:border-vm-primary/70 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isUpdating ? (
              <>
                <span className="inline-block w-3 h-3 border-2 border-vm-primary border-t-transparent rounded-full animate-spin"></span>
                <span>Updating...</span>
              </>
            ) : (
              "Update Now"
            )}
          </button>
        </div>
      </header>

      {/* Contenido principal - OverviewClient maneja la carga de datos */}
      <OverviewClient site={site} range={range} refreshTrigger={refreshTrigger} />
    </div>
  );
}

