'use client'
// Nota: metadata se exporta desde un wrapper server component cuando se necesite.
// Esta página es client component por el formulario multi-paso.
import { useState } from 'react'
import { useLocalStorage } from '@/hooks/useLocalStorage'

interface FormData {
  nombre:       string
  email:        string
  whatsapp:     string
  tipo_viaje:   string
  destino:      string
  fecha_salida: string
  fecha_regreso: string
  adultos:      string
  ninos:        string
  presupuesto:  string
  categoria:    string
  intereses:    string[]
  mensaje:      string
}

interface FormErrors {
  nombre?:     string
  email?:      string
  whatsapp?:   string
  tipo_viaje?: string
  destino?:    string
  categoria?:  string
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const WA_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '523337084290'
const DRAFT_KEY = 'eleva-cotizacion-draft'

const interesesOpciones = [
  'Playa y relax', 'Gastronomía', 'Cultura e historia', 'Aventura y naturaleza',
  'Compras', 'Vida nocturna', 'Bienestar y spa', 'Golf', 'Arte y museos', 'Fotografía',
]

const presupuestos = [
  { value: '20000-40000',  label: '$20,000 – $40,000 MXN' },
  { value: '40000-80000',  label: '$40,000 – $80,000 MXN' },
  { value: '80000-150000', label: '$80,000 – $150,000 MXN' },
  { value: '150000+',      label: 'Más de $150,000 MXN' },
  { value: 'flexible',     label: 'Presupuesto flexible / sorpréndeme' },
]

const TIPOS_VIAJE = [
  'Vacacional / placer', 'Luna de miel', 'Corporativo / negocios',
  'Grupo familiar', 'Aniversario / celebración', 'Otro',
]

const CATEGORIAS = ['Confort ★★★', 'Premium ★★★★', 'Lujo ★★★★★']

function validateStep1(form: FormData): FormErrors {
  const errs: FormErrors = {}
  if (form.nombre.trim().length < 2)           errs.nombre    = 'Ingresa tu nombre completo.'
  if (!EMAIL_RE.test(form.email))              errs.email     = 'Ingresa un correo electrónico válido.'
  if (form.whatsapp.replace(/\D/g, '').length < 7) errs.whatsapp = 'Ingresa un número de WhatsApp válido.'
  if (!form.tipo_viaje)                        errs.tipo_viaje = 'Selecciona el tipo de viaje.'
  return errs
}

function validateStep2(form: FormData): FormErrors {
  const errs: FormErrors = {}
  if (form.destino.trim().length < 2) errs.destino   = 'Ingresa el destino deseado.'
  if (!form.categoria)                errs.categoria = 'Selecciona una categoría.'
  return errs
}

const inputClass = (hasError: boolean) =>
  `w-full bg-transparent border ${hasError ? 'border-red-400' : 'border-dorado/20 focus:border-dorado/60'} outline-none px-5 py-4 text-crema text-sm transition-colors duration-300 placeholder:text-plata/30`

const selectClass = (hasError: boolean) =>
  `w-full bg-negro border ${hasError ? 'border-red-400' : 'border-dorado/20 focus:border-dorado/60'} outline-none px-5 py-4 text-crema text-sm transition-colors duration-300`

export default function CotizacionPage() {
  const INITIAL_FORM: FormData = {
    nombre: '', email: '', whatsapp: '', tipo_viaje: '',
    destino: '', fecha_salida: '', fecha_regreso: '',
    adultos: '2', ninos: '0', presupuesto: '', categoria: '',
    intereses: [], mensaje: '',
  }

  const [step, setStep]       = useState(1)
  const [enviado, setEnviado] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [apiError, setApiError]   = useState<string | null>(null)
  const [whatsappUrl, setWhatsappUrl] = useState<string | null>(null)
  const [errors, setErrors]   = useState<FormErrors>({})
  const [form, setForm, clearDraft] = useLocalStorage<FormData>(DRAFT_KEY, INITIAL_FORM)

  const update = (field: keyof FormData, value: string | string[]) => {
    setForm(prev => ({ ...prev, [field]: value }))
    if (field in errors) setErrors(prev => ({ ...prev, [field]: undefined }))
  }

  const toggleInteres = (i: string) => {
    setForm(prev => ({
      ...prev,
      intereses: prev.intereses.includes(i)
        ? prev.intereses.filter(x => x !== i)
        : [...prev.intereses, i],
    }))
  }

  const goToStep2 = () => {
    const errs = validateStep1(form)
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    setErrors({})
    setStep(2)
  }

  const goToStep3 = () => {
    const errs = validateStep2(form)
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    setErrors({})
    setStep(3)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setApiError(null)

    const response = await fetch('/api/cotizacion', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(form),
    })

    setIsLoading(false)

    if (!response.ok) {
      const json = (await response.json().catch(() => ({}))) as { error?: string }
      setApiError(json.error ?? 'Ocurrió un error al enviar tu solicitud. Inténtalo de nuevo.')
      return
    }

    const json = (await response.json()) as { whatsappUrl?: string }
    setWhatsappUrl(json.whatsappUrl ?? null)
    clearDraft()
    setEnviado(true)
  }

