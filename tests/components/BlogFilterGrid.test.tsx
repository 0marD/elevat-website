// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import BlogFilterGrid from '@/app/(public)/blog/BlogFilterGrid'
import type { BlogPostSerialized } from '@/types/blog'

vi.mock('next/link', () => ({
  default: ({ href, children, ...props }: { href: string; children: React.ReactNode }) => (
    <a href={href} {...props}>{children}</a>
  ),
}))

// Helper para obtener el botón de categoría por su texto
const getCatBtn = (name: string) => screen.getByText(name).closest('button')!

const makePost = (overrides: Partial<BlogPostSerialized> = {}): BlogPostSerialized => ({
  id:            overrides.id            ?? 'uuid-1',
  titulo:        overrides.titulo        ?? 'Guía de Japón',
  extracto:      overrides.extracto      ?? 'Todo lo que necesitas saber sobre Japón.',
  contenido:     overrides.contenido     ?? 'Contenido extenso del artículo de prueba para el blog.',
  slug:          overrides.slug          ?? 'guia-de-japon',
  imagenPortada: overrides.imagenPortada ?? '',
  categoria:     overrides.categoria     ?? 'Guías de destino',
  publicado:     overrides.publicado     ?? true,
  creadoEn:      overrides.creadoEn      ?? '2024-01-01T00:00:00.000Z',
  actualizadoEn: overrides.actualizadoEn ?? '2024-01-01T00:00:00.000Z',
})

const posts: BlogPostSerialized[] = [
  makePost({ id: '1', titulo: 'Guía de Japón',         categoria: 'Guías de destino',    slug: 'guia-japon'  }),
  makePost({ id: '2', titulo: 'Consejos para viajar',  categoria: 'Consejos de viaje',   slug: 'consejos'    }),
  makePost({ id: '3', titulo: 'Viaje corporativo',     categoria: 'Viajes corporativos', slug: 'corporativo' }),
  makePost({ id: '4', titulo: 'Sobre la agencia',      categoria: 'Sobre ÉLEVA',         slug: 'sobre-eleva' }),
]

describe('BlogFilterGrid — renderizado inicial', () => {
  it('muestra todos los botones de categoría', () => {
    render(<BlogFilterGrid posts={posts} />)

    expect(screen.getByText('Todos')).toBeInTheDocument()
    expect(screen.getByText('Consejos de viaje')).toBeInTheDocument()
    expect(screen.getByText('Guías de destino')).toBeInTheDocument()
    expect(screen.getByText('Viajes corporativos')).toBeInTheDocument()
    expect(screen.getByText('Sobre ÉLEVA')).toBeInTheDocument()
  })

  it('"Todos" está activo por defecto (aria-pressed="true")', () => {
    render(<BlogFilterGrid posts={posts} />)
    expect(getCatBtn('Todos')).toHaveAttribute('aria-pressed', 'true')
  })

  it('los demás botones no están activos al inicio', () => {
    render(<BlogFilterGrid posts={posts} />)
    expect(getCatBtn('Consejos de viaje')).toHaveAttribute('aria-pressed', 'false')
    expect(getCatBtn('Guías de destino')).toHaveAttribute('aria-pressed', 'false')
  })

  it('muestra todos los posts al iniciar', () => {
    render(<BlogFilterGrid posts={posts} />)
    posts.forEach((p) => {
      expect(screen.getByText(p.titulo)).toBeInTheDocument()
    })
  })

  it('el primer post se muestra como destacado con enlace "Leer artículo"', () => {
    render(<BlogFilterGrid posts={posts} />)
    expect(screen.getByText(/leer artículo/i)).toBeInTheDocument()
  })
})

describe('BlogFilterGrid — filtrado por categoría', () => {
  it('filtra los posts al hacer click en una categoría', () => {
    render(<BlogFilterGrid posts={posts} />)

    fireEvent.click(getCatBtn('Consejos de viaje'))

    expect(screen.getByText('Consejos para viajar')).toBeInTheDocument()
    expect(screen.queryByText('Guía de Japón')).toBeNull()
    expect(screen.queryByText('Viaje corporativo')).toBeNull()
  })

  it('la categoría activa cambia a aria-pressed="true"', () => {
    render(<BlogFilterGrid posts={posts} />)

    fireEvent.click(getCatBtn('Consejos de viaje'))

    expect(getCatBtn('Consejos de viaje')).toHaveAttribute('aria-pressed', 'true')
    expect(getCatBtn('Todos')).toHaveAttribute('aria-pressed', 'false')
  })

  it('al volver a "Todos" muestra todos los posts', () => {
    render(<BlogFilterGrid posts={posts} />)

    fireEvent.click(getCatBtn('Consejos de viaje'))
    fireEvent.click(getCatBtn('Todos'))

    posts.forEach((p) => {
      expect(screen.getByText(p.titulo)).toBeInTheDocument()
    })
  })

  it('muestra mensaje "No hay artículos" cuando no hay posts en la categoría', () => {
    const fewPosts = [makePost({ categoria: 'Guías de destino' })]
    render(<BlogFilterGrid posts={fewPosts} />)

    fireEvent.click(getCatBtn('Consejos de viaje'))

    expect(screen.getByText(/no hay artículos en esta categoría/i)).toBeInTheDocument()
  })

  it('filtra correctamente categoría con un solo post', () => {
    render(<BlogFilterGrid posts={posts} />)

    fireEvent.click(getCatBtn('Sobre ÉLEVA'))

    expect(screen.getByText('Sobre la agencia')).toBeInTheDocument()
    expect(screen.queryByText('Guía de Japón')).toBeNull()
  })
})

describe('BlogFilterGrid — con lista vacía', () => {
  it('muestra mensaje vacío cuando no hay posts', () => {
    render(<BlogFilterGrid posts={[]} />)
    expect(screen.getByText(/no hay artículos en esta categoría/i)).toBeInTheDocument()
  })

  it('los botones de categoría siguen visibles con lista vacía', () => {
    render(<BlogFilterGrid posts={[]} />)
    expect(screen.getByText('Todos')).toBeInTheDocument()
    expect(screen.getByText('Consejos de viaje')).toBeInTheDocument()
  })
})
