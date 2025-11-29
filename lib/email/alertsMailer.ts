/**
 * Servicio de envío de emails para alertas
 */

import nodemailer from 'nodemailer';
import { AlertRule, AlertEvent } from '../alerts/types';
import { alertsLogger } from '../alerts/logger';

interface MailerConfig {
  host: string;
  port: number;
  user: string;
  pass: string;
  from: string;
}

/**
 * Crea el transporter de nodemailer desde variables de entorno
 */
function createTransporter() {
  const config: MailerConfig = {
    host: process.env.ALERTS_SMTP_HOST || '',
    port: parseInt(process.env.ALERTS_SMTP_PORT || '587', 10),
    user: process.env.ALERTS_SMTP_USER || '',
    pass: process.env.ALERTS_SMTP_PASS || '',
    from: process.env.ALERTS_FROM_EMAIL || 'alerts@v-momentum-pro.com',
  };

  if (!config.host || !config.user || !config.pass) {
    throw new Error('SMTP configuration incomplete. Set ALERTS_SMTP_HOST, ALERTS_SMTP_USER, ALERTS_SMTP_PASS');
  }

  return nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.port === 465,
    auth: {
      user: config.user,
      pass: config.pass,
    },
  });
}

/**
 * Genera el asunto del email según el tipo de alerta
 */
function getAlertSubject(siteName: string, rule: AlertRule): string {
  const siteDisplayName = siteName === 'filamentrank' ? 'FilamentRank' : 'CamPrices';
  
  switch (rule.type) {
    case 'TRAFFIC_DROP_30':
      return `[V-Momentum-Pro] Alert: Traffic drop > 30% on ${siteDisplayName}`;
    case 'CONVERSION_DROP_20':
      return `[V-Momentum-Pro] Alert: Conversion rate drop > 20% on ${siteDisplayName}`;
    case 'PAGEVIEWS_SPIKE_2X':
      return `[V-Momentum-Pro] Alert: Pageviews spike on ${siteDisplayName}`;
    default:
      return `[V-Momentum-Pro] Alert: ${rule.name} on ${siteDisplayName}`;
  }
}

/**
 * Genera el cuerpo HTML del email
 */
function getAlertEmailBody(siteName: string, rule: AlertRule, event: AlertEvent): string {
  const siteDisplayName = siteName === 'filamentrank' ? 'FilamentRank' : 'CamPrices';
  const { payload } = event;
  const triggeredAt = new Date(event.triggeredAt).toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  let metricsHtml = '';
  
  if (rule.type === 'TRAFFIC_DROP_30') {
    metricsHtml = `
      <p><strong>Sessions (previous period):</strong> ${payload.previousValue.toLocaleString()}</p>
      <p><strong>Sessions (current period):</strong> ${payload.currentValue.toLocaleString()}</p>
      <p><strong>Change:</strong> ${payload.changePercent.toFixed(1)}%</p>
    `;
  } else if (rule.type === 'CONVERSION_DROP_20') {
    metricsHtml = `
      <p><strong>Conversion Rate (previous):</strong> ${(payload.previousValue * 100).toFixed(2)}%</p>
      <p><strong>Conversion Rate (current):</strong> ${(payload.currentValue * 100).toFixed(2)}%</p>
      <p><strong>Change:</strong> ${payload.changePercent.toFixed(1)}%</p>
      <p><strong>Conversions (previous):</strong> ${(payload.conversionsB as number || 0).toLocaleString()}</p>
      <p><strong>Conversions (current):</strong> ${(payload.conversionsA as number || 0).toLocaleString()}</p>
    `;
  } else if (rule.type === 'PAGEVIEWS_SPIKE_2X') {
    metricsHtml = `
      <p><strong>Average pageviews (last 6 days):</strong> ${payload.previousValue.toLocaleString()}</p>
      <p><strong>Pageviews (last day):</strong> ${payload.currentValue.toLocaleString()}</p>
      <p><strong>Multiplier:</strong> ${(payload.multiplier as number || 0).toFixed(2)}x</p>
      <p><strong>Change:</strong> +${payload.changePercent.toFixed(1)}%</p>
    `;
  }

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #0EA5E9; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
          .content { background: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; }
          .metrics { background: white; padding: 15px; margin: 15px 0; border-left: 4px solid #0EA5E9; }
          .footer { margin-top: 20px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #6b7280; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>V-Momentum-Pro Alert</h1>
          </div>
          <div class="content">
            <h2>${rule.name}</h2>
            <p><strong>Site:</strong> ${siteDisplayName}</p>
            <p><strong>Description:</strong> ${rule.description}</p>
            <p><strong>Triggered at:</strong> ${triggeredAt}</p>
            
            <div class="metrics">
              <h3>Metrics:</h3>
              ${metricsHtml}
            </div>
            
            <div class="footer">
              <p>You are receiving this email because your account is registered in V-Momentum-Pro alerts system.</p>
              <p>To manage your alerts, visit: <a href="https://v-momentum-pro.com/app">https://v-momentum-pro.com/app</a></p>
            </div>
          </div>
        </div>
      </body>
    </html>
  `;
}

/**
 * Envía emails de alerta a los destinatarios
 */
export async function sendAlertEmails(params: {
  siteName: string;
  rule: AlertRule;
  event: AlertEvent;
  recipients: string[];
}): Promise<{ sent: number; failed: number; errors: string[] }> {
  const { siteName, rule, event, recipients } = params;

  if (recipients.length === 0) {
    alertsLogger.warn(`No recipients for alert ${rule.id}`);
    return { sent: 0, failed: 0, errors: [] };
  }

  // Validar configuración SMTP
  if (!process.env.ALERTS_SMTP_HOST || !process.env.ALERTS_SMTP_USER || !process.env.ALERTS_SMTP_PASS) {
    const error = 'SMTP not configured. Emails will not be sent.';
    alertsLogger.error(error);
    return { sent: 0, failed: recipients.length, errors: [error] };
  }

  let transporter;
  try {
    alertsLogger.info('Creating SMTP transporter', {
      host: process.env.ALERTS_SMTP_HOST,
      port: process.env.ALERTS_SMTP_PORT,
      user: process.env.ALERTS_SMTP_USER,
    });
    transporter = createTransporter();
  } catch (error) {
    const errorMsg = `Failed to create email transporter: ${(error as Error).message}`;
    alertsLogger.error(errorMsg, { error });
    return { sent: 0, failed: recipients.length, errors: [errorMsg] };
  }

  const subject = getAlertSubject(siteName, rule);
  const html = getAlertEmailBody(siteName, rule, event);

  const results = { sent: 0, failed: 0, errors: [] as string[] };

  for (const recipient of recipients) {
    try {
      alertsLogger.info(`Sending alert email to ${recipient}`, {
        ruleId: rule.id,
        subject,
      });
      
      await transporter.sendMail({
        from: process.env.ALERTS_FROM_EMAIL || 'alerts@v-momentum-pro.com',
        to: recipient,
        subject,
        html,
      });
      
      results.sent++;
      alertsLogger.success(`Alert email sent successfully to ${recipient}`, {
        ruleId: rule.id,
        recipient,
      });
    } catch (error) {
      results.failed++;
      const errorMsg = `Failed to send email to ${recipient}: ${(error as Error).message}`;
      results.errors.push(errorMsg);
      alertsLogger.error(errorMsg, { recipient, ruleId: rule.id, error });
    }
  }

  alertsLogger.info('Email sending completed', {
    sent: results.sent,
    failed: results.failed,
    total: recipients.length,
  });

  return results;
}

