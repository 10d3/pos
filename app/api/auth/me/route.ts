import { verifyToken } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");

  if (!authHeader) {
    return NextResponse.json(
      { error: "Aucun header d'autorization trouve" },
      { status: 401 }
    );
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return NextResponse.json({ error: "Token manquant" }, { status: 401 });
  }

  const userData = verifyToken(token);

  if (!userData) {
    return NextResponse.json({ error: "Token invalide" }, { status: 401 });
  }
  return NextResponse.json({ user: userData }, { status: 200 });
}
