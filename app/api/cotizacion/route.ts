import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { CotizacionSchema } from '@/lib/validations/cotizacion'
import { create, serialize } from '@/lib/data/cotizaciones-store'
import { cotizacionEmailHtml, cotizacionEmailSubject } from '@/lib/email/cotizacion-template'
import { sendPushToAll } from '@/lib/push/send'

const WA_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '523337084290'

function buildWhatsAppUrl(nombre: string, destino: string): string {
  const text = `Hola, acabo de solicitar una cotización en ÉLEVA. Soy ${nombre} y me interesa viajar a ${destino}.`
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const body = await request.json().catch(() => null)
  if (!body) return NextResponse.json({ error: 'Cuerpo inválido' }, { status: 400 })

  const result = CotizacionSchema.safeParse(body)
  if (!result.success) {
    return NextResponse.json(
      { error: 'Datos inválidos', issues: result.error.flatten().fieldErrors },
      { status: 422 },
    )
  }

  const cotizacion = await create(result.data)

  const adminEmail = process.env.ADMIN_EMAIL
  const fromEmail  = process.env.RESEND_FROM ?? 'ÉLEVA <onboarding@resend.dev>'

  if (adminEmail && process.env.RESEND_API_KEY) {
    const resend = new Resend(process.env.RESEND_API_KEY)
    resend.emails.send({
      from:    fromEmail,
      to:      adminEmail,
      subject: cotizacionEmailSubject(cotizacion),
      html:    cotizacionEmailHtml(cotizacion),
    }).catch((err: unknown) => {
      console.error('[cotizacion] Error al enviar email:', err)
    })
  }

  sendPushToAll({
    title: '📋 Nueva cotización',
    body:  `${cotizacion.nombre} → ${cotizacion.destino}`,
    url:   '/admin/cotizaciones',
  }).catch((err: unknown) => {
    console.error('[cotizacion] Error al enviar push:', err)
  })

  return NextResponse.json(
    {
      ok:          true,
      id:          cotizacion.id,
      whatsappUrl: buildWhatsAppUrl(cotizacion.nombre, cotizacion.destino),
      cotizacion:  serialize(cotizacion),
    },
    { status: 201 },
  )
}
