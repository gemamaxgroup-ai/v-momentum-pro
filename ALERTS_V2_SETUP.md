# Sistema de Alertas V2 - Guía de Configuración

## Resumen

Se ha implementado el sistema de alertas v2 con disparo real basado en GA4 y notificaciones por email. El sistema evalúa métricas GA4 y envía alertas cuando se detectan cambios significativos.

## Archivos Principales Creados/Modificados

### Nuevos Archivos

1. **`lib/alerts/types.ts`** - Tipos TypeScript para AlertRule y AlertEvent
2. **`lib/alerts/storage.ts`** - Sistema de almacenamiento en archivos JSON (preparado para migrar a DB)
3. **`lib/alerts/ga4AlertEngine.ts`** - Motor de evaluación de alertas basado en GA4
4. **`lib/alerts/init.ts`** - Inicialización de reglas por defecto
5. **`lib/alerts/recipients.ts`** - Gestión de destinatarios de alertas
6. **`lib/email/alertsMailer.ts`** - Servicio de envío de emails con nodemailer
7. **`app/api/alerts/run/route.ts`** - Endpoint para ejecutar el motor de alertas
8. **`app/api/alerts/rules/route.ts`** - Endpoint para gestionar reglas de alertas

### Archivos Modificados

1. **`components/dashboard/AlertsSection.tsx`** - Integración con backend, botón "Run alerts now"
2. **`lib/ga4/overview.ts`** - Exportada función `getAnalyticsClient()` para uso compartido
3. **`.gitignore`** - Añadido `/data/` para ignorar archivos JSON de alertas

## Variables de Entorno Requeridas

Añade estas variables a tu `.env.local` y en Vercel:

```env
# ============================================
# ALERTAS V2 - Sistema de Alertas GA4
# ============================================

# Configuración SMTP para envío de emails de alertas
ALERTS_SMTP_HOST=smtp.gmail.com
ALERTS_SMTP_PORT=587
ALERTS_SMTP_USER=tu-email@gmail.com
ALERTS_SMTP_PASS=tu-app-password
ALERTS_FROM_EMAIL=alerts@v-momentum-pro.com

# Email(s) que recibirán las alertas (separados por coma si hay múltiples)
ALERTS_DEFAULT_RECIPIENT=admin@v-momentum-pro.com,otro-email@example.com

# Secreto para proteger el endpoint /api/alerts/run cuando se llama desde cron jobs
CRON_SECRET=tu-secreto-seguro-aqui-cambiar-en-produccion
```

### Configuración SMTP (Gmail como ejemplo)

1. Activa la verificación en 2 pasos en tu cuenta de Gmail
2. Genera una "App Password" en: https://myaccount.google.com/apppasswords
3. Usa esa contraseña en `ALERTS_SMTP_PASS`

Para otros proveedores SMTP, ajusta `ALERTS_SMTP_HOST` y `ALERTS_SMTP_PORT` según corresponda.

## Tipos de Alertas Implementadas

1. **TRAFFIC_DROP_30** - Detecta caída de tráfico > 30% comparando últimos 7 días vs 7 días anteriores
2. **CONVERSION_DROP_20** - Detecta caída de tasa de conversión > 20% comparando últimos 7 días vs 7 días anteriores
3. **PAGEVIEWS_SPIKE_2X** - Detecta pico de pageviews > 2x el promedio de los últimos 7 días

## Ejecución Manual del Motor de Alertas

### Usando cURL

```bash
# Con CRON_SECRET en header
curl -X POST https://v-momentum-pro.com/api/alerts/run \
  -H "x-cron-secret: tu-secreto-seguro-aqui"

# O con CRON_SECRET en query
curl -X POST "https://v-momentum-pro.com/api/alerts/run?cron_secret=tu-secreto-seguro-aqui"
```

### Respuesta Esperada

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

## Verificación

### 1. Verificar que se crean AlertRule y AlertEvent

Los archivos se guardan en `data/alert-rules.json` y `data/alert-events.json` (en el servidor).

Para verificar en producción, revisa los logs del endpoint `/api/alerts/run` o consulta los archivos directamente si tienes acceso al servidor.

### 2. Verificar que llegan los emails

1. Configura `ALERTS_DEFAULT_RECIPIENT` con tu email de prueba
2. Ejecuta manualmente el endpoint `/api/alerts/run`
3. Si hay alertas disparadas, deberías recibir un email con:
   - Asunto: `[V-Momentum-Pro] Alert: [tipo] on [sitio]`
   - Cuerpo HTML con métricas y detalles

### 3. Verificar desde la UI

1. Ve a `/app` → Sección "Alerts"
2. Verifica que las reglas se cargan desde el backend
3. Cambia el estado On/Off de una alerta y verifica que se actualiza
4. Si eres admin, usa el botón "Run alerts now" para ejecutar manualmente

## Configuración de Vercel Cron Job (Opcional)

Para ejecutar alertas automáticamente, configura un cron job en Vercel:

1. Crea `vercel.json` en la raíz del proyecto:

```json
{
  "crons": [
    {
      "path": "/api/alerts/run",
      "schedule": "0 9 * * *"
    }
  ]
}
```

2. En Vercel, añade la variable de entorno `CRON_SECRET` con un valor seguro
3. El cron job llamará automáticamente al endpoint cada día a las 9:00 AM UTC

## Notas Importantes

- **Deduplicación**: El sistema evita disparar la misma alerta más de una vez en 24 horas
- **Persistencia**: Por ahora usa archivos JSON. En producción, considera migrar a una base de datos
- **Seguridad**: El endpoint `/api/alerts/run` está protegido por `CRON_SECRET`. En desarrollo, si no está configurado, permite el acceso (con warning)
- **Errores**: Los errores de email no bloquean el proceso. Se registran en el evento y en los logs

## Próximos Pasos (Futuras Mejoras)

1. Migrar almacenamiento de JSON a base de datos (PostgreSQL/MongoDB)
2. Implementar sistema de usuarios con relación User ↔ Site
3. Permitir configuración de alertas por usuario
4. Añadir más tipos de alertas (revenue drop, bounce rate spike, etc.)
5. Dashboard de historial de alertas disparadas
6. Notificaciones push o webhooks además de email

