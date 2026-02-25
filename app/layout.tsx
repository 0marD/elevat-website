import type { Metadata, Viewport } from 'next'
import './globals.css'
import SessionProvider from './components/providers/SessionProvider'

export const metadata: Metadata = {
  title: 'ÉLEVA. — Viajes de Autor',
  description: 'Experiencias de viaje de lujo diseñadas con precisión y atención personalizada. Destinos nacionales e internacionales.',
  keywords: 'agencia de viajes lujo México, viajes premium, viajes corporativos, experiencias exclusivas',
  manifest: '/manifest.json',
  openGraph: {
    title: 'ÉLEVA. — Viajes de Autor',
    description: 'Cada destino, una experiencia diseñada sólo para ti.',
    type: 'website',
    siteName: 'ÉLEVA.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ÉLEVA. — Viajes de Autor',
    description: 'Cada destino, una experiencia diseñada sólo para ti.',
  },
}

export const viewport: Viewport = {
  themeColor: '#0A0A0A',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body>
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  )
}
