import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { getProfile } from "../api/profile";
import { login, register } from "../api/auth";
import type { Profile } from "../api/types";
import { AuthContext, type AuthContextValue } from "./authContext";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    const profile = await getProfile();
    setUser(profile);
  }, []);

  useEffect(() => {
    getProfile()
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setIsLoading(false));
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isLoading,
      signIn: async (payload) => {
        const profile = await login(payload);
        setUser(profile);
      },
      signUp: async (payload) => {
        const profile = await register(payload);
        setUser(profile);
      },
      signOut: () => setUser(null),
      refreshUser,
    }),
    [isLoading, refreshUser, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
