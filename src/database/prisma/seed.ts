import { BillTypeEnum, ExperimentGroup, TrackingEventEnum } from '../generated/enums'
import prisma from '../client';

async function main() {
  const lightBill = await prisma.billType.create({ data: { name: BillTypeEnum.LIGHT } })
  const today = new Date()

  // 2. Create 100 users (50 CONTROL, 50 VARIANT)
  for (let i = 1; i <= 100; i++) {
    const group = i % 2 === 0 ? ExperimentGroup.CONTROL : ExperimentGroup.VARIANT

    const passedExpirationDate = new Date(today)
    passedExpirationDate.setDate(today.getDate() - 3)

    const conversionThreshold = i % 2 === 0 ? 0.3 : 0.6
    const paidOnTime = Math.random() < conversionThreshold

    let paidAt = null
    if (paidOnTime) {
      paidAt = new Date(passedExpirationDate)
      paidAt.setDate(paidAt.getDate() - 0.5)
    }
    
    const user = await prisma.user.create({
      data: {
        name: `Test User ${i}`,
        email: `user_${i}@example.com`,
        experimentGroup: group,
      }
    })

    // create an expired and randomly paid bill
    const emissionDate = new Date()
    emissionDate.setDate(today.getDate() - 14)

    await prisma.bill.create({
      data: {
        userId: user.id,
        billTypeId: lightBill.id,
        emissionDate: emissionDate,
        expirationDate: passedExpirationDate,
        amount: Math.floor(Math.random() * 50000) + 10000,
        paidAt: paidAt,
      }
    })

    if (paidAt) {
      await prisma.trackingEvent.create({
        data: {
          userId: user.id,
          eventName: TrackingEventEnum.BILL_PAID,
          createdAt: paidAt,
        }
      })
    }

    if (group === ExperimentGroup.VARIANT) {
      const viewedAt = new Date(passedExpirationDate.setDate(passedExpirationDate.getDate() - 2))
      await prisma.trackingEvent.create({
        data: {
          userId: user.id,
          eventName: TrackingEventEnum.BANNER_VIEWED,
          createdAt: viewedAt,
        }
      })
    }
  }

  console.log("✅ Seed completed. 100 users created ready for the experiment.")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })