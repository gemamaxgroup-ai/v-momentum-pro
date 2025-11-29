/**
 * Endpoint intermedio para ejecutar alertas desde la UI
 * Lee CRON_SECRET del servidor y llama al endpoint interno
 * 
 * POST /api/alerts/run-manual
 */

import { NextResponse } from 'next/server';
import { getEnvVarOptional } from '@/lib/utils/env';
import { alertsLogger } from '@/lib/alerts/logger';

export async function POST() {
  alertsLogger.info('=== Alerts API: Run-manual endpoint called ===');
  
  try {
    const cronSecret = getEnvVarOptional('CRON_SECRET');
    
    if (!cronSecret) {
      alertsLogger.error('CRON_SECRET not configured in run-manual endpoint');
      return NextResponse.json(
        { error: 'CRON_SECRET not configured' },
        { status: 500 }
      );
    }

    // Llamar al endpoint interno con el secreto
    // En producción, usar URL absoluta; en desarrollo, usar localhost
    const baseUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}` 
      : process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    
    alertsLogger.info('Calling internal /api/alerts/run endpoint', { baseUrl });
    
    const response = await fetch(`${baseUrl}/api/alerts/run`, {
      method: 'POST',
      headers: {
        'x-cron-secret': cronSecret,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      alertsLogger.error('Internal alerts/run endpoint returned error', { status: response.status, data });
      return NextResponse.json(
        { error: data.error || 'Failed to run alerts', message: data.message },
        { status: response.status }
      );
    }

    alertsLogger.success('Run-manual endpoint completed successfully', { summary: data.summary });
    return NextResponse.json(data);
  } catch (error) {
    alertsLogger.error('Error in /api/alerts/run-manual', { error });
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        message: (error as Error).message,
      },
      { status: 500 }
    );
  }
}

