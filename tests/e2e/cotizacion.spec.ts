import { test, expect } from '@playwright/test'

/**
 * Pruebas E2E para el formulario de cotización de 3 pasos.
 * Verifica la navegación entre pasos, validación y envío.
 */

test.describe('Cotización — Paso 1 (tipo de viaje)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/cotizacion')
  })

  test('muestra el paso 1 al cargar', async ({ page }) => {
    await expect(page.getByText(/tipo de viaje|destino/i).first()).toBeVisible()
  })

  test('muestra las categorías de tipo de viaje', async ({ page }) => {
    // El formulario tiene botones/opciones de tipo de viaje
    const options = page.locator('button, input[type="radio"], label').filter({
      hasText: /luna|familia|grupo|aventura|cultural|romántico|negocio/i,
    })
    await expect(options.first()).toBeVisible()
  })

  test('los campos de fecha están presentes', async ({ page }) => {
    const fechaSalida  = page.locator('input[type="date"]').first()
    const fechaRegreso = page.locator('input[type="date"]').nth(1)
    await expect(fechaSalida).toBeVisible()
    await expect(fechaRegreso).toBeVisible()
  })

  test('los controles de adultos y niños están presentes', async ({ page }) => {
    const body = await page.locator('body').innerText()
    expect(body.toLowerCase()).toMatch(/adultos|niños|pasajero/i)
  })
})

test.describe('Cotización — Paso 2 (datos personales)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/cotizacion')

    // Avanzar al paso 2: seleccionar tipo y fechas
    await page.locator('button, label').filter({ hasText: /luna|familia|cultural|aventura/i }).first().click()

    const hoy   = new Date()
    const enMes = new Date(hoy.getFullYear(), hoy.getMonth() + 1, hoy.getDate())
    const formatDate = (d: Date) =>
      `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`

    await page.locator('input[type="date"]').first().fill(formatDate(hoy))
    await page.locator('input[type="date"]').nth(1).fill(formatDate(enMes))

    // Clic en "Siguiente"
    await page.locator('button').filter({ hasText: /siguiente/i }).click()
  })

  test('muestra campos de datos personales', async ({ page }) => {
    // Verificar que estamos en el paso 2
    const body = await page.locator('body').innerText()
    expect(body.toLowerCase()).toMatch(/nombre|email|teléfono|contacto/i)
  })

  test('puede regresar al paso anterior', async ({ page }) => {
    const btnAnterior = page.locator('button').filter({ hasText: /anterior|regresar|atrás/i })
    if (await btnAnterior.count() > 0) {
      await btnAnterior.click()
      await expect(page.locator('body')).toContainText(/tipo de viaje|destino/i)
    }
  })
})

test.describe('Cotización — envío con mock de API', () => {
  test('muestra éxito al recibir respuesta exitosa del servidor', async ({ page }) => {
    // Mockear la API de cotización
    await page.route('/api/cotizacion', async (route) => {
      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 'test-id-123',
          whatsappUrl: 'https://wa.me/523337084290?text=Test',
        }),
      })
    })

    await page.goto('/cotizacion')

    // Paso 1: seleccionar tipo de viaje y fechas
    await page.locator('button, label').filter({ hasText: /luna|familia|cultural|aventura/i }).first().click()

    const hoy   = new Date()
    const enMes = new Date(hoy.getFullYear(), hoy.getMonth() + 1, hoy.getDate())
    const formatDate = (d: Date) =>
      `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`

    await page.locator('input[type="date"]').first().fill(formatDate(hoy))
    await page.locator('input[type="date"]').nth(1).fill(formatDate(enMes))
    await page.locator('button').filter({ hasText: /siguiente/i }).click()

    // Paso 2: llenar datos personales
    await page.locator('input[name="nombre"], input[placeholder*="nombre" i], #nombre').fill('Ana García')
    await page.locator('input[type="email"], input[name="email"], #email').fill('ana@email.com')

    const telInput = page.locator('input[type="tel"], input[name="telefono"], #telefono, input[placeholder*="teléfono" i]')
    if (await telInput.count() > 0) {
      await telInput.first().fill('3337084290')
    }

    await page.locator('button').filter({ hasText: /siguiente|continuar/i }).click()

    // Paso 3: confirmar
    const btnEnviar = page.locator('button').filter({ hasText: /enviar|confirmar|cotizar/i })
    if (await btnEnviar.count() > 0) {
      await btnEnviar.click()

      // Esperar mensaje de éxito
      await expect(page.locator('body')).toContainText(
        /gracias|recibid|whatsapp|enviado/i,
        { timeout: 10_000 },
      )
    }
  })
})
