import { Suspense } from 'react'
import type { Metadata } from 'next'
import LoginForm from './LoginForm'

export const metadata: Metadata = {
  title: 'Acceso — Panel ÉLEVA.',
  robots: { index: false, follow: false },
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-negro flex flex-col items-center justify-center px-6">

      {/* Grain overlay heredado del body; fondo extra oscuro para contraste */}
      <div
        aria-hidden="true"
        className="fixed inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 50% 30%, rgba(92,26,46,0.15) 0%, transparent 65%)' }}
      />

      <div className="relative z-10 w-full max-w-sm">

        {/* Marca ─────────────────────────────────────────── */}
        <div className="text-center mb-10">
          <p
            className="text-crema"
            style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '32px', fontWeight: 300, letterSpacing: '8px' }}
          >
            ÉLEVA<span className="text-dorado">.</span>
          </p>
          <p className="mt-1 text-[9px] tracking-[0.4em] uppercase text-dorado/50">
            Panel de administración
          </p>
          <div className="mx-auto mt-5 h-px w-10 bg-dorado/40" />
        </div>

        {/* Formulario — envuelto en Suspense porque LoginForm usa useSearchParams */}
        <Suspense fallback={<FormSkeleton />}>
          <LoginForm />
        </Suspense>

        {/* Volver al sitio ────────────────────────────────── */}
        <p className="text-center mt-8">
          <a
            href="/"
            className="text-[10px] tracking-widest uppercase text-plata/40 hover:text-plata transition-colors"
          >
            ← Volver al sitio
          </a>
        </p>

      </div>
    </div>
  )
}

function FormSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-16 bg-crema/5 border border-crema/10" />
      <div className="h-16 bg-crema/5 border border-crema/10" />
      <div className="h-12 bg-dorado/10 border border-dorado/20" />
    </div>
  )
}
