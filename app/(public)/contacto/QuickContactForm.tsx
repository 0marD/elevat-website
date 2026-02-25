'use client'
import { useState } from 'react'

interface Fields {
  nombre:   string
  contacto: string
  mensaje:  string
}

interface FieldErrors {
  nombre?:   string
  contacto?: string
  mensaje?:  string
}

const WA_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '523337084290'

function isValidContacto(value: string): boolean {
  const email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  const phone = /^(\+?52)?[1-9]\d{9}$|^\d{10}$/
  return email.test(value) || phone.test(value)
}

function validate(fields: Fields): FieldErrors {
  const errs: FieldErrors = {}
  if (fields.nombre.trim().length < 2)        errs.nombre   = 'Ingresa tu nombre.'
  if (!isValidContacto(fields.contacto.trim())) errs.contacto = 'Ingresa un correo válido (juan@email.com) o número de WhatsApp (3337084290).'
  if (fields.mensaje.trim().length < 5)        errs.mensaje  = 'Escribe un mensaje más detallado.'
  return errs
}

const baseInput = 'w-full bg-transparent border outline-none px-5 py-4 text-crema text-sm transition-colors placeholder:text-plata/30'
const fieldClass = (hasError: boolean) =>
  `${baseInput} ${hasError ? 'border-red-400' : 'border-dorado/20 focus:border-dorado/50'}`

export default function QuickContactForm() {
  const [fields, setFields] = useState<Fields>({ nombre: '', contacto: '', mensaje: '' })
  const [errors, setErrors] = useState<FieldErrors>({})

  const update = (field: keyof Fields, value: string) => {
    setFields(prev => ({ ...prev, [field]: value }))
    if (field in errors) setErrors(prev => ({ ...prev, [field]: undefined }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const errs = validate(fields)
    if (Object.keys(errs).length > 0) { setErrors(errs); return }

    const text = `Hola, soy ${fields.nombre.trim()}. Mi contacto: ${fields.contacto.trim()}. ${fields.mensaje.trim()}`
    window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer')
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
          aria-invalid={!!errors.nombre}
          aria-describedby={errors.nombre ? 'err-qc-nombre' : undefined}
          className={fieldClass(!!errors.nombre)}
        />
        {errors.nombre && (
          <p id="err-qc-nombre" role="alert" className="mt-1 text-xs text-red-400 tracking-wide">
            {errors.nombre}
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
          aria-invalid={!!errors.contacto}
          aria-describedby={errors.contacto ? 'err-qc-contacto' : undefined}
          className={fieldClass(!!errors.contacto)}
        />
        {errors.contacto && (
          <p id="err-qc-contacto" role="alert" className="mt-1 text-xs text-red-400 tracking-wide">
            {errors.contacto}
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
          aria-invalid={!!errors.mensaje}
          aria-describedby={errors.mensaje ? 'err-qc-mensaje' : undefined}
          className={`${fieldClass(!!errors.mensaje)} resize-none`}
        />
        {errors.mensaje && (
          <p id="err-qc-mensaje" role="alert" className="mt-1 text-xs text-red-400 tracking-wide">
            {errors.mensaje}
          </p>
        )}
      </div>

      <button type="submit" className="btn-gold w-full">Enviar por WhatsApp</button>
    </form>
  )
}
