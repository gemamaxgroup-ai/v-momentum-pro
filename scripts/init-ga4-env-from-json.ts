/**
 * ⚠️ DEPRECATED: Este script usa rutas absolutas de Windows y no es compatible con Vercel.
 * 
 * Para producción en Vercel, configura las variables de entorno directamente:
 * - GA4_SERVICE_ACCOUNT_JSON: El JSON completo del Service Account como una sola línea
 * - GA4_PROPERTY_ID_FILAMENTRANK: El ID numérico de la propiedad GA4
 * 
 * Este script solo es útil para desarrollo local si tienes el JSON en una ruta específica.
 * Para usarlo, edita la constante JSON_PATH abajo con la ruta correcta de tu máquina.
 */

import * as fs from 'fs';
import * as path from 'path';

interface ServiceAccountJson {
  client_email: string;
  private_key: string;
  project_id?: string;
  private_key_id?: string;
  client_id?: string;
  auth_uri?: string;
  token_uri?: string;
  auth_provider_x509_cert_url?: string;
  client_x509_cert_url?: string;
  type?: string;
}

// ⚠️ EDITA ESTA RUTA con la ubicación real del JSON en tu máquina local
// En producción (Vercel), esto NO se usa. Usa variables de entorno directamente.
const JSON_PATH = process.env.GA4_JSON_PATH || '';

const ENV_PATH = path.join(process.cwd(), '.env.local');

function main() {
  if (!JSON_PATH) {
    console.error('❌ Error: No se especificó JSON_PATH');
    console.error('   Configura la variable de entorno GA4_JSON_PATH o edita el script.');
    console.error('   Ejemplo: GA4_JSON_PATH=/ruta/al/archivo.json npx ts-node scripts/init-ga4-env-from-json.ts');
    process.exit(1);
  }

  try {
    // Leer el JSON del Service Account
    console.log(`📖 Leyendo JSON desde: ${JSON_PATH}`);
    
    if (!fs.existsSync(JSON_PATH)) {
      throw new Error(`El archivo no existe: ${JSON_PATH}`);
    }

    const jsonContent = fs.readFileSync(JSON_PATH, 'utf-8');
    const json: ServiceAccountJson = JSON.parse(jsonContent);

    if (!json.client_email || !json.private_key) {
      throw new Error('El JSON no contiene client_email o private_key');
    }

    // Leer .env.local existente o crear uno nuevo
    let envContent = '';
    if (fs.existsSync(ENV_PATH)) {
      envContent = fs.readFileSync(ENV_PATH, 'utf-8');
    }

    // Convertir el JSON completo a una sola línea (escapar comillas y saltos de línea)
    const jsonString = JSON.stringify(json).replace(/"/g, '\\"').replace(/\n/g, '\\n');

    // Actualizar o insertar GA4_SERVICE_ACCOUNT_JSON
    if (envContent.includes('GA4_SERVICE_ACCOUNT_JSON=')) {
      envContent = envContent.replace(
        /GA4_SERVICE_ACCOUNT_JSON=.*/g,
        `GA4_SERVICE_ACCOUNT_JSON="${jsonString}"`
      );
    } else {
      envContent += `\nGA4_SERVICE_ACCOUNT_JSON="${jsonString}"\n`;
    }

    // Escribir .env.local actualizado
    fs.writeFileSync(ENV_PATH, envContent, 'utf-8');
    console.log('✓ .env.local actualizado correctamente');
    console.log('✓ GA4_SERVICE_ACCOUNT_JSON configurado');
    console.log('\n⚠️  IMPORTANTE: Edita manualmente GA4_PROPERTY_ID_FILAMENTRANK con el ID numérico de la propiedad GA4');
    console.log('   Ejemplo: GA4_PROPERTY_ID_FILAMENTRANK=514022388');
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    console.error('❌ Error:', errorMessage);
    process.exit(1);
  }
}

main();
