import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { generateToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const SessionDuration = 24 * 60 * 60 * 1000;
export const expires = Date.now() + SessionDuration;

export async function POST(request: Request) {
  const { email, password } = await request.json();

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
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
  const token = await generateToken({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  });
  const response = NextResponse.json({ success: true });
  response.cookies.set("token", token, { httpOnly: true, path: "/", expires : new Date(expires)});
  return response
}
