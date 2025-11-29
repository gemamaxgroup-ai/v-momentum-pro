/**
 * Script de prueba para el sistema de alertas
 * 
 * Ejecutar: npm run test:alerts
 */

// Cargar variables de entorno desde .env.local
import * as dotenv from 'dotenv';
import * as path from 'path';
dotenv.config({ path: path.join(process.cwd(), '.env.local') });

import { runAllAlerts } from '../lib/alerts/engine';
import { initializeDefaultAlertRules } from '../lib/alerts/init';
import { runAllChecks } from '../lib/alerts/checks';
import { alertsLogger } from '../lib/alerts/logger';
import { loadAlertRules } from '../lib/alerts/storage';

async function main() {
  console.log('=== Test de Sistema de Alertas V2 ===\n');
  alertsLogger.info('=== Starting automated alerts test ===');

  const report = {
    checks: { passed: false, details: {} },
    ga4Fetch: { success: false, errors: [] as string[] },
    alertsTriggered: 0,
    emailSent: false,
    errors: [] as string[],
  };

  try {
    // 1. Verificaciones del sistema
    console.log('1. Ejecutando verificaciones del sistema...');
    const checks = runAllChecks();
    report.checks.passed = checks.overall;
    report.checks.details = checks;

    if (!checks.overall) {
      console.log('   ⚠️  Algunas verificaciones fallaron:');
      if (checks.env.missing.length > 0) {
        console.log(`      - Variables faltantes: ${checks.env.missing.join(', ')}`);
      }
      if (checks.rules.errors.length > 0) {
        console.log(`      - Errores en reglas: ${checks.rules.errors.join(', ')}`);
      }
      if (checks.smtp.errors.length > 0) {
        console.log(`      - Errores SMTP: ${checks.smtp.errors.join(', ')}`);
      }
    } else {
      console.log('   ✓ Todas las verificaciones pasaron\n');
    }

    // 2. Estado de reglas
    console.log('2. Estado de reglas de alertas...');
    const allRules = loadAlertRules();
    const enabledRules = allRules.filter((r) => r.isEnabled);
    console.log(`   Total de reglas: ${allRules.length}`);
    console.log(`   Reglas habilitadas: ${enabledRules.length}`);
    
    enabledRules.forEach((rule) => {
      console.log(`   - ${rule.name} (${rule.type}) para ${rule.siteId}: ${rule.isEnabled ? 'HABILITADA' : 'DESHABILITADA'}`);
    });
    console.log('');

    // 3. Inicializar reglas por defecto si no existen
    console.log('3. Inicializando reglas por defecto si es necesario...');
    initializeDefaultAlertRules();
    console.log('   ✓ Reglas inicializadas\n');

    // 4. Ejecutar motor de alertas
    console.log('4. Ejecutando motor de alertas...');
    let result;
    try {
      result = await runAllAlerts();
      report.ga4Fetch.success = true;
      
      console.log('\n=== Resultados ===');
      console.log(`   Sitios procesados: ${result.sitesProcessed}`);
      console.log(`   Alertas evaluadas: ${result.alertsEvaluated}`);
      console.log(`   Alertas disparadas: ${result.alertsTriggered}`);
      console.log(`   Eventos generados: ${result.events.length}`);

      report.alertsTriggered = result.alertsTriggered;

      if (result.events.length > 0) {
        console.log('\n=== Eventos Disparados ===');
        result.events.forEach((event, index) => {
          console.log(`\n   ${index + 1}. ${event.alertRuleId}`);
          console.log(`      Sitio: ${event.siteId}`);
          console.log(`      Severidad: ${event.severity}`);
          console.log(`      Timestamp: ${event.triggeredAt}`);
          console.log(`      Cambio: ${event.payload.changePercent.toFixed(2)}%`);
          console.log(`      Métrica: ${event.payload.metric}`);
        });
      } else {
        console.log('\n   ✓ No se dispararon alertas (todo normal)');
      }
    } catch (error) {
      report.ga4Fetch.success = false;
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      report.ga4Fetch.errors.push(errorMsg);
      console.error(`   ❌ Error ejecutando motor de alertas: ${errorMsg}`);
      throw error;
    }

    // 5. Verificar envío de emails (solo si hay eventos)
    if (result.events.length > 0) {
      console.log('\n5. Verificando envío de emails...');
      // Los emails se envían desde el endpoint API, no desde el script de prueba
      console.log('   ℹ️  Los emails se envían desde el endpoint /api/alerts/run');
      console.log('   ℹ️  Para probar el envío completo, ejecuta: curl -X POST http://localhost:3000/api/alerts/run-manual');
    }

    console.log('\n=== Test completado exitosamente ===');
    alertsLogger.success('Automated alerts test completed successfully', report);
    process.exit(0);
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
    report.errors.push(errorMsg);
    console.error('\n❌ Error durante el test:', errorMsg);
    alertsLogger.error('Automated alerts test failed', { error, report });
    
    if (error instanceof Error) {
      console.error('   Stack:', error.stack);
    }
    process.exit(1);
  }
}

main();

