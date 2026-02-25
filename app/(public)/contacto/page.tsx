import type { Metadata } from 'next'
import Link from 'next/link'
import QuickContactForm from './QuickContactForm'
import JsonLd from '@/app/components/seo/JsonLd'

export const metadata: Metadata = {
  title: 'Contacto — ÉLEVA. Viajes de Autor',
  description: 'Escríbenos por WhatsApp, email o Instagram. Respondemos en menos de 4 horas en días hábiles.',
  alternates: { canonical: 'https://elevaviajes.mx/contacto' },
  openGraph: {
    title: 'Contacto — ÉLEVA.',
    description: 'Escríbenos y empieza a planear tu viaje ideal.',
    url: 'https://elevaviajes.mx/contacto',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contacto — ÉLEVA.',
    description: 'Escríbenos y empieza a planear tu viaje ideal.',
  },
}

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: '¿Cuánto cobra ÉLEVA por sus servicios?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Cobramos un service fee por la planeación y gestión de tu viaje, que varía según la complejidad del itinerario. Para paquetes sencillos comienza en $500 MXN y para itinerarios complejos puede llegar a $2,000 MXN.',
      },
    },
    {
      '@type': 'Question',
      name: '¿Cómo funciona el proceso de pago?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Tú nos pagas el total del viaje directamente a nosotros, nosotros gestionamos los pagos a todos los proveedores. Aceptamos transferencia SPEI, Mercado Pago y tarjeta de crédito/débito.',
      },
    },
    {
      '@type': 'Question',
      name: '¿En cuánto tiempo recibo mi cotización?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'En menos de 48 horas desde que recibes tu solicitud. Para casos urgentes, escríbenos directamente por WhatsApp y podemos tener una propuesta inicial en el mismo día.',
      },
    },
    {
      '@type': 'Question',
      name: '¿Qué pasa si necesito cambiar algo de mi itinerario?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Trabajamos contigo hasta que el itinerario esté exactamente como lo imaginas — antes de hacer cualquier pago.',
      },
    },
    {
      '@type': 'Question',
      name: '¿Viajan a cualquier destino del mundo?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Sí. Aunque nos especializamos en destinos premium en México, el Caribe, Europa y Asia, tenemos acceso a prácticamente cualquier destino.',
      },
    },
  ],
}

