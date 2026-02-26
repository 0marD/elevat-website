/* eslint-disable @typescript-eslint/no-explicit-any */
declare const self: ServiceWorkerGlobalScope

interface PushData {
  title: string
  body: string
  url: string
}

self.addEventListener('push', (event: any) => {
  const data = (event.data?.json() ?? {}) as PushData

  event.waitUntil(
    self.registration.showNotification(data.title ?? 'ÉLEVA.', {
      body:  data.body ?? '',
      icon:  '/icons/icon-192.svg',
      badge: '/icons/icon-192.svg',
      data:  { url: data.url ?? '/' },
    })
  )
})

self.addEventListener('notificationclick', (event: any) => {
  event.notification.close()
  const url = (event.notification.data?.url as string) ?? '/'
  event.waitUntil(clients.openWindow(url))
})
