/**
 * Cliente GA4 para el sistema de alertas
 * Reutiliza la lógica de overview.ts pero con funciones específicas para alertas
 */

import { getAnalyticsClient } from './overview';
import { Ga4Site } from './overview';
import { alertsLogger } from '../alerts/logger';

// Función helper para obtener Property ID
function getGa4PropertyIdInternal(site: Ga4Site): string {
  if (site === 'filamentrank') {
    return process.env.GA4_PROPERTY_ID_FILAMENTRANK || '';
  }
  return process.env.GA4_PROPERTY_ID_CAMPRICES || '';
}

/**
 * Obtiene métricas de tráfico para un período específico
 */
export async function getTrafficSummary(
  siteId: Ga4Site,
  windowDays: number
): Promise<{
  current: { sessions: number; users: number };
  previous: { sessions: number; users: number };
  changePercent: number;
}> {
  alertsLogger.info(`Fetching traffic summary for ${siteId}`, { windowDays });
  
  const client = getAnalyticsClient();
  const propertyId = getGa4PropertyIdInternal(siteId);
  
  if (!propertyId) {
    const error = `GA4 Property ID no configurado para sitio: ${siteId}`;
    alertsLogger.error(error);
    throw new Error(error);
  }

  const property = `properties/${propertyId}`;
  
  // Período actual: últimos N días
  const currentEndDate = 'yesterday';
  const currentStartDate = `${windowDays}daysAgo`;
  
  // Período anterior: N días anteriores
  const previousEndDate = `${windowDays + 1}daysAgo`;
  const previousStartDate = `${windowDays * 2}daysAgo`;

  try {
    // Obtener métricas del período actual
    alertsLogger.info(`Fetching GA4 data: current period (${currentStartDate} to ${currentEndDate})`);
    const [currentResponse] = await client.runReport({
      property,
      dateRanges: [{ startDate: currentStartDate, endDate: currentEndDate }],
      metrics: [
        { name: 'sessions' },
        { name: 'totalUsers' },
      ],
    });

    // Obtener métricas del período anterior
    alertsLogger.info(`Fetching GA4 data: previous period (${previousStartDate} to ${previousEndDate})`);
    const [previousResponse] = await client.runReport({
      property,
      dateRanges: [{ startDate: previousStartDate, endDate: previousEndDate }],
      metrics: [
        { name: 'sessions' },
        { name: 'totalUsers' },
      ],
    });

  const currentRow = currentResponse.rows?.[0];
  const previousRow = previousResponse.rows?.[0];

  const currentSessions = Number(currentRow?.metricValues?.[0]?.value || 0);
  const currentUsers = Number(currentRow?.metricValues?.[1]?.value || 0);
  const previousSessions = Number(previousRow?.metricValues?.[0]?.value || 0);
  const previousUsers = Number(previousRow?.metricValues?.[1]?.value || 0);

    const changePercent = previousSessions > 0
      ? ((currentSessions - previousSessions) / previousSessions) * 100
      : 0;

    const result = {
      current: { sessions: currentSessions, users: currentUsers },
      previous: { sessions: previousSessions, users: previousUsers },
      changePercent: Math.round(changePercent * 100) / 100,
    };

    alertsLogger.info(`Traffic summary fetched successfully for ${siteId}`, result);
    return result;
  } catch (error) {
    alertsLogger.error(`Error fetching traffic summary for ${siteId}`, { error, propertyId });
    throw error;
  }
}

/**
 * Obtiene métricas de conversión para un período específico
 */
