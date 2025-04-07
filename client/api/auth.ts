import { RegisterFormData } from "@/schema/register.schema";
import { ApiRequestConfig } from "@/utils/apiRequest/requestApi";

export const authApi = {
  login: (
    data: Omit<RegisterFormData, "confirmPassword">
  ): ApiRequestConfig => {
    return {
      method: "post",
      data,
      url: "/auth/signin",
    };
  },
  signUp: (data: RegisterFormData): ApiRequestConfig => {
    return {
      method: "post",
      data,
      url: "/auth/signup",
    };
  },
};
