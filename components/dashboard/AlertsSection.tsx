"use client";

import { useState, useEffect } from "react";
import { Ga4Site } from "@/lib/ga4/overview";
import { AlertConfig, getAlertsConfig, toggleAlert } from "@/lib/alerts";

interface AlertsSectionProps {
  site: Ga4Site;
  onSiteChange?: (site: Ga4Site) => void;
}

export function AlertsSection({ site }: AlertsSectionProps) {
  // Usar useMemo para calcular las alertas cuando cambia el sitio
  const [alerts, setAlerts] = useState<AlertConfig[]>(() => getAlertsConfig(site));

  // Cargar configuración de alertas cuando cambia el sitio usando setTimeout para evitar setState sincrónico
  useEffect(() => {
    const timer = setTimeout(() => {
      const config = getAlertsConfig(site);
      setAlerts(config);
    }, 0);
    return () => clearTimeout(timer);
  }, [site]);

  const handleToggle = (alertId: string, enabled: boolean) => {
    const updated = toggleAlert(site, alertId, enabled);
    setAlerts(updated);
  };

  const getMetricDisplayName = (metric: string): string => {
    const names: Record<string, string> = {
      traffic: "Traffic",
      conversion_rate: "Conversion Rate",
      revenue: "Revenue",
      pageviews_spike: "Pageviews Spike",
    };
    return names[metric] || metric;
  };

  const getConditionDisplayText = (alert: AlertConfig): string => {
    const conditionText = alert.condition === "drop" ? "Drop" : "Rise";
    return `${conditionText} > ${alert.thresholdPercent}% over ${alert.lookbackDays} days`;
  };


  return (
    <div className="px-4 sm:px-6 py-6">
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-semibold text-vm-textMain mb-2">Alerts</h1>
        <p className="text-sm text-vm-textMuted">
          Configure alerts to detect traffic drops, conversion rate changes, and other important metrics.
        </p>
      </div>

      {/* Info banner */}
      <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mb-6">
        <p className="text-xs text-blue-400">
          <strong>Note:</strong> Alert triggering based on GA4 data will be implemented in a later version. This page currently manages alert configurations only.
        </p>
      </div>

      {/* Alerts table */}
      <div className="bg-vm-card/80 border border-vm-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-vm-bgSoft/40 border-b border-vm-border">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-vm-textMuted uppercase tracking-wider">
                  Alert Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-vm-textMuted uppercase tracking-wider">
                  Description
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-vm-textMuted uppercase tracking-wider">
                  Condition
                </th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-vm-textMuted uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-vm-border">
              {alerts.map((alert) => (
                <tr
                  key={alert.id}
                  className="hover:bg-vm-bgSoft/20 transition-colors"
                >
                  <td className="px-4 py-4">
                    <div className="text-sm font-medium text-vm-textMain">{alert.name}</div>
                    <div className="text-xs text-vm-textMuted mt-1">
                      {getMetricDisplayName(alert.metric)}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <p className="text-xs text-vm-textMuted max-w-md">{alert.description}</p>
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-xs text-vm-textMuted">
                      {getConditionDisplayText(alert)}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <button
                      onClick={() => handleToggle(alert.id, !alert.enabled)}
                      className={`inline-flex items-center justify-center px-3 py-1.5 rounded-full text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-vm-primary/50 focus:ring-offset-2 focus:ring-offset-vm-card ${
                        alert.enabled
                          ? "bg-vm-primary text-white"
                          : "bg-vm-border text-vm-textMuted"
                      }`}
                      aria-label={`Toggle ${alert.name} alert`}
                      role="switch"
                      aria-checked={alert.enabled}
                    >
                      {alert.enabled ? "On" : "Off"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {alerts.length === 0 && (
          <div className="text-center py-8">
            <p className="text-sm text-vm-textMuted">No alerts configured</p>
          </div>
        )}
      </div>
    </div>
  );
}
