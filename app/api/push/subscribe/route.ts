import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { saveSubscription, deleteSubscription } from '@/lib/data/push-store'

const SubscribeSchema = z.object({
  endpoint: z.string().url(),
  p256dh:   z.string().min(1),
  auth:     z.string().min(1),
})

const UnsubscribeSchema = z.object({
  endpoint: z.string().url(),
})

export async function POST(request: NextRequest): Promise<NextResponse> {
  const body = await request.json().catch(() => null)
  if (!body) return NextResponse.json({ error: 'Cuerpo inválido' }, { status: 400 })

  const result = SubscribeSchema.safeParse(body)
  if (!result.success) {
    return NextResponse.json(
      { error: 'Datos inválidos', issues: result.error.flatten().fieldErrors },
      { status: 422 },
    )
  }

  const { endpoint, p256dh, auth } = result.data
  await saveSubscription(endpoint, p256dh, auth)
  return NextResponse.json({ ok: true }, { status: 201 })
}

export async function DELETE(request: NextRequest): Promise<NextResponse> {
  const body = await request.json().catch(() => null)
  if (!body) return NextResponse.json({ error: 'Cuerpo inválido' }, { status: 400 })

  const result = UnsubscribeSchema.safeParse(body)
  if (!result.success) {
    return NextResponse.json(
      { error: 'Datos inválidos', issues: result.error.flatten().fieldErrors },
      { status: 422 },
    )
  }

  await deleteSubscription(result.data.endpoint)
  return NextResponse.json({ ok: true })
}
