import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { setVisible, remove, serialize, getAll } from '@/lib/data/testimonios-store'

interface RouteContext {
  params: Promise<{ id: string }>
}

// PUT /api/testimonios/[id]   → actualizar visibilidad (requiere sesión)
export async function PUT(
  request: NextRequest,
  { params }: RouteContext
): Promise<NextResponse> {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const { id } = await params

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Body inválido' }, { status: 400 })
  }

  if (typeof body !== 'object' || body === null || !('visible' in body)) {
    return NextResponse.json({ error: 'Se requiere el campo "visible"' }, { status: 400 })
  }

  const { visible } = body as { visible: boolean }

  if (typeof visible !== 'boolean') {
    return NextResponse.json({ error: '"visible" debe ser un booleano' }, { status: 400 })
  }

  const updated = await setVisible(id, visible)
  if (!updated) {
    return NextResponse.json({ error: 'Testimonio no encontrado' }, { status: 404 })
  }

  return NextResponse.json(serialize(updated))
}

// DELETE /api/testimonios/[id]  → eliminar (requiere sesión)
export async function DELETE(
  _request: NextRequest,
  { params }: RouteContext
): Promise<NextResponse> {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const { id } = await params
  const deleted = await remove(id)

  if (!deleted) {
    return NextResponse.json({ error: 'Testimonio no encontrado' }, { status: 404 })
  }

  return NextResponse.json({ ok: true })
}

// GET /api/testimonios/[id]   → detalle (público)
export async function GET(
  _request: NextRequest,
  { params }: RouteContext
): Promise<NextResponse> {
  const { id } = await params
  const all = await getAll()
  const found = all.find((t) => t.id === id)

  if (!found) {
    return NextResponse.json({ error: 'Testimonio no encontrado' }, { status: 404 })
  }

  return NextResponse.json(serialize(found))
}
