/**
 * Sistema de almacenamiento para AlertRule y AlertEvent
 * 
 * Por ahora usa archivos JSON en el servidor.
 * En producción, esto debería migrarse a una base de datos (PostgreSQL, MongoDB, etc.)
 */

import * as fs from 'fs';
import * as path from 'path';
import { AlertRule, AlertEvent } from './types';

const DATA_DIR = path.join(process.cwd(), 'data');
const ALERT_RULES_FILE = path.join(DATA_DIR, 'alert-rules.json');
const ALERT_EVENTS_FILE = path.join(DATA_DIR, 'alert-events.json');

// Asegurar que el directorio data existe
function ensureDataDir(): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

/**
 * Carga las reglas de alertas desde el archivo JSON
 */
export function loadAlertRules(): AlertRule[] {
  ensureDataDir();
  
  if (!fs.existsSync(ALERT_RULES_FILE)) {
    return [];
  }

  try {
    const content = fs.readFileSync(ALERT_RULES_FILE, 'utf-8');
    return JSON.parse(content) as AlertRule[];
  } catch (error) {
    console.error('Error loading alert rules:', error);
    return [];
  }
}

/**
 * Guarda las reglas de alertas en el archivo JSON
 */
export function saveAlertRules(rules: AlertRule[]): void {
  ensureDataDir();
  
  try {
    fs.writeFileSync(ALERT_RULES_FILE, JSON.stringify(rules, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error saving alert rules:', error);
    throw error;
  }
}

/**
 * Carga los eventos de alertas desde el archivo JSON
 */
export function loadAlertEvents(): AlertEvent[] {
  ensureDataDir();
  
  if (!fs.existsSync(ALERT_EVENTS_FILE)) {
    return [];
  }

  try {
    const content = fs.readFileSync(ALERT_EVENTS_FILE, 'utf-8').trim();
    // Si el archivo está vacío o solo tiene espacios, retornar array vacío
    if (!content || content === '') {
      return [];
    }
    return JSON.parse(content) as AlertEvent[];
  } catch (error) {
    // Si hay error de parseo (ej: archivo corrupto), retornar array vacío
    console.error('Error loading alert events:', error);
    // Intentar crear un archivo limpio
    try {
      fs.writeFileSync(ALERT_EVENTS_FILE, '[]', 'utf-8');
    } catch {
      // Ignorar errores al escribir
    }
    return [];
  }
}

/**
 * Guarda los eventos de alertas en el archivo JSON
 */
export function saveAlertEvents(events: AlertEvent[]): void {
  ensureDataDir();
  
  try {
    fs.writeFileSync(ALERT_EVENTS_FILE, JSON.stringify(events, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error saving alert events:', error);
    throw error;
  }
}

/**
 * Añade un nuevo evento de alerta
 */
export function addAlertEvent(event: AlertEvent): void {
  const events = loadAlertEvents();
  events.push(event);
  saveAlertEvents(events);
}

/**
 * Obtiene eventos recientes para deduplicación (últimas 24 horas)
 */
export function getRecentEventsForRule(alertRuleId: string, siteId: string): AlertEvent[] {
  const events = loadAlertEvents();
  const now = new Date();
  const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

  return events.filter((event) => {
    if (event.alertRuleId !== alertRuleId || event.siteId !== siteId) {
      return false;
    }
    const triggeredAt = new Date(event.triggeredAt);
    return triggeredAt >= twentyFourHoursAgo;
  });
}

