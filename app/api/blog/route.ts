import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getPublished, getAll, create, serialize } from '@/lib/data/blog-store'
import { BlogPostSchema } from '@/lib/validations/blog'
import { sendPushToAll } from '@/lib/push/send'

export async function GET(request: NextRequest): Promise<NextResponse> {
  const { searchParams } = request.nextUrl
  const all = searchParams.get('all') === '1'

  if (all) {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    return NextResponse.json((await getAll()).map(serialize))
  }

  return NextResponse.json((await getPublished()).map(serialize))
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const body = await request.json().catch(() => null)
  if (!body) return NextResponse.json({ error: 'Cuerpo inválido' }, { status: 400 })

  const result = BlogPostSchema.safeParse(body)
  if (!result.success) {
    return NextResponse.json(
      { error: 'Datos inválidos', issues: result.error.flatten().fieldErrors },
      { status: 422 },
    )
  }

  const post = await create(result.data)

  if (post.publicado) {
    sendPushToAll({
      title: 'Nuevo artículo en ÉLEVA.',
      body:  post.titulo,
      url:   `/blog/${post.slug}`,
    }).catch((err: unknown) => console.error('[push] blog:', err))
  }

  return NextResponse.json(serialize(post), { status: 201 })
}
