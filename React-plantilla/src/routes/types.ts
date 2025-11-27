import type { IndexRouteObject, NonIndexRouteObject } from "react-router";
import { UserRole, type Permission } from "@/api/types"; // Importamos desde API

// Re-exportamos para facilitar el uso en otros archivos
export { UserRole };
export type { Permission };

export interface RouteHandle {
  title: string;
  description?: string;
  
  /** Define si la ruta requiere estar logueado */
  requiresAuth?: boolean;
  
  /** Roles permitidos (Lógica OR: basta con tener uno) */
  roles?: UserRole[];
  
  /** * Permisos requeridos (Lógica AND: debe tenerlos todos).
   * Se usan strings directos que deben coincidir con tu BD.
   */
  permissions?: Permission[];
  
  breadcrumb?: string;
  hideBreadcrumb?: boolean;
  icon?: string;
  hideInMenu?: boolean;
  layout?: "default" | "minimal" | "fullscreen";
}

// Extensiones para TypeScript en React Router
export interface AppIndexRouteObject extends Omit<IndexRouteObject, "handle"> {
  handle?: RouteHandle;
}

export interface AppNonIndexRouteObject extends Omit<NonIndexRouteObject, "handle" | "children"> {
  handle?: RouteHandle;
  children?: AppRouteObject[];
}

export type AppRouteObject = AppIndexRouteObject | AppNonIndexRouteObject;