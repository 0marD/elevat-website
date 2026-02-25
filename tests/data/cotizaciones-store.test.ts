import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/lib/db', () => ({
  prisma: {
    cotizacion: {
      findMany:  vi.fn(),
      findUnique: vi.fn(),
      create:    vi.fn(),
      update:    vi.fn(),
      delete:    vi.fn(),
    },
  },
}))

import { prisma } from '@/lib/db'
import { getAll, getById, create, setEstado, remove, serialize } from '@/lib/data/cotizaciones-store'
import type { Cotizacion } from '@/types/cotizacion'

const mockCotizacion: Cotizacion = {
  id:           'uuid-c1',
  nombre:       'Carlos López',
  email:        'carlos@example.com',
  whatsapp:     '3337084290',
  tipo_viaje:   'Luna de miel',
  destino:      'Bali',
  fecha_salida: '2024-12-01',
  fecha_regreso: '2024-12-15',
  adultos:      '2',
  ninos:        '0',
  presupuesto:  '80000-150000',
  categoria:    'Lujo ★★★★★',
  intereses:    ['Playa y relax', 'Gastronomía'],
  mensaje:      'Queremos algo especial para nuestra luna de miel.',
  estado:       'pendiente',
  creadoEn:     new Date('2024-11-01'),
}

beforeEach(() => {
  vi.clearAllMocks()
})

describe('serialize', () => {
  it('convierte creadoEn Date a string ISO', () => {
    const s = serialize(mockCotizacion)
    expect(typeof s.creadoEn).toBe('string')
    expect(s.estado).toBe('pendiente')
  })
})

describe('getAll', () => {
  it('retorna cotizaciones ordenadas por fecha DESC', async () => {
    vi.mocked(prisma.cotizacion.findMany).mockResolvedValue([mockCotizacion])
    const result = await getAll()
    expect(result).toHaveLength(1)
    expect(result[0].estado).toBe('pendiente')
  })
})

describe('getById', () => {
  it('retorna la cotización cuando existe', async () => {
    vi.mocked(prisma.cotizacion.findUnique).mockResolvedValue(mockCotizacion)
    const result = await getById('uuid-c1')
    expect(result).toEqual(mockCotizacion)
  })

  it('retorna null cuando no existe', async () => {
    vi.mocked(prisma.cotizacion.findUnique).mockResolvedValue(null)
    const result = await getById('no-existe')
    expect(result).toBeNull()
  })
})

describe('create', () => {
  it('crea una cotización con estado pendiente por defecto', async () => {
    vi.mocked(prisma.cotizacion.create).mockResolvedValue(mockCotizacion)

    const input = {
      nombre:     mockCotizacion.nombre,
      email:      mockCotizacion.email,
      whatsapp:   mockCotizacion.whatsapp,
      tipo_viaje: mockCotizacion.tipo_viaje,
      destino:    mockCotizacion.destino,
      adultos:    mockCotizacion.adultos,
      ninos:      mockCotizacion.ninos,
      categoria:  mockCotizacion.categoria,
      intereses:  mockCotizacion.intereses,
    }

    const result = await create(input)
    expect(result.estado).toBe('pendiente')
  })
})

describe('setEstado', () => {
  it('cambia estado a atendida', async () => {
    vi.mocked(prisma.cotizacion.update).mockResolvedValue({ ...mockCotizacion, estado: 'atendida' })
    const result = await setEstado('uuid-c1', 'atendida')
    expect(result?.estado).toBe('atendida')
  })

  it('retorna null si no existe', async () => {
    vi.mocked(prisma.cotizacion.update).mockRejectedValue(new Error('not found'))
    const result = await setEstado('no-existe', 'atendida')
    expect(result).toBeNull()
  })
})

describe('remove', () => {
  it('retorna true al eliminar', async () => {
    vi.mocked(prisma.cotizacion.delete).mockResolvedValue(mockCotizacion)
    expect(await remove('uuid-c1')).toBe(true)
  })

  it('retorna false si no existe', async () => {
    vi.mocked(prisma.cotizacion.delete).mockRejectedValue(new Error('not found'))
    expect(await remove('no-existe')).toBe(false)
  })
})
