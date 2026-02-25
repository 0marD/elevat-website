import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'
import { getServerSession } from 'next-auth'

vi.mock('next-auth',   () => ({ getServerSession: vi.fn() }))
vi.mock('@/lib/auth', () => ({ authOptions: {} }))
vi.mock('@/lib/data/testimonios-store', () => ({
  getAll:     vi.fn(),
  getVisible: vi.fn(),
  create:     vi.fn(),
  serialize:  vi.fn((t) => ({ ...t, creadoEn: '2024-01-01T00:00:00.000Z' })),
}))

import { GET, POST } from '@/app/api/testimonios/route'
import { getAll, getVisible, create } from '@/lib/data/testimonios-store'

const mockTestimonio = {
  id:           'uuid-t1',
  nombre:       'Laura Pérez',
  ciudad:       'Monterrey',
  viaje:        'Toscana con ÉLEVA',
  texto:        'Una experiencia incomparable. Cada detalle fue perfectamente curado.',
  calificacion: 5,
  visible:      true,
  orden:        1,
  creadoEn:     new Date('2024-03-01'),
}

const validTestimonioBody = {
  nombre:       mockTestimonio.nombre,
  ciudad:       mockTestimonio.ciudad,
  viaje:        mockTestimonio.viaje,
  texto:        mockTestimonio.texto,
  calificacion: mockTestimonio.calificacion,
}

const withSession = () =>
  vi.mocked(getServerSession).mockResolvedValue({ user: { email: 'admin@test.com' } } as never)
const noSession = () =>
  vi.mocked(getServerSession).mockResolvedValue(null)

function makeGet(params?: Record<string, string>) {
  const url = new URL('http://localhost/api/testimonios')
  if (params) Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v))
  return new NextRequest(url)
}

function makePost(body: unknown) {
  return new NextRequest('http://localhost/api/testimonios', {
    method:  'POST',
    body:    JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
  })
}

beforeEach(() => { vi.clearAllMocks() })

describe('GET /api/testimonios', () => {
  it('retorna solo testimonios visibles en la vista pública', async () => {
    vi.mocked(getVisible).mockResolvedValue([mockTestimonio])

    const res  = await GET(makeGet())
    const data = await res.json()

    expect(res.status).toBe(200)
    expect(data).toHaveLength(1)
    expect(getVisible).toHaveBeenCalledOnce()
    expect(getAll).not.toHaveBeenCalled()
  })

  it('retorna 401 cuando ?all=1 sin sesión', async () => {
    noSession()
    const res = await GET(makeGet({ all: '1' }))
    expect(res.status).toBe(401)
  })

  it('retorna todos los testimonios cuando ?all=1 con sesión', async () => {
    withSession()
    vi.mocked(getAll).mockResolvedValue([
      mockTestimonio,
      { ...mockTestimonio, id: 'uuid-t2', visible: false },
    ])

    const res  = await GET(makeGet({ all: '1' }))
    const data = await res.json()

    expect(res.status).toBe(200)
    expect(data).toHaveLength(2)
    expect(getAll).toHaveBeenCalledOnce()
  })
})

describe('POST /api/testimonios', () => {
  it('retorna 401 sin sesión', async () => {
    noSession()
    const res = await POST(makePost(validTestimonioBody))
    expect(res.status).toBe(401)
  })

  it('crea el testimonio y retorna 201', async () => {
    withSession()
    vi.mocked(create).mockResolvedValue(mockTestimonio)

    const res  = await POST(makePost(validTestimonioBody))
    const data = await res.json()

    expect(res.status).toBe(201)
    expect(data.nombre).toBe(mockTestimonio.nombre)
    expect(create).toHaveBeenCalledOnce()
  })

  it('retorna 422 cuando el schema falla', async () => {
    withSession()
    const res  = await POST(makePost({ nombre: 'Sin texto ni calificación' }))
    const data = await res.json()

    expect(res.status).toBe(422)
    expect(data.issues).toBeDefined()
  })

  it('retorna 400 con body inválido', async () => {
    withSession()
    const req = new NextRequest('http://localhost/api/testimonios', {
      method:  'POST',
      body:    'invalido{{',
      headers: { 'Content-Type': 'application/json' },
    })
    const res = await POST(req)
    expect(res.status).toBe(400)
  })
})
