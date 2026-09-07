# Guía Técnica y Speech para Video Demostrativo (Máximo 5 Minutos)
**Práctica Final: "Deployment & Quality Assurance (QA) con IA" — InteliDent SaaS**

- **Estudiante:** Marco César Cabrera Valeriano
- **Materia:** Desarrollo Web Integral (Unidad IV)
- **Modalidad:** Proyecto Individual
- **Duración Máxima:** 5:00 minutos exactos
- **Calificación Objetivo:** 10 / 10 (Excelente)

---

## 1. Configuración Previa de Pantallas (OBS Studio)
- **Ventana 1 (Navegador):** Abierto en `https://intelident.cloud` con el candado SSL visible.
- **Ventana 2 (Terminal VS Code):** Lista con el comando `npm run test --workspace=apps/frontend`.
- **Ventana 3 (Terminal VPS):** Lista para mostrar el protocolo de Rollback en Docker.

---

## 2. Cronograma Minuto a Minuto

| Minuto | Bloque Temático | Acción Principal en Pantalla |
|---|---|---|
| **0:00 - 0:50** | Bloque 1: Intro y Despliegue HTTPS | Mostrar navegador en `https://intelident.cloud`, abrir candado SSL y certificado Let's Encrypt. |
| **0:50 - 1:50** | Bloque 2: Pruebas Unitarias Vitest | Ejecutar en terminal `npm run test --workspace=apps/frontend` (15 tests aprobados). |
| **1:50 - 2:40** | Bloque 3: Integración Playwright | Mostrar suite de integración E2E (`auth-flow.spec.ts`) y redirección a dashboard. |
| **2:40 - 3:45** | Bloque 4: Rendimiento k6 y Lighthouse | Ejecutar prueba de carga k6 (50 VUs, p95 < 500ms) y tarjeta de Lighthouse (A11y 98, Best 100). |
| **3:45 - 4:40** | Bloque 5: Protocolo de Rollback VPS | Demostrar en consola Docker `docker compose down` y reversión a versión anterior estable. |
| **4:40 - 5:00** | Bloque 6: Conclusión y Gobernanza | Mostrar tag `v1.0.0-release` en Git y cumplimiento de privacidad LFPDPPP. |

---

## 3. Speech Textual Completo (Teleprompter)

### [0:00 - 0:50] Bloque 1: Apertura y Demostración de HTTPS en la Nube
> *"Hola, qué tal. Mi nombre es Marco César Cabrera Valeriano, estudiante de la Ingeniería en Desarrollo y Gestión de Software en la Universidad Tecnológica de San Juan del Río. En este video presento la entrega final de la Unidad 4 para la materia de Desarrollo Web Integral, correspondiente al despliegue en producción y el aseguramiento de calidad (QA) asistido por Inteligencia Artificial de nuestra plataforma InteliDent SaaS.*
> 
> *Como podemos observar aquí en pantalla, el sistema ya se encuentra desplegado y operativo en nuestra infraestructura Cloud utilizando contenedores Docker. En la barra de navegación vemos el candado verde de seguridad sobre el dominio https://intelident.cloud. Al hacer clic en él, confirmamos que contamos con un certificado TLS 1.3 activo, emitido por Let's Encrypt con cifrado fuerte de 256 bits y terminación SSL gestionada mediante un proxy inverso Nginx, cumpliendo estrictamente con la Fase 1 del proyecto."*

### [0:50 - 1:50] Bloque 2: Pruebas Unitarias y Caja Blanca en Tiempo Real
> *"A continuación, pasamos a nuestra terminal para ejecutar en tiempo real la suite de pruebas generada con asistencia de IA. Para las pruebas unitarias y de caja blanca utilizamos Vitest. Voy a lanzar el comando `npm run test --workspace=apps/frontend`.*
> 
> *Como vemos en la consola, se han ejecutado 2 archivos de prueba con un total de 15 casos aprobados al 100% en menos de 500 milisegundos. En particular, la suite de `candidateScoring.test.ts` evalúa la lógica interna de caja blanca: probamos todas las ramas condicionales del algoritmo, desde coincidencia total, coincidencia parcial, casos con listas vacías y normalización de mayúsculas, así como el triaje clínico de citas odontológicas según nivel de dolor y severidad de infección, validando el comportamiento del código sin depender de la interfaz gráfica."*

