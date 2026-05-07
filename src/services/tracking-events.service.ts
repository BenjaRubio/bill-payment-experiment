import prisma from '@/database/client'
import { TrackingEventEnum } from '@/database/generated/enums'

export async function trackEvent(eventName: TrackingEventEnum, userId: number) {
  // avoid duplicates
  const existing = await prisma.trackingEvent.findFirst({
    where: { userId, eventName },
    select: { id: true },
  })
  if (existing) return false

  await prisma.trackingEvent.create({
    data: {
      eventName,
      userId,
    },
  })
  return true
}

