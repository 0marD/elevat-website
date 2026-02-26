import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getAll, getVisible, create, serialize } from '@/lib/data/testimonios-store'
import { TestimonioSchema } from '@/lib/validations/testimonio'
import { sendPushToAll } from '@/lib/push/send'

// GET /api/testimonios          → testimonios visibles (público)
// GET /api/testimonios?all=1    → todos (requiere sesión admin)
export async function GET(request: NextRequest): Promise<NextResponse> {
  const showAll = request.nextUrl.searchParams.get('all') === '1'

  if (showAll) {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }
    return NextResponse.json((await getAll()).map(serialize))
  }

  return NextResponse.json((await getVisible()).map(serialize))
}

// POST /api/testimonios         → crear (requiere sesión admin)
export async function POST(request: NextRequest): Promise<NextResponse> {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Body inválido' }, { status: 400 })
  }

  const result = TestimonioSchema.safeParse(body)
  if (!result.success) {
    return NextResponse.json(
      { error: 'Datos inválidos', issues: result.error.flatten().fieldErrors },
      { status: 422 }
    )
  }

  const nuevo = await create(result.data)

  sendPushToAll({
    title: 'Nueva experiencia compartida.',
    body:  `${nuevo.nombre} comparte su viaje`,
    url:   '/testimonios',
  }).catch((err: unknown) => console.error('[push] testimonio:', err))

  return NextResponse.json(serialize(nuevo), { status: 201 })
}
