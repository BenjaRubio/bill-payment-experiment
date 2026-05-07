import prisma from '@/database/client'
import { ExperimentGroup, TrackingEventEnum } from '@/database/generated/enums'

type BillLike = {
  expirationDate: Date
  paidAt: Date | null
}

export function billIsExpiredUnpaid(bill: BillLike, now: Date): boolean {
  return bill.paidAt == null && bill.expirationDate.getTime() <= now.getTime()
}

export function userEligibleForConversion(bills: BillLike[], now: Date): boolean {
  if (bills.length === 0) return false
  return bills.some(
    (b) => b.paidAt != null || billIsExpiredUnpaid(b, now)
  )
}

export function userPaidAllOnTime(bills: BillLike[]): boolean {
  for (const b of bills) {
    if (!b.paidAt) return false
    if (b.paidAt.getTime() > b.expirationDate.getTime()) return false
  }
  return true
}

export type GroupExperimentMetrics = {
  totalUsers: number
  eligibleUsers: number
  convertedUsers: number
}

export type ExperimentDashboardData = {
  now: Date
  control: GroupExperimentMetrics
  variant: GroupExperimentMetrics
  variantBannerViewed: number
  variantFunnelConvertedWithBanner: number
}

type Group = 'CONTROL' | 'VARIANT'

export async function getExperimentDashboardData(): Promise<ExperimentDashboardData> {
  const now = new Date()

  const users = await prisma.user.findMany({
    include: { bills: true },
    orderBy: { id: 'asc' },
  })

  const bannerEvents = await prisma.trackingEvent.findMany({
    where: { eventName: TrackingEventEnum.BANNER_VIEWED },
    select: { userId: true },
  })

  const variantUserIdSet = new Set(
    users.filter((u) => u.experimentGroup === ExperimentGroup.VARIANT).map((u) => u.id)
  )
  const bannerUserIdsDistinct = [...new Set(bannerEvents.map((e) => e.userId))]
  const variantBannerUserIds = bannerUserIdsDistinct.filter((id) => variantUserIdSet.has(id))
  const variantBannerSeenSet = new Set(variantBannerUserIds)

  function emptyBucket(): GroupExperimentMetrics {
    return { totalUsers: 0, eligibleUsers: 0, convertedUsers: 0 }
  }

  const buckets: Record<Group, GroupExperimentMetrics> = {
    CONTROL: emptyBucket(),
    VARIANT: emptyBucket(),
  }

  let variantFunnelConvertedWithBanner = 0

  for (const u of users) {
    const g = u.experimentGroup as Group
    buckets[g].totalUsers += 1

    const eligible = userEligibleForConversion(u.bills, now)
    if (!eligible) continue

    buckets[g].eligibleUsers += 1

    const converted = userPaidAllOnTime(u.bills)
    if (!converted) continue

    buckets[g].convertedUsers += 1

    if (g === 'VARIANT' && variantBannerSeenSet.has(u.id)) {
      variantFunnelConvertedWithBanner += 1
    }
  }

  return {
    now,
    control: buckets.CONTROL,
    variant: buckets.VARIANT,
    variantBannerViewed: variantBannerUserIds.length,
    variantFunnelConvertedWithBanner,
  }
}
