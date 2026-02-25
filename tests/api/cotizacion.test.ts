import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'

vi.mock('resend', () => ({
  Resend: class {
    emails = { send: () => Promise.resolve({ id: 'email-id' }) }
  },
}))

vi.mock('@/lib/data/cotizaciones-store', () => ({
  create:    vi.fn(),
  serialize: vi.fn((c) => ({ ...c, creadoEn: '2024-01-01T00:00:00.000Z' })),
}))

import { POST } from '@/app/api/cotizacion/route'
import { create } from '@/lib/data/cotizaciones-store'

const validBody = {
  nombre:     'Ana García',
  email:      'ana@example.com',
  whatsapp:   '3337084290',
  tipo_viaje: 'Luna de miel',
  destino:    'Maldivas',
  adultos:    '2',
  ninos:      '0',
  categoria:  'Lujo ★★★★★',
  intereses:  ['Playa y relax'],
}

const mockCotizacion = {
  id:         'uuid-c1',
  ...validBody,
  estado:     'pendiente' as const,
  creadoEn:   new Date('2024-01-01'),
}

function makeRequest(body: unknown) {
  return new NextRequest('http://localhost/api/cotizacion', {
    method:  'POST',
    body:    JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
  })
}

beforeEach(() => { vi.clearAllMocks() })

describe('POST /api/cotizacion', () => {
  it('crea la cotización y retorna 201 con whatsappUrl', async () => {
    vi.mocked(create).mockResolvedValue(mockCotizacion)

    const res  = await POST(makeRequest(validBody))
    const data = await res.json()

    expect(res.status).toBe(201)
    expect(data.ok).toBe(true)
    expect(data.id).toBe('uuid-c1')
    expect(data.whatsappUrl).toContain('wa.me')
    expect(create).toHaveBeenCalledOnce()
  })

  it('incluye nombre y destino en la URL de WhatsApp', async () => {
    vi.mocked(create).mockResolvedValue(mockCotizacion)

    const { whatsappUrl } = await (await POST(makeRequest(validBody))).json()

    expect(whatsappUrl).toContain('Ana')
    expect(whatsappUrl).toContain('Maldivas')
  })

  it('retorna 400 cuando el body no es JSON válido', async () => {
    const req = new NextRequest('http://localhost/api/cotizacion', {
      method:  'POST',
      body:    'no-es-json{{',
      headers: { 'Content-Type': 'application/json' },
    })
    const res = await POST(req)
    expect(res.status).toBe(400)
  })

  it('retorna 422 con fieldErrors cuando faltan campos requeridos', async () => {
    const res  = await POST(makeRequest({ nombre: 'Solo nombre' }))
    const data = await res.json()

    expect(res.status).toBe(422)
    expect(data.error).toBe('Datos inválidos')
    expect(data.issues).toBeDefined()
  })

  it('retorna 422 cuando el email es inválido', async () => {
    const res = await POST(makeRequest({ ...validBody, email: 'no-es-email' }))
    expect(res.status).toBe(422)
  })

  it('retorna cotizacion serializada en la respuesta', async () => {
    vi.mocked(create).mockResolvedValue(mockCotizacion)

    const { cotizacion } = await (await POST(makeRequest(validBody))).json()

    expect(cotizacion).toBeDefined()
    expect(cotizacion.id).toBe('uuid-c1')
  })
})
