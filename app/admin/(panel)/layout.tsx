import { ReactNode } from 'react'
import Sidebar from '@/app/components/admin/Sidebar'

interface AdminPanelLayoutProps {
  children: ReactNode
}

export default function AdminPanelLayout({ children }: AdminPanelLayoutProps) {
  return (
    <div className="flex min-h-screen bg-negro">
      <Sidebar />
      {/*
        pt-14: compensa el header móvil fijo que renderiza el propio Sidebar.
        En desktop (md+) el sidebar ocupa su lugar en el flujo flex y no hay header fijo,
        por eso pt-14 se anula con md:pt-0.
      */}
      <div className="flex-1 min-w-0 pt-14 md:pt-0 overflow-auto">
        {children}
      </div>
    </div>
  )
}
