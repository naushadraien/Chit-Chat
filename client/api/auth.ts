import { RegisterFormData } from "@/schema/register.schema";
import { ApiRequestConfig } from "@/utils/apiRequest/requestApi";

export const authApi = {
  login: (
    data: Omit<RegisterFormData, "confirmPassword"> & { [key: string]: unknown }
  ): ApiRequestConfig => {
    return {
      method: "post",
      data,
      url: "/auth/signin",
    };
  },
  signUp: (
    data: Omit<RegisterFormData, "confirmPassword">
  ): ApiRequestConfig => {
    return {
      method: "post",
      data,
      url: "/auth/signup",
    };
  },
  logout: (data: { sessionId: string }): ApiRequestConfig => {
    return {
      method: "post",
      data,
      url: "/auth/logout",
    };
  },
  refreshAccessToken: (data: { refreshToken: string }): ApiRequestConfig => {
    return {
      method: "post",
      data,
      url: "/auth/refresh",
    };
  },
  sendOtp: (data: { phoneNumber: string }): ApiRequestConfig => {
    return {
      method: "post",
      data,
      url: "/auth/send-otp",
    };
  },
  verifyOtp: (data: { otp: string }): ApiRequestConfig => {
    return {
      method: "post",
      data,
      url: "/auth/verify-otp",
    };
  },
};
