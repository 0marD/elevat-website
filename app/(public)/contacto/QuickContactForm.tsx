'use client'
import { useState } from 'react'

interface Fields {
  nombre:   string
  contacto: string
  mensaje:  string
}

type Status = 'idle' | 'loading' | 'success' | 'error'

const baseInput = 'w-full bg-transparent border outline-none px-5 py-4 text-crema text-sm transition-colors placeholder:text-plata/30'
const fieldClass = (hasError: boolean) =>
  `${baseInput} ${hasError ? 'border-red-400' : 'border-dorado/20 focus:border-dorado/50'}`

export default function QuickContactForm() {
  const [fields, setFields] = useState<Fields>({ nombre: '', contacto: '', mensaje: '' })
  const [fieldErrors, setFieldErrors] = useState<Partial<Fields>>({})
  const [status, setStatus] = useState<Status>('idle')

  const update = (field: keyof Fields, value: string) => {
    setFields(prev => ({ ...prev, [field]: value }))
    if (field in fieldErrors) setFieldErrors(prev => ({ ...prev, [field]: undefined }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    setFieldErrors({})

    const res = await fetch('/api/contacto', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(fields),
    })

    if (res.status === 422) {
      const data = (await res.json()) as { errors: Partial<Fields> }
      setFieldErrors(data.errors)
      setStatus('idle')
      return
    }

    if (!res.ok) {
      setStatus('error')
      return
    }

    setStatus('success')
    setFields({ nombre: '', contacto: '', mensaje: '' })
  }

  if (status === 'success') {
    return (
      <div
        role="status"
        aria-live="polite"
        className="border border-dorado/20 px-8 py-10 text-center space-y-3"
      >
        <p className="text-dorado text-lg font-serif tracking-wide">Mensaje recibido</p>
        <p className="text-plata text-sm">
          Nos pondremos en contacto contigo pronto a través de{' '}
          <span className="text-crema">{fields.contacto || 'tu contacto'}</span>.
        </p>
        <button
          type="button"
          onClick={() => setStatus('idle')}
          className="mt-4 text-xs text-plata/60 underline underline-offset-4 hover:text-dorado transition-colors"
        >
          Enviar otro mensaje
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <div>
        <label htmlFor="qc-nombre" className="section-label block mb-2">Nombre</label>
        <input
          id="qc-nombre"
          type="text"
          value={fields.nombre}
          onChange={e => update('nombre', e.target.value)}
          placeholder="Tu nombre"
          aria-required="true"
          aria-invalid={!!fieldErrors.nombre}
          aria-describedby={fieldErrors.nombre ? 'err-qc-nombre' : undefined}
          className={fieldClass(!!fieldErrors.nombre)}
        />
        {fieldErrors.nombre && (
          <p id="err-qc-nombre" role="alert" className="mt-1 text-xs text-red-400 tracking-wide">
            {fieldErrors.nombre}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="qc-contacto" className="section-label block mb-2">Correo o WhatsApp</label>
        <input
          id="qc-contacto"
          type="text"
          value={fields.contacto}
          onChange={e => update('contacto', e.target.value)}
          placeholder="Para responderte"
          aria-required="true"
          aria-invalid={!!fieldErrors.contacto}
          aria-describedby={fieldErrors.contacto ? 'err-qc-contacto' : undefined}
          className={fieldClass(!!fieldErrors.contacto)}
        />
        {fieldErrors.contacto && (
          <p id="err-qc-contacto" role="alert" className="mt-1 text-xs text-red-400 tracking-wide">
            {fieldErrors.contacto}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="qc-mensaje" className="section-label block mb-2">Mensaje</label>
        <textarea
          id="qc-mensaje"
          rows={4}
          value={fields.mensaje}
          onChange={e => update('mensaje', e.target.value)}
          placeholder="Cuéntanos qué tienes en mente…"
          aria-required="true"
          aria-invalid={!!fieldErrors.mensaje}
          aria-describedby={fieldErrors.mensaje ? 'err-qc-mensaje' : undefined}
          className={`${fieldClass(!!fieldErrors.mensaje)} resize-none`}
        />
        {fieldErrors.mensaje && (
          <p id="err-qc-mensaje" role="alert" className="mt-1 text-xs text-red-400 tracking-wide">
            {fieldErrors.mensaje}
          </p>
        )}
      </div>

      {status === 'error' && (
        <p role="alert" className="text-xs text-red-400 tracking-wide">
          Ocurrió un error al enviar el mensaje. Inténtalo de nuevo.
        </p>
      )}

      <button
        type="submit"
        disabled={status === 'loading'}
        aria-busy={status === 'loading'}
        className="btn-gold w-full disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {status === 'loading' ? 'Enviando…' : 'Enviar mensaje'}
      </button>
    </form>
  )
}
