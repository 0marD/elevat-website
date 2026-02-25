import { describe, it, expect } from 'vitest'
import { DestinoSchema } from '@/lib/validations/destino'

const baseDestino = {
  nombre:          'Los Cabos',
  pais:            'México',
  tipo:            'Playa de lujo',
  descripcion:     'Paraíso en el extremo de Baja California Sur, donde el desierto se encuentra con el mar.',
  imagenPrincipal: 'https://images.unsplash.com/photo-123',
  etiquetas:       ['Playa', 'Lujo', 'Snorkel'],
  activo:          true,
}

describe('DestinoSchema', () => {
  it('acepta destino válido', () => {
    const result = DestinoSchema.safeParse(baseDestino)
    expect(result.success).toBe(true)
  })

  it('rechaza imagenPrincipal que no sea URL', () => {
    const result = DestinoSchema.safeParse({ ...baseDestino, imagenPrincipal: 'foto.jpg' })
    expect(result.success).toBe(false)
  })

  it('rechaza etiquetas vacías', () => {
    const result = DestinoSchema.safeParse({ ...baseDestino, etiquetas: [] })
    expect(result.success).toBe(false)
  })

  it('rechaza más de 6 etiquetas', () => {
    const result = DestinoSchema.safeParse({
      ...baseDestino,
      etiquetas: ['a', 'b', 'c', 'd', 'e', 'f', 'g'],
    })
    expect(result.success).toBe(false)
  })

  it('acepta exactamente 6 etiquetas', () => {
    const result = DestinoSchema.safeParse({
      ...baseDestino,
      etiquetas: ['a', 'b', 'c', 'd', 'e', 'f'],
    })
    expect(result.success).toBe(true)
  })

  it('rechaza nombre menor a 2 caracteres', () => {
    const result = DestinoSchema.safeParse({ ...baseDestino, nombre: 'X' })
    expect(result.success).toBe(false)
  })

  it('rechaza descripcion menor a 20 caracteres', () => {
    const result = DestinoSchema.safeParse({ ...baseDestino, descripcion: 'Muy corta.' })
    expect(result.success).toBe(false)
  })

  it('activo tiene default true cuando se omite', () => {
    const { activo: _, ...withoutActivo } = baseDestino
    const result = DestinoSchema.safeParse(withoutActivo)
    expect(result.success).toBe(true)
    if (result.success) expect(result.data.activo).toBe(true)
  })
})
