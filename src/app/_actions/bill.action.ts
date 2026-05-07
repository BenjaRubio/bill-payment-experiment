'use server'

import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'

import prisma from '@/database/client'
import { trackEvent } from '@/services/tracking-events.service'
import { TrackingEventEnum } from '@/database/generated/enums'

export async function payBill(billId: number) {
  const raw = (await cookies()).get('user_id')?.value
  const userId = raw ? parseInt(raw, 10) : null
  if (userId == null) {
    return
  }

  const bill = await prisma.bill.findFirst({
    where: { id: billId, userId },
  })

  if (!bill || bill.paidAt) {
    return
  }

  await prisma.bill.update({
    where: { id: billId },
    data: { paidAt: new Date() },
  })

  await trackEvent(TrackingEventEnum.BILL_PAID, userId)

  revalidatePath('/bills')
  revalidatePath('/')
}
