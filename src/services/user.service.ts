import { ExperimentGroup } from "../database/generated/enums";
import prisma from "../database/client";

export async function createUser (group: ExperimentGroup) {
  const user = await prisma.user.create({
    data: {
      name: `Test User ${group}`,
      email: `test-${Date.now()}@test.com`,
      experimentGroup: group,
    }
  })

  return user;
}

export async function getUserById(userId: number) {
  return prisma.user.findUnique({
    where: { id: userId },
    include: {
      bills: { where: { paidAt: null } },
    },
  })
}

export async function getUserWithExpiringBills(userId: number) {
  const limitDate = new Date();
  limitDate.setDate(limitDate.getDate() + 2);

  return prisma.user.findUnique({
    where: { id: userId },
    include: {
      bills: {
        where: {
          paidAt: null,
          expirationDate: { lte: limitDate }
        }
      }
    },
  })
}

export async function getUserWithAllBills(userId: number) {
  return prisma.user.findUnique({
    where: { id: userId },
    include: {
      bills: {
        orderBy: { expirationDate: "asc" },
      },
    },
  })
}
