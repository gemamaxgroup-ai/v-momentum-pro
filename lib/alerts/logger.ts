/**
 * Sistema de logging para alertas
 * Escribe logs tanto en consola como en archivo logs/alerts.log
 */

import * as fs from 'fs';
import * as path from 'path';

const LOGS_DIR = path.join(process.cwd(), 'logs');
const LOG_FILE = path.join(LOGS_DIR, 'alerts.log');

// Asegurar que el directorio logs existe
function ensureLogsDir(): void {
  if (!fs.existsSync(LOGS_DIR)) {
    fs.mkdirSync(LOGS_DIR, { recursive: true });
  }
}

/**
 * Formatea un mensaje de log con timestamp
 */
function formatLogMessage(level: string, message: string, data?: unknown): string {
  const timestamp = new Date().toISOString();
  const dataStr = data ? ` | Data: ${JSON.stringify(data)}` : '';
  return `[${timestamp}] [${level}] ${message}${dataStr}\n`;
}

/**
 * Escribe un log en archivo y consola
 */
function writeLog(level: string, message: string, data?: unknown): void {
  ensureLogsDir();
  
  const logMessage = formatLogMessage(level, message, data);
  
  // Escribir en consola
  if (level === 'ERROR') {
    console.error(logMessage.trim());
  } else if (level === 'WARN') {
    console.warn(logMessage.trim());
  } else {
    console.log(logMessage.trim());
  }
  
  // Escribir en archivo (append)
  try {
    fs.appendFileSync(LOG_FILE, logMessage, 'utf-8');
  } catch (error) {
    console.error(`Failed to write to log file: ${(error as Error).message}`);
  }
}

export const alertsLogger = {
  info: (message: string, data?: unknown) => writeLog('INFO', message, data),
  warn: (message: string, data?: unknown) => writeLog('WARN', message, data),
  error: (message: string, data?: unknown) => writeLog('ERROR', message, data),
  success: (message: string, data?: unknown) => writeLog('SUCCESS', message, data),
};

