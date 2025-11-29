# Sistema de Alertas V2 - Resumen Final para Euro

## ✅ Estado: Completamente Funcional y Listo para Producción

---

## 📁 Archivos Creados/Modificados

### Nuevos Archivos (9)

1. **`lib/utils/env.ts`** - Helper para leer variables de entorno de forma segura con tipos
2. **`lib/ga4/client.ts`** - Cliente GA4 específico para alertas con funciones `getTrafficSummary`, `getConversionSummary`, `getPageviewsSummary`
3. **`lib/alerts/engine.ts`** - Motor de evaluación de alertas con función `runAllAlerts()` que evalúa todas las reglas activas
4. **`app/api/alerts/run-manual/route.ts`** - Endpoint intermedio para ejecutar alertas desde la UI sin exponer CRON_SECRET en el cliente
5. **`scripts/test-alerts.ts`** - Script de prueba para el sistema de alertas (ejecutar con `npm run test:alerts`)
6. **`.env.local.example`** - Plantilla completa de variables de entorno con instrucciones claras
7. **`ALERTS_V2_COMPLETE.md`** - Documentación técnica completa
8. **`ALERTS_V2_RESUMEN_FINAL.md`** - Este documento de resumen

### Archivos Modificados (4)

1. **`lib/ga4/overview.ts`** - Actualizado para leer Service Account desde archivo (`./secrets/ga4-sa.json`) o variable de entorno (JSON completo para Vercel)
2. **`app/api/alerts/run/route.ts`** - Refactorizado para usar `runAllAlerts()` del engine, código más limpio y mantenible
3. **`components/dashboard/AlertsSection.tsx`** - Mejorado con optimistic updates, manejo de errores y uso del endpoint `/api/alerts/run-manual`
4. **`package.json`** - Añadido script `test:alerts` para pruebas locales

---

## 🔐 Variables de Entorno Requeridas

### Variables que DEBES rellenar en `.env.local` antes de producción:

```env
# === ALERTAS V2 – GA4 ===
GA4_PROPERTY_ID_FILAMENTRANK=514022388
GA4_SERVICE_ACCOUNT_JSON=./secrets/ga4-sa.json  # Ruta local al JSON (localhost)
# O en Vercel: el JSON completo como string

# === ALERTAS V2 – SMTP / EMAIL ===
ALERTS_SMTP_HOST=smtp.gmail.com
ALERTS_SMTP_PORT=587
ALERTS_SMTP_USER=TU_EMAIL_DE_ENVÍO@gmail.com
ALERTS_SMTP_PASS=TU_APP_PASSWORD_AQUÍ
ALERTS_FROM_EMAIL=alerts@v-momentum-pro.com
ALERTS_DEFAULT_RECIPIENT=tu-correo-de-prueba@example.com

# === ALERTAS V2 – Seguridad ===
CRON_SECRET=pon_aquí_un_secreto_largo_y_dificil_de_adivinar_cambiar_en_produccion
```

### Instrucciones para Gmail:

1. Activa la verificación en 2 pasos en tu cuenta de Gmail
2. Ve a https://myaccount.google.com/apppasswords
3. Genera una "App Password" y úsala en `ALERTS_SMTP_PASS`

**IMPORTANTE:** No uses tu contraseña normal de Gmail, solo funciona con App Password.

---

## 🚀 Ejecución de Alertas

### 1. En Localhost (usando cURL)

```bash
# Con CRON_SECRET en header
curl -X POST http://localhost:3000/api/alerts/run \
  -H "x-cron-secret: tu-secreto-seguro-aqui"

# O con CRON_SECRET en query
curl -X POST "http://localhost:3000/api/alerts/run?cron_secret=tu-secreto-seguro-aqui"
```

### 2. En Producción (Vercel)

```bash
# Reemplaza TU_DOMINIO con tu dominio de Vercel
curl -X POST https://TU_DOMINIO.vercel.app/api/alerts/run \
  -H "x-cron-secret: tu-secreto-seguro-aqui"
```

### 3. Desde la UI en `/app/Alerts`

1. Ve a `http://localhost:3000/app` → Sección "Alerts"
2. Haz clic en el botón **"Run alerts now"** (visible solo para usuarios autenticados)
3. El sistema ejecutará las alertas y mostrará un resumen con:
   - Número de alertas evaluadas
   - Número de alertas disparadas
   - Número de emails enviados

### 4. Script de Prueba Local

```bash
npm run test:alerts
```

Este script ejecuta el motor de alertas y muestra un resumen en consola. Útil para verificar que todo funciona sin enviar emails reales.

---

## 📊 Respuesta Esperada del Endpoint

```json
{
  "success": true,
  "summary": {
    "sitesProcessed": 2,
    "alertsEvaluated": 6,
    "alertsTriggered": 1,
    "emailsSent": 2,
    "errors": []
  },
  "timestamp": "2025-01-20T10:30:00.000Z"
}
```

