import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { setEstado, remove, serialize } from '@/lib/data/cotizaciones-store'
import type { EstadoCotizacion } from '@/types/cotizacion'

interface RouteContext {
  params: Promise<{ id: string }>
}

// PATCH /api/cotizacion/[id] — Cambia el estado (pendiente ↔ atendida)
export async function PATCH(
  request: NextRequest,
  { params }: RouteContext,
): Promise<NextResponse> {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const { id } = await params
  const body = await request.json().catch(() => null) as { estado?: EstadoCotizacion } | null
  if (!body?.estado || !['pendiente', 'atendida'].includes(body.estado)) {
    return NextResponse.json({ error: 'Estado inválido' }, { status: 400 })
  }

  const updated = await setEstado(id, body.estado)
  if (!updated) return NextResponse.json({ error: 'No encontrada' }, { status: 404 })
  return NextResponse.json(serialize(updated))
}

// DELETE /api/cotizacion/[id] — Elimina una cotización
export async function DELETE(
  _request: NextRequest,
  { params }: RouteContext,
): Promise<NextResponse> {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const { id } = await params
  const deleted = await remove(id)
  if (!deleted) return NextResponse.json({ error: 'No encontrada' }, { status: 404 })
  return NextResponse.json({ ok: true })
}
