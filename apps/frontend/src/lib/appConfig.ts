type AppMode = "browser" | "api";

function getAppMode(): AppMode {
  const mode = import.meta.env.VITE_APP_MODE;

  if (mode === "api" || mode === "browser") {
    return mode;
  }

  return "browser";
}

function getApiUrl(): string {
  const apiUrl = import.meta.env.VITE_API_URL;

  if (!apiUrl) {
    if (getAppMode() === "api") {
      throw new Error("VITE_API_URL is required when VITE_APP_MODE=api.");
    }

    return "";
  }

  return apiUrl.replace(/\/$/, "");
}

export const appConfig = {
  mode: getAppMode(),
  apiUrl: getApiUrl(),
  isApiMode: getAppMode() === "api",
} as const;
