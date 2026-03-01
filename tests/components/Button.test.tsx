// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import Button from '@/app/components/ui/Button'

// ─── Renderizado básico ───────────────────────────────────────────────────────

describe('Button — renderizado', () => {
  it('renderiza con el texto de hijo', () => {
    render(<Button>Haz clic</Button>)
    expect(screen.getByRole('button', { name: 'Haz clic' })).toBeInTheDocument()
  })

  it('aplica variante gold por defecto', () => {
    render(<Button>Gold</Button>)
    expect(screen.getByRole('button').className).toContain('border-dorado')
  })

  it('aplica variante ghost', () => {
    render(<Button variant="ghost">Ghost</Button>)
    expect(screen.getByRole('button').className).toContain('border-crema')
  })

  it('aplica variante danger', () => {
    render(<Button variant="danger">Eliminar</Button>)
    expect(screen.getByRole('button').className).toContain('border-red-500')
  })

  it('aplica variante solid', () => {
    render(<Button variant="solid">Sólido</Button>)
    expect(screen.getByRole('button').className).toContain('bg-dorado')
  })
})

// ─── Tamaños ─────────────────────────────────────────────────────────────────

describe('Button — tamaños', () => {
  it('aplica tamaño sm', () => {
    render(<Button size="sm">SM</Button>)
    expect(screen.getByRole('button').className).toContain('px-4')
  })

  it('aplica tamaño md por defecto', () => {
    render(<Button>MD</Button>)
    expect(screen.getByRole('button').className).toContain('px-6')
  })

  it('aplica tamaño lg', () => {
    render(<Button size="lg">LG</Button>)
    expect(screen.getByRole('button').className).toContain('px-8')
  })
})

// ─── Estados ─────────────────────────────────────────────────────────────────

describe('Button — estados', () => {
  it('está habilitado por defecto', () => {
    render(<Button>Activo</Button>)
    expect(screen.getByRole('button')).not.toBeDisabled()
  })

  it('se deshabilita con disabled', () => {
    render(<Button disabled>Deshabilitado</Button>)
    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('se deshabilita con isLoading', () => {
    render(<Button isLoading>Cargando</Button>)
    const btn = screen.getByRole('button')
    expect(btn).toBeDisabled()
    expect(btn).toHaveAttribute('aria-busy', 'true')
  })

  it('isLoading sin disabled explicito también deshabilita', () => {
    render(<Button isLoading disabled={false}>Cargando</Button>)
    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('muestra spinner SVG cuando isLoading es true', () => {
    render(<Button isLoading>Guardando</Button>)
    const svg = screen.getByRole('button').querySelector('svg')
    expect(svg).toBeInTheDocument()
    expect(svg).toHaveAttribute('aria-hidden', 'true')
  })

  it('no muestra spinner sin isLoading', () => {
    render(<Button>Normal</Button>)
    expect(screen.getByRole('button').querySelector('svg')).toBeNull()
  })

  it('no tiene aria-busy cuando no está cargando', () => {
    render(<Button>Normal</Button>)
    expect(screen.getByRole('button')).toHaveAttribute('aria-busy', 'false')
  })
})

// ─── Accesibilidad ────────────────────────────────────────────────────────────

describe('Button — accesibilidad', () => {
  it('es un elemento button semántico', () => {
    render(<Button>Acción</Button>)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('tiene focus-visible en su className', () => {
    render(<Button>Focus</Button>)
    expect(screen.getByRole('button').className).toContain('focus-visible')
  })

  it('admite aria-label extra', () => {
    render(<Button aria-label="Abrir menú">≡</Button>)
    expect(screen.getByRole('button', { name: 'Abrir menú' })).toBeInTheDocument()
  })

  it('admite type submit', () => {
    render(<Button type="submit">Enviar</Button>)
    expect(screen.getByRole('button')).toHaveAttribute('type', 'submit')
  })
})

// ─── Interacción ─────────────────────────────────────────────────────────────

describe('Button — interacción', () => {
  it('llama onClick al hacer clic', () => {
    const onClick = vi.fn()
    render(<Button onClick={onClick}>Clic</Button>)
    fireEvent.click(screen.getByRole('button'))
    expect(onClick).toHaveBeenCalledOnce()
  })

  it('no llama onClick si está deshabilitado', () => {
    const onClick = vi.fn()
    render(<Button disabled onClick={onClick}>No clic</Button>)
    fireEvent.click(screen.getByRole('button'))
    expect(onClick).not.toHaveBeenCalled()
  })

  it('admite className extra que se combina correctamente', () => {
    render(<Button className="mi-clase-extra">Extra</Button>)
    expect(screen.getByRole('button').className).toContain('mi-clase-extra')
  })

  it('pasa atributos HTML adicionales al elemento button', () => {
    render(<Button data-testid="btn-primary">Test</Button>)
    expect(screen.getByTestId('btn-primary')).toBeInTheDocument()
  })
})
