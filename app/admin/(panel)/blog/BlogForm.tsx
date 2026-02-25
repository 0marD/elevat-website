'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import { cn } from '@/lib/utils/cn'
import Input from '@/app/components/ui/Input'
import Textarea from '@/app/components/ui/Textarea'
import Button from '@/app/components/ui/Button'
import { BlogPostSchema, type BlogPostFieldErrors } from '@/lib/validations/blog'
import { ROUTES } from '@/lib/constants/routes'
import type { BlogPostSerialized } from '@/types/blog'

// ReactMarkdown is ESM-only — load dynamically to avoid SSR issues
const ReactMarkdown = dynamic(() => import('react-markdown'), { ssr: false })

// ─── Tipos ───────────────────────────────────────────────────────────────────

interface BlogFormState {
  titulo:        string
  extracto:      string
  contenido:     string
  imagenPortada: string // empty string = no image
  categoria:     string
  publicado:     boolean
}

interface BlogFormProps {
  initialData?: BlogPostSerialized
}

// ─── Componente principal ────────────────────────────────────────────────────

export default function BlogForm({ initialData }: BlogFormProps) {
  const router = useRouter()
  const isEdit = !!initialData

  const [form, setForm] = useState<BlogFormState>(
    initialData
      ? {
          titulo:        initialData.titulo,
          extracto:      initialData.extracto,
          contenido:     initialData.contenido,
          imagenPortada: initialData.imagenPortada ?? '',
          categoria:     initialData.categoria,
          publicado:     initialData.publicado,
        }
      : {
          titulo:        '',
          extracto:      '',
          contenido:     '',
          imagenPortada: '',
          categoria:     '',
          publicado:     false,
        },
  )

  const [errors, setErrors]   = useState<BlogPostFieldErrors>({})
  const [apiError, setApiError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const setField = <K extends keyof BlogFormState>(field: K, value: BlogFormState[K]) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: undefined }))
    setApiError(null)
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const payload = {
      ...form,
      imagenPortada: form.imagenPortada.trim() || undefined,
    }

    const result = BlogPostSchema.safeParse(payload)
    if (!result.success) {
      const fieldErrors: BlogPostFieldErrors = {}
      for (const issue of result.error.issues) {
        const key = issue.path[0] as keyof BlogPostFieldErrors
        if (!fieldErrors[key]) fieldErrors[key] = issue.message
      }
      setErrors(fieldErrors)
      return
    }

    setIsLoading(true)
    setApiError(null)

    const url    = isEdit ? `/api/blog/${initialData!.id}` : '/api/blog'
    const method = isEdit ? 'PUT' : 'POST'

    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(result.data),
    })

    setIsLoading(false)

    if (!response.ok) {
      const json = (await response.json().catch(() => ({}))) as { error?: string }
      setApiError(json.error ?? 'No se pudo guardar el artículo. Inténtalo de nuevo.')
      return
    }

    router.push(ROUTES.admin.blog)
    router.refresh()
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      aria-label={isEdit ? 'Formulario para editar artículo' : 'Formulario para crear artículo'}
      className="space-y-6 max-w-2xl"
    >
      <Input
        id="titulo"
        label="Título"
        placeholder="Ej. Los 10 mejores destinos para 2026"
        value={form.titulo}
        onChange={(e) => setField('titulo', e.target.value)}
        error={errors.titulo}
        required
        disabled={isLoading}
      />

      <Textarea
        id="extracto"
        label="Extracto"
        placeholder="Resumen breve del artículo (máximo 300 caracteres)…"
        rows={3}
        value={form.extracto}
        onChange={(e) => setField('extracto', e.target.value)}
        error={errors.extracto}
        hint={`${form.extracto.length} / 300 caracteres`}
        required
        disabled={isLoading}
      />

      <MarkdownEditor
        value={form.contenido}
        onChange={(v) => setField('contenido', v)}
        error={errors.contenido}
        disabled={isLoading}
      />

      <Input
        id="imagenPortada"
        label="URL de imagen de portada"
        placeholder="https://images.unsplash.com/… (opcional)"
        value={form.imagenPortada}
        onChange={(e) => setField('imagenPortada', e.target.value)}
        error={errors.imagenPortada}
        disabled={isLoading}
      />

      <Input
        id="categoria"
        label="Categoría"
        placeholder="Ej. Guías de destino"
        value={form.categoria}
        onChange={(e) => setField('categoria', e.target.value)}
        error={errors.categoria}
        required
        disabled={isLoading}
      />

      {/* Publicado ────────────────────────────────────────── */}
      <label className="flex items-center gap-3 cursor-pointer group">
        <input
          type="checkbox"
          checked={form.publicado}
          onChange={(e) => setField('publicado', e.target.checked)}
          disabled={isLoading}
          className="w-4 h-4 accent-dorado cursor-pointer"
          aria-label="Publicar artículo en el blog"
        />
        <span className="text-xs tracking-widest uppercase text-plata group-hover:text-crema transition-colors">
          Publicar artículo
        </span>
        <span className="text-[10px] text-plata/40">
          {form.publicado ? '— visible en /blog' : '— guardado como borrador'}
        </span>
      </label>

      {/* Error global ─────────────────────────────────────── */}
      {apiError && (
        <p role="alert" className="text-sm text-red-400 tracking-wide">
          {apiError}
        </p>
      )}

      {/* Acciones ────────────────────────────────────────── */}
      <div className="flex items-center gap-3 pt-2">
        <Button type="submit" variant="solid" isLoading={isLoading}>
          {isEdit ? 'Guardar cambios' : 'Crear artículo'}
        </Button>
        <Button
          type="button"
          variant="ghost"
          disabled={isLoading}
          onClick={() => router.push(ROUTES.admin.blog)}
        >
          Cancelar
        </Button>
      </div>
    </form>
  )
}

