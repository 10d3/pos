"use server";
import { startOfWeek, startOfMonth, startOfYear, startOfDay } from "date-fns";

import { OrderStatus } from "@prisma/client";
import { prisma } from "../prisma";

export async function getTotalRevenue() {
  try {
    const totalRevenue = await prisma.order.aggregate({
      _sum: { total: true },
      where: { status: OrderStatus.COMPLETED },
    });
    return totalRevenue;
  } catch (error) {
    console.log(error);
  }
}

export async function getPaidOrders() {
  try {
    const paidOrders = await prisma.order.count({
      where: { status: OrderStatus.COMPLETED },
    });
    return paidOrders;
  } catch (error) {
    console.log(error);
  }
}

export async function getDishesSold() {
  try {
    const dishesSold = await prisma.orderItem.aggregate({
      _sum: { quantity: true },
    });
    return dishesSold;
  } catch (error) {
    console.log(error);
  }
}

export async function getTopDishes() {
  const topDishes = await prisma.orderItem.groupBy({
    by: ["menuItemId"],
    _sum: { quantity: true },
    orderBy: { _sum: { quantity: "desc" } },
    take: 5,
  });

  const dishesWithItems = await Promise.all(
    topDishes.map(async (dish) => {
      const menuItem = await prisma.menuItem.findUnique({
        where: { id: dish.menuItemId },
        select: { name: true, category: true },
      });

      return {
        menuItemId: dish.menuItemId,
        _sum: {
          quantity: dish._sum.quantity ?? 0, // Handle null case
        },
        menuItem: menuItem || undefined, // Convert null to undefined
      };
    })
  );

  return dishesWithItems.filter((dish) => dish.menuItem); // Filter out undefined items
}

export async function getOrderTrends(
  timeframe: "day" | "week" | "month" | "year"
) {
  const dateFilter: { gte: Date } = { gte: new Date() };

  switch (timeframe) {
    case "day":
      dateFilter.gte = startOfDay(new Date());
    case "week":
      dateFilter.gte = startOfWeek(new Date());
      break;
    case "month":
      dateFilter.gte = startOfMonth(new Date());
      break;
    case "year":
      dateFilter.gte = startOfYear(new Date());
      break;
  }

  return prisma.order.findMany({
    where: {
      createdAt: dateFilter,
      status: OrderStatus.COMPLETED,
    },
    select: { createdAt: true, total: true },
  });
}
