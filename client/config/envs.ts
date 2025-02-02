import { z } from "zod";

const envSchema = z.object({
  BACKEND_URL: z
    .string({ message: "Backend Url is required" })
    .min(1, { message: "BackendUrl must be at least 1 character" }),
  SESSION_SECRET_KEY: z
    .string({ message: "Session secret key is required" })
    .min(4, { message: "Session key must be at least 4 characters" }),
});

const envs = {
  BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL,
  SESSION_SECRET_KEY: process.env.NEXT_PUBLIC_SESSION_SECRET,
};

const parsedEnvs = envSchema.parse(envs);

export { parsedEnvs as envs };
