import type { Cotizacion } from '@/types/cotizacion'

const PRESUPUESTO_LABELS: Record<string, string> = {
  '20000-40000':   '$20,000 – $40,000 MXN',
  '40000-80000':   '$40,000 – $80,000 MXN',
  '80000-150000':  '$80,000 – $150,000 MXN',
  '150000+':       'Más de $150,000 MXN',
  'flexible':      'Presupuesto flexible',
}

function row(label: string, value: string): string {
  if (!value) return ''
  return `
    <tr>
      <td style="padding:10px 16px;color:#8A8A8A;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;white-space:nowrap;vertical-align:top;width:140px;">${label}</td>
      <td style="padding:10px 16px;color:#F5F0E8;font-size:14px;vertical-align:top;">${value}</td>
    </tr>`
}

export function cotizacionEmailHtml(c: Cotizacion): string {
  const presupuestoLabel = PRESUPUESTO_LABELS[c.presupuesto] ?? c.presupuesto ?? '–'
  const viajeros = `${c.adultos} adulto${c.adultos !== '1' ? 's' : ''}${c.ninos !== '0' ? `, ${c.ninos} niño${c.ninos !== '1' ? 's' : ''}` : ''}`
  const fechas = [c.fecha_salida, c.fecha_regreso].filter(Boolean).join(' → ') || '–'
  const intereses = c.intereses.length > 0 ? c.intereses.join(', ') : '–'

  return `<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#0A0A0A;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table role="presentation" width="100%" style="background:#0A0A0A;padding:40px 20px;">
    <tr><td align="center">
      <table role="presentation" width="600" style="max-width:600px;background:#111;border:1px solid rgba(201,168,76,0.2);">

        <!-- Header -->
        <tr>
          <td style="padding:32px 40px;border-bottom:1px solid rgba(201,168,76,0.15);text-align:center;">
            <p style="margin:0 0 8px;font-size:9px;letter-spacing:0.5em;text-transform:uppercase;color:rgba(201,168,76,0.6);">Nueva solicitud</p>
            <h1 style="margin:0;font-size:28px;font-weight:300;color:#F5F0E8;letter-spacing:0.05em;">ÉLEVA <span style="color:#C9A84C;">·</span> Viajes de Autor</h1>
          </td>
        </tr>

        <!-- Alert badge -->
        <tr>
          <td style="padding:24px 40px 0;text-align:center;">
            <span style="display:inline-block;background:rgba(201,168,76,0.12);color:#C9A84C;font-size:10px;letter-spacing:0.3em;text-transform:uppercase;padding:8px 20px;">
              Cotización pendiente de atención
            </span>
          </td>
        </tr>

        <!-- Data table -->
        <tr>
          <td style="padding:24px 24px 8px;">
            <table role="presentation" width="100%" style="border-collapse:collapse;">
              ${row('Nombre', c.nombre)}
              ${row('Email', `<a href="mailto:${c.email}" style="color:#C9A84C;text-decoration:none;">${c.email}</a>`)}
              ${row('WhatsApp', `<a href="https://wa.me/${c.whatsapp.replace(/\D/g, '')}" style="color:#C9A84C;text-decoration:none;">${c.whatsapp}</a>`)}
              <tr><td colspan="2" style="padding:4px 0;"><hr style="border:none;border-top:1px solid rgba(255,255,255,0.06);margin:4px 0;"></td></tr>
              ${row('Destino', c.destino)}
              ${row('Tipo de viaje', c.tipo_viaje)}
              ${row('Categoría', c.categoria)}
              ${row('Viajeros', viajeros)}
              ${row('Fechas', fechas)}
              ${row('Presupuesto', presupuestoLabel)}
              ${row('Intereses', intereses)}
            </table>
          </td>
        </tr>

        <!-- Mensaje -->
        ${c.mensaje ? `
        <tr>
          <td style="padding:0 40px 24px;">
            <p style="margin:0 0 8px;font-size:9px;letter-spacing:0.3em;text-transform:uppercase;color:#8A8A8A;">Mensaje adicional</p>
            <p style="margin:0;color:rgba(245,240,232,0.7);font-size:14px;line-height:1.7;background:rgba(255,255,255,0.03);padding:16px;border-left:2px solid rgba(201,168,76,0.3);">${c.mensaje}</p>
          </td>
        </tr>` : ''}

        <!-- CTA -->
        <tr>
          <td style="padding:24px 40px 32px;text-align:center;border-top:1px solid rgba(201,168,76,0.1);">
            <a href="https://wa.me/${c.whatsapp.replace(/\D/g, '')}"
               style="display:inline-block;background:#C9A84C;color:#0A0A0A;text-decoration:none;font-size:10px;letter-spacing:0.25em;text-transform:uppercase;padding:14px 32px;margin-right:8px;">
              Responder por WhatsApp
            </a>
            <a href="mailto:${c.email}"
               style="display:inline-block;border:1px solid rgba(201,168,76,0.4);color:#C9A84C;text-decoration:none;font-size:10px;letter-spacing:0.25em;text-transform:uppercase;padding:14px 32px;">
              Responder por Email
            </a>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="padding:16px 40px;background:rgba(0,0,0,0.3);text-align:center;">
            <p style="margin:0;font-size:10px;color:#8A8A8A;">
              Notificación automática — Panel ÉLEVA ·
              <a href="/admin/cotizaciones" style="color:rgba(201,168,76,0.6);text-decoration:none;">Ver en el panel</a>
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`
}

export function cotizacionEmailSubject(c: Cotizacion): string {
  return `Nueva cotización: ${c.nombre} → ${c.destino}`
}
