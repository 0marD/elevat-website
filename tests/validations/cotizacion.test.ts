import { describe, it, expect } from 'vitest'
import { CotizacionSchema } from '@/lib/validations/cotizacion'

const baseInput = {
  nombre:       'María García',
  email:        'maria@example.com',
  whatsapp:     '3337084290',
  tipo_viaje:   'Vacacional / placer',
  destino:      'Italia',
  adultos:      '2',
  ninos:        '0',
  categoria:    'Premium ★★★★',
  intereses:    ['Gastronomía', 'Cultura e historia'],
}

describe('CotizacionSchema', () => {
  it('acepta datos mínimos válidos', () => {
    const result = CotizacionSchema.safeParse(baseInput)
    expect(result.success).toBe(true)
  })

  it('rechaza nombre menor a 2 caracteres', () => {
    const result = CotizacionSchema.safeParse({ ...baseInput, nombre: 'A' })
    expect(result.success).toBe(false)
    expect(result.error?.flatten().fieldErrors.nombre).toBeDefined()
  })

  it('rechaza email inválido', () => {
    const result = CotizacionSchema.safeParse({ ...baseInput, email: 'no-es-email' })
    expect(result.success).toBe(false)
  })

  it('rechaza whatsapp menor a 7 caracteres', () => {
    const result = CotizacionSchema.safeParse({ ...baseInput, whatsapp: '123' })
    expect(result.success).toBe(false)
  })

  it('rechaza tipo_viaje vacío', () => {
    const result = CotizacionSchema.safeParse({ ...baseInput, tipo_viaje: '' })
    expect(result.success).toBe(false)
  })

  it('rechaza destino menor a 2 caracteres', () => {
    const result = CotizacionSchema.safeParse({ ...baseInput, destino: 'X' })
    expect(result.success).toBe(false)
  })

  it('acepta campos opcionales omitidos con defaults', () => {
    const result = CotizacionSchema.safeParse(baseInput)
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.fecha_salida).toBe('')
      expect(result.data.presupuesto).toBe('')
      expect(result.data.mensaje).toBe('')
    }
  })

  it('rechaza mensaje mayor a 1000 caracteres', () => {
    const result = CotizacionSchema.safeParse({ ...baseInput, mensaje: 'a'.repeat(1001) })
    expect(result.success).toBe(false)
  })
})
