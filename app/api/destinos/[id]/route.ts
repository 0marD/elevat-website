import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getAll, setActivo, update, remove, serialize } from '@/lib/data/destinos-store'
import { DestinoSchema } from '@/lib/validations/destino'

interface RouteContext {
  params: Promise<{ id: string }>
}

// GET /api/destinos/[id]   → detalle (público)
export async function GET(
  _request: NextRequest,
  { params }: RouteContext
): Promise<NextResponse> {
  const { id } = await params
  const all = await getAll()
  const found = all.find((d) => d.id === id)

  if (!found) {
    return NextResponse.json({ error: 'Destino no encontrado' }, { status: 404 })
  }

  return NextResponse.json(serialize(found))
}

// PUT /api/destinos/[id]   → actualizar (requiere sesión)
// Body completo → update total; { activo: boolean } → toggle
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

  // Toggle: { activo: boolean }
  const isToggle =
    typeof body === 'object' &&
    body !== null &&
    Object.keys(body).length === 1 &&
    'activo' in body

  if (isToggle) {
    const { activo } = body as { activo: boolean }
    if (typeof activo !== 'boolean') {
      return NextResponse.json({ error: '"activo" debe ser un booleano' }, { status: 400 })
    }
    const updated = await setActivo(id, activo)
    if (!updated) {
      return NextResponse.json({ error: 'Destino no encontrado' }, { status: 404 })
    }
    return NextResponse.json(serialize(updated))
  }

  // Update completo
  const result = DestinoSchema.safeParse(body)
  if (!result.success) {
    return NextResponse.json(
      { error: 'Datos inválidos', issues: result.error.flatten().fieldErrors },
      { status: 422 }
    )
  }

  const updated = await update(id, result.data)
  if (!updated) {
    return NextResponse.json({ error: 'Destino no encontrado' }, { status: 404 })
  }

  return NextResponse.json(serialize(updated))
}

// DELETE /api/destinos/[id]  → eliminar (requiere sesión)
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
    return NextResponse.json({ error: 'Destino no encontrado' }, { status: 404 })
  }

  return NextResponse.json({ ok: true })
}
