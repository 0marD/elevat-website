'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils/cn'
import Input from '@/app/components/ui/Input'
import Textarea from '@/app/components/ui/Textarea'
import Button from '@/app/components/ui/Button'
import { TestimonioSchema, type TestimonioFieldErrors } from '@/lib/validations/testimonio'
import { ROUTES } from '@/lib/constants/routes'
import type { TestimonioSerialized } from '@/types/testimonio'

// ─── Estado del formulario ───────────────────────────────────────────────────

interface FormState {
  nombre:       string
  ciudad:       string
  viaje:        string
  texto:        string
  calificacion: number
}

function buildInitialState(initialData?: TestimonioSerialized): FormState {
  if (initialData) {
    return {
      nombre:       initialData.nombre,
      ciudad:       initialData.ciudad,
      viaje:        initialData.viaje,
      texto:        initialData.texto,
      calificacion: initialData.calificacion,
    }
  }
  return { nombre: '', ciudad: '', viaje: '', texto: '', calificacion: 5 }
}

// ─── Props ───────────────────────────────────────────────────────────────────

interface TestimonioFormProps {
  initialData?: TestimonioSerialized
}

// ─── Componente principal ────────────────────────────────────────────────────

export default function TestimonioForm({ initialData }: TestimonioFormProps) {
  const router     = useRouter()
  const isEditing  = Boolean(initialData)

  const [form, setForm]         = useState<FormState>(() => buildInitialState(initialData))
  const [errors, setErrors]     = useState<TestimonioFieldErrors>({})
  const [apiError, setApiError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const setField = <K extends keyof FormState>(field: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: undefined }))
    setApiError(null)
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const result = TestimonioSchema.safeParse(form)
    if (!result.success) {
      const fieldErrors: TestimonioFieldErrors = {}
      for (const issue of result.error.issues) {
        const key = issue.path[0] as keyof TestimonioFieldErrors
        if (!fieldErrors[key]) fieldErrors[key] = issue.message
      }
      setErrors(fieldErrors)
      return
    }

    setIsLoading(true)
    setApiError(null)

    const url    = isEditing ? `/api/testimonios/${initialData!.id}` : '/api/testimonios'
    const method = isEditing ? 'PUT' : 'POST'

    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(result.data),
    })

    setIsLoading(false)

    if (!response.ok) {
      const json = (await response.json().catch(() => ({}))) as { error?: string }
      setApiError(json.error ?? 'No se pudo guardar el testimonio. Inténtalo de nuevo.')
      return
    }

    router.push(ROUTES.admin.testimonios)
    router.refresh()
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      aria-label={isEditing ? 'Formulario para editar testimonio' : 'Formulario para agregar testimonio'}
      className="space-y-6 max-w-xl"
    >
      <Input
        id="nombre"
        label="Nombre del cliente"
        placeholder="Ej. Andrea M."
        value={form.nombre}
        onChange={(e) => setField('nombre', e.target.value)}
        error={errors.nombre}
        required
        disabled={isLoading}
      />

      <Input
        id="ciudad"
        label="Ciudad"
        placeholder="Ej. Ciudad de México"
        value={form.ciudad}
        onChange={(e) => setField('ciudad', e.target.value)}
        error={errors.ciudad}
        required
        disabled={isLoading}
      />

      <Input
        id="viaje"
        label="Tipo o destino del viaje"
        placeholder="Ej. Luna de miel en Toscana"
        value={form.viaje}
        onChange={(e) => setField('viaje', e.target.value)}
        error={errors.viaje}
        required
        disabled={isLoading}
      />

      <Textarea
        id="texto"
        label="Testimonio"
        placeholder="Texto del testimonio (mínimo 20 caracteres)…"
        rows={5}
        value={form.texto}
        onChange={(e) => setField('texto', e.target.value)}
        error={errors.texto}
        hint={`${form.texto.length} / 800 caracteres`}
        required
        disabled={isLoading}
      />

      <StarSelector
        value={form.calificacion}
        onChange={(v) => setField('calificacion', v)}
        error={errors.calificacion}
        disabled={isLoading}
      />

      {apiError && (
        <p role="alert" className="text-sm text-red-400 tracking-wide">
          {apiError}
        </p>
      )}

      <div className="flex items-center gap-3 pt-2">
        <Button type="submit" variant="solid" isLoading={isLoading}>
          {isEditing ? 'Guardar cambios' : 'Publicar testimonio'}
        </Button>
        <Button
          type="button"
          variant="ghost"
          disabled={isLoading}
          onClick={() => router.push(ROUTES.admin.testimonios)}
        >
          Cancelar
        </Button>
      </div>
    </form>
  )
}

// ─── Selector de estrellas accesible ────────────────────────────────────────

interface StarSelectorProps {
  value:     number
  onChange:  (v: number) => void
  error?:    string
  disabled?: boolean
}

function StarSelector({ value, onChange, error, disabled }: StarSelectorProps) {
  const [hovered, setHovered] = useState(0)
  const display = hovered || value

  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-xs tracking-widest2 uppercase font-light text-plata">
        Calificación
        <span aria-hidden="true" className="ml-1 text-dorado">*</span>
      </span>

      <div
        role="group"
        aria-label="Selecciona una calificación de 1 a 5 estrellas"
        className="flex gap-1"
      >
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => !disabled && onChange(star)}
            onMouseEnter={() => !disabled && setHovered(star)}
            onMouseLeave={() => setHovered(0)}
            disabled={disabled}
            aria-label={`${star} ${star === 1 ? 'estrella' : 'estrellas'}`}
            aria-pressed={value === star}
            className={cn(
              'text-3xl leading-none transition-colors duration-100',
              'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-dorado rounded-sm',
              disabled && 'cursor-not-allowed',
              display >= star ? 'text-dorado' : 'text-plata/20'
            )}
          >
            ★
          </button>
        ))}
        <span className="ml-3 self-center text-xs text-plata/50">
          {value} de 5
        </span>
      </div>

      {error && (
        <p role="alert" className="text-xs text-red-400 mt-0.5">
          {error}
        </p>
      )}
    </div>
  )
}
