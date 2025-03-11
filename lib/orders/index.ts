/* eslint-disable @typescript-eslint/no-explicit-any */
"use server"
import { prisma } from "../prisma";

export const updateOrderStatusServer = async (newStatus: any, id: string) => {
    await prisma.order.update({
        where: { id },
        data: {
          status: newStatus,
        },
      });
}