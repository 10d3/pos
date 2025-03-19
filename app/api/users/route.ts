/* eslint-disable @typescript-eslint/no-explicit-any */
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const role = searchParams.get("role");

    console.log("Fetching users with role filter:", role || "ALL");

    // Build query filters
    const filters: any = {};
    if (role) {
      filters.role = role;
    }

    // Fetch users with optional role filter
    const users = await prisma.user.findMany({
      where: filters,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        // Don't include hashedPassword for security
      },
      orderBy: {
        name: "asc",
      },
    });

    console.log(`Found ${users.length} users matching criteria`);
    return NextResponse.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}
