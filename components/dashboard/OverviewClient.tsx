"use client";

import { useState, useEffect } from "react";
import KpiCard from "./KpiCard";
import TrafficChart from "./TrafficChart";
import TopPagesTable from "./TopPagesTable";
import SuggestionsPanel from "./SuggestionsPanel";
import { Ga4OverviewData, Ga4Site, Ga4DateRange } from "@/lib/ga4/overview";
import { mockDashboardData } from "@/lib/mockDashboardData";
import { getSuggestionsForSite } from "@/lib/suggestions";

interface OverviewClientProps {
  site: Ga4Site;
  range: Ga4DateRange;
  refreshTrigger?: number;
  onSiteChange?: (site: Ga4Site) => void;
}

export default function OverviewClient({ site, range, refreshTrigger, onSiteChange }: OverviewClientProps) {
  // Notificar cambios de sitio al padre (para NotesModal)
  useEffect(() => {
    if (onSiteChange) {
      onSiteChange(site);
    }
  }, [site, onSiteChange]);
  const [data, setData] = useState<Ga4OverviewData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState<boolean>(false);

  async function fetchData(isManualRefresh: boolean = false) {
    setLoading(true);
    setError(null);
    setShowSuccessMessage(false);

    try {
      const response = await fetch(
        `/api/ga4/overview?site=${site}&range=${range}`,
        { cache: "no-store" }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch GA4 data");
      }

      const ga4Data: Ga4OverviewData = await response.json();
      setData(ga4Data);
      setError(null);
      
      // Mostrar mensaje de éxito solo si es una actualización manual
      if (isManualRefresh) {
        setShowSuccessMessage(true);
        // Ocultar el mensaje después de 3 segundos
        setTimeout(() => {
          setShowSuccessMessage(false);
        }, 3000);
      }
    } catch (err) {
      console.error("Error fetching GA4 data:", err);
      if (isManualRefresh) {
        setError("Update failed. Please try again.");
      } else {
        setError("Could not load GA4 data, falling back to sample data");
        // Fallback a datos mock solo en carga inicial
        setData({
          kpis: mockDashboardData.kpis.map((k) => ({
            id: k.id,
            label: k.label,
            value: k.value,
            delta: k.delta,
          })),
          traffic: mockDashboardData.traffic.map((t) => ({
            date: t.day,
            users: t.users,
            sessions: t.sessions,
          })),
          topPages: mockDashboardData.topPages.map((p) => ({
            path: p.path,
            views: p.views,
            ctr: parseFloat(p.ctr.replace("%", "")) / 100,
            avgTimeSeconds: parseDurationToSeconds(p.avgTime),
          })),
        });
      }
      // Mantener datos anteriores en caso de error durante actualización manual
    } finally {
      setLoading(false);
    }
  }

  // Función auxiliar para convertir "3m 24s" a segundos
  function parseDurationToSeconds(duration: string): number {
    const parts = duration.split(" ");
    let totalSeconds = 0;
    for (const part of parts) {
      if (part.endsWith("m")) {
        totalSeconds += parseInt(part) * 60;
      } else if (part.endsWith("s")) {
        totalSeconds += parseInt(part);
      }
    }
    return totalSeconds;
  }

  useEffect(() => {
    // Si refreshTrigger > 0, es una actualización manual
    const isManualRefresh = (refreshTrigger ?? 0) > 0;
    fetchData(isManualRefresh);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [site, range, refreshTrigger]);

  if (loading) {
    return (
      <div className="px-4 sm:px-6 py-6 space-y-6 flex-1 overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div
              key={i}
              className="bg-vm-card/80 border border-vm-border rounded-xl p-6 animate-pulse"
            >
              <div className="h-4 bg-vm-bgSoft/50 rounded w-24 mb-4"></div>
              <div className="h-8 bg-vm-bgSoft/50 rounded w-32 mb-2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="px-4 sm:px-6 py-6 flex-1 overflow-y-auto">
        <div className="text-center text-vm-textMuted">
          <p>No data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 py-6 space-y-6 flex-1 overflow-y-auto">
      {error && (
        <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 text-xs text-red-400">
          {error}
        </div>
      )}

      {showSuccessMessage && !error && !loading && (
        <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-2 text-xs text-green-400 text-center">
          Data updated successfully.
        </div>
      )}

      {/* KPIs Section - Responsive grid con 2 filas si es necesario */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {data.kpis.map((kpi) => (
          <KpiCard key={kpi.id} kpi={kpi} />
        ))}
      </div>

      {/* Chart and Top Pages Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-[2fr,1fr] gap-6">
        {/* Traffic Chart */}
        <TrafficChart data={data.traffic} />

        {/* Top Pages Table */}
        <TopPagesTable data={data.topPages} />
      </div>

      {/* Suggestions Panel - usando función centralizada */}
      <SuggestionsPanel data={getSuggestionsForSite(site, data)} />
    </div>
  );
}

