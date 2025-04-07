import { UseMutateFunction } from "@tanstack/react-query";

export type UserDetails = {
  firstName?: string;
  lastName?: string;
  _id: string;
  email: string;
  avatar?: string;
  phoneNumber?: string;
};

export type AuthProviderContext = {
  onLogin: UseMutateFunction<
    void,
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
};
