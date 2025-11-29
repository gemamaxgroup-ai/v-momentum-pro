/**
 * Helper para leer variables de entorno de forma segura
 */

/**
 * Obtiene una variable de entorno requerida
 * Lanza error si no está definida
 */
export function getEnvVar(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Variable de entorno requerida no configurada: ${name}`);
  }
  return value;
}

/**
 * Obtiene una variable de entorno opcional
 * Retorna el valor por defecto si no está definida
 */
export function getEnvVarOptional(name: string, defaultValue: string = ''): string {
  return process.env[name] || defaultValue;
}

/**
 * Obtiene una variable de entorno numérica
 */
export function getEnvVarNumber(name: string, defaultValue: number): number {
  const value = process.env[name];
  if (!value) {
    return defaultValue;
  }
  const parsed = parseInt(value, 10);
  if (isNaN(parsed)) {
    return defaultValue;
  }
  return parsed;
}

