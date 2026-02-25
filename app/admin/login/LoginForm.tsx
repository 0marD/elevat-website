'use client'

import { useState, FormEvent } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import Input from '@/app/components/ui/Input'
import Button from '@/app/components/ui/Button'

// Mensaje legible para el código de error que devuelve NextAuth
const ERROR_MESSAGES: Record<string, string> = {
  CredentialsSignin: 'Correo o contraseña incorrectos.',
  default:           'Ocurrió un error. Inténtalo de nuevo.',
}

interface FormState {
  email: string
  password: string
}

const INITIAL_STATE: FormState = { email: '', password: '' }

export default function LoginForm() {
  const router       = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl  = searchParams.get('callbackUrl') ?? '/admin'

  const [form, setForm]         = useState<FormState>(INITIAL_STATE)
  const [error, setError]       = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (field: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setError(null)
      setForm((prev) => ({ ...prev, [field]: e.target.value }))
    }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    const result = await signIn('credentials', {
      email:    form.email,
      password: form.password,
      redirect: false,
    })

    setIsLoading(false)

    if (!result?.ok) {
      const code = result?.error ?? 'default'
      setError(ERROR_MESSAGES[code] ?? ERROR_MESSAGES.default)
      return
    }

    router.push(callbackUrl)
    router.refresh()
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      aria-label="Formulario de acceso al panel"
      className="space-y-4"
    >
      <Input
        id="email"
        type="email"
        label="Correo electrónico"
        autoComplete="email"
        value={form.email}
        onChange={handleChange('email')}
        required
        disabled={isLoading}
      />

      <Input
        id="password"
        type="password"
        label="Contraseña"
        autoComplete="current-password"
        value={form.password}
        onChange={handleChange('password')}
        required
        disabled={isLoading}
      />

      {/* Error global ─────────────────────────────────────── */}
      {error && (
        <p role="alert" className="text-xs text-red-400 text-center tracking-wide pt-1">
          {error}
        </p>
      )}

      <Button
        type="submit"
        variant="solid"
        size="md"
        isLoading={isLoading}
        className="w-full mt-2"
      >
        {isLoading ? 'Verificando…' : 'Iniciar sesión'}
      </Button>
    </form>
  )
}
