export const env = {
  apiUrl: import.meta.env.VITE_API_URL || "http://localhost:8000/api",
  appName: import.meta.env.VITE_APP_NAME || "My React App",
  appVersion: import.meta.env.VITE_APP_VERSION || "1.0.0",
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
} as const;
