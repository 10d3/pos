import jsw from "jsonwebtoken";
import { env } from "./env";

const JSON_WEB_TOKEN = env.JSON_WEB_TOKEN;

export function generateToken(user: {
  id: string;
  email: string;
  name: string;
  role: string;
}) {
  return jsw.sign(
    { id: user.id, email: user.email, name: user.name, role: user.role },
    JSON_WEB_TOKEN,
    { expiresIn: "12h" }
  );
}

export function verifyToken(token: string) {
  try {
    const decoded = jsw.verify(token, JSON_WEB_TOKEN);
    return decoded;
  } catch (error) {
    console.log(error);
    return error;
  }
}
