export function getApiUrl(): string {
  const apiUrl = import.meta.env.VITE_API_URL;

  if (!apiUrl) {
    throw new Error("VITE_API_URL is required when runtime mode is api.");
  }

  return apiUrl.replace(/\/$/, "");
}

export const appConfig = {
  getApiUrl,
} as const;
