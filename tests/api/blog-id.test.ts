import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'
import { getServerSession } from 'next-auth'

vi.mock('next-auth',   () => ({ getServerSession: vi.fn() }))
vi.mock('@/lib/auth', () => ({ authOptions: {} }))
vi.mock('@/lib/data/blog-store', () => ({
  getById:      vi.fn(),
  update:       vi.fn(),
  setPublished: vi.fn(),
  remove:       vi.fn(),
  serialize:    vi.fn((p) => ({
    ...p,
    creadoEn:      '2024-01-01T00:00:00.000Z',
    actualizadoEn: '2024-01-01T00:00:00.000Z',
  })),
}))

import { GET, PUT, DELETE } from '@/app/api/blog/[id]/route'
import { getById, update, setPublished, remove } from '@/lib/data/blog-store'

const mockPost = {
  id:            'uuid-b1',
  titulo:        'Guía de Japón',
  extracto:      'Todo sobre Japón para el viajero de lujo.',
  contenido:     'Contenido extenso sobre Japón y sus maravillas culturales.',
  slug:          'guia-de-japon',
  imagenPortada: 'https://example.com/img.jpg',
  categoria:     'Guías de destino',
  publicado:     true,
  creadoEn:      new Date('2024-01-01'),
  actualizadoEn: new Date('2024-01-01'),
}

const validUpdateBody = {
  titulo:    mockPost.titulo,
  extracto:  mockPost.extracto,
  contenido: mockPost.contenido,
  categoria: mockPost.categoria,
  publicado: mockPost.publicado,
}

const withSession = () =>
  vi.mocked(getServerSession).mockResolvedValue({ user: { email: 'admin@test.com' } } as never)
const noSession = () =>
  vi.mocked(getServerSession).mockResolvedValue(null)
const ctx = (id: string) => ({ params: Promise.resolve({ id }) })

function makeRequest(method: string, body?: unknown) {
  return new NextRequest('http://localhost/api/blog/uuid-b1', {
    method,
    ...(body
      ? { body: JSON.stringify(body), headers: { 'Content-Type': 'application/json' } }
      : {}),
  })
}

beforeEach(() => { vi.clearAllMocks() })

describe('GET /api/blog/[id]', () => {
  it('retorna el post cuando existe', async () => {
    vi.mocked(getById).mockResolvedValue(mockPost)

    const res  = await GET(makeRequest('GET'), ctx('uuid-b1'))
    const data = await res.json()

    expect(res.status).toBe(200)
    expect(data.titulo).toBe(mockPost.titulo)
  })

  it('retorna 404 cuando no existe', async () => {
    vi.mocked(getById).mockResolvedValue(null)

    const res = await GET(makeRequest('GET'), ctx('no-existe'))
    expect(res.status).toBe(404)
  })
})

describe('PUT /api/blog/[id]', () => {
  it('retorna 401 sin sesión', async () => {
    noSession()
    const res = await PUT(makeRequest('PUT', { publicado: false }), ctx('uuid-b1'))
    expect(res.status).toBe(401)
  })

  it('hace toggle de publicado con body { publicado: boolean }', async () => {
    withSession()
    vi.mocked(setPublished).mockResolvedValue({ ...mockPost, publicado: false })

    const res  = await PUT(makeRequest('PUT', { publicado: false }), ctx('uuid-b1'))
    const data = await res.json()

    expect(res.status).toBe(200)
    expect(data.publicado).toBe(false)
    expect(setPublished).toHaveBeenCalledWith('uuid-b1', false)
    expect(update).not.toHaveBeenCalled()
  })

  it('retorna 404 al hacer toggle en post inexistente', async () => {
    withSession()
    vi.mocked(setPublished).mockResolvedValue(null)

    const res = await PUT(makeRequest('PUT', { publicado: false }), ctx('no-existe'))
    expect(res.status).toBe(404)
  })

  it('actualiza el post completo con body válido', async () => {
    withSession()
    vi.mocked(update).mockResolvedValue({ ...mockPost, titulo: 'Nuevo título' })

    const res  = await PUT(makeRequest('PUT', validUpdateBody), ctx('uuid-b1'))
    const data = await res.json()

    expect(res.status).toBe(200)
    expect(update).toHaveBeenCalledWith('uuid-b1', expect.objectContaining({ titulo: validUpdateBody.titulo }))
  })

  it('retorna 422 con body incompleto en actualización', async () => {
    withSession()
    const res = await PUT(makeRequest('PUT', { titulo: 'Sin resto de campos' }), ctx('uuid-b1'))
    expect(res.status).toBe(422)
  })
})

describe('DELETE /api/blog/[id]', () => {
  it('retorna 401 sin sesión', async () => {
    noSession()
    const res = await DELETE(makeRequest('DELETE'), ctx('uuid-b1'))
    expect(res.status).toBe(401)
  })

  it('elimina el post y retorna ok: true', async () => {
    withSession()
    vi.mocked(remove).mockResolvedValue(true)

    const res  = await DELETE(makeRequest('DELETE'), ctx('uuid-b1'))
    const data = await res.json()

    expect(res.status).toBe(200)
    expect(data.ok).toBe(true)
  })

  it('retorna 404 cuando el post no existe', async () => {
    withSession()
    vi.mocked(remove).mockResolvedValue(false)

    const res = await DELETE(makeRequest('DELETE'), ctx('no-existe'))
    expect(res.status).toBe(404)
  })
})
