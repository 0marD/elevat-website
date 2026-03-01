import { test, expect } from '@playwright/test'

/**
 * Pruebas de navegación — verifica que los enlaces del Navbar y Footer
 * llevan a las páginas correctas y que la navegación funciona fluidamente.
 */

test.describe('Navegación — Navbar', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('la página principal carga correctamente', async ({ page }) => {
    await expect(page).toHaveTitle(/ÉLEVA|Éleva|Eleva/i)
    await expect(page.locator('nav')).toBeVisible()
  })

  test('el logo navega al inicio', async ({ page }) => {
    // Navegar a otra página primero
    await page.goto('/destinos')
    await page.locator('nav a[href="/"]').first().click()
    await expect(page).toHaveURL('/')
  })

  test('enlace a Destinos funciona', async ({ page }) => {
    await page.locator('nav a[href="/destinos"]').click()
    await expect(page).toHaveURL('/destinos')
    await expect(page.locator('h1, h2').first()).toBeVisible()
  })

  test('enlace a Blog funciona', async ({ page }) => {
    await page.locator('nav a[href="/blog"]').click()
    await expect(page).toHaveURL('/blog')
    await expect(page.locator('h1, h2').first()).toBeVisible()
  })

  test('enlace a Testimonios funciona', async ({ page }) => {
    await page.locator('nav a[href="/testimonios"]').click()
    await expect(page).toHaveURL('/testimonios')
  })

  test('enlace a Contacto funciona', async ({ page }) => {
    await page.locator('nav a[href="/contacto"]').click()
    await expect(page).toHaveURL('/contacto')
  })
})

test.describe('Navegación — Footer', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('el footer es visible', async ({ page }) => {
    await expect(page.locator('footer')).toBeVisible()
  })

  test('el footer tiene enlace a WhatsApp o contacto', async ({ page }) => {
    const footer = page.locator('footer')
    const hasWhatsApp = await footer.locator('a[href*="whatsapp"]').count()
    const hasContacto = await footer.locator('a[href="/contacto"]').count()
    expect(hasWhatsApp + hasContacto).toBeGreaterThan(0)
  })
})

test.describe('Navegación — rutas directas', () => {
  const publicRoutes = [
    { path: '/',            pattern: /inicio|home|bienvenido|ÉLEVA/i },
    { path: '/destinos',    pattern: /destinos/i },
    { path: '/blog',        pattern: /blog/i },
    { path: '/testimonios', pattern: /testimonios/i },
    { path: '/contacto',    pattern: /contacto/i },
    { path: '/cotizacion',  pattern: /cotiz/i },
  ]

  for (const { path, pattern } of publicRoutes) {
    test(`GET ${path} responde con 200`, async ({ page }) => {
      const response = await page.goto(path)
      expect(response?.status()).toBe(200)
    })

    test(`${path} muestra contenido relevante`, async ({ page }) => {
      await page.goto(path)
      const bodyText = await page.locator('body').innerText()
      expect(bodyText.toLowerCase()).toMatch(pattern)
    })
  }
})
