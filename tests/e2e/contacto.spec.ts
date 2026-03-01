import { test, expect } from '@playwright/test'

/**
 * Pruebas E2E para el formulario de contacto rápido.
 * Verifica renderizado, validación del servidor y estados de UI.
 */

test.describe('Contacto — renderizado', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/contacto')
  })

  test('la página de contacto carga', async ({ page }) => {
    await expect(page.locator('h1, h2').first()).toBeVisible()
  })

  test('muestra los tres campos del formulario', async ({ page }) => {
    await expect(page.getByLabel(/nombre/i)).toBeVisible()
    await expect(page.getByLabel(/correo|whatsapp/i)).toBeVisible()
    await expect(page.getByLabel(/mensaje/i)).toBeVisible()
  })

  test('muestra el botón de envío', async ({ page }) => {
    await expect(page.getByRole('button', { name: /enviar/i })).toBeVisible()
  })

  test('los campos inician vacíos', async ({ page }) => {
    await expect(page.getByLabel(/nombre/i)).toHaveValue('')
    await expect(page.getByLabel(/correo|whatsapp/i)).toHaveValue('')
  })
})

test.describe('Contacto — envío exitoso', () => {
  test('muestra mensaje de éxito tras envío correcto', async ({ page }) => {
    await page.route('/api/contacto', async (route) => {
      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({ id: 'uuid-test-1' }),
      })
    })

    await page.goto('/contacto')

    await page.getByLabel(/nombre/i).fill('Ana García')
    await page.getByLabel(/correo|whatsapp/i).fill('ana@email.com')
    await page.getByLabel(/mensaje/i).fill('Quiero información sobre viajes a Japón y Europa.')

    await page.getByRole('button', { name: /enviar/i }).click()

    await expect(page.getByRole('status')).toBeVisible({ timeout: 8_000 })
    await expect(page.locator('body')).toContainText(/recibido|gracias|enviado/i)
  })

  test('permite enviar otro mensaje desde el estado success', async ({ page }) => {
    await page.route('/api/contacto', async (route) => {
      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({ id: 'uuid-test-2' }),
      })
    })

    await page.goto('/contacto')

    await page.getByLabel(/nombre/i).fill('Carlos López')
    await page.getByLabel(/correo|whatsapp/i).fill('3337084290')
    await page.getByLabel(/mensaje/i).fill('Me interesa el viaje a Europa en familia.')

    await page.getByRole('button', { name: /enviar/i }).click()
    await expect(page.locator('body')).toContainText(/recibido|gracias|enviado/i, { timeout: 8_000 })

    await page.getByRole('button', { name: /otro mensaje|nuevo mensaje/i }).click()
    await expect(page.getByLabel(/nombre/i)).toBeVisible()
  })
})

test.describe('Contacto — errores de validación (422)', () => {
  test('muestra error de nombre cuando el servidor retorna 422', async ({ page }) => {
    await page.route('/api/contacto', async (route) => {
      await route.fulfill({
        status: 422,
        contentType: 'application/json',
        body: JSON.stringify({ errors: { nombre: 'Ingresa tu nombre completo.' } }),
      })
    })

    await page.goto('/contacto')
    await page.getByLabel(/correo|whatsapp/i).fill('ana@email.com')
    await page.getByLabel(/mensaje/i).fill('Quiero información sobre viajes a Japón.')
    await page.getByRole('button', { name: /enviar/i }).click()

    await expect(page.locator('body')).toContainText(/ingresa tu nombre/i, { timeout: 8_000 })
  })

  test('muestra error de contacto cuando el servidor retorna 422', async ({ page }) => {
    await page.route('/api/contacto', async (route) => {
      await route.fulfill({
        status: 422,
        contentType: 'application/json',
        body: JSON.stringify({ errors: { contacto: 'Ingresa un correo válido o número de WhatsApp.' } }),
      })
    })

    await page.goto('/contacto')
    await page.getByLabel(/nombre/i).fill('Ana García')
    await page.getByLabel(/correo|whatsapp/i).fill('invalido')
    await page.getByLabel(/mensaje/i).fill('Mensaje de prueba largo.')
    await page.getByRole('button', { name: /enviar/i }).click()

    await expect(page.locator('body')).toContainText(/correo válido|whatsapp/i, { timeout: 8_000 })
  })

  test('muestra error genérico con respuesta 500', async ({ page }) => {
    await page.route('/api/contacto', async (route) => {
      await route.fulfill({ status: 500 })
    })

    await page.goto('/contacto')
    await page.getByLabel(/nombre/i).fill('Ana García')
    await page.getByLabel(/correo|whatsapp/i).fill('ana@email.com')
    await page.getByLabel(/mensaje/i).fill('Mensaje de prueba para error 500.')
    await page.getByRole('button', { name: /enviar/i }).click()

    await expect(page.getByRole('alert')).toBeVisible({ timeout: 8_000 })
  })
})

test.describe('Contacto — estado de carga', () => {
  test('deshabilita el botón mientras envía', async ({ page }) => {
    // Respuesta lenta para capturar estado loading
    await page.route('/api/contacto', async (route) => {
      await new Promise(resolve => setTimeout(resolve, 2_000))
      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({ id: 'uuid-slow' }),
      })
    })

    await page.goto('/contacto')
    await page.getByLabel(/nombre/i).fill('Ana García')
    await page.getByLabel(/correo|whatsapp/i).fill('ana@email.com')
    await page.getByLabel(/mensaje/i).fill('Mensaje largo de prueba E2E.')

    const btn = page.getByRole('button', { name: /enviar/i })
    await btn.click()

    // El botón debe estar deshabilitado mientras se envía
    await expect(btn).toBeDisabled()
    await expect(btn).toHaveAttribute('aria-busy', 'true')
  })
})
