import { z } from "zod";
import { baseRegisterSchema } from "./register.schema";

const loginSchema = baseRegisterSchema.pick({
  email: true,
  password: true,
});

export type LoginFormData = z.infer<typeof loginSchema>;
export default loginSchema;
