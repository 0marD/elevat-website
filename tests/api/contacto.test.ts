import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'

vi.mock('@/lib/db', () => ({
  prisma: {
    mensajeRapido: {
      create: vi.fn(),
    },
  },
}))

import { POST } from '@/app/api/contacto/route'
import { prisma } from '@/lib/db'

const mockMensaje = {
  id:        'uuid-msg-1',
  nombre:    'Ana García',
  contacto:  'ana@email.com',
  mensaje:   'Quiero información sobre viajes a Japón y Europa.',
  creadoEn:  new Date('2024-01-01'),
}

const validBody = {
  nombre:   'Ana García',
  contacto: 'ana@email.com',
  mensaje:  'Quiero información sobre viajes a Japón y Europa.',
}

function makeRequest(body: unknown) {
  return new NextRequest('http://localhost/api/contacto', {
    method:  'POST',
    body:    JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
  })
}

beforeEach(() => {
  vi.clearAllMocks()
  vi.mocked(prisma.mensajeRapido.create).mockResolvedValue(mockMensaje as never)
})

describe('POST /api/contacto', () => {
  describe('casos válidos', () => {
    it('retorna 201 con id cuando los datos son correctos', async () => {
      const res  = await POST(makeRequest(validBody))
      const data = await res.json()

      expect(res.status).toBe(201)
      expect(data.id).toBe(mockMensaje.id)
    })

    it('acepta email como contacto', async () => {
      const res = await POST(makeRequest({ ...validBody, contacto: 'usuario@dominio.com' }))
      expect(res.status).toBe(201)
    })

    it('acepta teléfono de 10 dígitos como contacto', async () => {
      const res = await POST(makeRequest({ ...validBody, contacto: '3337084290' }))
      expect(res.status).toBe(201)
    })

    it('acepta teléfono con prefijo +52', async () => {
      const res = await POST(makeRequest({ ...validBody, contacto: '+523337084290' }))
      expect(res.status).toBe(201)
    })

    it('acepta teléfono con prefijo 52', async () => {
      const res = await POST(makeRequest({ ...validBody, contacto: '523337084290' }))
      expect(res.status).toBe(201)
    })

    it('llama a prisma.mensajeRapido.create con los datos saneados', async () => {
      await POST(makeRequest({ ...validBody, nombre: '  Ana García  ' }))

      expect(prisma.mensajeRapido.create).toHaveBeenCalledWith({
        data: expect.objectContaining({ nombre: 'Ana García' }),
      })
    })
  })

  describe('validación — nombre', () => {
    it('retorna 422 cuando el nombre está vacío', async () => {
      const res  = await POST(makeRequest({ ...validBody, nombre: '' }))
      const data = await res.json()

      expect(res.status).toBe(422)
      expect(data.errors.nombre).toBeTruthy()
    })

    it('retorna 422 cuando el nombre tiene menos de 2 caracteres', async () => {
      const res  = await POST(makeRequest({ ...validBody, nombre: 'A' }))
      const data = await res.json()

      expect(res.status).toBe(422)
      expect(data.errors.nombre).toBeTruthy()
    })

    it('retorna 422 cuando falta el campo nombre', async () => {
      const { nombre: _, ...sinNombre } = validBody
      const res  = await POST(makeRequest(sinNombre))
      const data = await res.json()

      expect(res.status).toBe(422)
      expect(data.errors.nombre).toBeTruthy()
    })
  })

  describe('validación — contacto', () => {
    it('retorna 422 cuando el contacto es inválido', async () => {
      const res  = await POST(makeRequest({ ...validBody, contacto: 'no-es-valido' }))
      const data = await res.json()

      expect(res.status).toBe(422)
      expect(data.errors.contacto).toBeTruthy()
    })

    it('retorna 422 cuando el contacto está vacío', async () => {
      const res  = await POST(makeRequest({ ...validBody, contacto: '' }))
      const data = await res.json()

      expect(res.status).toBe(422)
      expect(data.errors.contacto).toBeTruthy()
    })

    it('retorna 422 con email sin dominio', async () => {
      const res = await POST(makeRequest({ ...validBody, contacto: 'usuario@' }))
      expect(res.status).toBe(422)
    })

    it('retorna 422 con teléfono de 9 dígitos', async () => {
      const res = await POST(makeRequest({ ...validBody, contacto: '333708429' }))
      expect(res.status).toBe(422)
    })
  })

  describe('validación — mensaje', () => {
    it('retorna 422 cuando el mensaje es demasiado corto', async () => {
      const res  = await POST(makeRequest({ ...validBody, mensaje: 'Hola' }))
      const data = await res.json()

      expect(res.status).toBe(422)
      expect(data.errors.mensaje).toBeTruthy()
    })

    it('retorna 422 cuando el mensaje está vacío', async () => {
      const res  = await POST(makeRequest({ ...validBody, mensaje: '' }))
      const data = await res.json()

      expect(res.status).toBe(422)
      expect(data.errors.mensaje).toBeTruthy()
    })

    it('retorna 422 con cuerpo completamente vacío', async () => {
      const res  = await POST(makeRequest({}))
      const data = await res.json()

      expect(res.status).toBe(422)
      expect(data.errors).toBeDefined()
    })
  })

  describe('persistencia', () => {
    it('no llama a create cuando la validación falla', async () => {
      await POST(makeRequest({ ...validBody, nombre: '' }))
      expect(prisma.mensajeRapido.create).not.toHaveBeenCalled()
    })

    it('llama a create exactamente una vez con datos válidos', async () => {
      await POST(makeRequest(validBody))
      expect(prisma.mensajeRapido.create).toHaveBeenCalledOnce()
    })
  })
})
