/**
 * Inicialización de reglas de alertas por defecto
 */

import { AlertRule } from './types';
import { loadAlertRules, saveAlertRules } from './storage';

/**
 * Crea las reglas de alertas por defecto si no existen
 */
export function initializeDefaultAlertRules(): AlertRule[] {
  const existingRules = loadAlertRules();
  
  // Si ya hay reglas, retornarlas
  if (existingRules.length > 0) {
    return existingRules;
  }

  const defaultRules: AlertRule[] = [
    {
      id: 'traffic-drop-30-filamentrank',
      siteId: 'filamentrank',
      type: 'TRAFFIC_DROP_30',
      name: 'Traffic drop > 30%',
      description: 'Alert when traffic drops more than 30% compared to previous period',
      isEnabled: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'conversion-drop-20-filamentrank',
      siteId: 'filamentrank',
      type: 'CONVERSION_DROP_20',
      name: 'Conversion rate drop > 20%',
      description: 'Alert when conversion rate drops more than 20% compared to previous period',
      isEnabled: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'pageviews-spike-2x-filamentrank',
      siteId: 'filamentrank',
      type: 'PAGEVIEWS_SPIKE_2X',
      name: 'Pageviews spike (> 2x average)',
      description: 'Alert when pageviews spike more than 2x the average of the last 7 days',
      isEnabled: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'traffic-drop-30-camprices',
      siteId: 'camprices',
      type: 'TRAFFIC_DROP_30',
      name: 'Traffic drop > 30%',
      description: 'Alert when traffic drops more than 30% compared to previous period',
      isEnabled: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'conversion-drop-20-camprices',
      siteId: 'camprices',
      type: 'CONVERSION_DROP_20',
      name: 'Conversion rate drop > 20%',
      description: 'Alert when conversion rate drops more than 20% compared to previous period',
      isEnabled: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'pageviews-spike-2x-camprices',
      siteId: 'camprices',
      type: 'PAGEVIEWS_SPIKE_2X',
      name: 'Pageviews spike (> 2x average)',
      description: 'Alert when pageviews spike more than 2x the average of the last 7 days',
      isEnabled: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  saveAlertRules(defaultRules);
  return defaultRules;
}

