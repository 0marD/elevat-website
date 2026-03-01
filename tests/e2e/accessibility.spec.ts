import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

/**
 * Pruebas de accesibilidad automáticas con axe-core (WCAG 2.1 AA).
 * Detecta violaciones de accesibilidad en todas las páginas públicas.
 *
 * Referencia: https://www.deque.com/axe/
 */

// Reglas de axe que aplican para WCAG 2.1 AA
const AXE_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice']

// Violaciones conocidas que se pueden ignorar temporalmente (idealmente vacía)
const KNOWN_VIOLATIONS: string[] = []

async function checkA11y(page: Parameters<typeof AxeBuilder>[0]['page']) {
  const results = await new AxeBuilder({ page })
    .withTags(AXE_TAGS)
    .disableRules(KNOWN_VIOLATIONS)
    .analyze()

  // Reportar violaciones en el mensaje de error para facilitar depuración
  if (results.violations.length > 0) {
    const summary = results.violations.map(v =>
      `\n  [${v.impact?.toUpperCase()}] ${v.id}: ${v.description}\n` +
      `  Afecta: ${v.nodes.map(n => n.html).join(', ')}`
    ).join('\n')

    expect(results.violations, `Violaciones de accesibilidad:${summary}`).toHaveLength(0)
  }
}

test.describe('Accesibilidad — páginas públicas', () => {
  test('/ (inicio) — sin violaciones WCAG 2.1 AA', async ({ page }) => {
    await page.goto('/')
    await checkA11y(page)
  })

  test('/destinos — sin violaciones WCAG 2.1 AA', async ({ page }) => {
    await page.goto('/destinos')
    await checkA11y(page)
  })

  test('/blog — sin violaciones WCAG 2.1 AA', async ({ page }) => {
    await page.goto('/blog')
    await checkA11y(page)
  })

  test('/testimonios — sin violaciones WCAG 2.1 AA', async ({ page }) => {
    await page.goto('/testimonios')
    await checkA11y(page)
  })

  test('/contacto — sin violaciones WCAG 2.1 AA', async ({ page }) => {
    await page.goto('/contacto')
    await checkA11y(page)
  })

  test('/cotizacion — sin violaciones WCAG 2.1 AA', async ({ page }) => {
    await page.goto('/cotizacion')
    await checkA11y(page)
  })
})

test.describe('Accesibilidad — interacciones', () => {
  test('formulario de contacto con errores de validación — sin violaciones', async ({ page }) => {
    await page.route('/api/contacto', async (route) => {
      await route.fulfill({
        status: 422,
        contentType: 'application/json',
        body: JSON.stringify({
          errors: {
            nombre:   'Ingresa tu nombre completo.',
            contacto: 'Ingresa un correo válido o número de WhatsApp.',
          },
        }),
      })
    })

    await page.goto('/contacto')
    await page.getByLabel(/nombre/i).fill('A')
    await page.getByLabel(/correo|whatsapp/i).fill('invalido')
    await page.getByLabel(/mensaje/i).fill('Mensaje de prueba.')
    await page.getByRole('button', { name: /enviar/i }).click()

    // Esperar que aparezcan los errores
    await page.waitForSelector('[role="alert"]', { timeout: 5_000 })
    await checkA11y(page)
  })

  test('cotización — paso 1 accesible', async ({ page }) => {
    await page.goto('/cotizacion')
    await checkA11y(page)
  })
})

test.describe('Accesibilidad — navegación por teclado', () => {
  test('la navegación principal es accesible por teclado', async ({ page }) => {
    await page.goto('/')

    // Hacer Tab desde el inicio de la página
    await page.keyboard.press('Tab')
    const firstFocused = await page.evaluate(() => document.activeElement?.tagName)

    // El primer elemento enfocado debe ser un enlace o botón
    expect(['A', 'BUTTON', 'INPUT']).toContain(firstFocused)
  })

  test('el formulario de contacto es navegable por teclado', async ({ page }) => {
    await page.goto('/contacto')

    // Navegar al campo de nombre con Tab y escribir
    await page.getByLabel(/nombre/i).focus()
    await page.keyboard.type('Ana García')

    await expect(page.getByLabel(/nombre/i)).toHaveValue('Ana García')
  })

  test('los botones tienen foco visible (focus-visible)', async ({ page }) => {
    await page.goto('/')

    // Verificar que hay al menos un botón con clase focus-visible en el CSS
    const hasFocusVisible = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button, a'))
      return buttons.some(el =>
        el.className.includes('focus-visible') ||
        el.className.includes('focus:ring') ||
        el.className.includes('focus:outline')
      )
    })

    expect(hasFocusVisible).toBe(true)
  })
})

test.describe('Accesibilidad — atributos ARIA', () => {
  test('las imágenes tienen atributo alt', async ({ page }) => {
    await page.goto('/')

    const imagesWithoutAlt = await page.evaluate(() => {
      const imgs = Array.from(document.querySelectorAll('img'))
      return imgs.filter(img => !img.hasAttribute('alt')).length
    })

    expect(imagesWithoutAlt).toBe(0)
  })

  test('el Navbar tiene role="navigation" o <nav>', async ({ page }) => {
    await page.goto('/')

    const hasNav = await page.locator('nav, [role="navigation"]').count()
    expect(hasNav).toBeGreaterThan(0)
  })

  test('el contenido principal tiene <main>', async ({ page }) => {
    await page.goto('/')

    const hasMain = await page.locator('main, [role="main"]').count()
    expect(hasMain).toBeGreaterThan(0)
  })

  test('los inputs del formulario tienen labels asociados', async ({ page }) => {
    await page.goto('/contacto')

    const inputsWithoutLabel = await page.evaluate(() => {
      const inputs = Array.from(document.querySelectorAll('input:not([type="hidden"]), textarea'))
      return inputs.filter(input => {
        const id       = input.getAttribute('id')
        const hasLabel = id ? document.querySelector(`label[for="${id}"]`) !== null : false
        const hasAriaLabel = input.hasAttribute('aria-label')
        const hasAriaLabelledBy = input.hasAttribute('aria-labelledby')
        return !hasLabel && !hasAriaLabel && !hasAriaLabelledBy
      }).length
    })

    expect(inputsWithoutLabel).toBe(0)
  })
})
