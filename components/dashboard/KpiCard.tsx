import { Ga4OverviewKpi } from "@/lib/ga4/overview";

interface KpiCardProps {
  kpi: Ga4OverviewKpi;
}

export default function KpiCard({ kpi }: KpiCardProps) {
  return (
    <div className="bg-vm-card/80 border border-vm-border rounded-xl p-4 sm:p-6 hover:border-vm-border/80 transition-all">
      <p className="text-xs sm:text-sm text-vm-textMuted mb-2">{kpi.label}</p>
      <p className="text-2xl sm:text-3xl font-bold text-vm-textMain mb-2">{kpi.value}</p>
      {kpi.delta && (
        <div className="flex items-center gap-1">
          <span className="text-xs sm:text-sm font-medium text-vm-textMuted">
            {kpi.delta}
          </span>
        </div>
      )}
    </div>
  );
}

