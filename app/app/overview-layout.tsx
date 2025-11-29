"use client";

import { useState } from "react";
import { OverviewSection } from "@/components/dashboard/OverviewSection";
import { SitesSection } from "@/components/dashboard/SitesSection";
import { AlertsSection } from "@/components/dashboard/AlertsSection";
import { SettingsSection } from "@/components/dashboard/SettingsSection";
import { NotesModal } from "@/components/dashboard/NotesModal";
import { Ga4Site } from "@/lib/ga4/overview";

type SectionId = "overview" | "sites" | "alerts" | "settings";

export function OverviewLayout() {
  const [activeSection, setActiveSection] = useState<SectionId>("overview");
  const [isNotesModalOpen, setIsNotesModalOpen] = useState<boolean>(false);
  const [currentSite, setCurrentSite] = useState<Ga4Site>("filamentrank");

  const renderSection = () => {
    switch (activeSection) {
      case "sites":
        return <SitesSection />;
      case "alerts":
        return <AlertsSection site={currentSite} onSiteChange={setCurrentSite} />;
      case "settings":
        return <SettingsSection />;
      case "overview":
      default:
        return <OverviewSection onSiteChange={setCurrentSite} />;
    }
  };

  const menuItems: Array<{ id: SectionId; label: string; icon: string }> = [
    { id: "overview", label: "Overview", icon: "📊" },
    { id: "sites", label: "Sites", icon: "🌐" },
    { id: "alerts", label: "Alerts", icon: "🔔" },
    { id: "settings", label: "Settings", icon: "⚙️" },
  ];

  // Obtener el sitio actual desde OverviewSection (necesitamos pasarlo como prop o contexto)
  // Por ahora, usamos un estado local que se puede actualizar desde OverviewSection
  // En una implementación más avanzada, usaríamos Context API

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="hidden md:flex w-64 flex-col border-r border-vm-border bg-vm-card/60">
        <div className="px-6 py-5 border-b border-vm-border/60">
          <h1 className="text-sm font-semibold tracking-[0.25em] uppercase text-vm-textMuted">
            V-MOMENTUM-PRO
          </h1>
          <p className="mt-2 text-xs text-vm-textMuted">Analytics & insights</p>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 text-sm">
          {menuItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveSection(item.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all w-full text-left ${
                  isActive
                    ? "bg-vm-bgSoft/60 text-vm-primary border border-vm-primary/30"
                    : "text-vm-textMuted hover:bg-vm-bgSoft/30 hover:text-vm-textMain"
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
          
          {/* Notes button */}
          <button
            type="button"
            onClick={() => setIsNotesModalOpen(true)}
            className="flex items-center gap-3 px-4 py-3 rounded-lg transition-all w-full text-left text-vm-textMuted hover:bg-vm-bgSoft/30 hover:text-vm-textMain mt-2"
          >
            <span className="text-lg">📝</span>
            <span className="font-medium">Notes</span>
          </button>
        </nav>

        <div className="px-4 py-4 border-t border-vm-border/60 text-xs text-vm-textMuted">
          © 2025 V-Momentum-Pro
        </div>
      </aside>

      {/* Main content (sección activa) */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {renderSection()}
      </main>

      {/* Notes Modal */}
      <NotesModal
        isOpen={isNotesModalOpen}
        onClose={() => setIsNotesModalOpen(false)}
        site={currentSite}
      />
    </div>
  );
}

