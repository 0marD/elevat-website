import { NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { prisma } from '@/lib/db'
import { z } from 'zod'

const PatchSchema = z.object({ leido: z.boolean() })

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const token = await getToken({ req: req as Parameters<typeof getToken>[0]['req'] })
  if (!token) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const { id } = await params
  const body: unknown = await req.json()
  const result = PatchSchema.safeParse(body)
  if (!result.success) return NextResponse.json({ error: 'Datos inválidos' }, { status: 422 })

  const mensaje = await prisma.mensajeRapido.update({
    where: { id },
    data: { leido: result.data.leido },
  })

  return NextResponse.json({ id: mensaje.id, leido: mensaje.leido })
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const token = await getToken({ req: req as Parameters<typeof getToken>[0]['req'] })
  if (!token) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const { id } = await params
  await prisma.mensajeRapido.delete({ where: { id } })

  return new NextResponse(null, { status: 204 })
}
