/**
 * Motor de evaluación de alertas
 * Expone función runAllAlerts() que evalúa todas las reglas activas
 */

import { AlertEvent, AlertSeverity } from './types';
import { loadAlertRules } from './storage';
import { getRecentEventsForRule } from './storage';
import { getTrafficSummary, getConversionSummary, getPageviewsSummary } from '../ga4/client';
import { Ga4Site } from '../ga4/overview';
import { alertsLogger } from './logger';

export interface RunAlertsResult {
  sitesProcessed: number;
  alertsEvaluated: number;
  alertsTriggered: number;
  events: AlertEvent[];
}

/**
 * Ejecuta todas las alertas activas
 */
export async function runAllAlerts(): Promise<RunAlertsResult> {
  alertsLogger.info('Starting alerts evaluation engine');
  
  const allRules = loadAlertRules();
  const enabledRules = allRules.filter((r) => r.isEnabled);
  
  alertsLogger.info(`Loaded ${allRules.length} total rules, ${enabledRules.length} enabled`);
  
  const sites: Ga4Site[] = ['filamentrank', 'camprices'];
  const events: AlertEvent[] = [];
  
  let sitesProcessed = 0;
  let alertsEvaluated = 0;

  for (const siteId of sites) {
    const siteRules = enabledRules.filter((r) => r.siteId === siteId);
    
    if (siteRules.length === 0) {
      alertsLogger.info(`No enabled rules for site ${siteId}, skipping`);
      continue;
    }

    sitesProcessed++;
    alertsLogger.info(`Processing site: ${siteId} with ${siteRules.length} enabled rules`);

    for (const rule of siteRules) {
      alertsEvaluated++;

      // Verificar deduplicación (no disparar si ya hay evento en últimas 24h)
      const recentEvents = getRecentEventsForRule(rule.id, siteId);
      if (recentEvents.length > 0) {
        alertsLogger.info(`Skipping alert ${rule.id} for ${siteId}: recent event exists (deduplication)`);
        continue;
      }

      try {
        alertsLogger.info(`Evaluating alert: ${rule.name} (${rule.type}) for ${siteId}`);
        
        let triggered = false;
        let payload: AlertEvent['payload'] | null = null;
        let severity: AlertSeverity = 'warning';

        switch (rule.type) {
          case 'TRAFFIC_DROP_30': {
            const summary = await getTrafficSummary(siteId, 7);
            alertsLogger.info(`Traffic summary for ${siteId}`, {
              current: summary.current.sessions,
              previous: summary.previous.sessions,
              changePercent: summary.changePercent,
            });
            
            if (summary.changePercent < -30) {
              triggered = true;
              severity = 'critical';
              payload = {
                previousValue: summary.previous.sessions,
                currentValue: summary.current.sessions,
                changePercent: summary.changePercent,
                metric: 'sessions',
                periodA: 'last 7 days',
                periodB: 'previous 7 days',
              };
            }
            break;
          }

          case 'CONVERSION_DROP_20': {
            const summary = await getConversionSummary(siteId, 7);
            alertsLogger.info(`Conversion summary for ${siteId}`, {
              currentRate: summary.current.conversionRate,
              previousRate: summary.previous.conversionRate,
              changePercent: summary.changePercent,
            });
            
            if (summary.changePercent < -20) {
              triggered = true;
              severity = 'warning';
              payload = {
                previousValue: summary.previous.conversionRate,
                currentValue: summary.current.conversionRate,
                changePercent: summary.changePercent,
                metric: 'conversion_rate',
                periodA: 'last 7 days',
                periodB: 'previous 7 days',
                conversionsA: summary.current.conversions,
                conversionsB: summary.previous.conversions,
                sessionsA: summary.current.sessions,
                sessionsB: summary.previous.sessions,
              };
            }
            break;
          }

          case 'PAGEVIEWS_SPIKE_2X': {
            const summary = await getPageviewsSummary(siteId, 7);
            alertsLogger.info(`Pageviews summary for ${siteId}`, {
              average: summary.average,
              lastDay: summary.lastDay,
              multiplier: summary.multiplier,
            });
            
            if (summary.multiplier > 2) {
              triggered = true;
              severity = 'info';
              payload = {
                previousValue: summary.average,
                currentValue: summary.lastDay,
                changePercent: (summary.multiplier - 1) * 100,
                metric: 'pageviews',
                multiplier: summary.multiplier,
                dailyPageViews: summary.daily,
              };
            }
            break;
          }
        }

        if (triggered && payload) {
          const event: AlertEvent = {
            id: `alert-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
            alertRuleId: rule.id,
            siteId,
            triggeredAt: new Date().toISOString(),
            severity,
            payload,
            sentToEmails: [],
            emailSent: false,
          };

          events.push(event);
          alertsLogger.success(`Alert triggered: ${rule.name} for ${siteId}`, {
            eventId: event.id,
            severity,
            changePercent: payload.changePercent,
          });
        } else {
          alertsLogger.info(`Alert ${rule.name} for ${siteId} did not trigger (threshold not met)`);
        }
      } catch (error) {
        const errorMsg = `Error evaluating alert ${rule.id} for ${siteId}: ${(error as Error).message}`;
        alertsLogger.error(errorMsg, { ruleId: rule.id, siteId, error });
        // Continuar con la siguiente alerta
      }
    }
  }

  alertsLogger.info('Alerts evaluation completed', {
    sitesProcessed,
    alertsEvaluated,
    alertsTriggered: events.length,
  });

  return {
    sitesProcessed,
    alertsEvaluated,
    alertsTriggered: events.length,
    events,
  };
}

