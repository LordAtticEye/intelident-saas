/**
 * InteliDent SaaS - Demostración de Protocolo de Rollback en Servidor VPS (Docker)
 * Para grabación de video demostrativo de la Práctica Final (Unidad IV).
 */

const readline = require('readline');

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Colores ANSI para terminal
const c = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  red: '\x1b[31m',
};

async function runDemo() {
  console.clear();
  console.log(`${c.dim}[SSH] Estableciendo túnel seguro con el servidor Cloud VPS...${c.reset}`);
  await sleep(600);
  console.log(`${c.green}✔ Conexión autenticada: deploy@vps.intelident.cloud (Ubuntu 24.04 LTS x86_64)${c.reset}`);
  console.log(`${c.dim}Docker Engine v25.0.3 | Compose v2.24.5 | Uptime: 14 días${c.reset}`);
  console.log('');
  await sleep(800);

  console.log(`${c.cyan}deploy@vps-intelident:${c.white}/srv/intelident/production$ ${c.bright}docker compose ps${c.reset}`);
  await sleep(400);
  console.log(`NAME                    IMAGE                          STATUS          PORTS`);
  console.log(`intelident-nginx-proxy   nginx:alpine                   Up 2 hours      0.0.0.0:80->80/tcp, 0.0.0.0:443->443/tcp`);
  console.log(`intelident-frontend-prod intelident-frontend:v1.0.0     Up 2 hours      80/tcp`);
  console.log(`intelident-backend-prod  intelident-backend:v1.0.0      Up 2 hours      3000/tcp`);
  console.log('');
  await sleep(1000);

  console.log(`${c.yellow}[ALERTA DE MONITOREO]: Detectada anomalía crítica en contenedor v1.0.0-release${c.reset}`);
  console.log(`${c.yellow}Iniciando Directiva de Rollback hacia la versión estable v0.9.8-stable...${c.reset}`);
  console.log('');
  await sleep(1200);

  // Paso 1: Detener contenedores
  console.log(`${c.cyan}deploy@vps-intelident:${c.white}/srv/intelident/production$ ${c.bright}docker compose -f docker-compose.prod.yml down${c.reset}`);
  await sleep(500);
  console.log(`${c.green}[+] Running 4/4${c.reset}`);
  console.log(` ${c.green}✔${c.reset} Container intelident-nginx-proxy    ${c.yellow}Stopping... Stopped${c.reset}  0.5s`);
  await sleep(300);
  console.log(` ${c.green}✔${c.reset} Container intelident-frontend-prod  ${c.yellow}Stopping... Stopped${c.reset}  0.8s`);
  await sleep(300);
  console.log(` ${c.green}✔${c.reset} Container intelident-backend-prod   ${c.yellow}Stopping... Stopped${c.reset}  0.6s`);
  await sleep(200);
  console.log(` ${c.green}✔${c.reset} Network intelident-prod-net         ${c.red}Removed${c.reset}              0.2s`);
  console.log('');
  await sleep(1000);

  // Paso 2: Revertir versión de imagen
  console.log(`${c.cyan}deploy@vps-intelident:${c.white}/srv/intelident/production$ ${c.bright}export FRONTEND_TAG=v0.9.8-stable && export BACKEND_TAG=v0.9.8-stable${c.reset}`);
  await sleep(600);
  console.log(`${c.dim}[Git/Registry] Puntero de imagen cambiado a repositorio oficial: :v0.9.8-stable${c.reset}`);
  console.log('');
  await sleep(800);

  // Paso 3: Levantar contenedores estables
  console.log(`${c.cyan}deploy@vps-intelident:${c.white}/srv/intelident/production$ ${c.bright}docker compose -f docker-compose.prod.yml up -d --remove-orphans${c.reset}`);
  await sleep(600);
  console.log(`${c.green}[+] Running 4/4${c.reset}`);
  console.log(` ${c.green}✔${c.reset} Network intelident-prod-net         ${c.green}Created${c.reset}              0.1s`);
  await sleep(400);
  console.log(` ${c.green}✔${c.reset} Container intelident-backend-prod   ${c.green}Started (v0.9.8-stable)${c.reset} 1.1s`);
  await sleep(400);
  console.log(` ${c.green}✔${c.reset} Container intelident-frontend-prod  ${c.green}Started (v0.9.8-stable)${c.reset} 0.9s`);
  await sleep(400);
  console.log(` ${c.green}✔${c.reset} Container intelident-nginx-proxy    ${c.green}Started (TLS 1.3 Active)${c.reset}0.4s`);
  console.log('');
  await sleep(1000);

  // Paso 4: Healthcheck de verificación
  console.log(`${c.cyan}deploy@vps-intelident:${c.white}/srv/intelident/production$ ${c.bright}curl -I https://127.0.0.1/api/health${c.reset}`);
  await sleep(600);
  console.log(`${c.green}HTTP/1.1 200 OK${c.reset}`);
  console.log(`Server: nginx/1.25.4 (Alpine Linux)`);
  console.log(`Content-Type: application/json; charset=utf-8`);
  console.log(`Strict-Transport-Security: max-age=31536000; includeSubDomains; preload`);
  console.log(`X-Frame-Options: SAMEORIGIN`);
  console.log(`X-Content-Type-Options: nosniff`);
  console.log(`Date: ${new Date().toUTCString()}`);
  console.log('');
  await sleep(800);

  console.log(`${c.green}========================================================================${c.reset}`);
  console.log(`${c.green}${c.bright}   ✔ PROTOCOLO DE ROLLBACK COMPLETADO CON ÉXITO EN 48 SEGUNDOS          ${c.reset}`);
  console.log(`${c.green}   Tráfico HTTPS restablecido sin pérdida de datos en MongoDB Atlas     ${c.reset}`);
  console.log(`${c.green}========================================================================${c.reset}`);
  console.log('');
}

runDemo();
