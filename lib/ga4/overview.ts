import { BetaAnalyticsDataClient } from '@google-analytics/data';

// Tipos para la integración con Google Analytics 4
export type Ga4DateRange = 'last_7_days' | 'last_24_hours' | 'last_30_days';
export type Ga4Site = 'filamentrank' | 'camprices';

export interface Ga4OverviewKpi {
  id: string;
  label: string;
  value: string;
  delta: string;
}

export interface Ga4OverviewTrafficPoint {
  date: string;      // '2025-01-20'
  users: number;
  sessions: number;
}

export interface Ga4OverviewTopPage {
  path: string;
  views: number;
  ctr: number;
  avgTimeSeconds: number;
}

export interface Ga4OverviewData {
  kpis: Ga4OverviewKpi[];
  traffic: Ga4OverviewTrafficPoint[];
  topPages: Ga4OverviewTopPage[];
}

/**
 * Crea el cliente de Analytics Data API usando credenciales desde variables de entorno
 * 
 * Lee GA4_SERVICE_ACCOUNT_JSON que debe contener el JSON completo del Service Account
 * como una cadena de texto (sin saltos de línea, o con \n escapados).
 */
function createAnalyticsClient() {
  const ga4Json = process.env.GA4_SERVICE_ACCOUNT_JSON;
  
  if (!ga4Json) {
    throw new Error('GA4_SERVICE_ACCOUNT_JSON no está configurada. Configúrala en Vercel o .env.local');
  }

  try {
    const credentials = JSON.parse(ga4Json);
    
    if (!credentials.client_email || !credentials.private_key) {
      throw new Error('El JSON del Service Account debe contener client_email y private_key');
    }

    // Normalizar la private_key: reemplazar \n escapados por saltos de línea reales
    const normalizedCredentials = {
      ...credentials,
      private_key: credentials.private_key.replace(/\\n/g, '\n'),
    };

    return new BetaAnalyticsDataClient({
      credentials: normalizedCredentials,
    });
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error('GA4_SERVICE_ACCOUNT_JSON no es un JSON válido. Verifica que esté correctamente formateado.');
    }
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Error desconocido al crear el cliente de GA4');
  }
}

// Cliente de Analytics Data API (instancia única, se crea solo si las credenciales están disponibles)
let analyticsDataClient: BetaAnalyticsDataClient | null = null;

function getAnalyticsClient(): BetaAnalyticsDataClient {
  if (!analyticsDataClient) {
    analyticsDataClient = createAnalyticsClient();
  }
  return analyticsDataClient;
}

/**
 * Obtiene el Property ID de GA4 según el sitio
 * 
 * @param site - El sitio ('filamentrank' o 'camprices')
 * @returns El Property ID desde las variables de entorno
 */
function getGa4PropertyId(site: Ga4Site): string {
  if (site === 'filamentrank') {
    return process.env.GA4_PROPERTY_ID_FILAMENTRANK || '';
  }
  return process.env.GA4_PROPERTY_ID_CAMPRICES || '';
}

/**
 * Mapea el rango de fechas a formato de GA4
 */
function getDateRange(range: Ga4DateRange) {
  switch (range) {
    case 'last_24_hours':
      return { startDate: '1daysAgo', endDate: 'today' };
    case 'last_30_days':
      return { startDate: '30daysAgo', endDate: 'yesterday' };
    case 'last_7_days':
    default:
      return { startDate: '7daysAgo', endDate: 'yesterday' };
  }
}

/**
 * Formatea un número grande a formato legible (ej: 12450 -> "12.4K")
 */
