/**
 * Endpoint para ejecutar el motor de alertas
 * 
 * Protegido por CRON_SECRET o autenticación de usuario admin
 * 
 * POST /api/alerts/run
 */

import { NextResponse } from 'next/server';
import { loadAlertRules, addAlertEvent, loadAlertEvents, saveAlertEvents } from '@/lib/alerts/storage';
import { initializeDefaultAlertRules } from '@/lib/alerts/init';
import { runAllAlerts } from '@/lib/alerts/engine';
import { sendAlertEmails } from '@/lib/email/alertsMailer';
import { getAlertRecipientsForSite } from '@/lib/alerts/recipients';
import { getEnvVarOptional } from '@/lib/utils/env';
import { alertsLogger } from '@/lib/alerts/logger';
import { runAllChecks } from '@/lib/alerts/checks';

/**
 * Valida que la petición esté autorizada
 */
function isAuthorized(request: Request): boolean {
  const cronSecret = getEnvVarOptional('CRON_SECRET');
  
  // Verificar CRON_SECRET en header o query
  const providedSecret = request.headers.get('x-cron-secret') || 
                         new URL(request.url).searchParams.get('cron_secret');
  
  if (cronSecret && providedSecret === cronSecret) {
    return true;
  }

  // En desarrollo, permitir sin autenticación si CRON_SECRET no está configurado
  if (!cronSecret) {
    console.warn('[Alerts API] CRON_SECRET not configured. Allowing request (development mode).');
    return true;
  }

  return false;
}

export async function POST(request: Request) {
  const startTime = Date.now();
  alertsLogger.info('=== Alerts API: Run endpoint called ===');

  try {
    // Validar autorización
    if (!isAuthorized(request)) {
      alertsLogger.warn('Unauthorized request to /api/alerts/run');
      return NextResponse.json(
        { error: 'Unauthorized', message: 'Invalid CRON_SECRET or missing admin authentication' },
        { status: 401 }
      );
    }

    alertsLogger.info('Request authorized, proceeding with alerts evaluation');

    // Ejecutar verificaciones del sistema
    const checks = runAllChecks();
    if (!checks.overall) {
      alertsLogger.error('System checks failed, but continuing anyway', checks);
    }

    // Inicializar reglas por defecto si no existen
    alertsLogger.info('Initializing default alert rules if needed');
    initializeDefaultAlertRules();

    const summary = {
      sitesProcessed: 0,
      alertsEvaluated: 0,
      alertsTriggered: 0,
      emailsSent: 0,
      errors: [] as string[],
    };

    // Ejecutar motor de alertas
    let alertsResult;
    try {
      alertsResult = await runAllAlerts();
      summary.sitesProcessed = alertsResult.sitesProcessed;
      summary.alertsEvaluated = alertsResult.alertsEvaluated;
      summary.alertsTriggered = alertsResult.alertsTriggered;
      
      alertsLogger.info('Alerts engine completed successfully', {
        sitesProcessed: alertsResult.sitesProcessed,
        alertsEvaluated: alertsResult.alertsEvaluated,
        alertsTriggered: alertsResult.alertsTriggered,
      });
    } catch (error) {
      const errorMsg = `Error running alerts engine: ${(error as Error).message}`;
      alertsLogger.error(errorMsg, { error });
      summary.errors.push(errorMsg);
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to run alerts engine',
          message: errorMsg,
          summary,
        },
        { status: 500 }
      );
    }

    // Persistir eventos y enviar emails
    alertsLogger.info(`Processing ${alertsResult.events.length} triggered events`);
    const allRules = loadAlertRules();
    
    for (const event of alertsResult.events) {
      try {
        // Persistir evento
        alertsLogger.info(`Persisting event: ${event.id} for rule ${event.alertRuleId}`);
        addAlertEvent(event);

        // Obtener destinatarios
        const recipients = await getAlertRecipientsForSite(event.siteId);
        alertsLogger.info(`Recipients for ${event.siteId}: ${recipients.length}`, { recipients });
        
        if (recipients.length > 0) {
          // Encontrar la regla correspondiente
          const rule = allRules.find((r) => r.id === event.alertRuleId);
          if (rule) {
            // Enviar emails
            alertsLogger.info(`Sending alert emails for event ${event.id}`, {
              ruleId: rule.id,
              recipients,
            });
            
            const emailResults = await sendAlertEmails({
              siteName: event.siteId,
              rule,
              event,
              recipients,
            });

            summary.emailsSent += emailResults.sent;
            
            if (emailResults.sent > 0) {
              alertsLogger.success(`Emails sent successfully for event ${event.id}`, {
                sent: emailResults.sent,
                recipients,
              });
            }
            
            if (emailResults.failed > 0) {
              alertsLogger.error(`Failed to send ${emailResults.failed} emails for event ${event.id}`, {
                errors: emailResults.errors,
              });
            }
            
            // Actualizar evento con resultados de email
            if (emailResults.sent > 0) {
              const allEvents = loadAlertEvents();
              const eventIndex = allEvents.findIndex((e) => e.id === event.id);
              if (eventIndex >= 0) {
                allEvents[eventIndex].emailSent = true;
                allEvents[eventIndex].sentToEmails = recipients;
                saveAlertEvents(allEvents);
              }
            } else if (emailResults.errors.length > 0) {
              // Marcar error de email en el evento
              const allEvents = loadAlertEvents();
              const eventIndex = allEvents.findIndex((e) => e.id === event.id);
              if (eventIndex >= 0) {
                allEvents[eventIndex].emailError = emailResults.errors.join('; ');
                saveAlertEvents(allEvents);
              }
            }

            if (emailResults.errors.length > 0) {
              summary.errors.push(...emailResults.errors);
            }
          } else {
            alertsLogger.warn(`Rule not found for event ${event.id}`, { ruleId: event.alertRuleId });
          }
        } else {
          alertsLogger.warn(`No recipients configured for site ${event.siteId}, skipping email`);
        }
      } catch (error) {
        const errorMsg = `Error processing event ${event.id}: ${(error as Error).message}`;
        summary.errors.push(errorMsg);
        alertsLogger.error(errorMsg, { eventId: event.id, error });
      }
    }

    const duration = Date.now() - startTime;
    alertsLogger.success('Alerts API run completed', {
      summary,
      durationMs: duration,
    });

    return NextResponse.json({
      success: true,
      summary,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    const duration = Date.now() - startTime;
    alertsLogger.error('Fatal error in /api/alerts/run', { error, durationMs: duration });
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

