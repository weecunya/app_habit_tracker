import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { clearAuthToken, getAuthToken, setAuthToken } from "../api/client";
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
    if (!getAuthToken()) {
      setIsLoading(false);
      return;
    }

    getProfile()
      .then(setUser)
      .catch(() => {
        clearAuthToken();
        setUser(null);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isLoading,
      signIn: async (payload) => {
        const auth = await login(payload);
        setAuthToken(auth.access_token);
        setUser({ username: auth.username, habits: auth.habits });
      },
      signUp: async (payload) => {
        const auth = await register(payload);
        setAuthToken(auth.access_token);
        setUser({ username: auth.username, habits: auth.habits });
      },
      signOut: () => {
        clearAuthToken();
        setUser(null);
      },
      refreshUser,
    }),
    [isLoading, refreshUser, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
