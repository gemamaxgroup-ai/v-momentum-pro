/**
 * Funciones de verificación y validación para el sistema de alertas
 */

import { AlertRule } from './types';
import { loadAlertRules } from './storage';
import { alertsLogger } from './logger';

/**
 * Verifica que todas las variables de entorno requeridas estén configuradas
 */
export function checkEnvironmentVariables(): { valid: boolean; missing: string[] } {
  const required = [
    'GA4_PROPERTY_ID_FILAMENTRANK',
    'GA4_SERVICE_ACCOUNT_JSON',
    'ALERTS_SMTP_HOST',
    'ALERTS_SMTP_PORT',
    'ALERTS_SMTP_USER',
    'ALERTS_SMTP_PASS',
    'ALERTS_FROM_EMAIL',
    'ALERTS_DEFAULT_RECIPIENT',
    'CRON_SECRET',
  ];

  const missing: string[] = [];

  for (const varName of required) {
    if (!process.env[varName]) {
      missing.push(varName);
    }
  }

  return {
    valid: missing.length === 0,
    missing,
  };
}

/**
 * Verifica que las reglas de alertas estén correctamente configuradas
 */
export function checkAlertRules(): { valid: boolean; rules: AlertRule[]; errors: string[] } {
  const errors: string[] = [];
  
  try {
    const rules = loadAlertRules();
    
    if (rules.length === 0) {
      errors.push('No alert rules found');
      return { valid: false, rules: [], errors };
    }

    // Validar estructura de cada regla
    for (const rule of rules) {
      if (!rule.id || !rule.siteId || !rule.type || !rule.name) {
        errors.push(`Invalid rule structure: ${rule.id || 'unknown'}`);
      }
    }

    return {
      valid: errors.length === 0,
      rules,
      errors,
    };
  } catch (error) {
    errors.push(`Error loading alert rules: ${(error as Error).message}`);
    return { valid: false, rules: [], errors };
  }
}

/**
 * Verifica la configuración SMTP
 */
export function checkSmtpConfig(): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  const host = process.env.ALERTS_SMTP_HOST;
  const port = process.env.ALERTS_SMTP_PORT;
  const user = process.env.ALERTS_SMTP_USER;
  const pass = process.env.ALERTS_SMTP_PASS;

  if (!host) errors.push('ALERTS_SMTP_HOST not configured');
  if (!port) errors.push('ALERTS_SMTP_PORT not configured');
  if (!user) errors.push('ALERTS_SMTP_USER not configured');
  if (!pass) errors.push('ALERTS_SMTP_PASS not configured');

  if (port && isNaN(parseInt(port, 10))) {
    errors.push('ALERTS_SMTP_PORT must be a number');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Ejecuta todas las verificaciones y retorna un reporte
 */
export function runAllChecks(): {
  env: { valid: boolean; missing: string[] };
  rules: { valid: boolean; rules: AlertRule[]; errors: string[] };
  smtp: { valid: boolean; errors: string[] };
  overall: boolean;
} {
  alertsLogger.info('Running system checks...');

  const env = checkEnvironmentVariables();
  const rules = checkAlertRules();
  const smtp = checkSmtpConfig();

  const overall = env.valid && rules.valid && smtp.valid;

  if (overall) {
    alertsLogger.success('All system checks passed');
  } else {
    alertsLogger.error('System checks failed', { env, rules, smtp });
  }

  return { env, rules, smtp, overall };
}

