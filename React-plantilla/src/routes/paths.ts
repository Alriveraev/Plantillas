// @/router/routes.config.ts

/**
 * Constantes de rutas de la aplicación
 * Evita el uso de strings mágicos y proporciona type-safety
 */
export const ROUTES = {
  // Rutas base
  HOME: "/",
  
  // Rutas públicas
  LOGIN: "/login",
  REGISTER: "/register",
  
  // Rutas privadas
  DASHBOARD: "/dashboard",
  PROFILE: "/profile",
  
  // Rutas de usuarios
  USERS: "/users",
  USER_DETAIL: (id: string | number) => `/users/${id}`,
  USER_CREATE: "/users/new",
  USER_EDIT: (id: string | number) => `/users/${id}/edit`,
  
  // Agregar más rutas según necesites
  // SETTINGS: "/settings",
  // NOTIFICATIONS: "/notifications",
  // REPORTS: "/reports",
  // REPORT_DETAIL: (id: string | number) => `/reports/${id}`,
} as const;

/**
 * Paths relativos para usar en la configuración del router
 * (sin el slash inicial)
 */
export const ROUTE_PATHS = {
  LOGIN: "login",
  REGISTER: "register",
  DASHBOARD: "dashboard",
  PROFILE: "profile",
  USERS: "users",
  USER_DETAIL: ":id",
  USER_CREATE: "new",
  USER_EDIT: ":id/edit",
} as const;

/**
 * Tipo para validar rutas
 */
export type AppRoute = typeof ROUTES[keyof typeof ROUTES];