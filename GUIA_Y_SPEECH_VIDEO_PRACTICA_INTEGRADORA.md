# Guía Completa de Grabación y Speech Oficial: Práctica Integradora
## *"IA-Driven Development con Next.js"*

**Proyecto:** InteliDent SaaS (Clínica Odontológica Inteligente)  
**Institución:** Universidad Tecnológica de San Juan del Río  
**Estudiante / Presentador:** Marco César Cabrera Valeriano  
**Materia:** Desarrollo Web Integral — Unidad I  
**Duración Objetivo del Video:** 7 a 10 minutos  
**Herramienta de IA Demostrada:** Cursor / Antigravity / Copilot con Next.js 15 & React 19  

---

## 1. Resumen de Cambios y Configuraciones Implementadas en el Proyecto

Para cumplir al 100% con los criterios de la rúbrica ("Excelente" en todos los rubros), se han configurado los siguientes elementos en el repositorio:

1. **Gobernanza y Reglas `.mdc` (`.cursor/rules/`):**
   - [`.cursor/rules/nextjs-architecture.mdc`](file:///C:/Users/marco/OneDrive/Escritorio/intelident/intelident/.cursor/rules/nextjs-architecture.mdc): Reglas de App Router, Server Components vs Client Components (`'use client'`), Server Actions y Layout Pattern.
   - [`.cursor/rules/typescript-standards.mdc`](file:///C:/Users/marco/OneDrive/Escritorio/intelident/intelident/.cursor/rules/typescript-standards.mdc): Estándares de TypeScript estricto, prohibición de `any`, Clean Code y uso del paquete compartido `@intelident/shared`.
   - [`.cursor/rules/tdd-testing.mdc`](file:///C:/Users/marco/OneDrive/Escritorio/intelident/intelident/.cursor/rules/tdd-testing.mdc): Metodología Test-Driven Development (Red-Green-Refactor) con Vitest y React Testing Library.
   - [`.cursor/rules/mcp-integration.mdc`](file:///C:/Users/marco/OneDrive/Escritorio/intelident/intelident/.cursor/rules/mcp-integration.mdc): Gobernanza de conectividad contextual mediante el protocolo MCP.

2. **Configuración de Servidores MCP (`.cursor/mcp.json`):**
   - [`.cursor/mcp.json`](file:///C:/Users/marco/OneDrive/Escritorio/intelident/intelident/.cursor/mcp.json): Conectores para MongoDB Atlas y sistema de archivos del monorepo.

3. **Suite de Pruebas Unitarias y TDD:**
   - [`apps/frontend/src/utils/appointmentValidation.ts`](file:///C:/Users/marco/OneDrive/Escritorio/intelident/intelident/apps/frontend/src/utils/appointmentValidation.ts): Reglas de negocio para agendamiento odontológico.
   - [`apps/frontend/src/utils/__tests__/appointmentValidation.test.ts`](file:///C:/Users/marco/OneDrive/Escritorio/intelident/intelident/apps/frontend/src/utils/__tests__/appointmentValidation.test.ts): Pruebas automatizadas en Vitest (`npm run test --workspace=apps/frontend`).

4. **Base de Datos MongoDB Atlas Conectada:**
   - Clúster en la nube configurado con seed de usuarios iniciales por rol (Admin, Dentista, Recepcionista, Paciente).

---

## 2. Estructura Minuto a Minuto del Video (7 a 10 minutos)

| Bloque | Tiempo | Tema Central | Qué Mostrar en Pantalla |
| :--- | :---: | :--- | :--- |
| **Bloque 1** | 0:00 - 1:30 | **Introducción y Contexto:** El "Por Qué" | Portada del proyecto InteliDent, VS Code/Cursor abierto con el árbol de carpetas, presentación personal e institucional. |
| **Bloque 2** | 1:30 - 3:15 | **Gobernanza del Código:** Reglas `.mdc` y `@docs` | Mostrar la carpeta `.cursor/rules/`, abrir archivos `.mdc`, explicar cómo la IA respeta la arquitectura sin alucinar y cómo `@docs` indexa Next.js 15. |
| **Bloque 3** | 3:15 - 5:30 | **Modos de Operación:** Autocompletado vs Modo Agente | Comparar autocompletado simple vs Agent Mode / Composer. Demostrar refactorización multiarchivo o creación asistida de componentes. |
| **Bloque 4** | 5:30 - 7:30 | **Estrategias Avanzadas:** IA + TDD y Linter | Mostrar el ciclo TDD: prueba en rojo en Vitest &rarr; generación con IA &rarr; prueba en verde. Demostrar corrección automática de errores con el Linter. |
| **Bloque 5** | 7:30 - 8:45 | **Conectividad Contextual:** Protocolo MCP | Mostrar `.cursor/mcp.json`, explicar la conexión en tiempo real a MongoDB Atlas y APIs externas. |
| **Cierre** | 8:45 - 9:30 | **Conclusiones y Resumen de Valor** | Repositorio de GitHub, commits con IA, síntesis del impacto en productividad y calidad técnica. |

---

## 3. Speech / Guion Técnico Palabra por Palabra

> *Consejo de grabación:* Habla con tono seguro, pausado y profesional. Puedes grabar en OBS Studio o Clipchamp compartiendo tu pantalla completa y tu cámara web en una esquina.

---

### [00:00 - 01:30] Bloque 1: Introducción y Contexto (El "Por Qué")

**En pantalla:**
- Mostrar la pantalla inicial del IDE (Cursor / VS Code) con el proyecto `intelident` abierto y la terminal.
- Cámara del presentador visible.

**Voz del Presentador:**
> *"Hola, ¿qué tal? Mi nombre es Marco César Cabrera Valeriano, estudiante de la Ingeniería en Desarrollo y Gestión de Software en la Universidad Tecnológica de San Juan del Río. En este video presentaré la práctica integradora: **IA-Driven Development con Next.js** para la materia de Desarrollo Web Integral.*
> 
> *El objetivo principal es demostrar cómo la integración de un asistente de codificación con Inteligencia Artificial transforma el flujo de trabajo moderno, elevando la productividad, la mantenibilidad y la gobernanza del código en un entorno de producción real: nuestro SaaS clínico odontológico llamado **InteliDent**.*
> 
> *Tradicionalmente, configurar arquitecturas robustas con el App Router de Next.js, gestionar Server Components frente a Client Components, estructurar Server Actions y conectar APIs externas consume hasta un 40% del tiempo inicial del proyecto en tareas repetitivas y boilerplate. Con un asistente de IA bien gobernado, este tiempo se reduce drásticamente, permitiéndonos enfocarnos en la lógica de negocio clínica, la seguridad médica y la experiencia del usuario."*

---

### [01:30 - 03:15] Bloque 2: Configuración Avanzada y Consistencia (Gobernanza del Código con `.mdc`)

**En pantalla:**
- Abrir el explorador de archivos y expandir la carpeta `.cursor/rules/`.
- Abrir [`.cursor/rules/nextjs-architecture.mdc`](file:///C:/Users/marco/OneDrive/Escritorio/intelident/intelident/.cursor/rules/nextjs-architecture.mdc) y resaltar las directivas de Server Components y nomenclatura.
- Abrir [`.cursor/rules/typescript-standards.mdc`](file:///C:/Users/marco/OneDrive/Escritorio/intelident/intelident/.cursor/rules/typescript-standards.mdc).

**Voz del Presentador:**
> *"El mayor error al usar IA en desarrollo de software es utilizarla sin gobernanza, lo que genera alucinaciones, código desalineado con la arquitectura o el uso de versiones obsoletas. Para resolver esto, hemos implementado el estándar de **Reglas del Editor mediante archivos `.mdc`** ubicados en la carpeta `.cursor/rules`.*
> 
> *Aquí pueden observar nuestras reglas activas:*
> 1. *`nextjs-architecture.mdc`: Establece que todo componente es un React Server Component por defecto, y que la directiva `'use client'` solo debe aplicarse en componentes interactivos, como nuestro Chatbot o las gráficas analíticas.*
> 2. *`typescript-standards.mdc`: Prohíbe estrictamente el tipo `any` y obliga a la IA a consumir nuestras interfaces compartidas del paquete `@intelident/shared`.*
> 3. *`tdd-testing.mdc`: Guía a la IA a seguir el ciclo Red-Green-Refactor.*
> 
> *Además, mediante herramientas de contexto enriquecido como `@docs`, indexamos la documentación oficial de Next.js 15 y Tailwind CSS. Esto garantiza que cuando la IA sugiere código, utiliza las APIs más recientes, evitando métodos deprecados de versiones anteriores de React."*

---

### [03:15 - 05:30] Bloque 3: Modos de Operación e Integración (El "Cómo")

**En pantalla:**
- Abrir el panel de Chat / Composer (Modo Agent).
- Mostrar en pantalla cómo la IA lee el contexto multiarchivo.
- Mostrar la consola o ejecutar una solicitud de refactorización o consulta de componentes.

**Voz del Presentador:**
> *"Hablemos ahora de los modos de operación. Existe una diferencia fundamental entre el **autocompletado simple en línea** y el **Modo Agente (Agent Mode)**.*
> 
> *El autocompletado predice la siguiente línea de código en un archivo aislado. En cambio, el **Modo Agente**, potenciado por modelos avanzados como Claude 3.5 Sonnet, GPT-4o o Gemini 2.0 Flash, actúa como un desarrollador par (Pair Programmer) autónomo capaz de razonar sobre múltiples archivos a la vez.*
> 
> *Veamos una demostración práctica: en InteliDent, el backend opera con servicios desacoplados (`OpenAIService.ts`, `CRMService.ts`) y el frontend con React 19. Cuando solicitamos al agente una modificación que involucra actualizar el esquema del modelo, el endpoint y el componente de UI, el agente analiza la jerarquía completa del monorepo, respeta las reglas `.mdc` y aplica cambios consistentes en todos los archivos simultáneamente sin romper contratos de tipos."*

---

### [05:30 - 07:30] Bloque 4: Estrategias Avanzadas: IA + TDD y Automatización de Calidad (Linter)

**En pantalla:**
- Abrir [`apps/frontend/src/utils/__tests__/appointmentValidation.test.ts`](file:///C:/Users/marco/OneDrive/Escritorio/intelident/intelident/apps/frontend/src/utils/__tests__/appointmentValidation.test.ts).
- Abrir [`apps/frontend/src/utils/appointmentValidation.ts`](file:///C:/Users/marco/OneDrive/Escritorio/intelident/intelident/apps/frontend/src/utils/appointmentValidation.ts).
- Ejecutar en la terminal integrada: `npm run test --workspace=apps/frontend`.
- Mostrar las 3 pruebas unitarias pasando en verde.

**Voz del Presentador:**
> *"Una de las estrategias más potentes en desarrollo profesional es combinar **IA con TDD (Test-Driven Development)**.*
> 
> *Aquí aplicamos el ciclo de tres pasos:*
> *Primero, solicitamos a la IA que cree la suite de pruebas unitarias para nuestra lógica de citas odontológicas: rechazar fechas pasadas, bloquear horarios en domingo y validar la jornada laboral de 9 a 18 horas. Inicialmente las pruebas fallan (fase Red).*
> 
> *Segundo, le pedimos a la IA que implemente la función de validación en `appointmentValidation.ts` respetando nuestras reglas de TypeScript y Clean Code.*
> 
> *Ejecutamos en terminal `npm run test` con Vitest... y como pueden ver en pantalla, los 3 tests pasan en verde instantáneamente.*
> 
> *En cuanto a la calidad de código, integramos ESLint y TypeScript Linter. Si introducimos un error de tipado o formato, la IA detecta los linter errors y ofrece la acción 'Iterate on Lints' para corregir automáticamente los problemas sin intervención manual."*

---

### [07:30 - 08:45] Bloque 5: Conectividad Contextual con MCP (Model Context Protocol)

**En pantalla:**
- Abrir [`.cursor/mcp.json`](file:///C:/Users/marco/OneDrive/Escritorio/intelident/intelident/.cursor/mcp.json).
- Explicar los servidores configurados (`mongodb-intelident` y `filesystem-intelident`).
- Mostrar en la terminal que MongoDB Atlas está conectado con los usuarios creados.

**Voz del Presentador:**
> *"La frontera más moderna en el desarrollo asistido por IA es el **Model Context Protocol (MCP)**.*
> 
> *MCP es un estándar abierto que permite conectar herramientas y fuentes de datos externas directamente al contexto del editor de código. En nuestro archivo `.cursor/mcp.json`, tenemos configurados dos servidores MCP:*
> 1. *`mongodb-intelident`: Conecta a la IA directamente con nuestro clúster en la nube de MongoDB Atlas, permitiéndole inspeccionar esquemas de colecciones (como `patients`, `appointments` y `users`) en tiempo real.*
> 2. *`filesystem-intelident`: Permite indexar y navegar de forma segura por las carpetas `apps` y `packages` de nuestro monorepo.*
> 
> *Esto elimina la necesidad de copiar y pegar esquemas de base de datos manualmente en el prompt, asegurando que la IA siempre tenga el contexto exacto de los datos clínicos."*

---

### [08:45 - 09:30] Cierre y Conclusiones

**En pantalla:**
- Mostrar el repositorio en GitHub o el árbol de commits (`git log --oneline`).
- Mostrar la pantalla del SaaS en funcionamiento o el PDF de arquitectura.

**Voz del Presentador:**
> *"En conclusión, la adopción de herramientas de IA como Cursor, Antigravity o Copilot no sustituye la ingeniería de software, sino que potencia al desarrollador. Gracias a las reglas `.mdc`, la metodología TDD y la conectividad MCP, logramos un sistema robusto, escalable y mantenible para nuestra plataforma **InteliDent**.*
> 
> *El código fuente, las configuraciones `.mdc`, el archivo `mcp.json` y la suite de pruebas se encuentran disponibles en nuestro repositorio de GitHub con el historial de commits correspondiente.*
> 
> *Muchas gracias por su atención."*

---

## 4. Checklist para la Grabación y Entrega

- [ ] **Grabador:** OBS Studio o software de grabación a 1080p con micrófono claro.
- [ ] **Archivos listos para abrir en el video:**
  - `.cursor/rules/nextjs-architecture.mdc`
  - `.cursor/rules/typescript-standards.mdc`
  - `.cursor/mcp.json`
  - `apps/frontend/src/utils/appointmentValidation.ts`
  - `apps/frontend/src/utils/__tests__/appointmentValidation.test.ts`
- [ ] **Comando listo en terminal:** `npm run test --workspace=apps/frontend` (debe arrojar 3 tests passed).
- [ ] **Subir el video:** YouTube (como No listado / Público) o Google Drive (con permiso "Cualquier persona con el enlace").
- [ ] **Repositorio GitHub:** Subir los últimos cambios (`git add .`, `git commit -m "feat: configure .mdc rules, MCP server and TDD vitest suite"`, `git push`).
