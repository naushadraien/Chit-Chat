import { z } from "zod";

const envSchema = z.object({
  BACKEND_URL: z
    .string({ message: "Backend Url is required" })
    .min(1, { message: "BackendUrl must be at least 1 character" }),
});

const envs = {
  BACKEND_URL: process.env.EXPO_PUBLIC_BACKEND_URL,
};

const parsedEnvs = envSchema.parse(envs);

export { parsedEnvs as envs };
