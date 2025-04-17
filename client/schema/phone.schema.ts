import { z } from "zod";

export const phoneSchema = z.object({
  phoneNumber: z
    .string({
      required_error: "Phone number is required",
    })
    .max(10, "Phone number must be at least 10 digit"),
});

export type PhoneDataType = z.infer<typeof phoneSchema>;
