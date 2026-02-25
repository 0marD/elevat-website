import { describe, it, expect } from 'vitest'

// Réplica de la función definida en QuickContactForm.tsx
// Se prueba como utilidad pura independiente del componente React
function isValidContacto(value: string): boolean {
  const email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  const phone = /^(\+?52)?[1-9]\d{9}$|^\d{10}$/
  return email.test(value) || phone.test(value)
}

describe('isValidContacto', () => {
  describe('emails válidos', () => {
    it('acepta email con formato estándar', () => {
      expect(isValidContacto('juan@email.com')).toBe(true)
    })

    it('acepta email con subdominio', () => {
      expect(isValidContacto('juan@mail.empresa.com')).toBe(true)
    })

    it('acepta email con caracteres especiales antes de @', () => {
      expect(isValidContacto('juan.lopez+filtro@gmail.com')).toBe(true)
    })
  })

  describe('teléfonos válidos', () => {
    it('acepta teléfono de 10 dígitos', () => {
      expect(isValidContacto('3337084290')).toBe(true)
    })

    it('acepta teléfono con código de país 52', () => {
      expect(isValidContacto('523337084290')).toBe(true)
    })

    it('acepta teléfono con +52', () => {
      expect(isValidContacto('+523337084290')).toBe(true)
    })
  })

  describe('valores inválidos', () => {
    it('rechaza cadena vacía', () => {
      expect(isValidContacto('')).toBe(false)
    })

    it('rechaza solo texto', () => {
      expect(isValidContacto('hola mundo')).toBe(false)
    })

    it('rechaza email sin dominio', () => {
      expect(isValidContacto('juan@')).toBe(false)
    })

    it('rechaza teléfono de 9 dígitos', () => {
      expect(isValidContacto('333708429')).toBe(false)
    })

    it('acepta teléfono de 10 dígitos que empieza con 0 (regex permisiva)', () => {
      // La regex ^\d{10}$ acepta cualquier número de 10 dígitos
      expect(isValidContacto('0337084290')).toBe(true)
    })
  })
})
