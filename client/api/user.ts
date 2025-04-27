import { RegisterFormData } from "@/schema/register.schema";
import { ApiRequestConfig } from "@/utils/apiRequest/requestApi";

export const userApi = {
  updateAvatar: ({
    data,
    userId,
  }: {
    data: FormData;
    userId: string;
  }): ApiRequestConfig => {
    return {
      method: "patch",
      data,
      url: `/user/${userId}/avatar`,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };
  },
  updateUserData: ({
    data,
    userId,
  }: {
    data: {
      firstName: string;
      lastName: string;
    };
    userId: string;
  }): ApiRequestConfig => {
    return {
      method: "patch",
      data,
      url: `/user/${userId}`,
    };
  },
};
