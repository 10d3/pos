import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { email, name, role, password } = await request.json();

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = await prisma.user.create({
      data: {
        email,
        hashedPassword,
        name,
        role,
      },
    });

    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.log(error);

    return NextResponse.json({
      success: false,
      error: " Inscription impossible",
    });
  }
}
