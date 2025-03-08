import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const phone = searchParams.get("phone")

  if (!phone) {
    return NextResponse.json({ error: "Phone number required" }, { status: 400 })
  }

  const customer = await prisma.customer.findUnique({
    where: { email : phone },
    include: { loyaltyTransactions: true }
  })

  return NextResponse.json(customer || { points: 0 })
}