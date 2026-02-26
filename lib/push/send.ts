import webpush from 'web-push'
import { getAllSubscriptions, deleteSubscription } from '@/lib/data/push-store'

export interface PushPayload {
  title: string
  body: string
  url: string
}

export async function sendPushToAll(payload: PushPayload): Promise<void> {
  const vapidPublic  = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
  const vapidPrivate = process.env.VAPID_PRIVATE_KEY
  const vapidSubject = process.env.VAPID_SUBJECT

  if (!vapidPublic || !vapidPrivate || !vapidSubject) {
    console.warn('[push] VAPID keys no configuradas — se omite el envío')
    return
  }

  webpush.setVapidDetails(vapidSubject, vapidPublic, vapidPrivate)

  const subscriptions = await getAllSubscriptions()
  if (subscriptions.length === 0) return

  await Promise.allSettled(
    subscriptions.map(async (sub) => {
      try {
        await webpush.sendNotification(
          { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
          JSON.stringify(payload),
        )
      } catch (err) {
        const statusCode = (err as { statusCode?: number }).statusCode
        if (statusCode === 410 || statusCode === 404) {
          await deleteSubscription(sub.endpoint)
        } else {
          console.error('[push] Error al enviar notificación:', err)
        }
      }
    }),
  )
}
