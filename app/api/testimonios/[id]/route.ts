import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { setVisible, update, remove, serialize, getById } from '@/lib/data/testimonios-store'
import { TestimonioSchema } from '@/lib/validations/testimonio'

interface RouteContext {
  params: Promise<{ id: string }>
}

// GET /api/testimonios/[id]   → detalle (público)
export async function GET(
  _request: NextRequest,
  { params }: RouteContext
): Promise<NextResponse> {
  const { id } = await params
  const found = await getById(id)

  if (!found) {
    return NextResponse.json({ error: 'Testimonio no encontrado' }, { status: 404 })
  }

  return NextResponse.json(serialize(found))
}

// PUT /api/testimonios/[id]
//   { visible: boolean }        → toggle visibilidad
//   { nombre, ciudad, … }       → actualización completa de campos
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

  if (typeof body !== 'object' || body === null) {
    return NextResponse.json({ error: 'Body inválido' }, { status: 400 })
  }

  // Toggle de visibilidad: { visible: boolean }
  if ('visible' in body && Object.keys(body).length === 1) {
    const { visible } = body as { visible: boolean }
    if (typeof visible !== 'boolean') {
      return NextResponse.json({ error: '"visible" debe ser un booleano' }, { status: 400 })
    }
    const updated = await setVisible(id, visible)
    if (!updated) return NextResponse.json({ error: 'Testimonio no encontrado' }, { status: 404 })
    return NextResponse.json(serialize(updated))
  }

  // Actualización completa
  const result = TestimonioSchema.safeParse(body)
  if (!result.success) {
    return NextResponse.json(
      { error: 'Datos inválidos', issues: result.error.flatten().fieldErrors },
      { status: 422 },
    )
  }

  const updated = await update(id, result.data)
  if (!updated) return NextResponse.json({ error: 'Testimonio no encontrado' }, { status: 404 })

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