const WA_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '523337084290'
const WA_HREF = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent('Hola, me gustaría información sobre un viaje')}`

export default function ContactoPage() {
  return (
    <div className="min-h-screen pt-32 pb-24">
      <JsonLd data={faqJsonLd} />
      <div className="max-w-7xl mx-auto px-6 md:px-12">

        {/* Header */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-20 mb-20">
          <div>
            <div className="section-label">Estamos aquí para ti</div>
            <h1 className="display-heading mb-6" style={{ fontSize: 'clamp(40px, 5vw, 64px)' }}>
              Hablemos de<br /><em className="text-dorado">tu próximo viaje</em>
            </h1>
            <p className="text-plata text-sm leading-loose mb-10 max-w-md">
              Cada gran viaje comienza con una conversación. Escríbenos por el canal que prefieras — respondemos en menos de 4 horas en días hábiles.
            </p>

            {/* Contact options */}
            <div className="space-y-4">
              <a
                href={WA_HREF}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-5 card-dark p-5 group"
              >
                <div className="w-10 h-10 border border-dorado/30 flex items-center justify-center text-dorado flex-shrink-0">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347"/>
                  </svg>
                </div>
                <div>
                  <div className="text-crema text-sm group-hover:text-dorado transition-colors">WhatsApp</div>
                  <div className="text-plata/40 mt-0.5" style={{ fontSize: '9px', letterSpacing: '3px' }}>RESPUESTA INMEDIATA</div>
                </div>
                <span className="ml-auto text-dorado/40 group-hover:text-dorado transition-colors text-lg">→</span>
              </a>

              <a
                href="mailto:hola@elevaviajes.mx"
                className="flex items-center gap-5 card-dark p-5 group"
              >
                <div className="w-10 h-10 border border-dorado/30 flex items-center justify-center text-dorado flex-shrink-0">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                  </svg>
                </div>
                <div>
                  <div className="text-crema text-sm group-hover:text-dorado transition-colors">hola@elevaviajes.mx</div>
                  <div className="text-plata/40 mt-0.5" style={{ fontSize: '9px', letterSpacing: '3px' }}>RESPUESTA EN 4 HORAS</div>
                </div>
                <span className="ml-auto text-dorado/40 group-hover:text-dorado transition-colors text-lg">→</span>
              </a>

              <a
                href="https://instagram.com/elevaviajes"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-5 card-dark p-5 group"
              >
                <div className="w-10 h-10 border border-dorado/30 flex items-center justify-center text-dorado flex-shrink-0">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                    <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                  </svg>
                </div>
                <div>
                  <div className="text-crema text-sm group-hover:text-dorado transition-colors">@elevaviajes</div>
                  <div className="text-plata/40 mt-0.5" style={{ fontSize: '9px', letterSpacing: '3px' }}>INSTAGRAM</div>
                </div>
                <span className="ml-auto text-dorado/40 group-hover:text-dorado transition-colors text-lg">→</span>
              </a>
            </div>
          </div>

          {/* Quick contact form */}
          <div className="card-dark p-10">
            <div className="section-label mb-6">Mensaje rápido</div>
            <QuickContactForm />
          </div>
        </div>

        <hr className="divider-gold my-16" />

        {/* FAQ */}
        <div className="max-w-3xl">
          <div className="section-label mb-4">Preguntas frecuentes</div>
          <h2 className="display-heading mb-12" style={{ fontSize: 'clamp(28px, 4vw, 44px)' }}>
            Lo que más nos <em className="text-dorado">preguntan</em>
          </h2>

          <div className="space-y-2">
            {[
              {
                q: '¿Cuánto cobra ÉLEVA por sus servicios?',
                a: 'Cobramos un service fee por la planeación y gestión de tu viaje, que varía según la complejidad del itinerario. Para paquetes sencillos comienza en $500 MXN y para itinerarios complejos puede llegar a $2,000 MXN. Este monto se aplica sin importar el costo del viaje y es completamente transparente desde el primer contacto.',
              },
              {
                q: '¿Cómo funciona el proceso de pago?',
                a: 'Tú nos pagas el total del viaje directamente a nosotros, nosotros gestionamos los pagos a todos los proveedores. Aceptamos transferencia SPEI, Mercado Pago y tarjeta de crédito/débito. Para viajes con más de 60 días de anticipación solicitamos un depósito del 30% para asegurar disponibilidad.',
              },
              {
                q: '¿En cuánto tiempo recibo mi cotización?',
                a: 'En menos de 48 horas desde que recibes tu solicitud. Para casos urgentes, escríbenos directamente por WhatsApp y podemos tener una propuesta inicial en el mismo día.',
              },
              {
                q: '¿Qué pasa si necesito cambiar algo de mi itinerario?',
                a: 'Trabajamos contigo hasta que el itinerario esté exactamente como lo imaginas — antes de hacer cualquier pago. Una vez confirmado y pagado, los cambios dependen de las políticas de cada proveedor, pero siempre te acompañamos en el proceso.',
              },
              {
                q: '¿Viajan a cualquier destino del mundo?',
                a: 'Sí. Aunque nos especializamos en destinos premium en México, el Caribe, Europa y Asia, tenemos acceso a prácticamente cualquier destino. Si tienes algo en mente, pregúntanos.',
              },
            ].map((item, i) => (
              <details key={i} className="card-dark group">
                <summary className="p-6 cursor-pointer flex justify-between items-center list-none">
                  <span className="text-crema text-sm pr-8" style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '18px', fontWeight: 300 }}>
                    {item.q}
                  </span>
                  <span className="text-dorado flex-shrink-0 transition-transform duration-300 group-open:rotate-45">+</span>
                </summary>
                <div className="px-6 pb-6">
                  <p className="text-plata/70 text-xs leading-loose border-t border-dorado/10 pt-4">{item.a}</p>
                </div>
              </details>
            ))}
          </div>
        </div>

        {/* Final CTA */}
        <div className="mt-20 text-center">
          <p className="text-plata text-sm mb-6">¿Prefieres empezar con una cotización formal?</p>
          <Link href="/cotizacion" className="btn-gold">Ir al formulario de cotización →</Link>
        </div>

      </div>
    </div>
  )
}
