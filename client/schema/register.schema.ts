import { z } from "zod";

const baseRegisterSchema = z.object({
  // firstName: z
  //   .string({
  //     required_error: "First Name is required",
  //     invalid_type_error: "First Name must be a string",
  //   })
  //   .min(2, "First Name must be 2 letters or more than that")
  //   .max(50, "First Name must be less than 50 characters"),
  // lastName: z
  //   .string({
  //     required_error: "Last Name is required",
  //     invalid_type_error: "Last Name must be a string",
  //   })
  //   .min(2, "Last Name must be 2 letters or more than that")
  //   .max(50, "Last Name must be less than 50 characters"),

  email: z
    .string({
      required_error: "Email is required",
      invalid_type_error: "Email must be a string",
    })
    .email("Invalid email address")
    .min(1, "Email is required"),

  password: z
    .string({
      required_error: "Password is required",
    })
    .min(8, "Password must be at least 8 characters")
    .max(100, "Password must be less than 100 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      "Password must contain at least one uppercase letter, one lowercase letter, one number and one special character"
    ),

  confirmPassword: z
    .string({
      required_error: "Confirm password is required",
    })
    .min(8, "Confirm Password must be at least 8 characters")
    .max(100, "Confirm Password must be less than 100 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      "Confirm Password must contain at least one uppercase letter, one lowercase letter, one number and one special character"
    ),
  // phoneNumber: z
  //   .string({
  //     required_error: "Phone Number is required",
  //     invalid_type_error: "Phone Number must be a string",
  //   })
  //   .trim()
  //   .min(10, "Phone number must be at least 10 digits")
  //   .max(10, "Phone number must be exactly 10 digits")
  //   .regex(/^[0-9]+$/, "Phone number must contain only numbers"),
  // countryCode: z.string().nullable(),
});

const registerSchema = baseRegisterSchema.refine(
  (data) => data.password === data.confirmPassword,
  {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  }
);

export { baseRegisterSchema };
export type RegisterFormData = z.infer<typeof registerSchema>;
export default registerSchema;
