"use client";

import { useState, useEffect } from "react";
import KpiCard from "./KpiCard";
import TrafficChart from "./TrafficChart";
import TopPagesTable from "./TopPagesTable";
import SuggestionsPanel from "./SuggestionsPanel";
import { Ga4OverviewData, Ga4Site, Ga4DateRange } from "@/lib/ga4/overview";
import { mockDashboardData } from "@/lib/mockDashboardData";

interface OverviewClientProps {
  site: Ga4Site;
  range: Ga4DateRange;
}

export default function OverviewClient({ site, range }: OverviewClientProps) {
  const [data, setData] = useState<Ga4OverviewData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);

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
      } catch (err) {
        console.error("Error fetching GA4 data:", err);
        setError("Could not load GA4 data, falling back to sample data");
        // Fallback a datos mock
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
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [site, range]);

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

  if (loading) {
    return (
      <div className="px-4 sm:px-6 py-6 space-y-6 flex-1 overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {[1, 2, 3, 4].map((i) => (
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
        <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-lg p-3 text-xs text-yellow-400">
          {error}
        </div>
      )}

      {/* KPIs Section */}
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

      {/* Suggestions Panel - usando mock por ahora */}
      <SuggestionsPanel data={mockDashboardData.suggestions} />
    </div>
  );
}

