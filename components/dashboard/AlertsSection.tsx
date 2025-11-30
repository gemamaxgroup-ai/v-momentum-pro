"use client";

import { useState, useEffect } from "react";
import { Ga4Site } from "@/lib/ga4/overview";
import { AlertConfig, getAlertsConfig, toggleAlert } from "@/lib/alerts";
import { getCurrentUser } from "@/lib/auth";

interface AlertsSectionProps {
  site: Ga4Site;
  onSiteChange?: (site: Ga4Site) => void;
}

export function AlertsSection({ site }: AlertsSectionProps) {
  const [alerts, setAlerts] = useState<AlertConfig[]>(() => getAlertsConfig(site));
  const [isRunningAlerts, setIsRunningAlerts] = useState<boolean>(false);
  const [runResult, setRunResult] = useState<string | null>(null);

  // Cargar configuración desde el backend cuando cambia el sitio
  const loadRulesFromBackend = async () => {
    try {
      const response = await fetch(`/api/alerts/rules?site=${site}`);
      if (response.ok) {
        const data = await response.json();
        // Convertir AlertRule del backend a AlertConfig del frontend
        interface BackendAlertRule {
          id: string;
          name: string;
          description: string;
          type: string;
          isEnabled: boolean;
        }
        const converted = data.rules.map((r: BackendAlertRule) => ({
          id: r.id,
          name: r.name,
          description: r.description,
          metric: mapTypeToMetric(r.type),
          condition: mapTypeToCondition(r.type),
          thresholdPercent: getThresholdFromType(r.type),
          lookbackDays: 7,
          enabled: r.isEnabled,
        }));
        setAlerts(converted);
      }
    } catch (error) {
      console.error('Error loading rules from backend:', error);
      // Fallback a localStorage
      const config = getAlertsConfig(site);
      setAlerts(config);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      loadRulesFromBackend();
    }, 0);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [site]);

  const handleToggle = async (alertId: string, enabled: boolean) => {
    // Optimistic update
    const previousAlerts = [...alerts];
    const optimisticUpdated = alerts.map((alert) =>
      alert.id === alertId ? { ...alert, enabled } : alert
    );
    setAlerts(optimisticUpdated);

    // Actualizar en backend
    try {
      const response = await fetch(`/api/alerts/rules?id=${alertId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isEnabled: enabled }),
      });

      if (!response.ok) {
        // Revertir cambio si falla
        setAlerts(previousAlerts);
        const errorData = await response.json().catch(() => ({}));
        setRunResult(`Error: ${errorData.message || 'Failed to update alert rule'}`);
        setTimeout(() => setRunResult(null), 5000);
      } else {
        // También actualizar localStorage para compatibilidad
        toggleAlert(site, alertId, enabled);
      }
    } catch (error) {
      // Revertir cambio si falla
      setAlerts(previousAlerts);
      console.error('Error updating alert rule:', error);
      setRunResult(`Error: ${(error as Error).message}`);
      setTimeout(() => setRunResult(null), 5000);
    }
  };

  const handleRunAlerts = async () => {
    setIsRunningAlerts(true);
    setRunResult(null);

    try {
      // Usar endpoint intermedio que maneja CRON_SECRET en el servidor
      const response = await fetch('/api/alerts/run-manual', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (data.success) {
        const { summary } = data;
        setRunResult(
          `Alerts processed: ${summary.alertsEvaluated} evaluated, ${summary.alertsTriggered} triggered, ${summary.emailsSent} emails sent.`
        );
      } else {
        setRunResult(`Error: ${data.message || data.error || 'Failed to run alerts'}`);
      }
    } catch (error) {
      setRunResult(`Error: ${(error as Error).message}`);
    } finally {
      setIsRunningAlerts(false);
      setTimeout(() => {
        setRunResult(null);
      }, 5000);
    }
  };

  // Helper functions para mapear tipos
  const mapTypeToMetric = (type: string): AlertConfig['metric'] => {
    if (type.includes('TRAFFIC')) return 'traffic';
    if (type.includes('CONVERSION')) return 'conversion_rate';
    if (type.includes('PAGEVIEWS')) return 'pageviews_spike';
    return 'traffic';
  };

  const mapTypeToCondition = (type: string): AlertConfig['condition'] => {
    if (type.includes('DROP')) return 'drop';
    if (type.includes('SPIKE')) return 'rise';
    return 'drop';
  };

  const getThresholdFromType = (type: string): number => {
    if (type === 'TRAFFIC_DROP_30') return 30;
    if (type === 'CONVERSION_DROP_20') return 20;
    if (type === 'PAGEVIEWS_SPIKE_2X') return 100;
    return 30;
  };

  // Verificar si el usuario es admin (por ahora, cualquier usuario autenticado)
  const isAdmin = getCurrentUser() !== null;

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
          <strong>Note:</strong> Alert triggering based on GA4 data is now available. This page manages which alerts are active for each site. Alerts are evaluated by a scheduled job calling /api/alerts/run.
        </p>
      </div>

      {/* Run alerts button (admin only) */}
      {isAdmin && (
        <div className="mb-6 flex items-center justify-between">
          <div></div>
          <button
            onClick={handleRunAlerts}
            disabled={isRunningAlerts}
            className="px-4 py-2 text-sm font-medium text-white bg-vm-primary rounded-full hover:bg-vm-primarySoft transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isRunningAlerts ? (
              <>
                <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                <span>Running alerts...</span>
              </>
            ) : (
              "Run alerts now"
            )}
          </button>
        </div>
      )}

      {/* Run result message */}
      {runResult && (
        <div className={`mb-6 p-3 rounded-lg text-sm ${
          runResult.includes('Error') 
            ? 'bg-red-500/20 border border-red-500/50 text-red-400'
            : 'bg-green-500/20 border border-green-500/50 text-green-400'
        }`}>
          {runResult}
        </div>
      )}

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
