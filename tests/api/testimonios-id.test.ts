import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'
import { getServerSession } from 'next-auth'

vi.mock('next-auth',   () => ({ getServerSession: vi.fn() }))
vi.mock('@/lib/auth', () => ({ authOptions: {} }))
vi.mock('@/lib/data/testimonios-store', () => ({
  getAll:     vi.fn(),
  getById:    vi.fn(),
  setVisible: vi.fn(),
  update:     vi.fn(),
  remove:     vi.fn(),
  serialize:  vi.fn((t) => ({ ...t, creadoEn: '2024-01-01T00:00:00.000Z' })),
}))

import { GET, PUT, DELETE } from '@/app/api/testimonios/[id]/route'
import { getById, setVisible, update, remove } from '@/lib/data/testimonios-store'

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

const withSession = () =>
  vi.mocked(getServerSession).mockResolvedValue({ user: { email: 'admin@test.com' } } as never)
const noSession = () =>
  vi.mocked(getServerSession).mockResolvedValue(null)
const ctx = (id: string) => ({ params: Promise.resolve({ id }) })

function makeRequest(method: string, body?: unknown) {
  return new NextRequest('http://localhost/api/testimonios/uuid-t1', {
    method,
    ...(body
      ? { body: JSON.stringify(body), headers: { 'Content-Type': 'application/json' } }
      : {}),
  })
}

beforeEach(() => { vi.clearAllMocks() })

describe('GET /api/testimonios/[id]', () => {
  it('retorna el testimonio cuando existe', async () => {
    vi.mocked(getById).mockResolvedValue(mockTestimonio)

    const res  = await GET(makeRequest('GET'), ctx('uuid-t1'))
    const data = await res.json()

    expect(res.status).toBe(200)
    expect(data.nombre).toBe(mockTestimonio.nombre)
    expect(getById).toHaveBeenCalledWith('uuid-t1')
  })

  it('retorna 404 cuando no existe', async () => {
    vi.mocked(getById).mockResolvedValue(null)

    const res = await GET(makeRequest('GET'), ctx('no-existe'))
    expect(res.status).toBe(404)
  })
})

describe('PUT /api/testimonios/[id]', () => {
  it('retorna 401 sin sesión', async () => {
    noSession()
    const res = await PUT(makeRequest('PUT', { visible: false }), ctx('uuid-t1'))
    expect(res.status).toBe(401)
  })

  it('oculta el testimonio (visible: false)', async () => {
    withSession()
    vi.mocked(setVisible).mockResolvedValue({ ...mockTestimonio, visible: false })

    const res  = await PUT(makeRequest('PUT', { visible: false }), ctx('uuid-t1'))
    const data = await res.json()

    expect(res.status).toBe(200)
    expect(data.visible).toBe(false)
    expect(setVisible).toHaveBeenCalledWith('uuid-t1', false)
  })

  it('muestra el testimonio (visible: true)', async () => {
    withSession()
    vi.mocked(setVisible).mockResolvedValue({ ...mockTestimonio, visible: true })

    const res  = await PUT(makeRequest('PUT', { visible: true }), ctx('uuid-t1'))
    const data = await res.json()

    expect(res.status).toBe(200)
    expect(data.visible).toBe(true)
  })

  it('retorna 422 cuando el body no es un toggle y falla la validación completa', async () => {
    withSession()
    const res = await PUT(makeRequest('PUT', { otro: 'campo' }), ctx('uuid-t1'))
    expect(res.status).toBe(422)
  })

  it('retorna 400 cuando visible no es booleano', async () => {
    withSession()
    const res = await PUT(makeRequest('PUT', { visible: 'si' }), ctx('uuid-t1'))
    expect(res.status).toBe(400)
  })

  it('retorna 404 cuando el testimonio no existe', async () => {
    withSession()
    vi.mocked(setVisible).mockResolvedValue(null)

    const res = await PUT(makeRequest('PUT', { visible: false }), ctx('no-existe'))
    expect(res.status).toBe(404)
  })
})

describe('DELETE /api/testimonios/[id]', () => {
  it('retorna 401 sin sesión', async () => {
    noSession()
    const res = await DELETE(makeRequest('DELETE'), ctx('uuid-t1'))
    expect(res.status).toBe(401)
  })

  it('elimina el testimonio y retorna ok: true', async () => {
    withSession()
    vi.mocked(remove).mockResolvedValue(true)

    const res  = await DELETE(makeRequest('DELETE'), ctx('uuid-t1'))
    const data = await res.json()

    expect(res.status).toBe(200)
    expect(data.ok).toBe(true)
    expect(remove).toHaveBeenCalledWith('uuid-t1')
  })

  it('retorna 404 cuando el testimonio no existe', async () => {
    withSession()
    vi.mocked(remove).mockResolvedValue(false)

    const res = await DELETE(makeRequest('DELETE'), ctx('no-existe'))
    expect(res.status).toBe(404)
  })
})
