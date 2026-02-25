/**
 * Capa de persistencia para destinos usando Prisma + PostgreSQL (Supabase).
 * Mismo contrato de funciones que la versión JSON anterior.
 */

import { prisma } from '@/lib/db'
import type { Destino, DestinoSerialized } from '@/types/destino'
import type { DestinoInput } from '@/lib/validations/destino'
import { slugify } from '@/lib/utils/slugify'

// ─── Serialización (server → client components) ──────────────────────────────

export function serialize(d: Destino): DestinoSerialized {
  return { ...d, creadoEn: d.creadoEn.toISOString() }
}

// ─── API pública del store ───────────────────────────────────────────────────

/** Todos los destinos, ordenados por fecha de creación DESC. Admin use only. */
export async function getAll(): Promise<Destino[]> {
  return prisma.destino.findMany({ orderBy: { creadoEn: 'desc' } })
}

/** Solo los destinos activos, ordenados por fecha de creación ASC. Página pública. */
export async function getActivos(): Promise<Destino[]> {
  return prisma.destino.findMany({
    where:   { activo: true },
    orderBy: { creadoEn: 'asc' },
  })
}

/** Busca un destino por slug. Devuelve null si no existe. */
export async function getBySlug(slug: string): Promise<Destino | null> {
  return prisma.destino.findUnique({ where: { slug } })
}

/** Crea un nuevo destino y lo persiste. */
export async function create(input: DestinoInput): Promise<Destino> {
  const baseSlug = slugify(input.nombre)
  let slug = baseSlug
  let counter = 2
  while (await prisma.destino.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${counter++}`
  }

  return prisma.destino.create({
    data: {
      nombre:          input.nombre,
      slug,
      pais:            input.pais,
      tipo:            input.tipo,
      descripcion:     input.descripcion,
      imagenPrincipal: input.imagenPrincipal,
      etiquetas:       input.etiquetas,
      activo:          input.activo ?? true,
    },
  })
}

/** Actualiza todos los campos de un destino. Devuelve null si no existe. */
export async function update(id: string, input: DestinoInput): Promise<Destino | null> {
  try {
    return await prisma.destino.update({
      where: { id },
      data:  {
        nombre:          input.nombre,
        pais:            input.pais,
        tipo:            input.tipo,
        descripcion:     input.descripcion,
        imagenPrincipal: input.imagenPrincipal,
        etiquetas:       input.etiquetas,
        activo:          input.activo ?? true,
      },
    })
  } catch {
    return null
  }
}

/** Activa o desactiva un destino. Devuelve null si no existe. */
export async function setActivo(id: string, activo: boolean): Promise<Destino | null> {
  try {
    return await prisma.destino.update({ where: { id }, data: { activo } })
  } catch {
    return null
  }
}

/** Elimina un destino. Devuelve true si existía, false si no. */
export async function remove(id: string): Promise<boolean> {
  try {
    await prisma.destino.delete({ where: { id } })
    return true
  } catch {
    return false
  }
}