  if (enviado) return (
    <div className="min-h-screen flex flex-col justify-center items-center text-center px-6 pt-24">
      <div
        className="text-dorado mb-6"
        style={{ fontSize: '64px', fontFamily: 'Cormorant Garamond, serif', fontWeight: 300 }}
        aria-hidden="true"
      >
        ✓
      </div>
      <h1 className="display-heading mb-4" style={{ fontSize: '40px' }}>Solicitud recibida</h1>
      <p className="text-plata max-w-md text-sm leading-loose mb-10">
        Gracias, <strong className="text-crema">{form.nombre}</strong>. Hemos recibido tu solicitud
        y te contactaremos en menos de 48 horas con una propuesta personalizada.
      </p>
      <a
        href={whatsappUrl ?? `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(`Hola, acabo de solicitar una cotización en ÉLEVA para ${form.destino || 'un viaje'}.`)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-gold"
      >
        También escríbenos por WhatsApp
      </a>
    </div>
  )

  return (
    <div className="min-h-screen pt-32 pb-24 px-6">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="text-center mb-16">
          <div className="section-label">Sin costo · Sin compromiso</div>
          <h1 className="display-heading mb-4" style={{ fontSize: 'clamp(36px, 5vw, 52px)' }}>
            Cotiza tu <em className="text-dorado">viaje ideal</em>
          </h1>
          <p className="text-plata text-sm leading-loose">
            Completa el formulario y recibirás una propuesta completamente personalizada en menos de 48 horas.
          </p>
        </div>

        {/* Progress */}
        <div className="flex gap-2 mb-12" role="progressbar" aria-valuenow={step} aria-valuemin={1} aria-valuemax={3} aria-label={`Paso ${step} de 3`}>
          {[1, 2, 3].map(s => (
            <div key={s} className="flex-1 h-px transition-all duration-500"
              style={{ background: s <= step ? '#C9A84C' : 'rgba(201,168,76,0.15)' }} />
          ))}
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-6">

          {/* ── PASO 1: Datos personales ── */}
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="display-heading mb-8" style={{ fontSize: '28px' }}>
                Sobre <em className="text-dorado">ti</em>
              </h2>

              <div>
                <label htmlFor="cot-nombre" className="section-label block mb-2">
                  Nombre completo *
                </label>
                <input
                  id="cot-nombre"
                  type="text"
                  value={form.nombre}
                  onChange={e => update('nombre', e.target.value)}
                  placeholder="Tu nombre"
                  aria-required="true"
                  aria-invalid={!!errors.nombre}
                  aria-describedby={errors.nombre ? 'err-nombre' : undefined}
                  className={inputClass(!!errors.nombre)}
                />
                {errors.nombre && (
                  <p id="err-nombre" role="alert" className="mt-1 text-xs text-red-400 tracking-wide">
                    {errors.nombre}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="cot-email" className="section-label block mb-2">
                  Correo electrónico *
                </label>
                <input
                  id="cot-email"
                  type="email"
                  value={form.email}
                  onChange={e => update('email', e.target.value)}
                  placeholder="tu@correo.com"
                  aria-required="true"
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? 'err-email' : undefined}
                  className={inputClass(!!errors.email)}
                />
                {errors.email && (
                  <p id="err-email" role="alert" className="mt-1 text-xs text-red-400 tracking-wide">
                    {errors.email}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="cot-whatsapp" className="section-label block mb-2">
                  WhatsApp *
                </label>
                <input
                  id="cot-whatsapp"
                  type="tel"
                  value={form.whatsapp}
                  onChange={e => update('whatsapp', e.target.value)}
                  placeholder="+52 55 0000 0000"
                  aria-required="true"
                  aria-invalid={!!errors.whatsapp}
                  aria-describedby={errors.whatsapp ? 'err-whatsapp' : undefined}
                  className={inputClass(!!errors.whatsapp)}
                />
                {errors.whatsapp && (
                  <p id="err-whatsapp" role="alert" className="mt-1 text-xs text-red-400 tracking-wide">
                    {errors.whatsapp}
                  </p>
                )}
              </div>

              <div
                role="group"
                aria-labelledby="lbl-tipo-viaje"
                aria-describedby={errors.tipo_viaje ? 'err-tipo-viaje' : undefined}
              >
                <p id="lbl-tipo-viaje" className="section-label block mb-3">
                  Tipo de viaje *
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {TIPOS_VIAJE.map(t => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => update('tipo_viaje', t)}
                      aria-pressed={form.tipo_viaje === t}
                      className={`px-4 py-3 text-xs border transition-all duration-300 text-left ${
                        form.tipo_viaje === t
                          ? 'border-dorado bg-dorado/10 text-dorado'
                          : 'border-dorado/15 text-plata/60 hover:border-dorado/40'
                      }`}
                      style={{ letterSpacing: '0.05em' }}
                    >
                      {t}
                    </button>
                  ))}
                </div>
                {errors.tipo_viaje && (
                  <p id="err-tipo-viaje" role="alert" className="mt-2 text-xs text-red-400 tracking-wide">
                    {errors.tipo_viaje}
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={goToStep2}
                className="btn-gold w-full justify-center"
              >
                Continuar →
              </button>
            </div>
          )}

          {/* ── PASO 2: El viaje ── */}
          {step === 2 && (
            <div className="space-y-6">
              <h2 className="display-heading mb-8" style={{ fontSize: '28px' }}>
                Tu <em className="text-dorado">viaje</em>
              </h2>

              <div>
                <label htmlFor="cot-destino" className="section-label block mb-2">
                  Destino deseado *
                </label>
                <input
                  id="cot-destino"
                  type="text"
                  value={form.destino}
                  onChange={e => update('destino', e.target.value)}
                  placeholder="p. ej. Italia, Cancún, Japón, sorpréndeme…"
                  aria-required="true"
                  aria-invalid={!!errors.destino}
                  aria-describedby={errors.destino ? 'err-destino' : undefined}
                  className={inputClass(!!errors.destino)}
                />
                {errors.destino && (
                  <p id="err-destino" role="alert" className="mt-1 text-xs text-red-400 tracking-wide">
                    {errors.destino}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="cot-fecha-salida" className="section-label block mb-2">
                    Fecha de salida
                  </label>
                  <input
                    id="cot-fecha-salida"
                    type="date"
                    value={form.fecha_salida}
                    onChange={e => update('fecha_salida', e.target.value)}
                    className={inputClass(false)}
                    style={{ colorScheme: 'dark' }}
                  />
                </div>
                <div>
                  <label htmlFor="cot-fecha-regreso" className="section-label block mb-2">
                    Fecha de regreso
                  </label>
                  <input
                    id="cot-fecha-regreso"
                    type="date"
                    value={form.fecha_regreso}
                    onChange={e => update('fecha_regreso', e.target.value)}
                    className={inputClass(false)}
                    style={{ colorScheme: 'dark' }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="cot-adultos" className="section-label block mb-2">
                    Adultos
                  </label>
                  <select
                    id="cot-adultos"
                    value={form.adultos}
                    onChange={e => update('adultos', e.target.value)}
                    className={selectClass(false)}
                  >
                    {['1','2','3','4','5','6','7','8+'].map(n => <option key={n} value={n}>{n}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="cot-ninos" className="section-label block mb-2">
                    Niños
                  </label>
                  <select
                    id="cot-ninos"
                    value={form.ninos}
                    onChange={e => update('ninos', e.target.value)}
                    className={selectClass(false)}
                  >
                    {['0','1','2','3','4','5+'].map(n => <option key={n} value={n}>{n}</option>)}
                  </select>
                </div>
              </div>

              <div
                role="group"
                aria-labelledby="lbl-categoria"
                aria-describedby={errors.categoria ? 'err-categoria' : undefined}
              >
                <p id="lbl-categoria" className="section-label block mb-3">
                  Categoría del viaje *
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {CATEGORIAS.map(c => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => update('categoria', c)}
                      aria-pressed={form.categoria === c}
                      className={`px-4 py-3 text-xs border transition-all duration-300 ${
                        form.categoria === c
                          ? 'border-dorado bg-dorado/10 text-dorado'
                          : 'border-dorado/15 text-plata/60 hover:border-dorado/40'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
                {errors.categoria && (
                  <p id="err-categoria" role="alert" className="mt-2 text-xs text-red-400 tracking-wide">
                    {errors.categoria}
                  </p>
                )}
              </div>

              <div role="group" aria-labelledby="lbl-presupuesto">
                <p id="lbl-presupuesto" className="section-label block mb-3">
                  Presupuesto aproximado
                </p>
                <div className="space-y-2">
                  {presupuestos.map(p => (
                    <button
                      key={p.value}
                      type="button"
                      onClick={() => update('presupuesto', p.value)}
                      aria-pressed={form.presupuesto === p.value}
                      className={`w-full px-5 py-3 text-xs border transition-all duration-300 text-left ${
                        form.presupuesto === p.value
                          ? 'border-dorado bg-dorado/10 text-dorado'
                          : 'border-dorado/15 text-plata/60 hover:border-dorado/40'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <button type="button" onClick={() => { setErrors({}); setStep(1) }} className="btn-ghost flex-1">
                  ← Atrás
                </button>
                <button type="button" onClick={goToStep3} className="btn-gold flex-1">
                  Continuar →
                </button>
              </div>
            </div>
          )}

          {/* ── PASO 3: Intereses y mensaje ── */}
          {step === 3 && (
            <div className="space-y-6">
              <h2 className="display-heading mb-8" style={{ fontSize: '28px' }}>
                Tus <em className="text-dorado">preferencias</em>
              </h2>

              <div role="group" aria-labelledby="lbl-intereses">
                <p id="lbl-intereses" className="section-label block mb-3">
                  ¿Qué te interesa en este viaje?
                </p>
                <div className="flex flex-wrap gap-2">
                  {interesesOpciones.map(i => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => toggleInteres(i)}
                      aria-pressed={form.intereses.includes(i)}
                      className={`px-4 py-2 text-xs border transition-all duration-300 ${
                        form.intereses.includes(i)
                          ? 'border-dorado bg-dorado/10 text-dorado'
                          : 'border-dorado/15 text-plata/60 hover:border-dorado/40'
                      }`}
                    >
                      {i}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label htmlFor="cot-mensaje" className="section-label block mb-2">
                  ¿Algo más que debamos saber?
                </label>
                <textarea
                  id="cot-mensaje"
                  rows={5}
                  value={form.mensaje}
                  onChange={e => update('mensaje', e.target.value)}
                  placeholder="Alergias, fechas especiales, requerimientos, o simplemente cuéntanos cómo imaginas el viaje perfecto…"
                  className="w-full bg-transparent border border-dorado/20 focus:border-dorado/60 outline-none px-5 py-4 text-crema text-sm transition-colors duration-300 placeholder:text-plata/30 resize-none"
                />
              </div>

              {/* Resumen rápido */}
              <div className="card-dark p-6 space-y-2" aria-label="Resumen de tu solicitud">
                <div className="section-label mb-3">Resumen de tu solicitud</div>
                {[
                  ['Viajero',    form.nombre],
                  ['Destino',    form.destino],
                  ['Tipo',       form.tipo_viaje],
                  ['Viajeros',   `${form.adultos} adultos, ${form.ninos} niños`],
                  ['Categoría',  form.categoria],
                  ['Presupuesto', presupuestos.find(p => p.value === form.presupuesto)?.label || '–'],
                ].map(([label, val]) => val && (
                  <div key={label} className="flex justify-between text-xs gap-4">
                    <span className="text-dorado/60 tracking-wider">{label}</span>
                    <span className="text-crema/80 text-right">{val}</span>
                  </div>
                ))}
              </div>

              {apiError && (
                <p role="alert" className="text-sm text-red-400 text-center tracking-wide py-2">
                  {apiError}
                </p>
              )}

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  disabled={isLoading}
                  className="btn-ghost flex-1 disabled:opacity-50"
                >
                  ← Atrás
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn-gold flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Enviando…' : 'Enviar solicitud ✓'}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  )
}
