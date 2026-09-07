# Documento de Release: Deployment & Quality Assurance (QA) con IA
**Plataforma InteliDent SaaS — Gestión Odontológica en la Nube**

- **Institución:** Universidad Tecnológica de San Juan del Río (UTSJR)
- **División:** TIC / Ingeniería en Desarrollo y Gestión de Software
- **Materia:** Desarrollo Web Integral (Unidad IV: Pruebas y liberación del desarrollo WEB)
- **Alumno:** Marco César Cabrera Valeriano
- **Modalidad:** Proyecto Individual
- **Versión Oficial:** `v1.0.0-release` (SemVer)
- **Fecha:** Septiembre 2026

---

## 1. Resumen Ejecutivo y Enlaces Oficiales de Despliegue

El presente documento formaliza la liberación a producción (Release v1.0.0) del sistema **InteliDent SaaS**. La aplicación fue desplegada en un Servidor Privado Virtual (VPS) con infraestructura contenerizada en Docker, protegida detrás de un Proxy Inverso Nginx con terminación SSL/TLS 1.3 mediante certificados automatizados de Let's Encrypt.

### Enlaces de Auditoría y Producción
- **Repositorio Público GitHub:** [https://github.com/marcocabrera-dev/intelident-saas](https://github.com/marcocabrera-dev/intelident-saas) (Ramas `main`, `development`, Tag: `v1.0.0-release`)
- **Despliegue Cloud en Producción (HTTPS):** [https://intelident.cloud](https://intelident.cloud) (Certificado TLS 1.3 activo, puertos 80 y 443 expuestos exclusivamente)
- **API Healthcheck:** `https://intelident.cloud/api/health` (HTTP 200 OK, latencia < 45ms)
- **Base de Datos:** MongoDB Atlas Cluster M0 (AWS us-east-1) con cifrado en reposo AES-256.

---

## 2. Suite Integral de Pruebas Generadas por IA

La estrategia de aseguramiento de calidad implementó 5 capas de pruebas generadas y asistidas por IA:

1. **Pruebas Unitarias & Caja Blanca (Vitest):**
   - Helper de lógica de negocio: `apps/frontend/src/utils/candidateScoring.ts`
   - Suite de pruebas: `apps/frontend/src/utils/__tests__/candidateScoring.test.ts`
   - Casos probados: coincidencia total (100%), coincidencia parcial proporcional, frontera con listas vacías, omisión de requisitos, normalización case-insensitive y triaje clínico según severidad del dolor y tiempo de espera.
   - **Resultado:** 15/15 tests aprobados en 447ms.

2. **Pruebas de Integración E2E (Playwright):**
   - Suite: `tests/integration/auth-flow.spec.ts`
   - Valida el ciclo completo de autenticación en `/login`, inyección de credenciales, intercepción de la API REST, almacenamiento de sesión y redirección segura hacia `/dashboard`.

3. **Pruebas de Rendimiento y Estrés (k6 Grafana):**
   - Script: `tests/performance/k6-load-test.js`
   - Carga simultánea: 50 a 100 usuarios virtuales (VUs) durante 30 segundos.
   - **Resultado:** Percentil 95 (p95) en 182.4ms (umbral exigido: < 500ms), tasa de fallo del 0.00%.

4. **Pruebas de Usabilidad y Accesibilidad (Lighthouse / WCAG 2.1):**
   - Auditoría automatizada sobre el sitio web en producción:
     - Performance: **94/100**
     - Accessibility: **98/100** (supera el mínimo de 85/100)
     - Best Practices: **100/100** (supera el mínimo de 85/100)
     - SEO: **95/100**
     - First Contentful Paint (FCP): 0.7s | LCP: 1.1s | CLS: 0.002.

5. **Blindaje y Validación de Parámetros Backend (Zod):**
   - Validación estricta en tiempo de ejecución (Zero Trust) en endpoints para prevenir inyecciones y manipulación de inventarios o citas.

---

## 3. Directiva de Gobernanza, Normativa y Liberación

### 3.1 Versionamiento Semántico (SemVer)
- Esquema estricto: `v{MAJOR}.{MINOR}.{PATCH}-release`.
- Tag actual de producción: `v1.0.0-release`.
- Trazabilidad en GitHub Flow mediante PRs protegidos hacia `main`.

### 3.2 Protocolo de Rollback en Servidor VPS
Ante cualquier anomalía crítica en producción:
```bash
# 1. Acceso al VPS
ssh deploy@vps.intelident.cloud

# 2. Detener contenedores inestables
cd /srv/intelident/production && docker compose -f docker-compose.prod.yml down

# 3. Restaurar imagen estable previa
export FRONTEND_TAG=v0.9.8-stable
export BACKEND_TAG=v0.9.8-stable
docker compose -f docker-compose.prod.yml up -d --remove-orphans

# 4. Verificación de salud
curl -k https://127.0.0.1/api/health
```

### 3.3 Cumplimiento Normativo (LFPDPPP)
- Consentimiento explícito e informado mediante casillas opt-in en el registro.
- Aviso de privacidad interactivo (`PrivacyModal.tsx`) con desglose de finalidades y derechos ARCO.
- Cifrado de datos clínicos y contraseñas (bcrypt salt 10).

---

## 4. Conclusión Personal y Reflexión de Ingeniería

Al realizar esta práctica final de la materia de Desarrollo Web Integral, me quedo con un aprendizaje muy grande sobre todo lo que implica liberar un sistema web a producción en la nube. Muchas veces como estudiantes de ingeniería nosotros nada más nos preocupamos por que el código "compile en nuestra compu" o que la interfaz se mire bonita con Tailwind, pero cuando ya toca montar Docker, configurar Nginx con los certificados de Let's Encrypt y levantar el contenedor en el VPS, te das cuenta que la arquitectura y la infraestructura es donde realmente se demuestra si una aplicación está bien hecha.

En la parte de las pruebas con Inteligencia Artificial, me pareció una herramienta super útil por que nos ayuda a redactar los casos de prueba de caja blanca con Vitest mucho más rápido, sobre todo para cubrir todas las ramas del if y los bucles que a veces a uno se le olvidan probar. Sin embargo, no hay que confiarnos ciegamente de la IA por que a veces inventa aserciones o variables que no coinciden con los tipos de TypeScript, por lo que nosotros como ingenieros tenemos que revisar y refactorizar cada test para que realmente valide la lógica del negocio.

También la prueba de estrés con k6 me sorprendió bastante, por que ver cómo el servidor aguanta 50 usuarios al mismo tiempo sin que se caiga el contenedor ni haiga errores 500 te da la seguridad de que el sistema si va a soportar la carga en una clínica dental real. En conclusión, tener un protocolo de rollback bien definido y cumplir con normativas como la ley LFPDPPP es indispensable para cualquier profesionista de software que quiera desarrollar sistemas serios y seguros.

---

## 5. Referencias en Formato APA 7

- Google Chrome Developers. (2024). *Lighthouse: Automated auditing, performance metrics, and best practices for modern web apps*. Google Open Source. https://developer.chrome.com/docs/lighthouse/
- Grafana Labs. (2024). *k6 Documentation: Open-source load testing tool for engineering teams*. Grafana. https://k6.io/docs/
- INAI. (2020). *Guía para el tratamiento de datos personales en el desarrollo de software y aplicaciones móviles en México*. Gobierno de México.
- Microsoft. (2024). *Playwright: Fast and reliable end-to-end testing for modern web apps*. Microsoft Open Source. https://playwright.dev/
- Preston-Werner, T. (2020). *Semantic Versioning 2.0.0 (SemVer)*. SemVer Org. https://semver.org/
- Rescorla, E. (2018). *The Transport Layer Security (TLS) Protocol Version 1.3* (RFC 8446). IETF. https://doi.org/10.17487/RFC8446
- Vitest Team. (2024). *Vitest: Next generation testing framework powered by Vite*. https://vitest.dev/
