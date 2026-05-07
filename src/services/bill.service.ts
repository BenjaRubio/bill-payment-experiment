import prisma from "../database/client";
import { BillModel } from "../database/generated/models";

export async function createBill({
  userId,
  amount,
  emissionDate,
  expirationDate,
}: {
  userId: number,
  amount?: number,
  emissionDate?: Date,
  expirationDate?: Date
}): Promise<BillModel> {
  const bill = await prisma.bill.create({
    data: {
      userId,
      amount: amount ?? Math.floor(Math.random() * 50000) + 10000,
      emissionDate: emissionDate ?? new Date(),
      expirationDate: expirationDate ?? new Date(new Date().setDate(new Date().getDate() + 2)),
    }
  })

  return bill;
}

export async function getUserPendingBills(userId: number) {
  return await prisma.bill.findMany({
    where: { userId, paidAt: null, expirationDate: { gt: new Date() } }
  })
}