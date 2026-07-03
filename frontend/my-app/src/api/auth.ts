import { apiRequest } from "./client";
import type { LoginRequest, Profile, RegisterRequest } from "./types";

export function login(payload: LoginRequest) {
  return apiRequest<Profile>("/api/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function register(payload: RegisterRequest) {
  return apiRequest<Profile>("/api/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