export async function getConversionSummary(
  siteId: Ga4Site,
  windowDays: number
): Promise<{
  current: { conversionRate: number; conversions: number; sessions: number };
  previous: { conversionRate: number; conversions: number; sessions: number };
  changePercent: number;
}> {
  alertsLogger.info(`Fetching conversion summary for ${siteId}`, { windowDays });
  
  const client = getAnalyticsClient();
  const propertyId = getGa4PropertyIdInternal(siteId);
  
  if (!propertyId) {
    const error = `GA4 Property ID no configurado para sitio: ${siteId}`;
    alertsLogger.error(error);
    throw new Error(error);
  }

  const property = `properties/${propertyId}`;
  
  const currentEndDate = 'yesterday';
  const currentStartDate = `${windowDays}daysAgo`;
  const previousEndDate = `${windowDays + 1}daysAgo`;
  const previousStartDate = `${windowDays * 2}daysAgo`;

  try {
    const [currentResponse] = await client.runReport({
      property,
      dateRanges: [{ startDate: currentStartDate, endDate: currentEndDate }],
      metrics: [
        { name: 'sessions' },
        { name: 'conversions' },
      ],
    });

    const [previousResponse] = await client.runReport({
      property,
      dateRanges: [{ startDate: previousStartDate, endDate: previousEndDate }],
      metrics: [
        { name: 'sessions' },
        { name: 'conversions' },
      ],
    });

  const currentRow = currentResponse.rows?.[0];
  const previousRow = previousResponse.rows?.[0];

  const currentSessions = Number(currentRow?.metricValues?.[0]?.value || 0);
  const currentConversions = Number(currentRow?.metricValues?.[1]?.value || 0);
  const previousSessions = Number(previousRow?.metricValues?.[0]?.value || 0);
  const previousConversions = Number(previousRow?.metricValues?.[1]?.value || 0);

  const currentRate = currentSessions > 0 ? currentConversions / currentSessions : 0;
  const previousRate = previousSessions > 0 ? previousConversions / previousSessions : 0;

    const changePercent = previousRate > 0
      ? ((currentRate - previousRate) / previousRate) * 100
      : 0;

    const result = {
      current: {
        conversionRate: currentRate,
        conversions: currentConversions,
        sessions: currentSessions,
      },
      previous: {
        conversionRate: previousRate,
        conversions: previousConversions,
        sessions: previousSessions,
      },
      changePercent: Math.round(changePercent * 100) / 100,
    };

    alertsLogger.info(`Conversion summary fetched successfully for ${siteId}`, result);
    return result;
  } catch (error) {
    alertsLogger.error(`Error fetching conversion summary for ${siteId}`, { error, propertyId });
    throw error;
  }
}

/**
 * Obtiene métricas de pageviews para un período específico
 */
export async function getPageviewsSummary(
  siteId: Ga4Site,
  windowDays: number
): Promise<{
  daily: number[];
  average: number;
  lastDay: number;
  multiplier: number;
}> {
  alertsLogger.info(`Fetching pageviews summary for ${siteId}`, { windowDays });
  
  const client = getAnalyticsClient();
  const propertyId = getGa4PropertyIdInternal(siteId);
  
  if (!propertyId) {
    const error = `GA4 Property ID no configurado para sitio: ${siteId}`;
    alertsLogger.error(error);
    throw new Error(error);
  }

  const property = `properties/${propertyId}`;
  const endDate = 'yesterday';
  const startDate = `${windowDays}daysAgo`;

  try {
    const [response] = await client.runReport({
      property,
      dateRanges: [{ startDate, endDate }],
      dimensions: [{ name: 'date' }],
      metrics: [{ name: 'screenPageViews' }],
      orderBys: [{ dimension: { dimensionName: 'date' } }],
    });

  const daily: number[] = (response.rows || []).map((row) =>
    Number(row.metricValues?.[0]?.value || 0)
  );

  if (daily.length === 0) {
    return {
      daily: [],
      average: 0,
      lastDay: 0,
      multiplier: 0,
    };
  }

  const lastDay = daily[daily.length - 1];
  const previousDays = daily.slice(0, -1);
  const average = previousDays.length > 0
    ? previousDays.reduce((sum, val) => sum + val, 0) / previousDays.length
    : lastDay;

    const multiplier = average > 0 ? lastDay / average : 0;

    const result = {
      daily,
      average: Math.round(average * 100) / 100,
      lastDay,
      multiplier: Math.round(multiplier * 100) / 100,
    };

    alertsLogger.info(`Pageviews summary fetched successfully for ${siteId}`, result);
    return result;
  } catch (error) {
    alertsLogger.error(`Error fetching pageviews summary for ${siteId}`, { error, propertyId });
    throw error;
  }
}
