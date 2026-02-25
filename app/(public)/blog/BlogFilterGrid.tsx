'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { BlogPostSerialized } from '@/types/blog'
import { formatDate, readingTime } from '@/lib/utils/format'
import { cn } from '@/lib/utils/cn'

const CATEGORIAS = ['Todos', 'Consejos de viaje', 'Guías de destino', 'Viajes corporativos', 'Sobre ÉLEVA']

interface BlogFilterGridProps {
  posts: BlogPostSerialized[]
}

export default function BlogFilterGrid({ posts }: BlogFilterGridProps) {
  const [categoriaActiva, setCategoriaActiva] = useState('Todos')

  const postsFiltrados =
    categoriaActiva === 'Todos'
      ? posts
      : posts.filter((p) => p.categoria === categoriaActiva)

  const [featured, ...rest] = postsFiltrados

  return (
    <>
      {/* Categorías (filtro interactivo) ─────────────────── */}
      <div className="flex gap-2 flex-wrap mb-16" role="list" aria-label="Categorías del blog">
        {CATEGORIAS.map((c) => (
          <button
            key={c}
            type="button"
            role="listitem"
            onClick={() => setCategoriaActiva(c)}
            aria-pressed={categoriaActiva === c}
            className={cn(
              'px-5 py-2 text-xs border transition-all duration-200',
              categoriaActiva === c
                ? 'border-dorado text-dorado'
                : 'border-dorado/15 text-plata/50 hover:border-dorado/40 hover:text-crema'
            )}
            style={{ letterSpacing: '0.2em' }}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Resultados ────────────────────────────────────────── */}
      {postsFiltrados.length === 0 ? (
        <p className="text-center text-plata text-sm py-20">
          No hay artículos en esta categoría todavía.
        </p>
      ) : (
        <>
          {/* Post destacado */}
          {featured && <FeaturedPost post={featured} />}

          {/* Resto de posts */}
          {rest.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 mt-2">
              {rest.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </>
      )}
    </>
  )
}

// ─── Post destacado ───────────────────────────────────────────────────────────

function FeaturedPost({ post }: { post: BlogPostSerialized }) {
  return (
    <div className="group card-dark overflow-hidden mb-2">
      <div className="grid grid-cols-1 md:grid-cols-2">
        {post.imagenPortada && (
          <div className="relative overflow-hidden" style={{ minHeight: '360px' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={post.imagenPortada}
              alt={post.titulo}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 absolute inset-0"
            />
          </div>
        )}
        <div className="p-12 flex flex-col justify-center">
          <div className="section-label mb-4" style={{ color: 'rgba(201,168,76,0.7)' }}>
            {post.categoria} · {formatDate(post.creadoEn)}
          </div>
          <h2 className="display-heading mb-4" style={{ fontSize: '28px' }}>
            {post.titulo}
          </h2>
          <p className="text-plata/70 text-sm leading-loose mb-8">{post.extracto}</p>
          <div className="flex items-center gap-6">
            <Link href={`/blog/${post.slug}`} className="btn-gold">
              Leer artículo →
            </Link>
            <span className="text-plata/40" style={{ fontSize: '9px', letterSpacing: '3px' }}>
              {readingTime(post.contenido).toUpperCase()} LECTURA
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Tarjeta de post ──────────────────────────────────────────────────────────

function PostCard({ post }: { post: BlogPostSerialized }) {
  return (
    <article className="group card-dark overflow-hidden">
      {post.imagenPortada && (
        <div className="relative overflow-hidden" style={{ aspectRatio: '16/9' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.imagenPortada}
            alt={post.titulo}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </div>
      )}
      <div className="p-8">
        <div
          className="section-label mb-3"
          style={{ color: 'rgba(201,168,76,0.6)', fontSize: '8px' }}
        >
          {post.categoria} · {formatDate(post.creadoEn)}
        </div>
        <h2 className="display-heading mb-3" style={{ fontSize: '20px', lineHeight: 1.3 }}>
          {post.titulo}
        </h2>
        <p className="text-plata/60 text-xs leading-loose mb-6">{post.extracto}</p>
        <div className="flex items-center justify-between">
          <Link
            href={`/blog/${post.slug}`}
            className="text-dorado hover:text-dorado-claro transition-colors"
            style={{ fontSize: '9px', letterSpacing: '0.3em' }}
          >
            LEER MÁS →
          </Link>
          <span className="text-plata/30" style={{ fontSize: '9px', letterSpacing: '2px' }}>
            {readingTime(post.contenido)}
          </span>
        </div>
      </div>
    </article>
  )
}
