import type { Metadata } from 'next'
import DestinoForm from '../DestinoForm'

export const metadata: Metadata = { title: 'Nuevo destino — Panel ÉLEVA.' }

export default function AdminDestinoNuevoPage() {
  return (
    <div className="p-6 md:p-10 max-w-2xl">

      <header className="mb-8">
        <p className="text-[9px] tracking-[0.4em] uppercase text-dorado/60 mb-2">
          Gestión de destinos
        </p>
        <h1
          className="text-crema"
          style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(24px, 3vw, 36px)', fontWeight: 300, letterSpacing: '2px' }}
        >
          Nuevo destino
        </h1>
        <div className="mt-4 h-px w-12 bg-dorado/40" />
      </header>

      <DestinoForm />

    </div>
  )
}
