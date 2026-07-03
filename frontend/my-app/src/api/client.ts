const API_URL = import.meta.env.VITE_API_URL ?? "";

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
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const message = getResponseErrorMessage(data, response.status);
    throw new Error(message);
  }

  return data as T;
}
