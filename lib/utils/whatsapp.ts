const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '523337084290'

export function buildWhatsAppUrl(message: string): string {
  const encoded = encodeURIComponent(message)
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`
}

export function buildCotizacionWhatsAppUrl(destino: string, nombre: string): string {
  const message = `Hola, soy ${nombre} y me interesa cotizar un viaje a ${destino}.`
  return buildWhatsAppUrl(message)
}
