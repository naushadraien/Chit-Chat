import { z } from "zod";

export const phoneSchema = z.object({
  phoneNumber: z
    .string({
      required_error: "Phone number is required",
    })
    .min(10, "Phone number must be at least 10 digits")
    .max(10, "Phone number must be exactly 10 digits"),
  countryCode: z.string().min(2, "Country code is required"),
});

export const verifyCodeSchema = z.object({
  code: z
    .string({
      required_error: "Verification code is required",
    })
    .length(6, "Code must be of 6 character")
    .regex(/^\d+$/, "Verification code must contain only digits"),
});

export type PhoneDataType = z.infer<typeof phoneSchema>;
export type VerifyCodeDataType = z.infer<typeof verifyCodeSchema>;
