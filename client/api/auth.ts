import { RegisterFormData } from "@/schema/register.schema";
import { ApiRequestConfig } from "@/utils/apiRequest/requestApi";

export const authApi = {
  signUp: (data: RegisterFormData): ApiRequestConfig => {
    return {
      method: "post",
      data,
      url: "/auth/signup",
    };
  },
};
