// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import LoginForm from '@/app/admin/login/LoginForm'

const mockPush    = vi.fn()
const mockRefresh = vi.fn()
const mockGet     = vi.fn()

vi.mock('next/navigation', () => ({
  useRouter:      () => ({ push: mockPush, refresh: mockRefresh }),
  useSearchParams: () => ({ get: mockGet }),
}))

const mockSignIn = vi.fn()
vi.mock('next-auth/react', () => ({
  signIn: (...args: unknown[]) => mockSignIn(...args),
}))

beforeEach(() => {
  vi.clearAllMocks()
  mockGet.mockReturnValue(null) // sin callbackUrl
})

describe('LoginForm — renderizado', () => {
  it('muestra el campo de email', () => {
    render(<LoginForm />)
    expect(screen.getByLabelText(/correo electrónico/i)).toBeInTheDocument()
  })

  it('muestra el campo de contraseña', () => {
    render(<LoginForm />)
    expect(screen.getByLabelText(/contraseña/i)).toBeInTheDocument()
  })

  it('muestra el botón de iniciar sesión', () => {
    render(<LoginForm />)
    expect(screen.getByRole('button', { name: /iniciar sesión/i })).toBeInTheDocument()
  })

  it('no muestra mensajes de error al cargar', () => {
    render(<LoginForm />)
    expect(screen.queryByRole('alert')).toBeNull()
  })
})

describe('LoginForm — autenticación exitosa', () => {
  it('redirige a /admin tras login exitoso', async () => {
    mockSignIn.mockResolvedValue({ ok: true, error: null })
    render(<LoginForm />)

    fireEvent.change(screen.getByLabelText(/correo electrónico/i), { target: { value: 'admin@eleva.mx' } })
    fireEvent.change(screen.getByLabelText(/contraseña/i),         { target: { value: 'clave123' } })
    fireEvent.submit(screen.getByRole('form'))

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/admin')
      expect(mockRefresh).toHaveBeenCalledOnce()
    })
  })

  it('redirige a callbackUrl cuando se proporciona', async () => {
    mockGet.mockReturnValue('/admin/cotizaciones')
    mockSignIn.mockResolvedValue({ ok: true, error: null })
    render(<LoginForm />)

    fireEvent.change(screen.getByLabelText(/correo electrónico/i), { target: { value: 'admin@eleva.mx' } })
    fireEvent.change(screen.getByLabelText(/contraseña/i),         { target: { value: 'clave123' } })
    fireEvent.submit(screen.getByRole('form'))

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/admin/cotizaciones')
    })
  })

  it('llama a signIn con las credenciales correctas', async () => {
    mockSignIn.mockResolvedValue({ ok: true, error: null })
    render(<LoginForm />)

    fireEvent.change(screen.getByLabelText(/correo electrónico/i), { target: { value: 'admin@eleva.mx' } })
    fireEvent.change(screen.getByLabelText(/contraseña/i),         { target: { value: 'clave123' } })
    fireEvent.submit(screen.getByRole('form'))

    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith('credentials', {
        email:    'admin@eleva.mx',
        password: 'clave123',
        redirect: false,
      })
    })
  })
})

describe('LoginForm — errores de autenticación', () => {
  it('muestra error cuando las credenciales son incorrectas', async () => {
    mockSignIn.mockResolvedValue({ ok: false, error: 'CredentialsSignin' })
    render(<LoginForm />)

    fireEvent.change(screen.getByLabelText(/correo electrónico/i), { target: { value: 'admin@eleva.mx' } })
    fireEvent.change(screen.getByLabelText(/contraseña/i),         { target: { value: 'mala-clave' } })
    fireEvent.submit(screen.getByRole('form'))

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(/correo o contraseña incorrectos/i)
    })
    expect(mockPush).not.toHaveBeenCalled()
  })

  it('muestra error genérico para errores desconocidos', async () => {
    mockSignIn.mockResolvedValue({ ok: false, error: 'UnknownError' })
    render(<LoginForm />)

    fireEvent.submit(screen.getByRole('form'))

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(/ocurrió un error/i)
    })
  })

  it('limpia el error al escribir en cualquier campo', async () => {
    mockSignIn.mockResolvedValue({ ok: false, error: 'CredentialsSignin' })
    render(<LoginForm />)

    fireEvent.submit(screen.getByRole('form'))

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument()
    })

    fireEvent.change(screen.getByLabelText(/correo electrónico/i), { target: { value: 'nuevo@email.com' } })
    expect(screen.queryByRole('alert')).toBeNull()
  })
})

describe('LoginForm — estado de carga', () => {
  it('muestra "Verificando…" durante la petición', async () => {
    // signIn que nunca resuelve para inspeccionar el estado intermedio
    mockSignIn.mockReturnValue(new Promise(() => {}))
    render(<LoginForm />)

    fireEvent.submit(screen.getByRole('form'))

    await waitFor(() => {
      expect(screen.getByRole('button')).toHaveTextContent(/verificando/i)
    })
  })
})
