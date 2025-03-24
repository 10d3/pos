/* eslint-disable @typescript-eslint/no-explicit-any */
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { User } from "@/types/type";

// Update user
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  // Verify admin
  const currentUser = (await auth()) as User;
  if (!currentUser || currentUser.role !== "ADMIN") {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 403 }
    );
  }

  const userId = params.id;
  const data = await request.json();

  try {
    // If password is provided, hash it
    const updateData: any = { ...data };
    if (data.password) {
      updateData.hashedPassword = await bcrypt.hash(data.password, 10);
      delete updateData.password;
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, error: "Failed to update user" },
      { status: 500 }
    );
  }
}

// Delete user
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  // Verify admin
  const currentUser = (await auth()) as User;
  if (!currentUser || currentUser.role !== "ADMIN") {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 403 }
    );
  }

  const userId = params.id;

  // Prevent deleting yourself
  if (userId === currentUser.id) {
    return NextResponse.json(
      { success: false, error: "You cannot delete your own account" },
      { status: 400 }
    );
  }

  try {
    await prisma.user.delete({
      where: { id: userId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, error: "Failed to delete user" },
      { status: 500 }
    );
  }
}
