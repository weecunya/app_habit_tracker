import { apiRequest } from "./client";
import type { AuthResponse, LoginRequest, RegisterRequest } from "./types";

export function login(payload: LoginRequest) {
  return apiRequest<AuthResponse>("/api/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function register(payload: RegisterRequest) {
  return apiRequest<AuthResponse>("/api/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
