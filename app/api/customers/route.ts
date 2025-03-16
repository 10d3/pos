import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

function isEmail(value: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(value);
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const searchValue = searchParams.get("phone");

  if (!searchValue) {
    return NextResponse.json(
      { error: "Search value required" },
      { status: 400 }
    );
  }

  const customer = await prisma.customer.findFirst({
    where: isEmail(searchValue)
      ? { email: searchValue }
      : { phone: searchValue },
    include: { loyaltyTransactions: true },
  });

  return NextResponse.json(customer || { points: 0 });
}
