'use server'
import jsw from "jsonwebtoken";
import { env } from "./env";
import { cookies } from "next/headers";
import { expires } from "@/app/api/auth/login/route";

const JSON_WEB_TOKEN = env.JSON_WEB_TOKEN;

export async function generateToken(user: {
  id: string;
  email: string;
  name: string;
  role: string;
}) {
  return jsw.sign(
    { id: user.id, email: user.email, name: user.name, role: user.role },
    JSON_WEB_TOKEN,
    { expiresIn: expires }
  );
}

export async function verifyToken(token: string) {
  try {
    const decoded = jsw.verify(token, JSON_WEB_TOKEN);
    return decoded;
  } catch (error) {
    console.log(error);
    return error;
  }
}

export async function auth() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token");

  if (!token) {
    return null;
  }

  return verifyToken(token.value);
}

export async function logout() {
  const cookieStore = await cookies();
  // Set cookie to expire immediately
  cookieStore.delete("token");
  return { success: true };
}