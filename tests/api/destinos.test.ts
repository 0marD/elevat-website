import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'
import { getServerSession } from 'next-auth'

vi.mock('next-auth',   () => ({ getServerSession: vi.fn() }))
vi.mock('@/lib/auth', () => ({ authOptions: {} }))
vi.mock('@/lib/data/destinos-store', () => ({
  getAll:     vi.fn(),
  getActivos: vi.fn(),
  create:     vi.fn(),
  serialize:  vi.fn((d) => ({ ...d, creadoEn: '2024-01-01T00:00:00.000Z' })),
}))

import { GET, POST } from '@/app/api/destinos/route'
import { getAll, getActivos, create } from '@/lib/data/destinos-store'

const mockDestino = {
  id:              'uuid-d1',
  nombre:          'Los Cabos',
  slug:            'los-cabos',
  pais:            'México',
  tipo:            'Playa de lujo',
  descripcion:     'Paraíso donde el desierto se encuentra con el mar de Cortés.',
  imagenPrincipal: 'https://example.com/cabos.jpg',
  etiquetas:       ['Playa', 'Lujo'],
  activo:          true,
  creadoEn:        new Date('2024-01-01'),
}

const validDestinoBody = {
  nombre:          mockDestino.nombre,
  pais:            mockDestino.pais,
  tipo:            mockDestino.tipo,
  descripcion:     mockDestino.descripcion,
  imagenPrincipal: mockDestino.imagenPrincipal,
  etiquetas:       mockDestino.etiquetas,
  activo:          true,
}

const withSession = () =>
  vi.mocked(getServerSession).mockResolvedValue({ user: { email: 'admin@test.com' } } as never)
const noSession = () =>
  vi.mocked(getServerSession).mockResolvedValue(null)

function makeGet(params?: Record<string, string>) {
  const url = new URL('http://localhost/api/destinos')
  if (params) Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v))
  return new NextRequest(url)
}

function makePost(body: unknown) {
  return new NextRequest('http://localhost/api/destinos', {
    method:  'POST',
    body:    JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
  })
}

beforeEach(() => { vi.clearAllMocks() })

describe('GET /api/destinos', () => {
  it('retorna solo destinos activos en la vista pública', async () => {
    vi.mocked(getActivos).mockResolvedValue([mockDestino])

    const res  = await GET(makeGet())
    const data = await res.json()

    expect(res.status).toBe(200)
    expect(data).toHaveLength(1)
    expect(getActivos).toHaveBeenCalledOnce()
    expect(getAll).not.toHaveBeenCalled()
  })

  it('retorna 401 cuando ?all=1 sin sesión', async () => {
    noSession()
    const res = await GET(makeGet({ all: '1' }))
    expect(res.status).toBe(401)
  })

  it('retorna todos los destinos cuando ?all=1 con sesión', async () => {
    withSession()
    vi.mocked(getAll).mockResolvedValue([mockDestino, { ...mockDestino, id: 'uuid-d2', activo: false }])

    const res  = await GET(makeGet({ all: '1' }))
    const data = await res.json()

    expect(res.status).toBe(200)
    expect(data).toHaveLength(2)
    expect(getAll).toHaveBeenCalledOnce()
  })
})

describe('POST /api/destinos', () => {
  it('retorna 401 sin sesión', async () => {
    noSession()
    const res = await POST(makePost(validDestinoBody))
    expect(res.status).toBe(401)
  })

  it('crea el destino y retorna 201', async () => {
    withSession()
    vi.mocked(create).mockResolvedValue(mockDestino)

    const res  = await POST(makePost(validDestinoBody))
    const data = await res.json()

    expect(res.status).toBe(201)
    expect(data.nombre).toBe(mockDestino.nombre)
    expect(create).toHaveBeenCalledOnce()
  })

  it('retorna 422 cuando el schema falla', async () => {
    withSession()
    const res  = await POST(makePost({ nombre: 'Sin campos requeridos' }))
    const data = await res.json()

    expect(res.status).toBe(422)
    expect(data.issues).toBeDefined()
  })

  it('retorna 400 con body inválido', async () => {
    withSession()
    const req = new NextRequest('http://localhost/api/destinos', {
      method:  'POST',
      body:    'invalido{{',
      headers: { 'Content-Type': 'application/json' },
    })
    const res = await POST(req)
    expect(res.status).toBe(400)
  })
})
