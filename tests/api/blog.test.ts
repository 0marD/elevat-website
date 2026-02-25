import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'
import { getServerSession } from 'next-auth'

vi.mock('next-auth',   () => ({ getServerSession: vi.fn() }))
vi.mock('@/lib/auth', () => ({ authOptions: {} }))
vi.mock('@/lib/data/blog-store', () => ({
  getAll:       vi.fn(),
  getPublished: vi.fn(),
  create:       vi.fn(),
  serialize:    vi.fn((p) => ({
    ...p,
    creadoEn:      '2024-01-01T00:00:00.000Z',
    actualizadoEn: '2024-01-01T00:00:00.000Z',
  })),
}))

import { GET, POST } from '@/app/api/blog/route'
import { getAll, getPublished, create } from '@/lib/data/blog-store'

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

const validPostBody = {
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

function makeGet(params?: Record<string, string>) {
  const url = new URL('http://localhost/api/blog')
  if (params) Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v))
  return new NextRequest(url)
}

function makePost(body: unknown) {
  return new NextRequest('http://localhost/api/blog', {
    method:  'POST',
    body:    JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
  })
}

beforeEach(() => { vi.clearAllMocks() })

describe('GET /api/blog', () => {
  it('retorna solo posts publicados (público, sin ?all)', async () => {
    vi.mocked(getPublished).mockResolvedValue([mockPost])

    const res  = await GET(makeGet())
    const data = await res.json()

    expect(res.status).toBe(200)
    expect(data).toHaveLength(1)
    expect(getPublished).toHaveBeenCalledOnce()
    expect(getAll).not.toHaveBeenCalled()
  })

  it('retorna 401 cuando ?all=1 sin sesión', async () => {
    noSession()
    const res = await GET(makeGet({ all: '1' }))
    expect(res.status).toBe(401)
  })

  it('retorna todos los posts cuando ?all=1 con sesión', async () => {
    withSession()
    vi.mocked(getAll).mockResolvedValue([mockPost, { ...mockPost, id: 'uuid-b2', publicado: false }])

    const res  = await GET(makeGet({ all: '1' }))
    const data = await res.json()

    expect(res.status).toBe(200)
    expect(data).toHaveLength(2)
    expect(getAll).toHaveBeenCalledOnce()
  })
})

describe('POST /api/blog', () => {
  it('retorna 401 sin sesión', async () => {
    noSession()
    const res = await POST(makePost(validPostBody))
    expect(res.status).toBe(401)
  })

  it('crea el post y retorna 201', async () => {
    withSession()
    vi.mocked(create).mockResolvedValue(mockPost)

    const res  = await POST(makePost(validPostBody))
    const data = await res.json()

    expect(res.status).toBe(201)
    expect(data.titulo).toBe(mockPost.titulo)
    expect(create).toHaveBeenCalledOnce()
  })

  it('retorna 400 con body inválido', async () => {
    withSession()
    const req = new NextRequest('http://localhost/api/blog', {
      method:  'POST',
      body:    'no-es-json{{',
      headers: { 'Content-Type': 'application/json' },
    })
    const res = await POST(req)
    expect(res.status).toBe(400)
  })

  it('retorna 422 cuando el schema falla', async () => {
    withSession()
    const res  = await POST(makePost({ titulo: 'Solo titulo' }))
    const data = await res.json()

    expect(res.status).toBe(422)
    expect(data.issues).toBeDefined()
  })
})
