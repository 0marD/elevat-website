import type { Metadata, Viewport } from 'next'
import './globals.css'
import SessionProvider from './components/providers/SessionProvider'

export const metadata: Metadata = {
  title: 'ÉLEVA. — Viajes de Autor',
  description: 'Experiencias de viaje de lujo diseñadas con precisión y atención personalizada. Destinos nacionales e internacionales.',
  keywords: 'agencia de viajes lujo México, viajes premium, viajes corporativos, experiencias exclusivas, agencia viajes Guadalajara',
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/favicon/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: '/favicon/apple-touch-icon.png',
    other: [
      { rel: 'icon', url: '/favicon/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
      { rel: 'icon', url: '/favicon/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
  },
  openGraph: {
    title: 'ÉLEVA. — Viajes de Autor',
    description: 'Cada destino, una experiencia diseñada sólo para ti.',
    type: 'website',
    siteName: 'ÉLEVA.',
    locale: 'es_MX',
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
