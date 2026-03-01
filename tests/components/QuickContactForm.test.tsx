// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import QuickContactForm from '@/app/(public)/contacto/QuickContactForm'

// ─── Helpers ──────────────────────────────────────────────────────────────────

type FetchMockOptions = {
  ok: boolean
  status: number
  json?: () => Promise<unknown>
}

function mockFetch(response: FetchMockOptions) {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
    ok:     response.ok,
    status: response.status,
    json:   response.json ?? (() => Promise.resolve({})),
  }))
}

function fillForm(nombre = '', contacto = '', mensaje = '') {
  if (nombre)   fireEvent.change(screen.getByLabelText(/nombre/i),             { target: { value: nombre } })
  if (contacto) fireEvent.change(screen.getByLabelText(/correo o whatsapp/i),  { target: { value: contacto } })
  if (mensaje)  fireEvent.change(screen.getByLabelText(/mensaje/i),            { target: { value: mensaje } })
}

function submitForm() {
  fireEvent.submit(screen.getByRole('button').closest('form')!)
}

beforeEach(() => { vi.restoreAllMocks() })
afterEach(() => { vi.unstubAllGlobals() })

// ─── Renderizado ──────────────────────────────────────────────────────────────

describe('QuickContactForm — renderizado', () => {
  it('muestra los tres campos del formulario', () => {
    render(<QuickContactForm />)
    expect(screen.getByLabelText(/nombre/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/correo o whatsapp/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/mensaje/i)).toBeInTheDocument()
  })

  it('muestra el botón de envío', () => {
    render(<QuickContactForm />)
    expect(screen.getByRole('button', { name: /enviar mensaje/i })).toBeInTheDocument()
  })

  it('los campos inician vacíos', () => {
    render(<QuickContactForm />)
    expect(screen.getByLabelText(/nombre/i)).toHaveValue('')
    expect(screen.getByLabelText(/correo o whatsapp/i)).toHaveValue('')
  })
})

// ─── Envío y estados ──────────────────────────────────────────────────────────

describe('QuickContactForm — envío al API', () => {
  it('llama a POST /api/contacto al enviar el formulario', async () => {
    mockFetch({ ok: true, status: 200 })
    render(<QuickContactForm />)
    fillForm('Ana García', 'ana@email.com', 'Quiero información sobre viajes a Japón.')
    submitForm()

    await waitFor(() => {
      expect(vi.mocked(global.fetch)).toHaveBeenCalledWith(
        '/api/contacto',
        expect.objectContaining({ method: 'POST' }),
      )
    })
  })

  it('envía el body con los campos del formulario', async () => {
    mockFetch({ ok: true, status: 200 })
    render(<QuickContactForm />)
    fillForm('Ana García', 'ana@email.com', 'Mensaje de prueba para el test.')
    submitForm()

    await waitFor(() => {
      const call = vi.mocked(global.fetch).mock.calls[0]
      const body = JSON.parse(call[1]?.body as string)
      expect(body).toMatchObject({ nombre: 'Ana García', contacto: 'ana@email.com' })
    })
  })

  it('muestra estado de éxito tras respuesta 200', async () => {
    mockFetch({ ok: true, status: 200 })
    render(<QuickContactForm />)
    fillForm('Ana García', 'ana@email.com', 'Quiero información sobre viajes a Japón.')
    submitForm()

    await waitFor(() => {
      expect(screen.getByRole('status')).toBeInTheDocument()
      expect(screen.getByText(/mensaje recibido/i)).toBeInTheDocument()
    })
  })

  it('muestra error de nombre cuando el servidor retorna 422', async () => {
    mockFetch({
      ok:     false,
      status: 422,
      json:   async () => ({ errors: { nombre: 'Ingresa tu nombre completo.' } }),
    })
    render(<QuickContactForm />)
    fillForm('', 'ana@email.com', 'Mensaje de prueba para el formulario.')
    submitForm()

    await waitFor(() => {
      expect(screen.getByText(/ingresa tu nombre/i)).toBeInTheDocument()
    })
  })

  it('muestra error de contacto cuando el servidor retorna 422', async () => {
    mockFetch({
      ok:     false,
      status: 422,
      json:   async () => ({ errors: { contacto: 'Ingresa un correo válido o número de WhatsApp.' } }),
    })
    render(<QuickContactForm />)
    fillForm('Ana García', 'no-valido', 'Mensaje de prueba para el formulario.')
    submitForm()

    await waitFor(() => {
      expect(screen.getByText(/ingresa un correo válido/i)).toBeInTheDocument()
    })
  })

  it('muestra error de mensaje cuando el servidor retorna 422', async () => {
    mockFetch({
      ok:     false,
      status: 422,
      json:   async () => ({ errors: { mensaje: 'Escribe un mensaje más detallado.' } }),
    })
    render(<QuickContactForm />)
    fillForm('Ana García', 'ana@email.com', 'Ok')
    submitForm()

    await waitFor(() => {
      expect(screen.getByText(/escribe un mensaje más detallado/i)).toBeInTheDocument()
    })
  })

  it('muestra error genérico con respuesta 500', async () => {
    mockFetch({ ok: false, status: 500 })
    render(<QuickContactForm />)
    fillForm('Ana García', 'ana@email.com', 'Quiero información sobre viajes a Japón.')
    submitForm()

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument()
      expect(screen.getByText(/error al enviar/i)).toBeInTheDocument()
    })
  })

  it('deshabilita el botón y muestra aria-busy mientras envía', () => {
    let resolveFetch!: (v: unknown) => void
    vi.stubGlobal('fetch', vi.fn().mockReturnValue(
      new Promise(r => { resolveFetch = r }),
    ))

    render(<QuickContactForm />)
    fillForm('Ana García', 'ana@email.com', 'Quiero información sobre viajes.')
    submitForm()

    const btn = screen.getByRole('button')
    expect(btn).toBeDisabled()
    expect(btn).toHaveAttribute('aria-busy', 'true')

    // cleanup: resolve the pending promise
    resolveFetch({ ok: true, status: 200, json: async () => ({}) })
  })

  it('acepta número de teléfono como contacto válido (sin errores del servidor)', async () => {
    mockFetch({ ok: true, status: 200 })
    render(<QuickContactForm />)
    fillForm('Carlos López', '3337084290', 'Me interesa el viaje a Europa en familia.')
    submitForm()

    await waitFor(() => {
      expect(screen.getByText(/mensaje recibido/i)).toBeInTheDocument()
    })
  })
})

