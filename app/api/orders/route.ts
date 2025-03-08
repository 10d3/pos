import { env } from "@/lib/env";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// app/api/orders/route.ts
export async function POST(request: Request) {
  const { customerId, pointsUsed, items, subtotal, createdAt, date, id, ...orderData } = await request.json();

  console.log(subtotal, createdAt, date)

  // Calculate points earned
  const pointsEarned = Math.floor(orderData.total * env.POINTS_PER_DOLLAR);

  const order = await prisma.order.create({
    data: {
      ...orderData,
      customerId: customerId ? customerId : undefined,
      pointsUsed,
      pointsEarned,
      orderId: id,
      orderItems: {
        create: items.map((item: {id: string, quantity: number}) => ({
          menuItem: {
            connect: { id: item.id } // Fix: use connect instead of direct id
          },
          quantity: item.quantity,
        })),
      },
    },
  });

  if (customerId) {
    // Update customer points
    await prisma.customer.update({
      where: { id: customerId },
      data: {
        points: {
          increment: pointsEarned - (pointsUsed || 0),
        },
      },
    });

    // Create loyalty transactions
    if (pointsUsed > 0) {
      await prisma.loyaltyTransaction.create({
        data: {
          customerId,
          points: -pointsUsed,
          type: "REDEEMED",
        },
      });
    }

    await prisma.loyaltyTransaction.create({
      data: {
        customerId,
        points: pointsEarned,
        type: "EARNED",
      },
    });
  }

  return NextResponse.json(order);
}
