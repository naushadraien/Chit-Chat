import { AuthProviderContext, LoginResponse, UserDetails } from "@/types";
import { useMutation } from "@tanstack/react-query";
import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import { useToast } from "./ToastProvider";
import requestAPI from "@/utils/apiRequest/requestApi";
import { authApi } from "@/api/auth";
import {
  getTokensFromAsyncStorage,
  setTokensToAsyncStorage,
} from "@/utils/token.utils";
import {
  getUserDetailsFromAsyncStorage,
  setUsersToAsyncStorage,
} from "@/utils/auth.utils";
import { storageEventEmitter } from "@/events/event.emitter";

const AuthContext = createContext<AuthProviderContext | undefined>(undefined);

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [authState, setAuthState] = useState<AuthProviderContext["authState"]>({
    authenticated: false,
    token: "",
  });
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  console.log("🚀 ~ AuthProvider ~ userDetails:", userDetails);
  const [isLoading, setIsLoading] = useState(false);

  const { showToast } = useToast();

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const tokens = await getTokensFromAsyncStorage();
        if (tokens) {
          setAuthState({
            authenticated: true,
            token: tokens.accessToken,
          });
        }
        const userData = await getUserDetailsFromAsyncStorage();
        if (userData) {
          setUserDetails(userData);
        }
      } catch (error) {
        console.log(
          "Error while getting tokens and user data from async storage",
          error
        );
      }
    };
    loadInitialData();
  }, []);

  useEffect(() => {
    storageEventEmitter.addListener("storageUpdate", (eventData) => {
      if (eventData.token) {
        setAuthState((prev) => ({
          ...prev,
          token: eventData.token,
        }));
      }
    });

    return () => storageEventEmitter.removeAllListeners("storageUpdate");
  }, []);

  const handleLoginSuccess = async (data: LoginResponse) => {
    const { accessToken, refreshToken, ...user } = data;
    await setTokensToAsyncStorage({
      accessToken,
      refreshToken,
    });
    await setUsersToAsyncStorage(user);
    setAuthState({
      authenticated: true,
      token: accessToken,
    });
    setUserDetails(user);
    showToast({
      type: "success",
      text1: "Login successfully!",
    });
  };

  const { mutate: onLogin, isPending: isLogging } = useMutation({
    mutationFn: async (data: { email: string; password: string }) => {
      const res = await requestAPI<LoginResponse>(
        authApi.login({
          email: data.email,
          password: data.password,
        })
      );
      return res;
    },
    onSuccess: handleLoginSuccess,
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
