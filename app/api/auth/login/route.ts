import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { generateToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const { email, password, name } = await request.json();

  const user = await prisma.user.findUnique({
    where: email ? email : name,
  });

  if (!user) {
    return NextResponse.json(
      { success: false, message: "Utilisatuer introuvable" },
      { status: 401 }
    );
  }

  const isValid = await bcrypt.compare(password, user.hashedPassword);
  if (!isValid) {
    return NextResponse.json(
      { success: false, message: "Mot de passe incorrect" },
      { status: 401 }
    );
  }
  const token = generateToken({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role
  });
  return NextResponse.json({ success: true, token });
}
