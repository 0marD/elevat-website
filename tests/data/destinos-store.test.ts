import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/lib/db', () => ({
  prisma: {
    destino: {
      findMany:  vi.fn(),
      findUnique: vi.fn(),
      create:    vi.fn(),
      update:    vi.fn(),
      delete:    vi.fn(),
    },
  },
}))

import { prisma } from '@/lib/db'
import { getAll, getActivos, getBySlug, create, update, setActivo, remove, serialize } from '@/lib/data/destinos-store'
import type { Destino } from '@/types/destino'

const mockDestino: Destino = {
  id:              'uuid-d1',
  nombre:          'Los Cabos',
  slug:            'los-cabos',
  pais:            'México',
  tipo:            'Playa de lujo',
  descripcion:     'Paraíso donde el desierto se encuentra con el mar de Cortés.',
  imagenPrincipal: 'https://example.com/cabos.jpg',
  etiquetas:       ['Playa', 'Lujo'],
  activo:          true,
  creadoEn:        new Date('2024-01-15'),
}

beforeEach(() => {
  vi.clearAllMocks()
})

describe('serialize', () => {
  it('convierte creadoEn Date a string ISO', () => {
    const s = serialize(mockDestino)
    expect(typeof s.creadoEn).toBe('string')
    expect(s.nombre).toBe(mockDestino.nombre)
  })
})

describe('getAll', () => {
  it('retorna todos los destinos ordenados por fecha DESC', async () => {
    vi.mocked(prisma.destino.findMany).mockResolvedValue([mockDestino])
    const result = await getAll()
    expect(result).toHaveLength(1)
    expect(prisma.destino.findMany).toHaveBeenCalledWith({ orderBy: { creadoEn: 'desc' } })
  })
})

describe('getActivos', () => {
  it('filtra solo destinos activos', async () => {
    vi.mocked(prisma.destino.findMany).mockResolvedValue([mockDestino])
    await getActivos()
    expect(prisma.destino.findMany).toHaveBeenCalledWith({
      where:   { activo: true },
      orderBy: { creadoEn: 'asc' },
    })
  })
})

describe('getBySlug', () => {
  it('retorna destino cuando existe', async () => {
    vi.mocked(prisma.destino.findUnique).mockResolvedValue(mockDestino)
    const result = await getBySlug('los-cabos')
    expect(result).toEqual(mockDestino)
  })

  it('retorna null cuando no existe', async () => {
    vi.mocked(prisma.destino.findUnique).mockResolvedValue(null)
    const result = await getBySlug('no-existe')
    expect(result).toBeNull()
  })
})

describe('create', () => {
  it('genera un slug único a partir del nombre', async () => {
    vi.mocked(prisma.destino.findUnique).mockResolvedValue(null) // slug disponible
    vi.mocked(prisma.destino.create).mockResolvedValue(mockDestino)

    const input = {
      nombre:          mockDestino.nombre,
      pais:            mockDestino.pais,
      tipo:            mockDestino.tipo,
      descripcion:     mockDestino.descripcion,
      imagenPrincipal: mockDestino.imagenPrincipal,
      etiquetas:       mockDestino.etiquetas,
      activo:          true,
    }

    const result = await create(input)
    expect(result).toEqual(mockDestino)
    expect(prisma.destino.create).toHaveBeenCalledOnce()
  })
})

describe('setActivo', () => {
  it('desactiva un destino', async () => {
    vi.mocked(prisma.destino.update).mockResolvedValue({ ...mockDestino, activo: false })
    const result = await setActivo('uuid-d1', false)
    expect(result?.activo).toBe(false)
  })

  it('retorna null si no existe', async () => {
    vi.mocked(prisma.destino.update).mockRejectedValue(new Error('not found'))
    const result = await setActivo('no-existe', true)
    expect(result).toBeNull()
  })
})

describe('remove', () => {
  it('retorna true al eliminar', async () => {
    vi.mocked(prisma.destino.delete).mockResolvedValue(mockDestino)
    expect(await remove('uuid-d1')).toBe(true)
  })

  it('retorna false si no existe', async () => {
    vi.mocked(prisma.destino.delete).mockRejectedValue(new Error('not found'))
    expect(await remove('no-existe')).toBe(false)
  })
})
