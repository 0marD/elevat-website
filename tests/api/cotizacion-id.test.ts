import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'
import { getServerSession } from 'next-auth'

vi.mock('next-auth',    () => ({ getServerSession: vi.fn() }))
vi.mock('@/lib/auth',  () => ({ authOptions: {} }))
vi.mock('@/lib/data/cotizaciones-store', () => ({
  setEstado: vi.fn(),
  remove:    vi.fn(),
  serialize: vi.fn((c) => ({ ...c, creadoEn: '2024-01-01T00:00:00.000Z' })),
}))

import { PATCH, DELETE } from '@/app/api/cotizacion/[id]/route'
import { setEstado, remove } from '@/lib/data/cotizaciones-store'

const mockCotizacion = {
  id:         'uuid-c1',
  nombre:     'Ana García',
  email:      'ana@example.com',
  whatsapp:   '3337084290',
  tipo_viaje: 'Luna de miel',
  destino:    'Maldivas',
  adultos:    '2',
  ninos:      '0',
  categoria:  'Lujo ★★★★★',
  intereses:  ['Playa y relax'],
  estado:     'pendiente' as const,
  creadoEn:   new Date('2024-01-01'),
}

const withSession = () =>
  vi.mocked(getServerSession).mockResolvedValue({ user: { email: 'admin@test.com' } } as never)
const noSession = () =>
  vi.mocked(getServerSession).mockResolvedValue(null)
const ctx = (id: string) => ({ params: Promise.resolve({ id }) })

function makeRequest(method: string, body?: unknown) {
  return new NextRequest('http://localhost/api/cotizacion/uuid-c1', {
    method,
    ...(body
      ? { body: JSON.stringify(body), headers: { 'Content-Type': 'application/json' } }
      : {}),
  })
}

beforeEach(() => { vi.clearAllMocks() })

describe('PATCH /api/cotizacion/[id]', () => {
  it('retorna 401 sin sesión', async () => {
    noSession()
    const res = await PATCH(makeRequest('PATCH', { estado: 'atendida' }), ctx('uuid-c1'))
    expect(res.status).toBe(401)
  })

  it('cambia el estado a atendida', async () => {
    withSession()
    vi.mocked(setEstado).mockResolvedValue({ ...mockCotizacion, estado: 'atendida' as const })

    const res  = await PATCH(makeRequest('PATCH', { estado: 'atendida' }), ctx('uuid-c1'))
    const data = await res.json()

    expect(res.status).toBe(200)
    expect(data.estado).toBe('atendida')
    expect(setEstado).toHaveBeenCalledWith('uuid-c1', 'atendida')
  })

  it('cambia el estado de vuelta a pendiente', async () => {
    withSession()
    vi.mocked(setEstado).mockResolvedValue({ ...mockCotizacion, estado: 'pendiente' as const })

    const res = await PATCH(makeRequest('PATCH', { estado: 'pendiente' }), ctx('uuid-c1'))
    expect((await res.json()).estado).toBe('pendiente')
  })

  it('retorna 400 con estado inválido', async () => {
    withSession()
    const res = await PATCH(makeRequest('PATCH', { estado: 'desconocido' }), ctx('uuid-c1'))
    expect(res.status).toBe(400)
  })

  it('retorna 404 cuando la cotización no existe', async () => {
    withSession()
    vi.mocked(setEstado).mockResolvedValue(null)

    const res = await PATCH(makeRequest('PATCH', { estado: 'atendida' }), ctx('no-existe'))
    expect(res.status).toBe(404)
  })
})

describe('DELETE /api/cotizacion/[id]', () => {
  it('retorna 401 sin sesión', async () => {
    noSession()
    const res = await DELETE(makeRequest('DELETE'), ctx('uuid-c1'))
    expect(res.status).toBe(401)
  })

  it('elimina la cotización y retorna ok: true', async () => {
    withSession()
    vi.mocked(remove).mockResolvedValue(true)

    const res  = await DELETE(makeRequest('DELETE'), ctx('uuid-c1'))
    const data = await res.json()

    expect(res.status).toBe(200)
    expect(data.ok).toBe(true)
    expect(remove).toHaveBeenCalledWith('uuid-c1')
  })

  it('retorna 404 cuando la cotización no existe', async () => {
    withSession()
    vi.mocked(remove).mockResolvedValue(false)

    const res = await DELETE(makeRequest('DELETE'), ctx('no-existe'))
    expect(res.status).toBe(404)
  })
})