function formatNumber(value: number): string {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`;
  }
  return value.toString();
}

/**
 * Convierte fecha YYYYMMDD a YYYY-MM-DD
 */
function formatDate(dateStr: string): string {
  if (dateStr.length === 8) {
    return `${dateStr.slice(0, 4)}-${dateStr.slice(4, 6)}-${dateStr.slice(6, 8)}`;
  }
  return dateStr;
}

/**
 * Formatea duración en segundos a formato legible (ej: 125 -> "2m 5s")
 */
function formatDuration(seconds: number): string {
  if (seconds < 60) {
    return `${Math.round(seconds)}s`;
  }
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.round(seconds % 60);
  if (remainingSeconds === 0) {
    return `${minutes}m`;
  }
  return `${minutes}m ${remainingSeconds}s`;
}

/**
 * Obtiene los datos de overview desde Google Analytics 4
 * 
 * Implementación REAL usando Google Analytics Data API v1
 */
export async function getGa4Overview(
  site: Ga4Site,
  range: Ga4DateRange
): Promise<Ga4OverviewData> {
  const propertyId = getGa4PropertyId(site);
  
  if (!propertyId) {
    console.error("[GA4 DEBUG] GA4_PROPERTY_ID_FILAMENTRANK value:", process.env.GA4_PROPERTY_ID_FILAMENTRANK ?? "<undefined>");
    throw new Error(
      `GA4 property id not configured. Set GA4_PROPERTY_ID_${site.toUpperCase()} in .env.local`
    );
  }

  const dateRange = getDateRange(range);
  const property = `properties/${propertyId}`;

  try {
    const client = getAnalyticsClient();
    
    // 1. Obtener KPIs agregados (incluyendo nuevas métricas)
    const [kpiResponse] = await client.runReport({
      property,
      dateRanges: [dateRange],
      metrics: [
        { name: 'totalUsers' },
        { name: 'newUsers' },
        { name: 'sessions' },
        { name: 'screenPageViews' },
        { name: 'sessionConversionRate' },
        { name: 'averageSessionDuration' },
        { name: 'bounceRate' },
      ],
    });

    const kpiRow = kpiResponse.rows?.[0];
    const kpiValues = kpiRow?.metricValues || [];

    const totalUsers = Number(kpiValues[0]?.value || 0);
    const newUsers = Number(kpiValues[1]?.value || 0);
    const sessions = Number(kpiValues[2]?.value || 0);
    const pageViews = Number(kpiValues[3]?.value || 0);
    const conversionRate = Number(kpiValues[4]?.value || 0);
    const avgSessionDuration = Number(kpiValues[5]?.value || 0); // en segundos
    const bounceRate = Number(kpiValues[6]?.value || 0); // decimal (0-1)

    // Calcular pages per session
    const pagesPerSession = sessions > 0 ? pageViews / sessions : 0;

    const rangeLabel = range === 'last_24_hours' ? '24h' : range === 'last_7_days' ? '7d' : '30d';

    const kpis: Ga4OverviewKpi[] = [
      {
        id: 'users',
        label: `Users (${rangeLabel})`,
        value: formatNumber(totalUsers),
        delta: '', // TODO: calcular delta comparando con período anterior
      },
      {
        id: 'sessions',
        label: `Sessions (${rangeLabel})`,
        value: formatNumber(sessions),
        delta: '',
      },
      {
        id: 'views',
        label: 'Page views',
        value: formatNumber(pageViews),
        delta: '',
      },
      {
        id: 'conv-rate',
        label: 'Conversion rate',
        value: `${(conversionRate * 100).toFixed(1)}%`,
        delta: '',
      },
      {
        id: 'new-users',
        label: `New users (${rangeLabel})`,
        value: formatNumber(newUsers),
        delta: '',
      },
      {
        id: 'avg-session-duration',
        label: `Avg. session duration (${rangeLabel})`,
        value: formatDuration(avgSessionDuration),
        delta: '',
      },
      {
        id: 'pages-per-session',
        label: `Pages per session (${rangeLabel})`,
        value: pagesPerSession.toFixed(1),
        delta: '',
      },
      {
        id: 'bounce-rate',
        label: `Bounce rate (${rangeLabel})`,
        value: `${(bounceRate * 100).toFixed(1)}%`,
        delta: '',
      },
    ];

    // 2. Obtener tráfico por día
    const [trafficResponse] = await client.runReport({
      property,
      dateRanges: [dateRange],
      dimensions: [{ name: 'date' }],
      metrics: [
        { name: 'totalUsers' },
        { name: 'sessions' },
      ],
      orderBys: [{ dimension: { dimensionName: 'date' } }],
    });

    const traffic: Ga4OverviewTrafficPoint[] = (trafficResponse.rows || []).map((row) => ({
      date: formatDate(row.dimensionValues?.[0]?.value || ''),
      users: Number(row.metricValues?.[0]?.value || 0),
      sessions: Number(row.metricValues?.[1]?.value || 0),
    }));

    // 3. Obtener top pages
    const [topPagesResponse] = await client.runReport({
      property,
      dateRanges: [dateRange],
      dimensions: [{ name: 'pagePath' }],
      metrics: [
        { name: 'screenPageViews' },
        { name: 'sessionConversionRate' },
        { name: 'averageSessionDuration' },
      ],
      orderBys: [
        { metric: { metricName: 'screenPageViews' }, desc: true },
      ],
      limit: 5,
    });

    const topPages: Ga4OverviewTopPage[] = (topPagesResponse.rows || []).map((row) => ({
      path: row.dimensionValues?.[0]?.value || '',
      views: Number(row.metricValues?.[0]?.value || 0),
      ctr: Number(row.metricValues?.[1]?.value || 0),
      avgTimeSeconds: Number(row.metricValues?.[2]?.value || 0),
    }));

    return {
      kpis,
      traffic,
      topPages,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    console.error('Error fetching GA4 data:', errorMessage);
    throw new Error(`Failed to fetch GA4 data: ${errorMessage}`);
  }
}
