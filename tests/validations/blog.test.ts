import { describe, it, expect } from 'vitest'
import { BlogPostSchema } from '@/lib/validations/blog'

const basePost = {
  titulo:    'Guía completa de Japón para viajeros de lujo',
  extracto:  'Todo lo que necesitas saber para vivir Japón como un experto.',
  contenido: 'El viaje a Japón comienza mucho antes de abordar el avión. La preparación, el itinerario y los contactos correctos son la diferencia entre un viaje ordinario y uno extraordinario.',
  categoria: 'Destinos',
  publicado: false,
}

describe('BlogPostSchema', () => {
  it('acepta post válido', () => {
    const result = BlogPostSchema.safeParse(basePost)
    expect(result.success).toBe(true)
  })

  it('acepta post con imagenPortada como URL válida', () => {
    const result = BlogPostSchema.safeParse({
      ...basePost,
      imagenPortada: 'https://images.unsplash.com/photo-123',
    })
    expect(result.success).toBe(true)
  })

  it('rechaza imagenPortada que no sea URL', () => {
    const result = BlogPostSchema.safeParse({ ...basePost, imagenPortada: 'no-es-url' })
    expect(result.success).toBe(false)
  })

  it('rechaza titulo menor a 5 caracteres', () => {
    const result = BlogPostSchema.safeParse({ ...basePost, titulo: 'Guí' })
    expect(result.success).toBe(false)
  })

  it('rechaza extracto menor a 20 caracteres', () => {
    const result = BlogPostSchema.safeParse({ ...basePost, extracto: 'Muy corto.' })
    expect(result.success).toBe(false)
  })

  it('rechaza contenido menor a 50 caracteres', () => {
    const result = BlogPostSchema.safeParse({ ...basePost, contenido: 'Poco contenido.' })
    expect(result.success).toBe(false)
  })

  it('publicado tiene default false cuando se omite', () => {
    const { publicado: _, ...withoutPublicado } = basePost
    const result = BlogPostSchema.safeParse(withoutPublicado)
    expect(result.success).toBe(true)
    if (result.success) expect(result.data.publicado).toBe(false)
  })
})
