import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    DATABASE_URL: z.string().url(),
    // OPEN_AI_API_KEY: z.string().min(1),
    JSON_WEB_TOKEN: z.string().min(1),
    POINTS_PER_DOLLAR: z.number().default(1),
    REDEEM_RATE: z.number().default(100), // 100 points = $1
  },
  client: {
    // NEXT_PUBLIC_PUBLISHABLE_KEY: z.string().min(1),
  },
  // If you're using Next.js < 13.4.4, you'll need to specify the runtimeEnv manually
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    // OPEN_AI_API_KEY: process.env.OPEN_AI_API_KEY,
    // NEXT_PUBLIC_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_PUBLISHABLE_KEY,
    JSON_WEB_TOKEN: process.env.JSON_WEB_TOKEN,
    POINTS_PER_DOLLAR: Number(process.env.POINTS_PER_DOLLAR),
    REDEEM_RATE: Number(process.env.REDEEM_RATE), // 100 points = $1
  },
  // For Next.js >= 13.4.4, you only need to destructure client variables:
  // experimental__runtimeEnv: {
  //   NEXT_PUBLIC_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_PUBLISHABLE_KEY,
  // }
});
