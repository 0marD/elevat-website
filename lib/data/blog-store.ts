/**
 * Capa de persistencia para posts del blog usando Prisma + PostgreSQL (Supabase).
 * Mismo contrato de funciones que la versión JSON anterior.
 */

import { prisma } from '@/lib/db'
import type { BlogPost, BlogPostSerialized } from '@/types/blog'
import type { BlogPostInput } from '@/lib/validations/blog'
import { slugify } from '@/lib/utils/slugify'

// ─── Serialización (server → client components) ──────────────────────────────

export function serialize(post: BlogPost): BlogPostSerialized {
  return {
    ...post,
    creadoEn:     post.creadoEn.toISOString(),
    actualizadoEn: post.actualizadoEn.toISOString(),
  }
}

// ─── Generación de slug único ─────────────────────────────────────────────────

async function uniqueSlug(titulo: string, excludeId?: string): Promise<string> {
  const base = slugify(titulo)
  const existing = await prisma.blogPost.findUnique({ where: { slug: base } })
  if (!existing || existing.id === excludeId) return base

  let i = 2
  while (true) {
    const candidate = `${base}-${i}`
    const found = await prisma.blogPost.findUnique({ where: { slug: candidate } })
    if (!found || found.id === excludeId) return candidate
    i++
  }
}

// ─── API pública del store ───────────────────────────────────────────────────

/** Todos los posts, ordenados por fecha de creación DESC. Solo admin. */
export async function getAll(): Promise<BlogPost[]> {
  return prisma.blogPost.findMany({ orderBy: { creadoEn: 'desc' } })
}

/** Solo posts publicados, ordenados por fecha DESC. Página pública. */
export async function getPublished(): Promise<BlogPost[]> {
  return prisma.blogPost.findMany({
    where:   { publicado: true },
    orderBy: { creadoEn: 'desc' },
  })
}

/** Busca un post publicado por su slug. Devuelve null si no existe o es borrador. */
export async function getBySlug(slug: string): Promise<BlogPost | null> {
  return prisma.blogPost.findFirst({ where: { slug, publicado: true } })
}

/** Busca un post por id (cualquier estado). Solo admin. */
export async function getById(id: string): Promise<BlogPost | null> {
  return prisma.blogPost.findUnique({ where: { id } })
}

/** Crea un nuevo post y lo persiste. */
export async function create(input: BlogPostInput): Promise<BlogPost> {
  const slug = await uniqueSlug(input.titulo)
  return prisma.blogPost.create({
    data: {
      titulo:        input.titulo,
      extracto:      input.extracto,
      contenido:     input.contenido,
      slug,
      imagenPortada: input.imagenPortada ?? null,
      categoria:     input.categoria,
      publicado:     input.publicado,
    },
  })
}

/** Actualiza un post existente. Devuelve null si no existe. */
export async function update(id: string, input: BlogPostInput): Promise<BlogPost | null> {
  try {
    return await prisma.blogPost.update({
      where: { id },
      data:  {
        titulo:        input.titulo,
        extracto:      input.extracto,
        contenido:     input.contenido,
        imagenPortada: input.imagenPortada ?? null,
        categoria:     input.categoria,
        publicado:     input.publicado,
      },
    })
  } catch {
    return null
  }
}

/** Cambia el estado publicado de un post. Devuelve null si no existe. */
export async function setPublished(id: string, publicado: boolean): Promise<BlogPost | null> {
  try {
    return await prisma.blogPost.update({ where: { id }, data: { publicado } })
  } catch {
    return null
  }
}

/** Elimina un post. Devuelve true si existía, false si no. */
export async function remove(id: string): Promise<boolean> {
  try {
    await prisma.blogPost.delete({ where: { id } })
    return true
  } catch {
    return false
  }
}
