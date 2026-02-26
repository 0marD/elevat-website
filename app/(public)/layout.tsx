import { ReactNode } from 'react'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import PWAInstallModal from '../components/ui/PWAInstallModal'
import PushNotificationBanner from '../components/ui/PushNotificationBanner'

interface PublicLayoutProps {
  children: ReactNode
}

export default function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
      <PWAInstallModal />
      <PushNotificationBanner />
    </>
  )
}
