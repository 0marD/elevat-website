import { prisma } from '@/lib/db'

export interface PushSubscriptionRecord {
  id: string
  endpoint: string
  p256dh: string
  auth: string
  creadoEn: Date
}

export async function saveSubscription(
  endpoint: string,
  p256dh: string,
  auth: string,
): Promise<void> {
  await prisma.pushSubscription.upsert({
    where:  { endpoint },
    update: { p256dh, auth },
    create: { endpoint, p256dh, auth },
  })
}

export async function getAllSubscriptions(): Promise<PushSubscriptionRecord[]> {
  return prisma.pushSubscription.findMany()
}

export async function deleteSubscription(endpoint: string): Promise<void> {
  await prisma.pushSubscription.deleteMany({ where: { endpoint } })
}
