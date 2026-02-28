import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { MensajeRapidoSchema } from '@/lib/validations/mensaje-rapido'

export async function POST(req: Request) {
  const body: unknown = await req.json()
  const result = MensajeRapidoSchema.safeParse(body)

  if (!result.success) {
    return NextResponse.json(
      { errors: result.error.flatten().fieldErrors },
      { status: 422 },
    )
  }

  const mensaje = await prisma.mensajeRapido.create({
    data: {
      nombre:   result.data.nombre.trim(),
      contacto: result.data.contacto.trim(),
      mensaje:  result.data.mensaje.trim(),
    },
  })

  return NextResponse.json({ id: mensaje.id }, { status: 201 })
}
