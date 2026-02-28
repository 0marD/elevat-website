import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Cotiza tu viaje — ÉLEVA. Viajes de Autor',
  description: 'Completa nuestro formulario y recibe una propuesta de viaje completamente personalizada en menos de 48 horas. Sin costo, sin compromiso.',
  robots: { index: false, follow: true },
  alternates: { canonical: 'https://elevaviajes.shop/cotizacion' },
  openGraph: {
    title: 'Cotiza tu viaje ideal — ÉLEVA.',
    description: 'Propuesta personalizada en menos de 48 horas.',
    url: 'https://elevaviajes.shop/cotizacion',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cotiza tu viaje ideal — ÉLEVA.',
    description: 'Propuesta personalizada en menos de 48 horas.',
  },
}

export default function CotizacionLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
