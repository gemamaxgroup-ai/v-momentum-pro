import { NextResponse } from 'next/server';
import { getGa4Overview, Ga4Site, Ga4DateRange } from '@/lib/ga4/overview';

/**
 * Endpoint API para obtener datos de overview desde Google Analytics 4
 * 
 * Más adelante, getGa4Overview se implementará usando:
 * - Service Account (GA4_SA_CLIENT_EMAIL, GA4_SA_PRIVATE_KEY)
 * - Google Analytics Data API v1
 * - Property ID según el sitio (GA4_PROPERTY_ID_FILAMENTRANK o GA4_PROPERTY_ID_CAMPRICES)
 * 
 * Este endpoint será el que usaremos desde el dashboard para sustituir los mocks actuales.
 * 
 * Parámetros de query:
 * - site: 'filamentrank' | 'camprices' (default: 'filamentrank')
 * - range: 'last_7_days' | 'last_24_hours' | 'last_30_days' (default: 'last_7_days')
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const site = (searchParams.get('site') || 'filamentrank') as Ga4Site;
  const range = (searchParams.get('range') || 'last_7_days') as Ga4DateRange;

  try {
    const data = await getGa4Overview(site, range);
    return NextResponse.json(data);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    console.error('GA4 overview error:', errorMessage);
    
    // Si falta configuración de GA4, retornar error claro
    if (errorMessage.includes('GA4_SERVICE_ACCOUNT_JSON') || 
        errorMessage.includes('not configured') ||
        errorMessage.includes('GA4 property id')) {
      return NextResponse.json(
        { error: 'GA4 not configured', message: errorMessage },
        { status: 500 },
      );
    }
    
    // Otros errores
    return NextResponse.json(
      { error: 'Failed to fetch GA4 overview', message: errorMessage },
      { status: 500 },
    );
  }
}

