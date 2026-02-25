import { describe, it, expect } from 'vitest'
import { TestimonioSchema } from '@/lib/validations/testimonio'

const baseTestimonio = {
  nombre:      'Ana Martínez',
  ciudad:      'Guadalajara',
  viaje:       'Luna de miel en Italia',
  texto:       'ÉLEVA superó todas nuestras expectativas. Cada detalle fue perfecto, desde el hotel en Florencia hasta la mesa reservada con vista al Duomo.',
  calificacion: 5,
}

describe('TestimonioSchema', () => {
  it('acepta testimonio válido', () => {
    const result = TestimonioSchema.safeParse(baseTestimonio)
    expect(result.success).toBe(true)
  })

  it('rechaza nombre menor a 2 caracteres', () => {
    const result = TestimonioSchema.safeParse({ ...baseTestimonio, nombre: 'A' })
    expect(result.success).toBe(false)
  })

  it('rechaza ciudad menor a 2 caracteres', () => {
    const result = TestimonioSchema.safeParse({ ...baseTestimonio, ciudad: 'X' })
    expect(result.success).toBe(false)
  })

  it('rechaza texto menor a 20 caracteres', () => {
    const result = TestimonioSchema.safeParse({ ...baseTestimonio, texto: 'Muy bueno.' })
    expect(result.success).toBe(false)
  })

  it('rechaza calificacion menor a 1', () => {
    const result = TestimonioSchema.safeParse({ ...baseTestimonio, calificacion: 0 })
    expect(result.success).toBe(false)
  })

  it('rechaza calificacion mayor a 5', () => {
    const result = TestimonioSchema.safeParse({ ...baseTestimonio, calificacion: 6 })
    expect(result.success).toBe(false)
  })

  it('rechaza calificacion decimal', () => {
    const result = TestimonioSchema.safeParse({ ...baseTestimonio, calificacion: 4.5 })
    expect(result.success).toBe(false)
  })

  it('acepta todas las calificaciones del 1 al 5', () => {
    for (let i = 1; i <= 5; i++) {
      const result = TestimonioSchema.safeParse({ ...baseTestimonio, calificacion: i })
      expect(result.success).toBe(true)
    }
  })
})
