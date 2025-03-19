/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";
import { OrderStatus } from "@prisma/client";
import { prisma } from "../prisma";

export const updateOrderStatusServer = async (id: string, newStatus: OrderStatus) => {
  try {
    const updatedOrder = await prisma.order.update({
      where: { id },
      data: {
        status: newStatus,
      },
    });
    return updatedOrder;
  } catch (error) {
    console.error("Error updating order status:", error);
    throw error;
  }
};
