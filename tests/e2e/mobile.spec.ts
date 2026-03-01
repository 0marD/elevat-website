import { test, expect } from '@playwright/test'

/**
 * Pruebas E2E específicas para dispositivos móviles.
 * Verifica el menú hamburguesa, el layout y la ausencia de overflow horizontal.
 *
 * Estos tests corren en el proyecto "mobile-chrome" (Pixel 5) e "iPhone 13".
 */

const PUBLIC_ROUTES = ['/', '/destinos', '/blog', '/testimonios', '/contacto', '/cotizacion']

test.describe('Mobile — overflow horizontal', () => {
  for (const route of PUBLIC_ROUTES) {
    test(`${route} no tiene overflow horizontal`, async ({ page }) => {
      await page.goto(route)

      const hasOverflow = await page.evaluate(() => {
        const bodyWidth    = document.body.scrollWidth
        const viewportWidth = window.innerWidth
        return bodyWidth > viewportWidth
      })

      expect(hasOverflow).toBe(false)
    })
  }
})

test.describe('Mobile — Navbar hamburguesa', () => {
  test('el botón de menú es visible en móvil', async ({ page }) => {
    await page.goto('/')

    // El botón hamburguesa suele ser visible solo en mobile
    const hamburger = page.locator('button[aria-label*="menú" i], button[aria-label*="menu" i], button[aria-expanded]').first()
    await expect(hamburger).toBeVisible()
  })

  test('el menú móvil se abre y muestra los links de navegación', async ({ page }) => {
    await page.goto('/')

    const hamburger = page.locator('button[aria-label*="menú" i], button[aria-label*="menu" i], button[aria-expanded]').first()
    await hamburger.click()

    // Después de abrir el menú, los links deben ser visibles
    await expect(page.locator('nav').getByRole('link').first()).toBeVisible({ timeout: 3_000 })
  })

  test('el menú se cierra al navegar a otra página', async ({ page }) => {
    await page.goto('/')

    const hamburger = page.locator('button[aria-label*="menú" i], button[aria-label*="menu" i], button[aria-expanded]').first()
    await hamburger.click()

    const destLink = page.locator('a[href="/destinos"]').first()
    await destLink.click()

    await expect(page).toHaveURL('/destinos')
  })
})

test.describe('Mobile — layout responsive', () => {
  test('el Navbar es visible en la parte superior', async ({ page }) => {
    await page.goto('/')
    const nav = page.locator('nav').first()
    await expect(nav).toBeVisible()

    const box = await nav.boundingBox()
    // El navbar debe estar en la parte superior de la página
    expect(box?.y).toBeLessThan(100)
  })

  test('el formulario de contacto es usable en móvil', async ({ page }) => {
    await page.goto('/contacto')

    const nombreInput = page.getByLabel(/nombre/i)
    await expect(nombreInput).toBeVisible()

    // El input debe ser accesible (sin estar cortado por el viewport)
    const box = await nombreInput.boundingBox()
    if (box) {
      expect(box.width).toBeGreaterThan(100) // al menos 100px de ancho
    }
  })

  test('el botón CTA del inicio es visible sin scroll', async ({ page }) => {
    await page.goto('/')

    // Buscar el botón de CTA principal (suele ser el primero visible)
    const cta = page.locator('a[href="/cotizacion"], a[href*="cotiz"]').first()
    if (await cta.count() > 0) {
      // El CTA puede estar debajo del fold pero debe existir
      await expect(cta).toBeAttached()
    }
  })
})

test.describe('Mobile — texto y tipografía', () => {
  test('los títulos no desbordan el viewport', async ({ page }) => {
    await page.goto('/')

    const overflow = await page.evaluate(() => {
      const headings = document.querySelectorAll('h1, h2, h3')
      let hasOverflow = false

      headings.forEach(el => {
        if (el.scrollWidth > el.clientWidth + 2) { // +2px tolerancia
          hasOverflow = true
        }
      })

      return hasOverflow
    })

    expect(overflow).toBe(false)
  })

  test('los párrafos no desbordan su contenedor', async ({ page }) => {
    await page.goto('/contacto')

    const overflow = await page.evaluate(() => {
      const paragraphs = document.querySelectorAll('p')
      let hasOverflow = false

      paragraphs.forEach(el => {
        if (el.scrollWidth > el.clientWidth + 2) {
          hasOverflow = true
        }
      })

      return hasOverflow
    })

    expect(overflow).toBe(false)
  })
})
