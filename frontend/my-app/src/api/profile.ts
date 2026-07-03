import { apiRequest } from "./client";
import type { Profile } from "./types";

export function getProfile() {
  return apiRequest<Profile>("/api/profile/");
}

export function getPartnerProfile() {
  return apiRequest<Profile>("/api/profile/partner");
}
