/**
 * Obtiene los destinatarios de alertas para un sitio
 * 
 * Por ahora usa una variable de entorno ALERTS_DEFAULT_RECIPIENT
 * En el futuro, esto debería consultar una base de datos de usuarios
 */

import { alertsLogger } from './logger';

/**
 * Obtiene la lista de emails que deben recibir alertas para un sitio
 * 
 * @param siteId - El sitio (por ahora no se usa, pero se mantiene para futuras implementaciones)
 */
export async function getAlertRecipientsForSite(siteId: string): Promise<string[]> {
  // siteId se mantiene para futuras implementaciones donde se pueda configurar por sitio
  void siteId; // Evitar warning de variable no usada
  
  const defaultRecipient = process.env.ALERTS_DEFAULT_RECIPIENT;
  
  if (defaultRecipient) {
    // Si hay múltiples emails separados por coma
    const recipients = defaultRecipient.split(',').map((email) => email.trim()).filter(Boolean);
    alertsLogger.info(`Recipients configured: ${recipients.length}`, { recipients });
    return recipients;
  }

  // Si no hay configuración, retornar array vacío (no enviar emails)
  alertsLogger.warn(`No ALERTS_DEFAULT_RECIPIENT configured. Alerts will not be sent via email.`);
  return [];
}

