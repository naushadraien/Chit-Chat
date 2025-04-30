import { UseMutateFunction } from "@tanstack/react-query";

type VerificationStatus = {
  isNameProvided?: boolean;
  isPhoneVerified?: boolean;
};

export type LoginResponse = {
  accessToken: string;
  avatar: string | null;
  createdAt: string;
  email: string;
  firstName: string | null;
  fullName: string | null;
  id: string;
  lastName: string | null;
  phoneNumber: string | null;
  refreshToken: string;
  updatedAt: string;
  verificationStatus: VerificationStatus;
};

export type UserDetails = Omit<LoginResponse, "accessToken" | "refreshToken">;

export type AuthProviderContext = {
  onLogin: UseMutateFunction<
    LoginResponse,
    Error,
    {
      email: string;
      password: string;
    },
    unknown
  >;
  authState: { authenticated: boolean | null; token: string | null };
  onLogout: () => Promise<void>;
  isLoading: boolean;
  userDetails: UserDetails | null;
  refreshToken: () => Promise<string>;
  updateUserDetails?: (userData: Partial<UserDetails>) => Promise<void>;
};
