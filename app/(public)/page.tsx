import type { Metadata } from 'next'
import Link from 'next/link'
import JsonLd from '@/app/components/seo/JsonLd'

export const metadata: Metadata = {
  title: 'ÉLEVA. — Agencia de Viajes de Lujo en México',
  description: 'Diseñamos experiencias de viaje completamente personalizadas. Destinos nacionales e internacionales con atención 100% personalizada.',
  alternates: { canonical: 'https://elevaviajes.mx' },
  openGraph: {
    title: 'ÉLEVA. — Agencia de Viajes de Lujo en México',
    description: 'No vendemos viajes. Diseñamos experiencias.',
    url: 'https://elevaviajes.mx',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ÉLEVA. — Agencia de Viajes de Lujo en México',
    description: 'No vendemos viajes. Diseñamos experiencias.',
  },
}

const WA_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '523337084290'
const WA_HREF = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent('Hola, me gustaría información sobre un viaje')}`

const destinos = [
  { nombre: 'Los Cabos', pais: 'México', tipo: 'Playa de lujo', img: 'https://images.unsplash.com/photo-1510097467424-192d713fd8b2?w=600&q=80' },
  { nombre: 'Toscana', pais: 'Italia', tipo: 'Cultura & gastronomía', img: 'https://images.unsplash.com/photo-1534430480872-3498386e7856?w=600&q=80' },
  { nombre: 'Kioto', pais: 'Japón', tipo: 'Experiencia cultural', img: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=600&q=80' },
]

const pasos = [
  { num: '01', titulo: 'Cuéntanos tu visión', desc: 'Completa nuestro formulario de cotización con tus preferencias, fechas y presupuesto.' },
  { num: '02', titulo: 'Diseñamos tu itinerario', desc: 'En 24–48 horas te presentamos una propuesta personalizada con opciones curadas.' },
  { num: '03', titulo: 'Refinamos juntos', desc: 'Ajustamos cada detalle hasta que el viaje sea exactamente lo que imaginaste.' },
  { num: '04', titulo: 'Tú solo disfrutas', desc: 'Nos encargamos de toda la logística. Tú llega y vive la experiencia.' },
]

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'TravelAgency',
  name: 'ÉLEVA.',
  description: 'Agencia de viajes de autor especializada en experiencias personalizadas de lujo.',
  url: 'https://elevaviajes.mx',
  logo: 'https://elevaviajes.mx/icons/icon-512.svg',
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+52-33-3708-4290',
    contactType: 'customer service',
    availableLanguage: 'Spanish',
  },
  sameAs: [
    'https://instagram.com/elevaviajes',
    'https://wa.me/523337084290',
  ],
  areaServed: {
    '@type': 'Country',
    name: 'Mexico',
  },
  priceRange: '$$$',
}

export default function HomePage() {
  return (
    <>
      <JsonLd data={organizationJsonLd} />
      {/* ── HERO ───────────────────────────────────── */}
      <section className="relative min-h-screen flex flex-col justify-center items-center text-center px-6 overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full"
            style={{ background: 'radial-gradient(ellipse, rgba(92,26,46,0.25) 0%, transparent 70%)' }} />
        </div>

        <div className="relative z-10 max-w-4xl">
          <div className="section-label mb-8">Agencia de viajes de autor · México</div>

          <h1 className="display-heading mb-6"
            style={{ fontSize: 'clamp(56px, 10vw, 110px)', letterSpacing: '10px' }}>
            ÉLEVA<span className="text-dorado">.</span>
          </h1>

          <span className="gold-line mx-auto mb-8 block" />

          <p className="text-crema/60 mb-12 max-w-xl mx-auto leading-loose"
            style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(18px, 2.5vw, 24px)', fontStyle: 'italic', fontWeight: 300 }}>
            "Cada destino, una experiencia<br />diseñada sólo para ti."
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/cotizacion" className="btn-gold">Cotizar mi viaje</Link>
            <Link href="/destinos" className="btn-ghost">Ver destinos</Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40">
          <span style={{ fontSize: '8px', letterSpacing: '4px', color: '#C9A84C' }}>SCROLL</span>
          <div className="w-px h-10 bg-gradient-to-b from-dorado to-transparent" />
        </div>
      </section>

      <hr className="divider-gold" />

      {/* ── PROPUESTA DE VALOR ─────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 py-28">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
          <div>
            <div className="section-label">Por qué ÉLEVA</div>
            <h2 className="display-heading mb-8" style={{ fontSize: 'clamp(36px, 4vw, 52px)' }}>
              No vendemos viajes.<br />
              <em className="text-dorado" style={{ fontStyle: 'italic' }}>Diseñamos experiencias.</em>
            </h2>
            <p className="text-plata text-sm leading-loose mb-6">
              En un mundo donde cualquiera puede buscar un vuelo en internet, nuestro valor está en el detalle invisible: el hotel que no aparece en Booking, la mesa con la mejor vista, el guía que abre puertas que otros no conocen.
            </p>
            <p className="text-plata text-sm leading-loose mb-10">
              Atención personalizada desde el primer mensaje hasta que regresas a casa.
            </p>
            <Link href="/cotizacion" className="btn-gold">Empezar a planear</Link>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {[
              { num: '100%', label: 'Atención personalizada' },
              { num: '48h', label: 'Tiempo de respuesta' },
              { num: '5★', label: 'Hoteles y experiencias' },
              { num: '∞', label: 'Destinos disponibles' },
            ].map(item => (
              <div key={item.label} className="card-dark p-8 text-center">
                <div className="text-dorado mb-2"
                  style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '48px', fontWeight: 300 }}>
                  {item.num}
                </div>
                <div className="text-plata/60" style={{ fontSize: '9px', letterSpacing: '3px', textTransform: 'uppercase' }}>
                  {item.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <hr className="divider-gold" />

      {/* ── DESTINOS DESTACADOS ────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 py-28">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16">
          <div>
            <div className="section-label">Destinos curados</div>
            <h2 className="display-heading" style={{ fontSize: 'clamp(36px, 4vw, 52px)' }}>
              Experiencias que<br /><em className="text-dorado">transforman</em>
            </h2>
          </div>
          <Link href="/destinos" className="btn-ghost mt-6 md:mt-0">Ver todos →</Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          {destinos.map((d) => (
            <div key={d.nombre} className="group relative overflow-hidden cursor-pointer" style={{ aspectRatio: '3/4' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={d.img} alt={d.nombre} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-negro via-negro/40 to-transparent" />
              <div className="absolute bottom-0 left-0 p-8">
                <div className="section-label mb-2" style={{ color: 'rgba(201,168,76,0.7)' }}>{d.tipo}</div>
                <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '32px', fontWeight: 300, letterSpacing: '3px', color: '#F5F0E8' }}>
                  {d.nombre}
                </div>
                <div className="text-plata/60 text-xs tracking-widest mt-1">{d.pais}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <hr className="divider-gold" />

      {/* ── CÓMO FUNCIONA ─────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 py-28">
        <div className="text-center mb-20">
          <div className="section-label">El proceso</div>
          <h2 className="display-heading" style={{ fontSize: 'clamp(36px, 4vw, 52px)' }}>
            Cómo <em className="text-dorado">funciona</em>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
          {pasos.map((p) => (
            <div key={p.num} className="card-dark p-8 relative">
              <div className="text-dorado/20 mb-6"
                style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '64px', fontWeight: 300, lineHeight: 1 }}>
                {p.num}
              </div>
              <div className="text-crema mb-3"
                style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '20px', fontWeight: 300 }}>
                {p.titulo}
              </div>
              <p className="text-plata/70 text-xs leading-loose">{p.desc}</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <Link href="/cotizacion" className="btn-gold">Comenzar ahora</Link>
        </div>
      </section>

      <hr className="divider-gold" />

      {/* ── CTA FINAL ─────────────────────────────── */}
      <section className="relative py-40 overflow-hidden text-center">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at center, rgba(92,26,46,0.3) 0%, transparent 70%)' }} />
        <div className="relative z-10 max-w-2xl mx-auto px-6">
          <div className="section-label mb-6">¿Listo para tu próxima experiencia?</div>
          <h2 className="display-heading mb-8" style={{ fontSize: 'clamp(36px, 5vw, 60px)' }}>
            Tu viaje ideal comienza<br />
            <em className="text-dorado">con una conversación</em>
          </h2>
          <p className="text-plata text-sm leading-loose mb-12">
            Cuéntanos qué tienes en mente. En menos de 48 horas te enviamos una propuesta completamente personalizada, sin costo y sin compromiso.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/cotizacion" className="btn-gold">Solicitar cotización gratuita</Link>
            <a
              href={WA_HREF}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost"
            >
              Escribir por WhatsApp
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
