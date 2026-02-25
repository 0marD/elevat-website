'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { cn } from '@/lib/utils/cn'
import { formatDate } from '@/lib/utils/format'
import { ROUTES } from '@/lib/constants/routes'
import type { BlogPostSerialized } from '@/types/blog'

interface BlogTableProps {
  posts: BlogPostSerialized[]
}

export default function BlogTable({ posts }: BlogTableProps) {
  if (posts.length === 0) {
    return (
      <p className="text-plata/40 text-sm py-12 text-center tracking-wide">
        No hay artículos todavía.{' '}
        <Link href={ROUTES.admin.blogNuevo} className="text-dorado hover:text-dorado-claro">
          Crea el primero →
        </Link>
      </p>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-crema/10">
            {['Título', 'Categoría', 'Estado', 'Fecha', 'Acciones'].map((h) => (
              <th
                key={h}
                className="pb-3 text-[9px] tracking-[0.3em] uppercase text-plata/40 font-normal pr-6"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {posts.map((post) => (
            <BlogRow key={post.id} post={post} />
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ─── Fila de la tabla ─────────────────────────────────────────────────────────

function BlogRow({ post }: { post: BlogPostSerialized }) {
  const router  = useRouter()
  const [isPending, startTransition] = useTransition()
  const [confirmDelete, setConfirmDelete] = useState(false)

  const togglePublicado = () => {
    startTransition(async () => {
      await fetch(`/api/blog/${post.id}`, {
        method:  'PUT',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ publicado: !post.publicado }),
      })
      router.refresh()
    })
  }

  const handleDelete = () => {
    startTransition(async () => {
      await fetch(`/api/blog/${post.id}`, { method: 'DELETE' })
      router.refresh()
    })
  }

  return (
    <tr
      className={cn(
        'border-b border-crema/5 transition-colors',
        isPending && 'opacity-50',
      )}
    >
      {/* Título */}
      <td className="py-4 pr-6 max-w-xs">
        <Link
          href={ROUTES.admin.blogEditar(post.id)}
          className="text-crema/80 text-sm hover:text-dorado transition-colors line-clamp-2 leading-snug"
        >
          {post.titulo}
        </Link>
      </td>

      {/* Categoría */}
      <td className="py-4 pr-6">
        <span className="text-[10px] tracking-widest text-plata/50 uppercase whitespace-nowrap">
          {post.categoria}
        </span>
      </td>

      {/* Estado */}
      <td className="py-4 pr-6">
        <span
          className={cn(
            'inline-block px-2 py-0.5 text-[9px] tracking-widest uppercase',
            post.publicado
              ? 'bg-dorado/10 text-dorado'
              : 'bg-crema/5 text-plata/40',
          )}
        >
          {post.publicado ? 'Publicado' : 'Borrador'}
        </span>
      </td>

      {/* Fecha */}
      <td className="py-4 pr-6 whitespace-nowrap">
        <span className="text-[10px] text-plata/40">
          {formatDate(post.creadoEn)}
        </span>
      </td>

      {/* Acciones */}
      <td className="py-4">
        {confirmDelete ? (
          <span className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] text-red-400 tracking-wide mr-1">¿Eliminar?</span>
            <button
              onClick={handleDelete}
              disabled={isPending}
              className="text-[9px] tracking-widest uppercase text-red-400 hover:text-red-300 transition-colors"
            >
              Confirmar
            </button>
            <button
              onClick={() => setConfirmDelete(false)}
              disabled={isPending}
              className="text-[9px] tracking-widest uppercase text-plata/40 hover:text-plata transition-colors"
            >
              Cancelar
            </button>
          </span>
        ) : (
          <span className="flex items-center gap-4">
            <Link
              href={ROUTES.admin.blogEditar(post.id)}
              className="text-[9px] tracking-widest uppercase text-plata/50 hover:text-dorado transition-colors"
            >
              Editar
            </Link>
            <button
              onClick={togglePublicado}
              disabled={isPending}
              className="text-[9px] tracking-widest uppercase text-plata/50 hover:text-dorado transition-colors"
            >
              {post.publicado ? 'Despublicar' : 'Publicar'}
            </button>
            <button
              onClick={() => setConfirmDelete(true)}
              disabled={isPending}
              className="text-[9px] tracking-widest uppercase text-plata/30 hover:text-red-400 transition-colors"
            >
              Eliminar
            </button>
          </span>
        )}
      </td>
    </tr>
  )
}
