/**
 * Endpoint para gestionar reglas de alertas
 * 
 * GET /api/alerts/rules?site=filamentrank - Obtiene reglas para un sitio
 * PATCH /api/alerts/rules/:id - Actualiza una regla (por ahora solo isEnabled)
 */

import { NextResponse } from 'next/server';
import { loadAlertRules, saveAlertRules } from '@/lib/alerts/storage';
import { initializeDefaultAlertRules } from '@/lib/alerts/init';
import { Ga4Site } from '@/lib/ga4/overview';
import { alertsLogger } from '@/lib/alerts/logger';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const site = searchParams.get('site') as Ga4Site | null;

    alertsLogger.info('GET /api/alerts/rules', { site });

    // Inicializar reglas por defecto si no existen
    initializeDefaultAlertRules();
    const allRules = loadAlertRules();

    if (site) {
      const siteRules = allRules.filter((r) => r.siteId === site);
      alertsLogger.info(`Returning ${siteRules.length} rules for site ${site}`);
      return NextResponse.json({ rules: siteRules });
    }

    alertsLogger.info(`Returning ${allRules.length} total rules`);
    return NextResponse.json({ rules: allRules });
  } catch (error) {
    alertsLogger.error('Error in GET /api/alerts/rules', { error });
    return NextResponse.json(
      { error: 'Failed to load alert rules', message: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const ruleId = searchParams.get('id');

    if (!ruleId) {
      alertsLogger.warn('PATCH /api/alerts/rules called without rule ID');
      return NextResponse.json(
        { error: 'Missing rule ID' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { isEnabled } = body;

    if (typeof isEnabled !== 'boolean') {
      alertsLogger.warn('PATCH /api/alerts/rules called with invalid isEnabled value', { ruleId, isEnabled });
      return NextResponse.json(
        { error: 'Invalid isEnabled value' },
        { status: 400 }
      );
    }

    alertsLogger.info(`Updating rule ${ruleId}`, { isEnabled });

    const allRules = loadAlertRules();
    const ruleIndex = allRules.findIndex((r) => r.id === ruleId);

    if (ruleIndex === -1) {
      alertsLogger.warn(`Rule not found: ${ruleId}`);
      return NextResponse.json(
        { error: 'Rule not found' },
        { status: 404 }
      );
    }

    // Actualizar regla
    allRules[ruleIndex].isEnabled = isEnabled;
    allRules[ruleIndex].updatedAt = new Date().toISOString();

    saveAlertRules(allRules);

    alertsLogger.success(`Rule ${ruleId} updated successfully`, { isEnabled });

    return NextResponse.json({ rule: allRules[ruleIndex] });
  } catch (error) {
    alertsLogger.error('Error in PATCH /api/alerts/rules', { error });
    return NextResponse.json(
      { error: 'Failed to update alert rule', message: (error as Error).message },
      { status: 500 }
    );
  }
}

