// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import QuickContactForm from '@/app/(public)/contacto/QuickContactForm'

// next/link no se usa en este componente, pero el env jsdom requiere
// que window exista — ya lo provee jsdom.

beforeEach(() => {
  vi.restoreAllMocks()
})

describe('QuickContactForm — renderizado', () => {
  it('muestra los tres campos del formulario', () => {
    render(<QuickContactForm />)

    expect(screen.getByLabelText(/nombre/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/correo o whatsapp/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/mensaje/i)).toBeInTheDocument()
  })

  it('muestra el botón de envío', () => {
    render(<QuickContactForm />)
    expect(screen.getByRole('button', { name: /enviar por whatsapp/i })).toBeInTheDocument()
  })

  it('los campos inician vacíos', () => {
    render(<QuickContactForm />)
    expect(screen.getByLabelText(/nombre/i)).toHaveValue('')
    expect(screen.getByLabelText(/correo o whatsapp/i)).toHaveValue('')
  })
})

describe('QuickContactForm — validación al enviar', () => {
  it('muestra error de nombre cuando está vacío', () => {
    render(<QuickContactForm />)
    fireEvent.submit(screen.getByRole('button', { name: /enviar/i }).closest('form')!)
    expect(screen.getByText(/ingresa tu nombre/i)).toBeInTheDocument()
  })

  it('muestra error de contacto con valor inválido', () => {
    render(<QuickContactForm />)

    fireEvent.change(screen.getByLabelText(/nombre/i),   { target: { value: 'Ana García' } })
    fireEvent.change(screen.getByLabelText(/correo o whatsapp/i), { target: { value: 'no-valido' } })
    fireEvent.change(screen.getByLabelText(/mensaje/i),  { target: { value: 'Mensaje de prueba largo' } })
    fireEvent.submit(screen.getByRole('button').closest('form')!)

    expect(screen.getByText(/ingresa un correo válido/i)).toBeInTheDocument()
  })

  it('muestra error de mensaje cuando es muy corto', () => {
    render(<QuickContactForm />)

    fireEvent.change(screen.getByLabelText(/nombre/i),   { target: { value: 'Ana García' } })
    fireEvent.change(screen.getByLabelText(/correo o whatsapp/i), { target: { value: 'ana@email.com' } })
    fireEvent.change(screen.getByLabelText(/mensaje/i),  { target: { value: 'Ok' } })
    fireEvent.submit(screen.getByRole('button').closest('form')!)

    expect(screen.getByText(/escribe un mensaje más detallado/i)).toBeInTheDocument()
  })

  it('muestra error de nombre cuando tiene menos de 2 caracteres', () => {
    render(<QuickContactForm />)

    fireEvent.change(screen.getByLabelText(/nombre/i), { target: { value: 'A' } })
    fireEvent.submit(screen.getByRole('button').closest('form')!)

    expect(screen.getByText(/ingresa tu nombre/i)).toBeInTheDocument()
  })

  it('no muestra errores con datos válidos y llama window.open', () => {
    const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null)
    render(<QuickContactForm />)

    fireEvent.change(screen.getByLabelText(/nombre/i),             { target: { value: 'Ana García' } })
    fireEvent.change(screen.getByLabelText(/correo o whatsapp/i),  { target: { value: 'ana@email.com' } })
    fireEvent.change(screen.getByLabelText(/mensaje/i),            { target: { value: 'Quiero información sobre viajes a Japón.' } })
    fireEvent.submit(screen.getByRole('button').closest('form')!)

    expect(screen.queryByRole('alert')).toBeNull()
    expect(openSpy).toHaveBeenCalledOnce()
    expect(openSpy).toHaveBeenCalledWith(
      expect.stringContaining('wa.me'),
      '_blank',
      'noopener,noreferrer',
    )
  })

  it('acepta número de teléfono como contacto válido', () => {
    const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null)
    render(<QuickContactForm />)

    fireEvent.change(screen.getByLabelText(/nombre/i),             { target: { value: 'Carlos López' } })
    fireEvent.change(screen.getByLabelText(/correo o whatsapp/i),  { target: { value: '3337084290' } })
    fireEvent.change(screen.getByLabelText(/mensaje/i),            { target: { value: 'Me interesa el viaje a Europa en familia.' } })
    fireEvent.submit(screen.getByRole('button').closest('form')!)

    expect(screen.queryByRole('alert')).toBeNull()
    expect(openSpy).toHaveBeenCalledOnce()
  })
})

describe('QuickContactForm — limpieza de errores', () => {
  it('limpia el error de nombre al escribir', () => {
    render(<QuickContactForm />)

    // Provoca el error
    fireEvent.submit(screen.getByRole('button').closest('form')!)
    expect(screen.getByText(/ingresa tu nombre/i)).toBeInTheDocument()

    // Escribe en el campo
    fireEvent.change(screen.getByLabelText(/nombre/i), { target: { value: 'Ana' } })
    expect(screen.queryByText(/ingresa tu nombre/i)).toBeNull()
  })

  it('limpia el error de contacto al escribir', () => {
    render(<QuickContactForm />)

    fireEvent.change(screen.getByLabelText(/nombre/i),            { target: { value: 'Ana' } })
    fireEvent.change(screen.getByLabelText(/correo o whatsapp/i), { target: { value: 'invalido' } })
    fireEvent.change(screen.getByLabelText(/mensaje/i),           { target: { value: 'Mensaje largo de prueba para el test.' } })
    fireEvent.submit(screen.getByRole('button').closest('form')!)
    expect(screen.getByText(/ingresa un correo válido/i)).toBeInTheDocument()

    fireEvent.change(screen.getByLabelText(/correo o whatsapp/i), { target: { value: 'ana@email.com' } })
    expect(screen.queryByText(/ingresa un correo válido/i)).toBeNull()
  })
})
