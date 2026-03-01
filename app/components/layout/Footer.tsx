import Link from 'next/link'

const WA_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '523337084290'
const WA_HREF = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent('Hola, me gustaría información sobre un viaje')}`

export default function Footer() {
  return (
    <footer className="border-t border-dorado/10 bg-negro">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 py-12 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-16">

          {/* Brand */}
          <div>
            <div className="mb-6">
              <span style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(24px, 6vw, 32px)', fontWeight: 300, letterSpacing: '6px', color: '#F5F0E8' }}>
                ÉLEVA<span style={{ color: '#C9A84C' }}>.</span>
              </span>
              <div className="mt-1" style={{ fontSize: '8px', letterSpacing: '5px', color: 'rgba(201,168,76,0.5)' }}>
                VIAJES DE AUTOR
              </div>
            </div>
            <p className="text-plata text-xs leading-loose max-w-xs" style={{ letterSpacing: '0.05em' }}>
              Experiencias de viaje diseñadas con precisión y atención personalizada. Cada destino, curado para ti.
            </p>
          </div>

          {/* Links */}
          <div>
            <div className="section-label mb-6">Navegación</div>
            <div className="flex flex-col gap-3">
              {[
                { href: '/', label: 'Inicio' },
                { href: '/destinos', label: 'Destinos' },
                { href: '/cotizacion', label: 'Cotizar viaje' },
                { href: '/blog', label: 'Blog' },
                { href: '/testimonios', label: 'Testimonios' },
                { href: '/contacto', label: 'Contacto' },
              ].map(l => (
                <Link key={l.href} href={l.href} className="text-plata hover:text-dorado transition-colors text-xs tracking-wider">
                  {l.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <div className="section-label mb-6">Contacto</div>
            <div className="flex flex-col gap-4">
              <a
                href={WA_HREF}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-xs text-plata hover:text-dorado transition-colors tracking-wider"
              >
                <span className="text-dorado">↗</span> WhatsApp
              </a>
              <a href="mailto:hola@elevaviajes.shop" className="flex items-center gap-3 text-xs text-plata hover:text-dorado transition-colors tracking-wider">
                <span className="text-dorado">↗</span> hola@elevaviajes.shop
              </a>
              <a href="https://instagram.com/elevaviajes" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-xs text-plata hover:text-dorado transition-colors tracking-wider">
                <span className="text-dorado">↗</span> @elevaviajes
              </a>
            </div>

            <div className="mt-10">
              <Link href="/cotizacion" className="btn-gold">
                Cotizar ahora
              </Link>
            </div>
          </div>
        </div>

        <hr className="divider-gold my-12" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
          <p className="text-plata/40 text-xs tracking-widest" style={{ fontSize: '9px', letterSpacing: '0.3em' }}>
            © {new Date().getFullYear()} ÉLEVA VIAJES DE AUTOR — TODOS LOS DERECHOS RESERVADOS
          </p>
          <p className="text-plata/30 text-xs" style={{ fontSize: '9px', letterSpacing: '0.2em' }}>
            MÉXICO
          </p>
        </div>
      </div>
    </footer>
  )
}
