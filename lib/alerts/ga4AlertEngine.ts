/**
 * Motor de evaluación de alertas basado en datos GA4
 */

import { BetaAnalyticsDataClient } from '@google-analytics/data';
import { AlertRule, AlertEvent, AlertSeverity } from './types';
import { getRecentEventsForRule } from './storage';
import { Ga4Site } from '../ga4/overview';

// Función helper para obtener Property ID
function getGa4PropertyIdInternal(site: Ga4Site): string {
  if (site === 'filamentrank') {
    return process.env.GA4_PROPERTY_ID_FILAMENTRANK || '';
  }
  return process.env.GA4_PROPERTY_ID_CAMPRICES || '';
}

interface Ga4Metrics {
  sessions: number;
  conversions: number;
  pageViews: number;
  conversionRate: number;
}

/**
 * Obtiene métricas GA4 para un período específico
 */
async function getGa4MetricsForPeriod(
  client: BetaAnalyticsDataClient,
  propertyId: string,
  startDate: string,
  endDate: string
): Promise<Ga4Metrics> {
  const [response] = await client.runReport({
    property: `properties/${propertyId}`,
    dateRanges: [{ startDate, endDate }],
    metrics: [
      { name: 'sessions' },
      { name: 'conversions' },
      { name: 'screenPageViews' },
    ],
  });

  const row = response.rows?.[0];
  const values = row?.metricValues || [];

  const sessions = Number(values[0]?.value || 0);
  const conversions = Number(values[1]?.value || 0);
  const pageViews = Number(values[2]?.value || 0);
  const conversionRate = sessions > 0 ? conversions / sessions : 0;

  return {
    sessions,
    conversions,
    pageViews,
    conversionRate,
  };
}

/**
 * Obtiene pageviews diarios para los últimos N días
 */
async function getDailyPageViews(
  client: BetaAnalyticsDataClient,
  propertyId: string,
  days: number
): Promise<number[]> {
  const endDate = 'yesterday';
  const startDate = `${days}daysAgo`;

  const [response] = await client.runReport({
    property: `properties/${propertyId}`,
    dateRanges: [{ startDate, endDate }],
    dimensions: [{ name: 'date' }],
    metrics: [{ name: 'screenPageViews' }],
    orderBys: [{ dimension: { dimensionName: 'date' } }],
  });

  return (response.rows || []).map((row) => Number(row.metricValues?.[0]?.value || 0));
}

/**
 * Evalúa la regla TRAFFIC_DROP_30
 */
async function evaluateTrafficDrop30(
  client: BetaAnalyticsDataClient,
  propertyId: string
): Promise<{ triggered: boolean; payload?: AlertEvent['payload'] }> {
  // Período A: últimos 7 días
  const periodA = await getGa4MetricsForPeriod(client, propertyId, '7daysAgo', 'yesterday');
  
  // Período B: 7 días anteriores (8-14 días atrás)
  const periodB = await getGa4MetricsForPeriod(client, propertyId, '14daysAgo', '8daysAgo');

  const sessionsA = periodA.sessions;
  const sessionsB = periodB.sessions;

  if (sessionsB === 0) {
    return { triggered: false };
  }

  const changePercent = ((sessionsA - sessionsB) / sessionsB) * 100;
  const threshold = -30; // Drop > 30%

  if (changePercent < threshold) {
    return {
      triggered: true,
      payload: {
        previousValue: sessionsB,
        currentValue: sessionsA,
        changePercent: Math.round(changePercent * 100) / 100,
        metric: 'sessions',
        periodA: 'last 7 days',
        periodB: 'previous 7 days',
      },
    };
  }

  return { triggered: false };
}

/**
 * Evalúa la regla CONVERSION_DROP_20
 */
