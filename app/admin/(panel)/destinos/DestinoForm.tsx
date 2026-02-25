'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import Input from '@/app/components/ui/Input'
import Textarea from '@/app/components/ui/Textarea'
import Button from '@/app/components/ui/Button'
import { DestinoSchema, type DestinoFieldErrors } from '@/lib/validations/destino'
import { ROUTES } from '@/lib/constants/routes'
import type { DestinoSerialized } from '@/types/destino'

// ─── Estado del formulario ───────────────────────────────────────────────────

interface FormState {
  nombre:          string
  pais:            string
  tipo:            string
  descripcion:     string
  imagenPrincipal: string
  etiquetasRaw:    string   // ingresadas como texto separado por comas
  activo:          boolean
}

function buildInitialState(initialData?: DestinoSerialized): FormState {
  if (initialData) {
    return {
      nombre:          initialData.nombre,
      pais:            initialData.pais,
      tipo:            initialData.tipo,
      descripcion:     initialData.descripcion,
      imagenPrincipal: initialData.imagenPrincipal,
      etiquetasRaw:    initialData.etiquetas.join(', '),
      activo:          initialData.activo,
    }
  }
  return {
    nombre:          '',
    pais:            '',
    tipo:            '',
    descripcion:     '',
    imagenPrincipal: '',
    etiquetasRaw:    '',
    activo:          true,
  }
}

// ─── Props ───────────────────────────────────────────────────────────────────

interface DestinoFormProps {
  initialData?: DestinoSerialized
}

// ─── Componente principal ────────────────────────────────────────────────────

export default function DestinoForm({ initialData }: DestinoFormProps) {
  const router = useRouter()
  const isEditing = Boolean(initialData)

  const [form, setForm]         = useState<FormState>(() => buildInitialState(initialData))
  const [errors, setErrors]     = useState<DestinoFieldErrors>({})
  const [apiError, setApiError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const setField = <K extends keyof FormState>(field: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: undefined }))
    setApiError(null)
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const etiquetas = form.etiquetasRaw
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean)

    const payload = {
      nombre:          form.nombre,
      pais:            form.pais,
      tipo:            form.tipo,
      descripcion:     form.descripcion,
      imagenPrincipal: form.imagenPrincipal,
      etiquetas,
      activo:          form.activo,
    }

    const result = DestinoSchema.safeParse(payload)
    if (!result.success) {
      const fieldErrors: DestinoFieldErrors = {}
      for (const issue of result.error.issues) {
        const key = issue.path[0] as keyof DestinoFieldErrors
        if (!fieldErrors[key]) fieldErrors[key] = issue.message
      }
      setErrors(fieldErrors)
      return
    }

    setIsLoading(true)
    setApiError(null)

    const url    = isEditing ? `/api/destinos/${initialData!.id}` : '/api/destinos'
    const method = isEditing ? 'PUT' : 'POST'

    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(result.data),
    })

    setIsLoading(false)

    if (!response.ok) {
      const json = (await response.json().catch(() => ({}))) as { error?: string }
      setApiError(json.error ?? 'No se pudo guardar el destino. Inténtalo de nuevo.')
      return
    }

    router.push(ROUTES.admin.destinos)
    router.refresh()
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      aria-label={isEditing ? 'Formulario para editar destino' : 'Formulario para agregar destino'}
      className="space-y-6 max-w-xl"
    >
      <Input
        id="nombre"
        label="Nombre del destino"
        placeholder="Ej. Los Cabos"
        value={form.nombre}
        onChange={(e) => setField('nombre', e.target.value)}
        error={errors.nombre}
        required
        disabled={isLoading}
      />

      <div className="grid grid-cols-2 gap-4">
        <Input
          id="pais"
          label="País / Región"
          placeholder="Ej. México"
          value={form.pais}
          onChange={(e) => setField('pais', e.target.value)}
          error={errors.pais}
          required
          disabled={isLoading}
        />

        <Input
          id="tipo"
          label="Tipo de experiencia"
          placeholder="Ej. Playa de lujo"
          value={form.tipo}
          onChange={(e) => setField('tipo', e.target.value)}
          error={errors.tipo}
          required
          disabled={isLoading}
        />
      </div>

      <Textarea
        id="descripcion"
        label="Descripción"
        placeholder="Descripción breve del destino (mínimo 20 caracteres)…"
        rows={4}
        value={form.descripcion}
        onChange={(e) => setField('descripcion', e.target.value)}
        error={errors.descripcion}
        hint={`${form.descripcion.length} / 600 caracteres`}
        required
        disabled={isLoading}
      />

      <Input
        id="imagenPrincipal"
        label="URL de imagen principal"
        placeholder="https://…"
        type="url"
        value={form.imagenPrincipal}
        onChange={(e) => setField('imagenPrincipal', e.target.value)}
        error={errors.imagenPrincipal}
        required
        disabled={isLoading}
      />

      <Input
        id="etiquetas"
        label="Etiquetas (separadas por coma)"
        placeholder="Ej. Playa, Lujo, Romance"
        value={form.etiquetasRaw}
        onChange={(e) => setField('etiquetasRaw', e.target.value)}
        error={errors.etiquetas}
        hint="Máximo 6 etiquetas"
        required
        disabled={isLoading}
      />

      {/* Toggle activo ──────────────────────────────────────── */}
      <div className="flex items-center gap-3">
        <label htmlFor="activo" className="flex items-center gap-3 cursor-pointer group">
          <div className="relative">
            <input
              id="activo"
              type="checkbox"
              checked={form.activo}
              onChange={(e) => setField('activo', e.target.checked)}
              disabled={isLoading}
              className="sr-only"
            />
            <div
              className={`w-10 h-5 rounded-full transition-colors duration-200 ${
                form.activo ? 'bg-dorado/60' : 'bg-crema/10'
              }`}
            />
            <div
              className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-crema transition-transform duration-200 ${
                form.activo ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </div>
          <span className="text-xs text-plata tracking-widest uppercase">
            {form.activo ? 'Activo en catálogo' : 'Inactivo (oculto)'}
          </span>
        </label>
      </div>

      {/* Error global ───────────────────────────────────────── */}
      {apiError && (
        <p role="alert" className="text-sm text-red-400 tracking-wide">
          {apiError}
        </p>
      )}

      {/* Acciones ────────────────────────────────────────────── */}
      <div className="flex items-center gap-3 pt-2">
        <Button type="submit" variant="solid" isLoading={isLoading}>
          {isEditing ? 'Guardar cambios' : 'Publicar destino'}
        </Button>
        <Button
          type="button"
          variant="ghost"
          disabled={isLoading}
          onClick={() => router.push(ROUTES.admin.destinos)}
        >
          Cancelar
        </Button>
      </div>
    </form>
  )
}
