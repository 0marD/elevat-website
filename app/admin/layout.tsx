import { ReactNode } from 'react'

interface AdminLayoutProps {
  children: ReactNode
}

// Layout raíz del área admin.
// No incluye Navbar ni Footer del sitio público.
// La página de login usa solo este layout (sin sidebar).
// El panel autenticado hereda además app/admin/(panel)/layout.tsx.
export default function AdminLayout({ children }: AdminLayoutProps) {
  return <>{children}</>
}