// ─── Editor de Markdown con vista previa ─────────────────────────────────────

interface MarkdownEditorProps {
  value:    string
  onChange: (v: string) => void
  error?:   string
  disabled?: boolean
}

function MarkdownEditor({ value, onChange, error, disabled }: MarkdownEditorProps) {
  const [tab, setTab] = useState<'write' | 'preview'>('write')

  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-xs tracking-widest2 uppercase font-light text-plata">
        Contenido
        <span aria-hidden="true" className="ml-1 text-dorado">*</span>
      </span>

      <div className={cn(
        'border transition-colors',
        error ? 'border-red-500/50' : 'border-crema/10 focus-within:border-dorado/30',
      )}>
        {/* Tabs */}
        <div className="flex border-b border-crema/10">
          <TabButton active={tab === 'write'} onClick={() => setTab('write')}>
            Escribir
          </TabButton>
          <TabButton active={tab === 'preview'} onClick={() => setTab('preview')}>
            Vista previa
          </TabButton>
          <span className="ml-auto self-center pr-4 text-[10px] text-plata/30 tracking-widest">
            Markdown
          </span>
        </div>

        {/* Content area */}
        {tab === 'write' ? (
          <textarea
            id="contenido"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
            rows={16}
            placeholder="Escribe el contenido del artículo en Markdown…"
            className={cn(
              'w-full bg-transparent px-4 py-3 text-crema/90 text-sm leading-relaxed resize-y',
              'placeholder:text-plata/30 outline-none font-mono',
              disabled && 'cursor-not-allowed opacity-50',
            )}
            aria-label="Contenido del artículo en formato Markdown"
            aria-required="true"
            aria-invalid={!!error}
          />
        ) : (
          <div
            className="px-6 py-4 min-h-[200px]"
            aria-label="Vista previa del artículo"
          >
            {value.trim() ? (
              <ReactMarkdown
                components={{
                  h1: ({ children }) => (
                    <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 300, fontSize: '28px' }} className="text-crema mb-4 mt-6">{children}</h1>
                  ),
                  h2: ({ children }) => (
                    <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 300, fontSize: '22px' }} className="text-crema mb-3 mt-5">{children}</h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="text-crema text-base font-medium mb-2 mt-4">{children}</h3>
                  ),
                  p: ({ children }) => (
                    <p className="text-plata/80 text-sm leading-loose mb-4">{children}</p>
                  ),
                  strong: ({ children }) => (
                    <strong className="text-crema font-medium">{children}</strong>
                  ),
                  em: ({ children }) => (
                    <em className="text-crema/80 italic">{children}</em>
                  ),
                  ul: ({ children }) => (
                    <ul className="list-disc list-inside text-plata/80 text-sm space-y-1.5 mb-4 ml-2">{children}</ul>
                  ),
                  ol: ({ children }) => (
                    <ol className="list-decimal list-inside text-plata/80 text-sm space-y-1.5 mb-4 ml-2">{children}</ol>
                  ),
                  li: ({ children }) => <li>{children}</li>,
                  a: ({ href, children }) => (
                    <a href={href} className="text-dorado hover:text-dorado-claro underline underline-offset-2">{children}</a>
                  ),
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-2 border-dorado/30 pl-4 italic text-plata/60 mb-4">{children}</blockquote>
                  ),
                  code: ({ children }) => (
                    <code className="bg-negro/60 text-dorado/80 px-1 py-0.5 text-xs rounded">{children}</code>
                  ),
                  pre: ({ children }) => (
                    <pre className="bg-negro/60 p-4 overflow-x-auto mb-4 text-xs">{children}</pre>
                  ),
                  hr: () => <hr className="border-dorado/10 my-6" />,
                }}
              >
                {value}
              </ReactMarkdown>
            ) : (
              <p className="text-plata/30 text-sm italic">Nada que previsualizar todavía.</p>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between">
        <span className="text-[10px] text-plata/40">{value.length} caracteres</span>
        {error && (
          <p role="alert" className="text-xs text-red-400">
            {error}
          </p>
        )}
      </div>
    </div>
  )
}

// ─── Tab button ───────────────────────────────────────────────────────────────

interface TabButtonProps {
  active:   boolean
  onClick:  () => void
  children: React.ReactNode
}

function TabButton({ active, onClick, children }: TabButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'px-5 py-2.5 text-[10px] tracking-widest uppercase transition-colors',
        active
          ? 'text-dorado border-b border-dorado -mb-px'
          : 'text-plata/40 hover:text-plata',
      )}
    >
      {children}
    </button>
  )
}
