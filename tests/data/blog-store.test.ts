import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock del cliente Prisma antes de importar el store
vi.mock('@/lib/db', () => ({
  prisma: {
    blogPost: {
      findMany:  vi.fn(),
      findUnique: vi.fn(),
      findFirst: vi.fn(),
      create:    vi.fn(),
      update:    vi.fn(),
      delete:    vi.fn(),
    },
  },
}))

import { prisma } from '@/lib/db'
import { getAll, getPublished, getBySlug, getById, create, update, setPublished, remove, serialize } from '@/lib/data/blog-store'
import type { BlogPost } from '@/types/blog'

const mockPost: BlogPost = {
  id:            'uuid-1',
  titulo:        'Guía de Japón',
  extracto:      'Todo sobre Japón para el viajero de lujo.',
  contenido:     'Contenido extenso sobre Japón y sus maravillas culturales.',
  slug:          'guia-de-japon',
  imagenPortada: 'https://example.com/img.jpg',
  categoria:     'Destinos',
  publicado:     true,
  creadoEn:      new Date('2024-01-01'),
  actualizadoEn: new Date('2024-01-10'),
}

beforeEach(() => {
  vi.clearAllMocks()
})

describe('serialize', () => {
  it('convierte fechas Date a strings ISO', () => {
    const serialized = serialize(mockPost)
    expect(typeof serialized.creadoEn).toBe('string')
    expect(typeof serialized.actualizadoEn).toBe('string')
    expect(serialized.titulo).toBe(mockPost.titulo)
  })
})

describe('getAll', () => {
  it('retorna todos los posts ordenados por fecha DESC', async () => {
    vi.mocked(prisma.blogPost.findMany).mockResolvedValue([mockPost])
    const result = await getAll()
    expect(result).toHaveLength(1)
    expect(prisma.blogPost.findMany).toHaveBeenCalledWith({ orderBy: { creadoEn: 'desc' } })
  })
})

describe('getPublished', () => {
  it('filtra solo posts publicados', async () => {
    vi.mocked(prisma.blogPost.findMany).mockResolvedValue([mockPost])
    const result = await getPublished()
    expect(result).toHaveLength(1)
    expect(prisma.blogPost.findMany).toHaveBeenCalledWith({
      where:   { publicado: true },
      orderBy: { creadoEn: 'desc' },
    })
  })
})

describe('getBySlug', () => {
  it('retorna el post cuando existe y está publicado', async () => {
    vi.mocked(prisma.blogPost.findFirst).mockResolvedValue(mockPost)
    const result = await getBySlug('guia-de-japon')
    expect(result).toEqual(mockPost)
  })

  it('retorna null cuando no existe', async () => {
    vi.mocked(prisma.blogPost.findFirst).mockResolvedValue(null)
    const result = await getBySlug('no-existe')
    expect(result).toBeNull()
  })
})

describe('getById', () => {
  it('retorna post por id', async () => {
    vi.mocked(prisma.blogPost.findUnique).mockResolvedValue(mockPost)
    const result = await getById('uuid-1')
    expect(result).toEqual(mockPost)
  })
})

describe('create', () => {
  it('crea un post con slug generado', async () => {
    vi.mocked(prisma.blogPost.findUnique).mockResolvedValue(null) // slug disponible
    vi.mocked(prisma.blogPost.create).mockResolvedValue(mockPost)

    const input = {
      titulo:    mockPost.titulo,
      extracto:  mockPost.extracto,
      contenido: mockPost.contenido,
      categoria: mockPost.categoria,
      publicado: mockPost.publicado,
    }

    const result = await create(input)
    expect(result).toEqual(mockPost)
    expect(prisma.blogPost.create).toHaveBeenCalledOnce()
  })
})

describe('setPublished', () => {
  it('actualiza el estado publicado', async () => {
    vi.mocked(prisma.blogPost.update).mockResolvedValue({ ...mockPost, publicado: false })
    const result = await setPublished('uuid-1', false)
    expect(result?.publicado).toBe(false)
  })

  it('retorna null si el post no existe', async () => {
    vi.mocked(prisma.blogPost.update).mockRejectedValue(new Error('not found'))
    const result = await setPublished('no-existe', true)
    expect(result).toBeNull()
  })
})

describe('remove', () => {
  it('retorna true cuando elimina exitosamente', async () => {
    vi.mocked(prisma.blogPost.delete).mockResolvedValue(mockPost)
    const result = await remove('uuid-1')
    expect(result).toBe(true)
  })

  it('retorna false si el post no existe', async () => {
    vi.mocked(prisma.blogPost.delete).mockRejectedValue(new Error('not found'))
    const result = await remove('no-existe')
    expect(result).toBe(false)
  })
})
