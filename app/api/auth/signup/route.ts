import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

type User = {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: string;
};

export async function POST(request: Request) {
  // Verify the current user is an admin
  const currentUser = (await auth()) as User;

  if (!currentUser || currentUser.role !== "ADMIN") {
    return NextResponse.json(
      {
        success: false,
        error: "Unauthorized: Only administrators can create new accounts",
      },
      { status: 403 }
    );
  }

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
      error: "Inscription impossible",
    });
  }
}
