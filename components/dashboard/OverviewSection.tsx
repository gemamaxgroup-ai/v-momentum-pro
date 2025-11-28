"use client";

import { useState } from "react";
import OverviewClient from "./OverviewClient";
import { Ga4Site, Ga4DateRange } from "@/lib/ga4/overview";

export function OverviewSection() {
  const [site, setSite] = useState<Ga4Site>("filamentrank");
  const [range, setRange] = useState<Ga4DateRange>("last_7_days");

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
        <div className="flex items-center gap-2">
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
        </div>
      </header>

      {/* Contenido principal - OverviewClient maneja la carga de datos */}
      <OverviewClient site={site} range={range} />
    </div>
  );
}

