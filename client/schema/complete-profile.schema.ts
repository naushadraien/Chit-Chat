import { z } from "zod";

export const completeProfileSchema = z.object({
  profileImage: z.string({
    required_error: "Profile image is required",
  }),
  firstName: z
    .string({
      required_error: "First Name is required",
    })
    .min(2, "First Name must be at least 2 characters long")
    .max(50, "First Name must not exceed 50 characters"),
  lastName: z
    .string({
      required_error: "Last Name is required",
    })
    .min(2, "Last Name must be at least 2 characters long")
    .max(50, "Last Name must not exceed 50 characters"),
});

export type CompleteProfileDataType = z.infer<typeof completeProfileSchema>;
