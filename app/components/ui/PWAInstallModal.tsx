'use client'

import { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Button from '@/app/components/ui/Button'
import { useLocalStorage } from '@/hooks/useLocalStorage'

// ─── Tipos ───────────────────────────────────────────────────────────────────

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

type Platform = 'ios' | 'other'

// ─── Constantes ──────────────────────────────────────────────────────────────

const MODAL_TITLE_ID = 'pwa-install-title'
const SHOW_DELAY_MS = 4000

// ─── Utilidades ──────────────────────────────────────────────────────────────

function detectPlatform(): Platform | null {
  if (typeof window === 'undefined') return null

  const isStandalone =
    window.matchMedia('(display-mode: standalone)').matches ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true

  if (isStandalone) return null
  if (/iPhone|iPad|iPod/.test(navigator.userAgent)) return 'ios'
  return 'other'
}

// ─── Componente ──────────────────────────────────────────────────────────────

export default function PWAInstallModal() {
  const [neverShow, setNeverShow] = useLocalStorage<boolean>('eleva-pwa-never', false)
  const [visible, setVisible] = useState(false)
  const [platform, setPlatform] = useState<Platform | null>(null)
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)

  const dismiss = useCallback(() => setVisible(false), [])

  const dismissPermanently = useCallback(() => {
    setNeverShow(true)
    setVisible(false)
  }, [setNeverShow])

  const handleInstall = useCallback(async () => {
    if (platform === 'ios') {
      dismiss()
      return
    }
    if (!deferredPrompt) return

    await deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    if (outcome === 'accepted') setNeverShow(true)
    setDeferredPrompt(null)
    setVisible(false)
  }, [platform, deferredPrompt, dismiss, setNeverShow])

  // Tecla Escape → cierra como "más tarde"
  useEffect(() => {
    if (!visible) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') dismiss() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [visible, dismiss])

  // Scroll lock mientras el modal está visible
  useEffect(() => {
    document.body.style.overflow = visible ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [visible])

  // Detección de plataforma + timer de aparición
  useEffect(() => {
    if (neverShow) return

    const detected = detectPlatform()
    if (!detected) return
    setPlatform(detected)

    let timer: ReturnType<typeof setTimeout>

    if (detected === 'ios') {
      timer = setTimeout(() => setVisible(true), SHOW_DELAY_MS)
      return () => clearTimeout(timer)
    }

    // Otros: esperar evento nativo del browser
    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      timer = setTimeout(() => setVisible(true), SHOW_DELAY_MS)
    }
    window.addEventListener('beforeinstallprompt', handler)
    return () => {
      window.removeEventListener('beforeinstallprompt', handler)
      clearTimeout(timer)
    }
  }, [neverShow])

  return (
    <AnimatePresence>
      {visible && (
        <>
          {/* Overlay */}
          <motion.div
            key="pwa-overlay"
            className="fixed inset-0 z-50 bg-negro/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={dismiss}
            aria-hidden="true"
          />

          {/* Contenedor centrador (sin visual, pointer-events-none) */}
          <div className="pointer-events-none fixed inset-x-0 bottom-6 z-50 flex justify-center px-4">
            {/* Panel animado */}
            <motion.div
              key="pwa-panel"
              role="dialog"
              aria-modal="true"
              aria-labelledby={MODAL_TITLE_ID}
              className="pointer-events-auto w-full max-w-sm"
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 32 }}
              transition={{ type: 'spring', damping: 28, stiffness: 320 }}
            >
              <div className="rounded border border-dorado/30 bg-negro p-7 shadow-[0_0_60px_rgba(201,168,76,0.1)]">

                {/* Encabezado */}
                <div className="mb-5 flex items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded border border-dorado/40">
                    <span className="font-serif text-2xl text-dorado" aria-hidden="true">É</span>
                  </div>
                  <div>
                    <h2 id={MODAL_TITLE_ID} className="font-serif text-lg leading-tight text-crema">
                      Instala ÉLEVA
                    </h2>
                    <p className="font-sans text-xs text-plata">
                      Accede rápido desde tu pantalla de inicio
                    </p>
                  </div>
                </div>

                {/* Instrucciones iOS */}
                {platform === 'ios' && (
                  <ol className="mb-5 space-y-2 rounded border border-dorado/10 bg-crema/5 p-4 font-sans text-xs text-crema/80">
                    <li className="flex gap-2">
                      <span className="shrink-0 font-semibold text-dorado">1.</span>
                      Toca el ícono Compartir en Safari
                    </li>
                    <li className="flex gap-2">
                      <span className="shrink-0 font-semibold text-dorado">2.</span>
                      Selecciona «Agregar a pantalla de inicio»
                    </li>
                    <li className="flex gap-2">
                      <span className="shrink-0 font-semibold text-dorado">3.</span>
                      Confirma tocando «Agregar»
                    </li>
                  </ol>
                )}

                {/* Acciones */}
                <div className="flex flex-col gap-2">
                  <Button
                    variant="gold"
                    size="sm"
                    className="w-full"
                    onClick={() => { void handleInstall() }}
                  >
                    {platform === 'ios' ? 'Instalaré ahora' : 'Instalar ahora'}
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full"
                    onClick={dismiss}
                  >
                    Quizás más tarde
                  </Button>

                  <button
                    className="mt-1 text-xs uppercase tracking-widest2 text-plata/50 transition-colors hover:text-plata/80"
                    onClick={dismissPermanently}
                  >
                    No volver a mostrar
                  </button>
                </div>

              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
