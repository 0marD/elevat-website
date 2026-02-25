import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'
import { getServerSession } from 'next-auth'

vi.mock('next-auth',   () => ({ getServerSession: vi.fn() }))
vi.mock('@/lib/auth', () => ({ authOptions: {} }))
vi.mock('@/lib/data/destinos-store', () => ({
  getAll:    vi.fn(),
  setActivo: vi.fn(),
  update:    vi.fn(),
  remove:    vi.fn(),
  serialize: vi.fn((d) => ({ ...d, creadoEn: '2024-01-01T00:00:00.000Z' })),
}))

import { GET, PUT, DELETE } from '@/app/api/destinos/[id]/route'
import { getAll, setActivo, update, remove } from '@/lib/data/destinos-store'

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

const validUpdateBody = {
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
const ctx = (id: string) => ({ params: Promise.resolve({ id }) })

function makeRequest(method: string, body?: unknown) {
  return new NextRequest('http://localhost/api/destinos/uuid-d1', {
    method,
    ...(body
      ? { body: JSON.stringify(body), headers: { 'Content-Type': 'application/json' } }
      : {}),
  })
}

beforeEach(() => { vi.clearAllMocks() })

describe('GET /api/destinos/[id]', () => {
  it('retorna el destino cuando existe', async () => {
    vi.mocked(getAll).mockResolvedValue([mockDestino])

    const res  = await GET(makeRequest('GET'), ctx('uuid-d1'))
    const data = await res.json()

    expect(res.status).toBe(200)
    expect(data.nombre).toBe(mockDestino.nombre)
  })

  it('retorna 404 cuando no existe', async () => {
    vi.mocked(getAll).mockResolvedValue([mockDestino])

    const res = await GET(makeRequest('GET'), ctx('no-existe'))
    expect(res.status).toBe(404)
  })
})

describe('PUT /api/destinos/[id]', () => {
  it('retorna 401 sin sesión', async () => {
    noSession()
    const res = await PUT(makeRequest('PUT', { activo: false }), ctx('uuid-d1'))
    expect(res.status).toBe(401)
  })

  it('hace toggle de activo con body { activo: boolean }', async () => {
    withSession()
    vi.mocked(setActivo).mockResolvedValue({ ...mockDestino, activo: false })

    const res  = await PUT(makeRequest('PUT', { activo: false }), ctx('uuid-d1'))
    const data = await res.json()

    expect(res.status).toBe(200)
    expect(data.activo).toBe(false)
    expect(setActivo).toHaveBeenCalledWith('uuid-d1', false)
    expect(update).not.toHaveBeenCalled()
  })

  it('retorna 404 al hacer toggle en destino inexistente', async () => {
    withSession()
    vi.mocked(setActivo).mockResolvedValue(null)

    const res = await PUT(makeRequest('PUT', { activo: false }), ctx('no-existe'))
    expect(res.status).toBe(404)
  })

  it('actualiza el destino completo con body válido', async () => {
    withSession()
    vi.mocked(update).mockResolvedValue({ ...mockDestino, nombre: 'Cancún' })

    const res = await PUT(makeRequest('PUT', validUpdateBody), ctx('uuid-d1'))
    expect(res.status).toBe(200)
    expect(update).toHaveBeenCalledWith('uuid-d1', expect.objectContaining({ nombre: validUpdateBody.nombre }))
  })

  it('retorna 422 con body inválido en actualización completa', async () => {
    withSession()
    const res = await PUT(makeRequest('PUT', { nombre: 'Sin campos requeridos' }), ctx('uuid-d1'))
    expect(res.status).toBe(422)
  })
})

describe('DELETE /api/destinos/[id]', () => {
  it('retorna 401 sin sesión', async () => {
    noSession()
    const res = await DELETE(makeRequest('DELETE'), ctx('uuid-d1'))
    expect(res.status).toBe(401)
  })

  it('elimina el destino y retorna ok: true', async () => {
    withSession()
    vi.mocked(remove).mockResolvedValue(true)

    const res  = await DELETE(makeRequest('DELETE'), ctx('uuid-d1'))
    const data = await res.json()

    expect(res.status).toBe(200)
    expect(data.ok).toBe(true)
    expect(remove).toHaveBeenCalledWith('uuid-d1')
  })

  it('retorna 404 cuando el destino no existe', async () => {
    withSession()
    vi.mocked(remove).mockResolvedValue(false)

    const res = await DELETE(makeRequest('DELETE'), ctx('no-existe'))
    expect(res.status).toBe(404)
  })
})