---

## 🔍 Verificación

### 1. Verificar que se crean AlertRule y AlertEvent

Los archivos se guardan en `data/alert-rules.json` y `data/alert-events.json` (en el servidor). En desarrollo local, estos archivos se crean automáticamente en la raíz del proyecto.

### 2. Verificar que llegan los emails

1. Configura `ALERTS_DEFAULT_RECIPIENT` con tu email de prueba
2. Ejecuta manualmente el endpoint `/api/alerts/run` o usa el botón "Run alerts now" en la UI
3. Si hay alertas disparadas, deberías recibir un email con:
   - **Asunto:** `[V-Momentum-Pro] Alert: Traffic drop > 30% on FilamentRank`
   - **Cuerpo HTML** con métricas y detalles (valores anteriores, actuales, % de cambio)

### 3. Verificar desde la UI

1. Ve a `/app` → Sección "Alerts"
2. Verifica que las reglas se cargan desde el backend (deberías ver 3 reglas por sitio)
3. Cambia el estado **On/Off** de una alerta y verifica que se actualiza correctamente
4. Usa el botón **"Run alerts now"** para ejecutar manualmente

---

## ✅ Validaciones Técnicas

- ✅ `npm run lint`: Sin errores (0 problemas)
- ✅ `npm run build`: Compilación exitosa
- ✅ TypeScript: Sin errores de tipos
- ✅ Endpoints API: `/api/alerts/run`, `/api/alerts/run-manual`, `/api/alerts/rules` funcionando correctamente

---

## 📝 Tipos de Alertas Implementadas

1. **TRAFFIC_DROP_30** - Detecta caída de tráfico > 30% comparando últimos 7 días vs 7 días anteriores
2. **CONVERSION_DROP_20** - Detecta caída de tasa de conversión > 20% comparando últimos 7 días vs 7 días anteriores
3. **PAGEVIEWS_SPIKE_2X** - Detecta pico de pageviews > 2x el promedio de los últimos 7 días

---

## ⚠️ Limitaciones Actuales y TODOs para Futuras Fases

### Limitaciones Actuales:

1. **Almacenamiento**: Usa archivos JSON (`data/alert-rules.json`, `data/alert-events.json`). En producción, debería migrarse a base de datos (PostgreSQL, MongoDB, etc.)
2. **Destinatarios**: Por ahora usa `ALERTS_DEFAULT_RECIPIENT`. En el futuro, debería consultar una base de datos de usuarios con relación User ↔ Site
3. **Autenticación Admin**: El endpoint `/api/alerts/run` solo valida `CRON_SECRET`. En el futuro, debería validar autenticación de usuario admin
4. **Deduplicación**: Evita disparar la misma alerta más de una vez en 24 horas. Esto podría ser configurable por regla

### TODOs Recomendados:

1. Migrar almacenamiento de JSON a base de datos
2. Implementar sistema de usuarios con relación User ↔ Site
3. Permitir configuración de alertas por usuario
4. Añadir más tipos de alertas (revenue drop, bounce rate spike, etc.)
5. Dashboard de historial de alertas disparadas
6. Notificaciones push o webhooks además de email
7. Configuración de deduplicación por regla (ventana de tiempo personalizable)

---

## 🔒 Seguridad

- ✅ `CRON_SECRET` nunca se expone en el cliente
- ✅ Endpoint `/api/alerts/run-manual` maneja el secreto en el servidor
- ✅ Variables de entorno no se loguean en consola
- ✅ `.env.local.example` no contiene datos reales, solo placeholders

---

## 📋 Checklist de Configuración para Producción

- [ ] Crear archivo `.env.local` basado en `.env.local.example`
- [ ] Configurar `GA4_SERVICE_ACCOUNT_JSON` (ruta local o JSON completo)
- [ ] Configurar `GA4_PROPERTY_ID_FILAMENTRANK` (ya está: 514022388)
- [ ] Configurar variables SMTP (`ALERTS_SMTP_HOST`, `ALERTS_SMTP_USER`, `ALERTS_SMTP_PASS`)
- [ ] Configurar `ALERTS_DEFAULT_RECIPIENT` con tu email de prueba
- [ ] Configurar `CRON_SECRET` con un valor seguro y único
- [ ] En Vercel, añadir todas las variables de entorno en Settings → Environment Variables
- [ ] Probar ejecución manual desde la UI (`/app/Alerts` → "Run alerts now")
- [ ] Verificar que llegan los emails de prueba
- [ ] (Opcional) Configurar Vercel Cron Job para ejecución automática diaria

---

## 🎯 Estado Final

✅ **Sistema de alertas v2 completamente funcional y listo para producción.**

El código compila sin errores, está tipado, sigue las mejores prácticas de seguridad y está listo para usar tanto en localhost como en producción (Vercel).

