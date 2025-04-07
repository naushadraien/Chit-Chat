import { AuthProviderContext, UserDetails } from "@/types";
import { useMutation } from "@tanstack/react-query";
import { createContext, PropsWithChildren, useContext, useState } from "react";
import { useToast } from "./ToastProvider";
import requestAPI from "@/utils/apiRequest/requestApi";
import { authApi } from "@/api/auth";

const AuthContext = createContext<AuthProviderContext | undefined>(undefined);

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [authState, setAuthState] = useState<AuthProviderContext["authState"]>({
    authenticated: false,
    token: "",
  });
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { showToast } = useToast();

  const { mutate: onLogin, isPending: isLogging } = useMutation({
    mutationFn: async (data: { email: string; password: string }) => {
      const res = await requestAPI(
        authApi.login({
          email: data.email,
          password: data.password,
        })
      );
      console.log("🚀 ~ mutationFn: ~ res:", res);
      return res;
    },
    onSuccess: (data) => {
      console.log("logged in user data", data);
      showToast({
        type: "success",
        text1: "Login successfully!",
      });
    },
  });

  const values: AuthProviderContext = {
    onLogin: onLogin,
    authState,
    isLoading: isLoading || isLogging,
    onLogout: async () => {},
  };
  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth can be used within AuthProvider");
  }
  return context;
};