// ─── Limpieza de errores ──────────────────────────────────────────────────────

describe('QuickContactForm — limpieza de errores', () => {
  it('limpia el error de nombre al escribir en el campo', async () => {
    mockFetch({
      ok:     false,
      status: 422,
      json:   async () => ({ errors: { nombre: 'Ingresa tu nombre completo.' } }),
    })
    render(<QuickContactForm />)
    fillForm('', 'ana@email.com', 'Mensaje de prueba.')
    submitForm()

    await waitFor(() => expect(screen.getByText(/ingresa tu nombre/i)).toBeInTheDocument())

    fireEvent.change(screen.getByLabelText(/nombre/i), { target: { value: 'Ana' } })
    expect(screen.queryByText(/ingresa tu nombre/i)).toBeNull()
  })

  it('limpia el error de contacto al escribir en el campo', async () => {
    mockFetch({
      ok:     false,
      status: 422,
      json:   async () => ({ errors: { contacto: 'Ingresa un correo válido o número de WhatsApp.' } }),
    })
    render(<QuickContactForm />)
    fillForm('Ana García', 'invalido', 'Mensaje largo de prueba para el test.')
    submitForm()

    await waitFor(() => expect(screen.getByText(/ingresa un correo válido/i)).toBeInTheDocument())

    fireEvent.change(screen.getByLabelText(/correo o whatsapp/i), { target: { value: 'ana@email.com' } })
    expect(screen.queryByText(/ingresa un correo válido/i)).toBeNull()
  })

  it('permite enviar otro mensaje desde el estado success', async () => {
    mockFetch({ ok: true, status: 200 })
    render(<QuickContactForm />)
    fillForm('Ana García', 'ana@email.com', 'Quiero información sobre viajes a Japón.')
    submitForm()

    await waitFor(() => expect(screen.getByText(/mensaje recibido/i)).toBeInTheDocument())

    fireEvent.click(screen.getByText(/enviar otro mensaje/i))
    expect(screen.getByLabelText(/nombre/i)).toBeInTheDocument()
  })
})
