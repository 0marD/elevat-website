/**
 * Capa de persistencia para cotizaciones usando Prisma + PostgreSQL (Supabase).
 * Mismo contrato de funciones que la versión JSON anterior.
 */

import { prisma } from '@/lib/db'
import type { Cotizacion, CotizacionSerialized, EstadoCotizacion } from '@/types/cotizacion'
import type { CotizacionInput } from '@/lib/validations/cotizacion'

// ─── Serialización (server → client components) ──────────────────────────────

export function serialize(c: Cotizacion): CotizacionSerialized {
  return { ...c, creadoEn: c.creadoEn.toISOString() }
}

// ─── API pública del store ───────────────────────────────────────────────────

/** Todas las cotizaciones, ordenadas por fecha DESC. */
export async function getAll(): Promise<Cotizacion[]> {
  const rows = await prisma.cotizacion.findMany({ orderBy: { creadoEn: 'desc' } })
  return rows.map((r) => ({ ...r, estado: r.estado as EstadoCotizacion }))
}

/** Busca una cotización por id. */
export async function getById(id: string): Promise<Cotizacion | null> {
  const row = await prisma.cotizacion.findUnique({ where: { id } })
  if (!row) return null
  return { ...row, estado: row.estado as EstadoCotizacion }
}

/** Crea y persiste una nueva cotización. */
export async function create(input: CotizacionInput): Promise<Cotizacion> {
  const row = await prisma.cotizacion.create({
    data: {
      nombre:        input.nombre,
      email:         input.email,
      whatsapp:      input.whatsapp,
      tipo_viaje:    input.tipo_viaje,
      destino:       input.destino,
      fecha_salida:  input.fecha_salida ?? '',
      fecha_regreso: input.fecha_regreso ?? '',
      adultos:       input.adultos,
      ninos:         input.ninos,
      presupuesto:   input.presupuesto ?? '',
      categoria:     input.categoria,
      intereses:     input.intereses,
      mensaje:       input.mensaje ?? '',
      estado:        'pendiente',
    },
  })
  return { ...row, estado: row.estado as EstadoCotizacion }
}

/** Cambia el estado de una cotización. Devuelve null si no existe. */
export async function setEstado(id: string, estado: EstadoCotizacion): Promise<Cotizacion | null> {
  try {
    const row = await prisma.cotizacion.update({ where: { id }, data: { estado } })
    return { ...row, estado: row.estado as EstadoCotizacion }
  } catch {
    return null
  }
}

/** Elimina una cotización. Devuelve true si existía. */
export async function remove(id: string): Promise<boolean> {
  try {
    await prisma.cotizacion.delete({ where: { id } })
    return true
  } catch {
    return false
  }
}
