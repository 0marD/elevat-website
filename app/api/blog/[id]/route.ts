import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getById, update, setPublished, remove, serialize } from '@/lib/data/blog-store'
import { BlogPostSchema } from '@/lib/validations/blog'

interface RouteContext {
  params: Promise<{ id: string }>
}

export async function GET(
  _request: NextRequest,
  { params }: RouteContext,
): Promise<NextResponse> {
  const { id } = await params
  const post = await getById(id)
  if (!post) return NextResponse.json({ error: 'No encontrado' }, { status: 404 })
  return NextResponse.json(serialize(post))
}

export async function PUT(
  request: NextRequest,
  { params }: RouteContext,
): Promise<NextResponse> {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const { id } = await params
  const body = await request.json().catch(() => null)
  if (!body) return NextResponse.json({ error: 'Cuerpo inválido' }, { status: 400 })

  // Toggle rápido: { publicado: boolean } solamente
  if ('publicado' in body && Object.keys(body).length === 1) {
    const updated = await setPublished(id, Boolean(body.publicado))
    if (!updated) return NextResponse.json({ error: 'No encontrado' }, { status: 404 })
    return NextResponse.json(serialize(updated))
  }

  // Actualización completa desde el formulario
  const result = BlogPostSchema.safeParse(body)
  if (!result.success) {
    return NextResponse.json(
      { error: 'Datos inválidos', issues: result.error.flatten().fieldErrors },
      { status: 422 },
    )
  }

  const updated = await update(id, result.data)
  if (!updated) return NextResponse.json({ error: 'No encontrado' }, { status: 404 })
  return NextResponse.json(serialize(updated))
}

export async function DELETE(
  _request: NextRequest,
  { params }: RouteContext,
): Promise<NextResponse> {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const { id } = await params
  const deleted = await remove(id)
  if (!deleted) return NextResponse.json({ error: 'No encontrado' }, { status: 404 })
  return NextResponse.json({ ok: true })
}
