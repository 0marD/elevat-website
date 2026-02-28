/**
 * Capa de persistencia para testimonios usando Prisma + PostgreSQL (Supabase).
 * Mismo contrato de funciones que la versión JSON anterior.
 */

import { prisma } from '@/lib/db'
import type { Testimonio, TestimonioSerialized } from '@/types/testimonio'
import type { TestimonioInput } from '@/lib/validations/testimonio'

// ─── Serialización (server → client components) ──────────────────────────────

export function serialize(t: Testimonio): TestimonioSerialized {
  return { ...t, creadoEn: t.creadoEn.toISOString() }
}

// ─── API pública del store ───────────────────────────────────────────────────

/** Todos los testimonios, ordenados por `orden` ASC. Admin use only. */
export async function getAll(): Promise<Testimonio[]> {
  return prisma.testimonio.findMany({ orderBy: { orden: 'asc' } })
}

/** Solo los testimonios visibles, ordenados por `orden` ASC. Página pública. */
export async function getVisible(): Promise<Testimonio[]> {
  return prisma.testimonio.findMany({
    where:   { visible: true },
    orderBy: { orden: 'asc' },
  })
}

/** Crea un nuevo testimonio y lo persiste. */
export async function create(input: TestimonioInput): Promise<Testimonio> {
  const maxOrdenRow = await prisma.testimonio.findFirst({
    orderBy: { orden: 'desc' },
    select:  { orden: true },
  })
  const nextOrden = (maxOrdenRow?.orden ?? 0) + 1

  return prisma.testimonio.create({
    data: {
      nombre:       input.nombre,
      ciudad:       input.ciudad,
      viaje:        input.viaje,
      texto:        input.texto,
      calificacion: input.calificacion,
      visible:      true,
      orden:        nextOrden,
    },
  })
}

/** Busca un testimonio por id. Devuelve null si no existe. */
export async function getById(id: string): Promise<Testimonio | null> {
  return prisma.testimonio.findUnique({ where: { id } })
}

/** Actualiza los campos editables de un testimonio. Devuelve null si no existe. */
export async function update(id: string, input: TestimonioInput): Promise<Testimonio | null> {
  try {
    return await prisma.testimonio.update({
      where: { id },
      data: {
        nombre:       input.nombre,
        ciudad:       input.ciudad,
        viaje:        input.viaje,
        texto:        input.texto,
        calificacion: input.calificacion,
      },
    })
  } catch {
    return null
  }
}

/** Activa o desactiva la visibilidad de un testimonio. Devuelve null si no existe. */
export async function setVisible(id: string, visible: boolean): Promise<Testimonio | null> {
  try {
    return await prisma.testimonio.update({ where: { id }, data: { visible } })
  } catch {
    return null
  }
}

/** Elimina un testimonio. Devuelve true si existía, false si no. */
export async function remove(id: string): Promise<boolean> {
  try {
    await prisma.testimonio.delete({ where: { id } })
    return true
  } catch {
    return false
  }
}