async function evaluateConversionDrop20(
  client: BetaAnalyticsDataClient,
  propertyId: string
): Promise<{ triggered: boolean; payload?: AlertEvent['payload'] }> {
  // Período A: últimos 7 días
  const periodA = await getGa4MetricsForPeriod(client, propertyId, '7daysAgo', 'yesterday');
  
  // Período B: 7 días anteriores
  const periodB = await getGa4MetricsForPeriod(client, propertyId, '14daysAgo', '8daysAgo');

  const crA = periodA.conversionRate;
  const crB = periodB.conversionRate;

  if (crB === 0) {
    return { triggered: false };
  }

  const changePercent = ((crA - crB) / crB) * 100;
  const threshold = -20; // Drop > 20%

  if (changePercent < threshold) {
    return {
      triggered: true,
      payload: {
        previousValue: crB,
        currentValue: crA,
        changePercent: Math.round(changePercent * 100) / 100,
        metric: 'conversion_rate',
        periodA: 'last 7 days',
        periodB: 'previous 7 days',
        conversionsA: periodA.conversions,
        conversionsB: periodB.conversions,
        sessionsA: periodA.sessions,
        sessionsB: periodB.sessions,
      },
    };
  }

  return { triggered: false };
}

/**
 * Evalúa la regla PAGEVIEWS_SPIKE_2X
 */
async function evaluatePageviewsSpike2x(
  client: BetaAnalyticsDataClient,
  propertyId: string
): Promise<{ triggered: boolean; payload?: AlertEvent['payload'] }> {
  const dailyPageViews = await getDailyPageViews(client, propertyId, 7);
  
  if (dailyPageViews.length < 2) {
    return { triggered: false };
  }

  const lastDay = dailyPageViews[dailyPageViews.length - 1];
  const previousDays = dailyPageViews.slice(0, -1);
  const avg = previousDays.reduce((sum, val) => sum + val, 0) / previousDays.length;

  if (avg === 0) {
    return { triggered: false };
  }

  const multiplier = lastDay / avg;

  if (multiplier > 2) {
    return {
      triggered: true,
      payload: {
        previousValue: avg,
        currentValue: lastDay,
        changePercent: Math.round((multiplier - 1) * 100 * 100) / 100,
        metric: 'pageviews',
        multiplier: Math.round(multiplier * 100) / 100,
        dailyPageViews,
      },
    };
  }

  return { triggered: false };
}

/**
 * Ejecuta la evaluación de alertas para un sitio
 */
export async function evaluateAlertsForSite(
  siteId: Ga4Site,
  rules: AlertRule[],
  client: BetaAnalyticsDataClient
): Promise<AlertEvent[]> {
  const propertyId = getGa4PropertyIdInternal(siteId);
  
  if (!propertyId) {
    console.warn(`No GA4 property ID configured for site: ${siteId}`);
    return [];
  }

  const enabledRules = rules.filter((r) => r.isEnabled && r.siteId === siteId);
  const events: AlertEvent[] = [];

  for (const rule of enabledRules) {
    // Verificar deduplicación (no disparar si ya hay evento en últimas 24h)
    const recentEvents = getRecentEventsForRule(rule.id, siteId);
    if (recentEvents.length > 0) {
      console.log(`Skipping alert ${rule.id} for ${siteId}: recent event exists`);
      continue;
    }

    let result: { triggered: boolean; payload?: AlertEvent['payload'] };
    let severity: AlertSeverity = 'warning';

    try {
      switch (rule.type) {
        case 'TRAFFIC_DROP_30':
          result = await evaluateTrafficDrop30(client, propertyId);
          severity = 'critical';
          break;
        case 'CONVERSION_DROP_20':
          result = await evaluateConversionDrop20(client, propertyId);
          severity = 'warning';
          break;
        case 'PAGEVIEWS_SPIKE_2X':
          result = await evaluatePageviewsSpike2x(client, propertyId);
          severity = 'info';
          break;
        default:
          console.warn(`Unknown alert type: ${rule.type}`);
          continue;
      }

      if (result.triggered && result.payload) {
        const event: AlertEvent = {
          id: `alert-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
          alertRuleId: rule.id,
          siteId,
          triggeredAt: new Date().toISOString(),
          severity,
          payload: result.payload,
          sentToEmails: [],
          emailSent: false,
        };

        events.push(event);
      }
    } catch (error) {
      console.error(`Error evaluating alert ${rule.id} for ${siteId}:`, error);
      // Continuar con la siguiente alerta
    }
  }

  return events;
}

