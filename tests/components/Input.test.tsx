// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import Input from '@/app/components/ui/Input'

// ─── Renderizado básico ───────────────────────────────────────────────────────

describe('Input — renderizado', () => {
  it('renderiza el input con su label asociado', () => {
    render(<Input id="email" label="Correo electrónico" />)
    expect(screen.getByLabelText('Correo electrónico')).toBeInTheDocument()
  })

  it('asocia htmlFor del label con el id del input', () => {
    render(<Input id="nombre" label="Nombre" />)
    const input = screen.getByLabelText('Nombre')
    expect(input).toHaveAttribute('id', 'nombre')
  })

  it('muestra asterisco con aria-hidden cuando required es true', () => {
    render(<Input id="nombre" label="Nombre" required />)
    const asterisco = screen.getByText('*')
    expect(asterisco).toBeInTheDocument()
    expect(asterisco).toHaveAttribute('aria-hidden', 'true')
  })

  it('no muestra asterisco sin required', () => {
    render(<Input id="nombre" label="Nombre" />)
    expect(screen.queryByText('*')).toBeNull()
  })

  it('admite placeholder', () => {
    render(<Input id="campo" label="Campo" placeholder="Escribe aquí" />)
    expect(screen.getByPlaceholderText('Escribe aquí')).toBeInTheDocument()
  })
})

// ─── Tipo de input ────────────────────────────────────────────────────────────

describe('Input — tipo', () => {
  it('es tipo text por defecto', () => {
    render(<Input id="campo" label="Campo" />)
    expect(screen.getByLabelText('Campo')).toHaveAttribute('type', 'text')
  })

  it('acepta type email', () => {
    render(<Input id="email" label="Email" type="email" />)
    expect(screen.getByLabelText('Email')).toHaveAttribute('type', 'email')
  })

  it('acepta type password', () => {
    render(<Input id="pass" label="Contraseña" type="password" />)
    expect(screen.getByLabelText('Contraseña')).toHaveAttribute('type', 'password')
  })

  it('acepta type tel', () => {
    render(<Input id="tel" label="Teléfono" type="tel" />)
    expect(screen.getByLabelText('Teléfono')).toHaveAttribute('type', 'tel')
  })
})

// ─── Accesibilidad ────────────────────────────────────────────────────────────

describe('Input — accesibilidad', () => {
  it('tiene aria-required cuando required es true', () => {
    render(<Input id="campo" label="Campo" required />)
    expect(screen.getByLabelText(/^Campo/)).toHaveAttribute('aria-required', 'true')
  })

  it('tiene aria-invalid false sin error', () => {
    render(<Input id="campo" label="Campo" />)
    expect(screen.getByLabelText('Campo')).toHaveAttribute('aria-invalid', 'false')
  })

  it('tiene aria-invalid true con error', () => {
    render(<Input id="campo" label="Campo" error="Campo requerido" />)
    expect(screen.getByLabelText('Campo')).toHaveAttribute('aria-invalid', 'true')
  })

  it('aria-describedby apunta al id del error', () => {
    render(<Input id="email" label="Email" error="Email inválido" />)
    const input = screen.getByLabelText('Email')
    expect(input).toHaveAttribute('aria-describedby', 'email-error')
  })

  it('aria-describedby apunta al id del hint cuando no hay error', () => {
    render(<Input id="email" label="Email" hint="Ej: usuario@correo.com" />)
    const input = screen.getByLabelText('Email')
    expect(input).toHaveAttribute('aria-describedby', 'email-hint')
  })

  it('no tiene aria-describedby cuando no hay error ni hint', () => {
    render(<Input id="campo" label="Campo" />)
    expect(screen.getByLabelText('Campo')).not.toHaveAttribute('aria-describedby')
  })
})

// ─── Error ────────────────────────────────────────────────────────────────────

describe('Input — error', () => {
  it('muestra el mensaje de error con role alert', () => {
    render(<Input id="email" label="Email" error="Email inválido" />)
    const alert = screen.getByRole('alert')
    expect(alert).toBeInTheDocument()
    expect(alert).toHaveTextContent('Email inválido')
  })

  it('el error tiene el id correcto para aria-describedby', () => {
    render(<Input id="email" label="Email" error="Error" />)
    expect(screen.getByRole('alert')).toHaveAttribute('id', 'email-error')
  })

  it('no hay role alert cuando no hay error', () => {
    render(<Input id="email" label="Email" />)
    expect(screen.queryByRole('alert')).toBeNull()
  })
})

// ─── Hint ─────────────────────────────────────────────────────────────────────

describe('Input — hint', () => {
  it('muestra el texto de ayuda cuando no hay error', () => {
    render(<Input id="campo" label="Campo" hint="Texto de ayuda" />)
    expect(screen.getByText('Texto de ayuda')).toBeInTheDocument()
  })

  it('oculta el hint cuando hay un error activo', () => {
    render(<Input id="campo" label="Campo" error="Error aquí" hint="Ayuda aquí" />)
    expect(screen.queryByText('Ayuda aquí')).toBeNull()
    expect(screen.getByText('Error aquí')).toBeInTheDocument()
  })
})

// ─── Disabled ─────────────────────────────────────────────────────────────────

describe('Input — disabled', () => {
  it('desactiva el input', () => {
    render(<Input id="campo" label="Campo" disabled />)
    expect(screen.getByLabelText('Campo')).toBeDisabled()
  })

  it('aplica estilo de opacidad reducida al label con disabled', () => {
    render(<Input id="campo" label="Campo" disabled />)
    const label = screen.getByText('Campo')
    expect(label.className).toContain('text-plata/40')
  })
})

// ─── Interacción ─────────────────────────────────────────────────────────────

describe('Input — interacción', () => {
  it('llama onChange al escribir', () => {
    const onChange = vi.fn()
    render(<Input id="campo" label="Campo" onChange={onChange} />)
    fireEvent.change(screen.getByLabelText('Campo'), { target: { value: 'Hola' } })
    expect(onChange).toHaveBeenCalledOnce()
  })

  it('muestra el valor escrito', () => {
    render(<Input id="campo" label="Campo" defaultValue="Texto inicial" />)
    expect(screen.getByLabelText('Campo')).toHaveValue('Texto inicial')
  })

  it('admite className extra en el input', () => {
    render(<Input id="campo" label="Campo" className="clase-extra" />)
    expect(screen.getByLabelText('Campo').className).toContain('clase-extra')
  })

  it('admite wrapperClassName en el contenedor', () => {
    render(<Input id="campo" label="Campo" wrapperClassName="wrapper-extra" />)
    const wrapper = screen.getByLabelText('Campo').closest('div')
    expect(wrapper?.className).toContain('wrapper-extra')
  })
})
