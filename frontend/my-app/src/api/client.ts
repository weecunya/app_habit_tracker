const API_URL = import.meta.env.VITE_API_URL ?? "";
const AUTH_TOKEN_KEY = "auth_token";

export function getAuthToken() {
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

export function setAuthToken(token: string) {
  localStorage.setItem(AUTH_TOKEN_KEY, token);
}

export function clearAuthToken() {
  localStorage.removeItem(AUTH_TOKEN_KEY);
}

function getResponseErrorMessage(data: unknown, status: number) {
  if (
    data &&
    typeof data === "object" &&
    "detail" in data
  ) {
    const detail = data.detail;

    if (typeof detail === "string") {
      return detail;
    }

    if (Array.isArray(detail)) {
      return "Проверьте заполнение полей.";
    }
  }

  return `Request failed with status ${status}`;
}

export async function apiRequest<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const headers = new Headers(options.headers);
  const token = getAuthToken();

  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const message = getResponseErrorMessage(data, response.status);
    throw new Error(message);
  }

  return data as T;
}
