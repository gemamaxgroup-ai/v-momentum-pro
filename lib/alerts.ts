import { Ga4Site } from './ga4/overview';

export type AlertMetric = 'traffic' | 'conversion_rate' | 'revenue' | 'pageviews_spike';
export type AlertCondition = 'drop' | 'rise';

export interface AlertConfig {
  id: string;
  name: string;
  description: string;
  metric: AlertMetric;
  condition: AlertCondition;
  thresholdPercent: number; // e.g. 30 => 30%
  lookbackDays: number; // e.g. 7
  enabled: boolean;
}

/**
 * Configuración por defecto de alertas
 */
export const DEFAULT_ALERTS: AlertConfig[] = [
  {
    id: 'traffic-drop-30',
    name: 'Traffic drop > 30%',
    description: 'Alert when traffic drops more than 30% compared to previous period',
    metric: 'traffic',
    condition: 'drop',
    thresholdPercent: 30,
    lookbackDays: 7,
    enabled: true,
  },
  {
    id: 'conversion-drop-20',
    name: 'Conversion rate drop > 20%',
    description: 'Alert when conversion rate drops more than 20% compared to previous period',
    metric: 'conversion_rate',
    condition: 'drop',
    thresholdPercent: 20,
    lookbackDays: 7,
    enabled: true,
  },
  {
    id: 'pageviews-spike-2x',
    name: 'Pageviews spike (> 2x average)',
    description: 'Alert when pageviews spike more than 2x the average of the last 7 days',
    metric: 'pageviews_spike',
    condition: 'rise',
    thresholdPercent: 100, // 2x = 100% increase
    lookbackDays: 7,
    enabled: false,
  },
];

/**
 * Obtiene la configuración de alertas para un sitio desde localStorage
 * Si no existe, retorna las alertas por defecto y las guarda
 */
export function getAlertsConfig(site: Ga4Site): AlertConfig[] {
  if (typeof window === 'undefined') {
    return DEFAULT_ALERTS;
  }

  const storageKey = `vmomentum-alerts::${site}`;
  const stored = localStorage.getItem(storageKey);

  if (stored) {
    try {
      const parsed = JSON.parse(stored) as AlertConfig[];
      // Validar que tenga la estructura correcta
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    } catch (error) {
      console.error('Error parsing alerts config:', error);
    }
  }

  // Si no existe o hay error, guardar defaults y retornarlos
  saveAlertsConfig(site, DEFAULT_ALERTS);
  return DEFAULT_ALERTS;
}

/**
 * Guarda la configuración de alertas para un sitio en localStorage
 */
export function saveAlertsConfig(site: Ga4Site, alerts: AlertConfig[]): void {
  if (typeof window === 'undefined') {
    return;
  }

  const storageKey = `vmomentum-alerts::${site}`;
  try {
    localStorage.setItem(storageKey, JSON.stringify(alerts));
  } catch (error) {
    console.error('Error saving alerts config:', error);
  }
}

/**
 * Actualiza el estado enabled de una alerta específica
 */
export function toggleAlert(site: Ga4Site, alertId: string, enabled: boolean): AlertConfig[] {
  const alerts = getAlertsConfig(site);
  const updated = alerts.map((alert) =>
    alert.id === alertId ? { ...alert, enabled } : alert
  );
  saveAlertsConfig(site, updated);
  return updated;
}

