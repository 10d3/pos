/* eslint-disable @typescript-eslint/no-explicit-any */
import { env } from "@/lib/env";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET method to fetch orders with optional filters
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const staffId = searchParams.get("staffId");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const status = searchParams.get("status");

    console.log("Fetching orders with filters:", {
      staffId,
      startDate,
      endDate,
      status,
    });

    // Build query filters
    const filters: any = {};

    if (staffId) {
      filters.staffId = staffId;
    }

    if (startDate || endDate) {
      filters.createdAt = {};
      if (startDate) {
        filters.createdAt.gte = new Date(startDate);
      }
      if (endDate) {
        filters.createdAt.lte = new Date(endDate);
      }
    }

    if (status) {
      filters.status = status;
    }

    // Fetch orders with filters
    const orders = await prisma.order.findMany({
      where: filters,
      include: {
        staff: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        orderItems: {
          include: {
            menuItem: true,
          },
        },
        customer: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    console.log(`Found ${orders.length} orders matching criteria`);
    return NextResponse.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

// app/api/orders/route.ts
export async function POST(request: Request) {
  const {
    customerId,
    pointsUsed,
    items,
    subtotal,
    createdAt,
    date,
    id,
    phone,
    ...orderData
  } = await request.json();

  console.log(subtotal, createdAt, date, phone);

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
        create: items.map((item: { id: string; quantity: number }) => ({
          menuItem: {
            connect: { id: item.id }, // Fix: use connect instead of direct id
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
