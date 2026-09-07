/**
 * InteliDent SaaS - Suite de Pruebas de Integración E2E (Playwright)
 * Generada con asistencia de IA para validar el flujo completo de autenticación y redirección.
 */

import { test, expect } from '@playwright/test';

test.describe('Pruebas de Integración - Flujo de Autenticación y Redirección E2E', () => {
  const BASE_URL = process.env.BASE_URL || 'http://localhost:5173';

  test.beforeEach(async ({ page }) => {
    // Interceptar llamadas al backend para garantizar predictibilidad o validar contra API viva
    await page.route('**/auth/login', async (route) => {
      if (route.request().method() === 'POST') {
        const postData = JSON.parse(route.request().postData() || '{}');
        if (postData.email === 'admin@intelident.mx') {
          await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
              success: true,
              data: {
                user: {
                  _id: 'usr_admin_01',
                  firstName: 'Marco',
                  lastName: 'Cabrera',
                  email: 'admin@intelident.mx',
                  role: 'ADMIN',
                  isActive: true,
                  createdAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString(),
                },
                accessToken: 'mock-jwt-token-production-2026-xyz'
              }
            })
          });
          return;
        }

        if (postData.email === 'intruder@hack.com') {
          await route.fulfill({
            status: 401,
            contentType: 'application/json',
            body: JSON.stringify({
              success: false,
              message: 'Credenciales inválidas'
            })
          });
          return;
        }
      }
      await route.continue();
    });
  });

  test('Flujo E2E: Login exitoso, almacenamiento de sesión y redirección a /dashboard', async ({ page }) => {
    // 1. Navegar a la pantalla de Login
    await page.goto(`${BASE_URL}/login`);
    await expect(page).toHaveTitle(/InteliDent/i);

    // 2. Rellenar credenciales de acceso
    const emailInput = page.locator('input[type="email"]');
    const passwordInput = page.locator('input[type="password"]');
    const submitBtn = page.locator('button[type="submit"]');

    await emailInput.fill('admin@intelident.mx');
    await passwordInput.fill('Password123!');

    // 3. Ejecutar acción de envío (Submit)
    await submitBtn.click();

    // 4. Aserción de Integración: Verificar redirección al Dashboard
    await expect(page).toHaveURL(/.*dashboard.*/, { timeout: 10000 });
  });

  test('Validación de Seguridad: Rechazo de credenciales incorrectas y mensaje de error', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);

    const emailInput = page.locator('input[type="email"]');
    const passwordInput = page.locator('input[type="password"]');
    const submitBtn = page.locator('button[type="submit"]');

    await emailInput.fill('intruder@hack.com');
    await passwordInput.fill('WrongPass123!');
    await submitBtn.click();

    // Validar que permanece en login y muestra alerta
    await expect(page).toHaveURL(/.*login.*/);
    const alertMessage = page.locator('text=/Credenciales inválidas|Error de autenticación/i');
    await expect(alertMessage).toBeVisible({ timeout: 10000 });
  });
});
