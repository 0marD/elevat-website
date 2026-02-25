import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/lib/db', () => ({
  prisma: {
    testimonio: {
      findMany:  vi.fn(),
      findFirst: vi.fn(),
      create:    vi.fn(),
      update:    vi.fn(),
      delete:    vi.fn(),
    },
  },
}))

import { prisma } from '@/lib/db'
import { getAll, getVisible, create, setVisible, remove, serialize } from '@/lib/data/testimonios-store'
import type { Testimonio } from '@/types/testimonio'

const mockTestimonio: Testimonio = {
  id:          'uuid-t1',
  nombre:      'Laura Pérez',
  ciudad:      'Monterrey',
  viaje:       'Toscana con ÉLEVA',
  texto:       'Una experiencia incomparable. Cada detalle fue perfectamente curado para nosotros.',
  calificacion: 5,
  visible:     true,
  orden:       1,
  creadoEn:    new Date('2024-03-01'),
}

beforeEach(() => {
  vi.clearAllMocks()
})

describe('serialize', () => {
  it('convierte creadoEn Date a string ISO', () => {
    const s = serialize(mockTestimonio)
    expect(typeof s.creadoEn).toBe('string')
    expect(s.nombre).toBe(mockTestimonio.nombre)
  })
})

describe('getAll', () => {
  it('retorna todos los testimonios ordenados por orden ASC', async () => {
    vi.mocked(prisma.testimonio.findMany).mockResolvedValue([mockTestimonio])
    const result = await getAll()
    expect(result).toHaveLength(1)
    expect(prisma.testimonio.findMany).toHaveBeenCalledWith({ orderBy: { orden: 'asc' } })
  })
})

describe('getVisible', () => {
  it('filtra solo testimonios visibles', async () => {
    vi.mocked(prisma.testimonio.findMany).mockResolvedValue([mockTestimonio])
    await getVisible()
    expect(prisma.testimonio.findMany).toHaveBeenCalledWith({
      where:   { visible: true },
      orderBy: { orden: 'asc' },
    })
  })
})

describe('create', () => {
  it('calcula el siguiente orden correctamente', async () => {
    vi.mocked(prisma.testimonio.findFirst).mockResolvedValue({ orden: 5 } as Testimonio)
    vi.mocked(prisma.testimonio.create).mockResolvedValue({ ...mockTestimonio, orden: 6 })

    const input = {
      nombre:      mockTestimonio.nombre,
      ciudad:      mockTestimonio.ciudad,
      viaje:       mockTestimonio.viaje,
      texto:       mockTestimonio.texto,
      calificacion: mockTestimonio.calificacion,
    }

    const result = await create(input)
    expect(result.orden).toBe(6)
  })

  it('asigna orden 1 cuando no hay testimonios previos', async () => {
    vi.mocked(prisma.testimonio.findFirst).mockResolvedValue(null)
    vi.mocked(prisma.testimonio.create).mockResolvedValue({ ...mockTestimonio, orden: 1 })

    const input = {
      nombre:      'Nuevo',
      ciudad:      'Ciudad',
      viaje:       'Viaje largo',
      texto:       'Experiencia realmente increíble con muchos detalles.',
      calificacion: 4,
    }

    const result = await create(input)
    expect(result.orden).toBe(1)
  })
})

describe('setVisible', () => {
  it('oculta un testimonio', async () => {
    vi.mocked(prisma.testimonio.update).mockResolvedValue({ ...mockTestimonio, visible: false })
    const result = await setVisible('uuid-t1', false)
    expect(result?.visible).toBe(false)
  })

  it('retorna null si no existe', async () => {
    vi.mocked(prisma.testimonio.update).mockRejectedValue(new Error('not found'))
    const result = await setVisible('no-existe', true)
    expect(result).toBeNull()
  })
})

describe('remove', () => {
  it('retorna true al eliminar exitosamente', async () => {
    vi.mocked(prisma.testimonio.delete).mockResolvedValue(mockTestimonio)
    expect(await remove('uuid-t1')).toBe(true)
  })

  it('retorna false si no existe', async () => {
    vi.mocked(prisma.testimonio.delete).mockRejectedValue(new Error('not found'))
    expect(await remove('no-existe')).toBe(false)
  })
})
