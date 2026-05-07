'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import type { ExperimentGroup } from '@/database/generated/enums'
import {
  createUser,
  getUserWithAllBills,
  getUserWithExpiringBills,
} from '@/services/user.service'
import { createBill } from '@/services/bill.service'

export async function createTestUser(group: ExperimentGroup) {
  const user = await createUser(group)

  const expirationDate = new Date()
  expirationDate.setDate(expirationDate.getDate() + 2)

  await createBill({
    userId: user.id,
    expirationDate,
  })

  ;(await cookies()).set('user_id', user.id.toString(), { path: '/' })
  redirect('/')
}

export async function getHomePageUser() {
  const userIdStr = (await cookies()).get('user_id')?.value
  const userId = userIdStr ? parseInt(userIdStr, 10) : null

  return userId ? getUserWithExpiringBills(userId) : null
}

export async function getBillsPageUser() {
  const userIdStr = (await cookies()).get('user_id')?.value
  const userId = userIdStr ? parseInt(userIdStr, 10) : null

  return userId ? getUserWithAllBills(userId) : null
}