import { createContext } from "react";
import type { LoginRequest, Profile, RegisterRequest } from "../api/types";

export type AuthContextValue = {
  user: Profile | null;
  isLoading: boolean;
  signIn: (payload: LoginRequest) => Promise<void>;
  signUp: (payload: RegisterRequest) => Promise<void>;
  signOut: () => void;
  refreshUser: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextValue | null>(null);
