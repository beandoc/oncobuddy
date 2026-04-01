import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  NEXTAUTH_SECRET: z.string().min(1),
  NEXTAUTH_URL: z.string().url(),
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  
  // Clinical Media Services
  MUX_TOKEN_ID: z.string().min(1).optional(),
  MUX_TOKEN_SECRET: z.string().min(1).optional(),
  
  // Communications
  AWS_ACCESS_KEY_ID: z.string().min(1).optional(),
  AWS_SECRET_ACCESS_KEY: z.string().min(1).optional(),
  AWS_REGION: z.string().min(1).default("us-east-1"),
  
  // Redis for BullMQ
  REDIS_URL: z.string().url().optional(),

  // CMS
  SANITY_PROJECT_ID: z.string().min(1).optional(),
  SANITY_DATASET: z.string().min(1).default("production"),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error(
    "❌ Invalid environment variables:",
    JSON.stringify(_env.error.format(), null, 2)
  );
  process.exit(1);
}

export const env = _env.data;
