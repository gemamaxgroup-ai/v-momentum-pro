# Guía de Despliegue en Vercel

Esta guía explica cómo desplegar V-Momentum-Pro en Vercel con integración de Google Analytics 4.

## Scripts de Build

Vercel usará automáticamente estos scripts definidos en `package.json`:

- **`dev`**: `next dev` - Servidor de desarrollo local
- **`build`**: `next build` - Compilación para producción
- **`start`**: `next start` - Servidor de producción (opcional, Vercel lo maneja automáticamente)

## Variables de Entorno Requeridas

Para que la integración con Google Analytics 4 funcione correctamente, debes configurar las siguientes variables de entorno en Vercel:

### 1. `GA4_PROPERTY_ID_FILAMENTRANK`

**Tipo**: String (número)

**Descripción**: ID numérico de la propiedad de Google Analytics 4 para FilamentRank.

**Cómo obtenerlo**:
1. Ve a [Google Analytics](https://analytics.google.com/)
2. Selecciona tu propiedad GA4
3. Ve a **Admin** > **Property Settings**
4. Copia el **Property ID** (formato numérico, ej: `514022388`)

**Ejemplo**: `514022388`

---

### 2. `GA4_SERVICE_ACCOUNT_JSON`

**Tipo**: String (JSON completo como una sola línea)

**Descripción**: JSON completo del Service Account de Google Cloud, necesario para autenticarse con la API de Google Analytics Data.

**Cómo obtenerlo**:

1. **Crear Service Account en Google Cloud Console**:
   - Ve a [Google Cloud Console](https://console.cloud.google.com/)
   - Selecciona tu proyecto
   - Ve a **IAM & Admin** > **Service Accounts**
   - Crea un nuevo Service Account o usa uno existente
   - Descarga el archivo JSON de credenciales

2. **Convertir el JSON a una sola línea**:
   
   El JSON debe estar en formato de una sola línea, con:
   - Comillas dobles escapadas: `"` → `\"`
   - Saltos de línea escapados: `\n` (literal, no salto real)
   
   **Ejemplo de formato**:
   ```json
   {"type":"service_account","project_id":"tu-proyecto","private_key_id":"...","private_key":"-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n","client_email":"...","client_id":"...","auth_uri":"...","token_uri":"...","auth_provider_x509_cert_url":"...","client_x509_cert_url":"..."}
   ```

3. **Configurar en Vercel**:
   - Ve a tu proyecto en Vercel
   - Ve a **Settings** > **Environment Variables**
   - Agrega `GA4_SERVICE_ACCOUNT_JSON` con el valor del JSON completo (una sola línea)

**⚠️ IMPORTANTE**:
- El JSON debe estar completo, incluyendo `client_email`, `private_key`, `project_id`, etc.
- No uses saltos de línea reales, usa `\n` escapado
- Escapa todas las comillas dobles con `\"`
- Nunca commitees este valor al repositorio

---

### 3. `GA4_PROPERTY_ID_CAMPRICES` (Opcional)

**Tipo**: String (número)

**Descripción**: ID numérico de la propiedad GA4 para CamPrices. Solo necesario si planeas usar datos de CamPrices.

**Ejemplo**: `123456789`

---

## Configuración en Vercel

### Paso 1: Importar el Proyecto

1. Ve a [Vercel Dashboard](https://vercel.com/dashboard)
2. Haz clic en **Add New** > **Project**
3. Importa tu repositorio de GitHub/GitLab/Bitbucket
4. Vercel detectará automáticamente que es un proyecto Next.js

### Paso 2: Configurar Variables de Entorno

1. En la página de configuración del proyecto, ve a **Environment Variables**
2. Agrega cada variable de entorno:
   - `GA4_PROPERTY_ID_FILAMENTRANK`
   - `GA4_SERVICE_ACCOUNT_JSON`
   - `GA4_PROPERTY_ID_CAMPRICES` (si aplica)

3. **Selecciona los ambientes** donde aplicar cada variable:
   - **Production**: Para el despliegue en producción
   - **Preview**: Para preview deployments (pull requests)
   - **Development**: Para desarrollo local (opcional)

### Paso 3: Desplegar

1. Haz clic en **Deploy**
2. Vercel construirá y desplegará automáticamente
3. Revisa los logs de build para verificar que no hay errores

## Verificación Post-Despliegue

Después del despliegue, verifica que:

1. ✅ La landing page carga correctamente (`/`)
2. ✅ El dashboard interno funciona (`/app`)
3. ✅ La API de GA4 responde correctamente (`/api/ga4/overview?site=filamentrank&range=last_7_days`)

Si la API retorna un error `500` con mensaje "GA4 not configured", verifica que:
- Las variables de entorno están configuradas correctamente en Vercel
- El JSON del Service Account está completo y bien formateado
- El Property ID es correcto

## Troubleshooting

### Error: "GA4_SERVICE_ACCOUNT_JSON no está configurada"

**Solución**: Verifica que la variable de entorno esté configurada en Vercel y que el valor sea el JSON completo en una sola línea.

### Error: "GA4_SERVICE_ACCOUNT_JSON no es un JSON válido"

**Solución**: Asegúrate de que:
- Todas las comillas dobles estén escapadas (`\"`)
- Los saltos de línea estén escapados como `\n` (literal)
- El JSON esté completo (no falten campos)

### Error: "GA4 property id not configured"

**Solución**: Verifica que `GA4_PROPERTY_ID_FILAMENTRANK` esté configurado y contenga el ID numérico correcto.

## Seguridad

- ✅ **NUNCA** commitees `.env.local` al repositorio
- ✅ **NUNCA** commitees archivos JSON de Service Account
- ✅ Usa variables de entorno de Vercel para credenciales sensibles
- ✅ El archivo `.gitignore` ya está configurado para ignorar `.env*` y `*.key.json`

## Referencias

- [Next.js Deployment en Vercel](https://nextjs.org/docs/deployment)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [Google Analytics Data API](https://developers.google.com/analytics/devguides/reporting/data/v1)