### [1:50 - 2:40] Bloque 3: Pruebas de Integración y Flujo E2E
> *"En el segundo nivel de nuestra pirámide de calidad tenemos las pruebas de integración desarrolladas con Playwright. Aquí validamos el flujo completo de autenticación: el test navega automáticamente a la ruta `/login`, simula el llenado de credenciales con credenciales de prueba, intercepta la respuesta de la API REST para verificar el token JWT de sesión y comprueba que la aplicación redirige de forma exitosa y segura hacia el panel de control en `/dashboard`.*
> 
> *También incluye un caso de seguridad donde se suministran credenciales incorrectas, comprobando que el sistema rechaza el acceso y despliega una alerta amigable sin exponer información sensible del servidor."*

### [2:40 - 3:45] Bloque 4: Rendimiento k6 y Auditoría Lighthouse
> *"Para la prueba de rendimiento y estrés utilizamos k6 de Grafana. Diseñamos un script que simula 50 usuarios virtuales concurrentes bombardeando el endpoint de salud y registro durante 30 segundos.*
> 
> *Los resultados arrojaron más de 2,300 peticiones con un 0% de errores de conexión. Lo más destacable es que el percentil 95 de latencia se ubicó en solo 182 milisegundos, superando con creces el umbral máximo de 500 milisegundos exigido por la rúbrica.*
> 
> *Complementando esto con la prueba de usabilidad y accesibilidad auditada con Google Lighthouse bajo las directrices WCAG 2.1, obtuvimos un puntaje de 98 sobre 100 en Accesibilidad y 100 sobre 100 en Mejores Prácticas, con un First Contentful Paint de 0.7 segundos y contrastes de color óptimos para doctores y pacientes."*

### [3:45 - 4:40] Bloque 5: Demostración Práctica del Protocolo de Rollback
> *"El cuarto criterio fundamental de nuestra evaluación es la gobernanza y el protocolo de Rollback. Si en algún momento una actualización en producción falla o presenta un bug crítico, no entramos en pánico: tenemos un protocolo estricto documentado en la directiva de liberación.*
> 
> *Simulando el procedimiento directamente en la terminal de nuestro servidor: ejecutamos `docker compose -f docker-compose.prod.yml down` para detener los contenedores inestables de manera controlada. Acto seguido, exportamos la variable de entorno apuntando a nuestra última imagen estable probada, por ejemplo `v0.9.8-stable`, y volvemos a levantar la infraestructura con `docker compose up -d`.*
> 
> *En menos de 60 segundos, Nginx vuelve a enrutar el tráfico hacia la versión segura sin pérdida de información en la base de datos distribuida de MongoDB Atlas y con cero tiempo prolongado de indisponibilidad para la clínica."*

### [4:40 - 5:00] Bloque 6: Conclusión y Cierre
> *"Para finalizar, todo nuestro código se encuentra respaldado en GitHub bajo el flujo GitHub Flow con el tag de release oficial `v1.0.0-release`, y cuenta con cumplimiento pleno de la Ley Federal de Protección de Datos Personales (LFPDPPP) gracias a nuestras casillas de consentimiento y el aviso de privacidad interactivo implementado en el registro.*
> 
> *Con esto demostramos el dominio integral del despliegue en la nube, pruebas automatizadas con IA y políticas de liberación. Muchas gracias por su atención."*

---

## 4. Comandos de Consola Listos para Usar
- Vitest: `npm run test --workspace=apps/frontend`
- Playwright: `npx playwright test tests/integration/auth-flow.spec.ts`
- k6: `k6 run tests/performance/k6-load-test.js`
- Rollback: `docker compose -f docker-compose.prod.yml down && docker compose up -d`
