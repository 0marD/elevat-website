'use client'

import { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Button from '@/app/components/ui/Button'
import { useLocalStorage } from '@/hooks/useLocalStorage'

// ─── Constantes ──────────────────────────────────────────────────────────────

const BANNER_TITLE_ID = 'push-banner-title'
const SHOW_DELAY_MS   = 3000

// ─── Utilidades ──────────────────────────────────────────────────────────────

function isStandalone(): boolean {
  if (typeof window === 'undefined') return false
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true
  )
}

function urlBase64ToUint8Array(base64String: string): Uint8Array<ArrayBuffer> {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64  = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const raw     = window.atob(base64)
  const buffer  = new ArrayBuffer(raw.length)
  const view    = new Uint8Array(buffer)
  for (let i = 0; i < raw.length; i++) {
    view[i] = raw.charCodeAt(i)
  }
  return view
}

// ─── Componente ──────────────────────────────────────────────────────────────

export default function PushNotificationBanner() {
  const [dismissed, setDismissed]   = useLocalStorage<boolean>('eleva-push-dismissed', false)
  const [visible, setVisible]       = useState(false)
  const [subscribing, setSubscribing] = useState(false)
  const [subscribed, setSubscribed]   = useState(false)

  const dismiss = useCallback(() => setVisible(false), [])

  const dismissPermanently = useCallback(() => {
    setDismissed(true)
    setVisible(false)
  }, [setDismissed])

  const handleSubscribe = useCallback(async () => {
    const vapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
    if (!vapidKey) return

    setSubscribing(true)
    try {
      const registration  = await navigator.serviceWorker.ready
      const subscription  = await registration.pushManager.subscribe({
        userVisibleOnly:      true,
        applicationServerKey: urlBase64ToUint8Array(vapidKey),
      })

      const json   = subscription.toJSON()
      const keys   = json.keys ?? {}
      const p256dh = keys['p256dh'] ?? ''
      const auth   = keys['auth']   ?? ''

      await fetch('/api/push/subscribe', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ endpoint: subscription.endpoint, p256dh, auth }),
      })

      setSubscribed(true)
      setTimeout(() => setVisible(false), 2000)
    } catch (err) {
      console.error('[push] Error al suscribirse:', err)
      dismiss()
    } finally {
      setSubscribing(false)
    }
  }, [dismiss])

  // Tecla Escape → cierra como "ahora no"
  useEffect(() => {
    if (!visible) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') dismiss() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [visible, dismiss])

  // Lógica de aparición
  useEffect(() => {
    if (dismissed) return
    if (!isStandalone()) return
    if (!('Notification' in window)) return
    if (Notification.permission !== 'default') return
    if (!('serviceWorker' in navigator)) return

    const timer = setTimeout(() => setVisible(true), SHOW_DELAY_MS)
    return () => clearTimeout(timer)
  }, [dismissed])

  return (
    <AnimatePresence>
      {visible && (
        <div className="pointer-events-none fixed inset-x-0 bottom-6 z-40 flex justify-center px-4">
          <motion.div
            role="region"
            aria-labelledby={BANNER_TITLE_ID}
            className="pointer-events-auto w-full max-w-sm"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
          >
            <div className="rounded border border-dorado/30 bg-negro p-6 shadow-[0_0_60px_rgba(201,168,76,0.08)]">

              {subscribed ? (
                <p id={BANNER_TITLE_ID} className="font-sans text-sm text-dorado text-center">
                  ¡Notificaciones activadas!
                </p>
              ) : (
                <>
                  {/* Encabezado */}
                  <div className="mb-4 flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded border border-dorado/40">
                      <span className="font-serif text-lg text-dorado" aria-hidden="true">É</span>
                    </div>
                    <div>
                      <p id={BANNER_TITLE_ID} className="font-serif text-sm leading-snug text-crema">
                        Notificaciones de ÉLEVA.
                      </p>
                      <p className="font-sans text-xs text-plata leading-relaxed mt-0.5">
                        Entérate cuando publiquemos nuevos artículos, destinos y experiencias.
                      </p>
                    </div>
                  </div>

                  {/* Acciones */}
                  <div className="flex flex-col gap-2">
                    <Button
                      variant="gold"
                      size="sm"
                      className="w-full"
                      isLoading={subscribing}
                      onClick={() => { void handleSubscribe() }}
                    >
                      Activar notificaciones
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full"
                      onClick={dismiss}
                    >
                      Ahora no
                    </Button>

                    <button
                      className="mt-1 text-xs uppercase tracking-widest2 text-plata/50 transition-colors hover:text-plata/80"
                      onClick={dismissPermanently}
                    >
                      No volver a preguntar
                    </button>
                  </div>
                </>
              )}

            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
