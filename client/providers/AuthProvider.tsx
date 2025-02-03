import { AuthProviderContext } from "@/types";
import { createContext, PropsWithChildren, useContext, useState } from "react";

const AuthContext = createContext<AuthProviderContext | undefined>(undefined);

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [authState, setAuthState] = useState<AuthProviderContext["authState"]>({
    authenticated: false,
    token: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  const values: AuthProviderContext = {
    onLogin: () => {},
    authState,
    isLoading,
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
