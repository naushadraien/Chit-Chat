import { authApi } from "@/api/auth";
import { storageEventEmitter } from "@/events/event.emitter";
import { AuthProviderContext, LoginResponse, UserDetails } from "@/types";
import requestAPI from "@/utils/apiRequest/requestApi";
import {
  clearUserDetails,
  getUserDetailsFromAsyncStorage,
  setUsersToAsyncStorage,
} from "@/utils/auth.utils";
import {
  clearTokensFromAsyncStorage,
  getTokensFromAsyncStorage,
  setTokensToAsyncStorage,
} from "@/utils/token.utils";
import { useMutation } from "@tanstack/react-query";
import { router } from "expo-router";
import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useToast } from "./ToastProvider";

const AuthContext = createContext<AuthProviderContext | undefined>(undefined);

/**
 * Authentication Provider that handles all auth-related state and operations
 */
export const AuthProvider = ({ children }: PropsWithChildren) => {
  // Auth state management
  const [authState, setAuthState] = useState<AuthProviderContext["authState"]>({
    authenticated: false,
    token: "",
  });
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  console.log("🚀 ~ AuthProvider ~ userDetails:", userDetails);

  // Loading states with specific flags for different operations
  const [isLoadingInitial, setIsLoadingInitial] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Token refresh management
  const tokenRefreshTimeout = useRef<NodeJS.Timeout | null>(null);

  const { showToast } = useToast();

  /**
   * Loads initial auth data from storage when app starts
   */
  useEffect(() => {
    const loadInitialData = async () => {
      setIsLoadingInitial(true);
      try {
        // Load tokens and user data in parallel for performance
        const [tokens, userData] = await Promise.all([
          getTokensFromAsyncStorage(),
          getUserDetailsFromAsyncStorage(),
        ]);

        if (tokens) {
          setAuthState({
            authenticated: true,
            token: tokens.accessToken,
          });

          // Set up token refresh if we have a token
          scheduleTokenRefresh(tokens.accessToken);
        }

        if (userData) {
          setUserDetails(userData);
        }
      } catch (error) {
        console.error("Failed to load authentication data:", error);
        // Reset auth state on error as a precaution
        setAuthState({ authenticated: false, token: "" });
        setUserDetails(null);
      } finally {
        setIsLoadingInitial(false);
      }
    };

    loadInitialData();

    // Clean up any token refresh timers on unmount
    return () => {
      if (tokenRefreshTimeout.current) {
        clearTimeout(tokenRefreshTimeout.current);
      }
    };
  }, []);

  /**
   * Listen for storage updates (useful for multi-window/tab scenarios)
   */
  useEffect(() => {
    const handleStorageUpdate = (eventData: { token: string }) => {
      if (eventData.token) {
        setAuthState((prev) => ({
          ...prev,
          token: eventData.token,
          authenticated: !!eventData.token,
        }));

        if (eventData.token) {
          scheduleTokenRefresh(eventData.token);
        }
      }
    };

    storageEventEmitter.addListener("storageUpdate", handleStorageUpdate);

    return () => storageEventEmitter.removeAllListeners("storageUpdate");
  }, []);

  /**
   * Schedule a token refresh based on token expiry
   */
  const scheduleTokenRefresh = useCallback((token: string) => {
    // Clear any existing timeout
    if (tokenRefreshTimeout.current) {
      clearTimeout(tokenRefreshTimeout.current);
    }

    try {
      // Parse token to get expiry (simplified - use a proper JWT library in production)
      const payload = JSON.parse(atob(token.split(".")[1]));
      const expiryTime = payload.exp * 1000; // Convert to milliseconds
      const currentTime = Date.now();

      // Schedule refresh 5 minutes before expiry
      const timeToRefresh = Math.max(
        0,
        expiryTime - currentTime - 5 * 60 * 1000
      );

      if (timeToRefresh > 0) {
        tokenRefreshTimeout.current = setTimeout(() => {
          refreshToken();
        }, timeToRefresh);
      } else {
        // Token already expired
        refreshToken();
      }
    } catch (error) {
      console.error("Error scheduling token refresh:", error);
    }
  }, []);

  const handleUpdateUserDetails = async (userData: Partial<UserDetails>) => {
    try {
      const userDataObj = {
        ...userDetails,
        ...userData,
      };

      await setUsersToAsyncStorage(userDataObj as UserDetails);
      setUserDetails(userDataObj as UserDetails);
    } catch (error) {
      console.log("Error while updating user data", error);
    }
  };

  /**
   * Refresh the access token using the refresh token
   */
  const refreshToken = useCallback(async () => {
    try {
      const tokens = await getTokensFromAsyncStorage();
      if (!tokens?.refreshToken) {
        throw new Error("No refresh token available");
      }

      const response = await requestAPI<{
        accessToken: string;
        refreshToken: string;
      }>(authApi.refreshAccessToken({ refreshToken: tokens.refreshToken }));

      // Update tokens in storage
      await setTokensToAsyncStorage({
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
      });

      // Update auth state
      setAuthState({
        authenticated: true,
        token: response.accessToken,
      });

      // Schedule the next refresh
      scheduleTokenRefresh(response.accessToken);

      return response.accessToken;
    } catch (error) {
      console.error("Token refresh failed:", error);
      // Handle token refresh failure by logging out
      handleLogout();
      throw error;
    }
  }, []);

  /**
   * Handle successful login
   */
  const handleLoginSuccess = async (data: LoginResponse) => {
    try {
      const { accessToken, refreshToken, ...user } = data;

      // Store authentication data
      await Promise.all([
        setTokensToAsyncStorage({
          accessToken,
          refreshToken,
        }),
        setUsersToAsyncStorage(user),
      ]);

      // Update local state
      setAuthState({
        authenticated: true,
        token: accessToken,
      });
      setUserDetails(user);

      // Schedule token refresh
      scheduleTokenRefresh(accessToken);

      router.replace("/(app)");

      // Show success message
      showToast({
        type: "success",
        text1: "Login successful!",
      });
    } catch (error) {
      console.error("Error saving auth data:", error);
      showToast({
        type: "error",
        text1: "Login succeeded but failed to save session",
      });
    }
  };

  /**
   * Handle logout process
   */
  const handleLogout = useCallback(async () => {
    try {
      setIsLoggingOut(true);

      // Clear token refresh timeout
      if (tokenRefreshTimeout.current) {
        clearTimeout(tokenRefreshTimeout.current);
        tokenRefreshTimeout.current = null;
      }

      // Call logout API if available
      try {
        // await requestAPI(authApi.logout());
      } catch (error) {
        // Logout API can fail silently - we still want to clear local state
        console.warn("Logout API call failed:", error);
      }

      // Clear stored auth data
      await Promise.all([clearTokensFromAsyncStorage(), clearUserDetails()]);

      // Reset auth state
      setAuthState({ authenticated: false, token: "" });
      setUserDetails(null);

      showToast({
        type: "info",
        text1: "You've been logged out",
      });
    } catch (error) {
      console.error("Error during logout:", error);
      showToast({
        type: "error",
        text1: "Failed to log out properly",
      });
    } finally {
      setIsLoggingOut(false);
    }
  }, []);

  /**
   * Login mutation
   */
  const { mutate: onLogin, isPending: isLogging } = useMutation({
    mutationFn: async (data: { email: string; password: string }) => {
      return await requestAPI<LoginResponse>(
        authApi.login({
          email: data.email,
          password: data.password,
        })
      );
    },
    onSuccess: handleLoginSuccess,
    onError: (error) => {
      console.error("Login failed:", error);
      // Toast is already shown by requestAPI
    },
  });

  // Determine overall loading state
  const isLoading = isLoadingInitial || isLogging || isLoggingOut;

  // Prepare context value
  const contextValue: AuthProviderContext = {
    onLogin,
    authState,
    isLoading,
    onLogout: handleLogout,
    userDetails,
    refreshToken, // Expose refreshToken for manual refresh if needed
    updateUserDetails: handleUpdateUserDetails,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

/**
 * Hook to access the auth context
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
