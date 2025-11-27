import * as React from "react";
import { useLocation, Link } from "react-router";
import {
  LayoutDashboard,
  Users,
  UserCircle,
  Settings2,
  LifeBuoy,
  Send,
  SquareTerminal,
  PawPrint, // Importamos el icono de la marca
  type LucideIcon,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

// Imports de tu arquitectura
import { privateRoutes } from "@/routes";
import { useAuth } from "@/features/auth/hooks";
import type { RouteHandle } from "@/routes/types";

// 1. Mapa de Iconos
const ICON_MAP: Record<string, LucideIcon> = {
  dashboard: LayoutDashboard,
  users: Users,
  "user-circle": UserCircle,
  settings: Settings2,
  terminal: SquareTerminal,
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user, hasRole, hasPermission } = useAuth();
  const location = useLocation();

  // Función auxiliar para validar visibilidad y permisos
  const isRouteVisible = React.useCallback(
    (handle?: RouteHandle) => {
      if (!handle) return false;
      if (handle.hideInMenu) return false;
      if (handle.roles && !handle.roles.some(hasRole)) return false;
      if (handle.permissions && !handle.permissions.every(hasPermission))
        return false;
      return true;
    },
    [hasRole, hasPermission]
  );

  // 2. Transformación de Rutas
  const navItems = React.useMemo(() => {
    return privateRoutes
      .filter((route) => isRouteVisible(route.handle as RouteHandle))
      .map((route) => {
        const handle = route.handle as RouteHandle;
        const Icon = handle.icon
          ? ICON_MAP[handle.icon] || SquareTerminal
          : SquareTerminal;

        // Submenús
        const subItems = route.children
          ?.filter((child) => isRouteVisible(child.handle as RouteHandle))
          .map((child) => {
            const childHandle = child.handle as RouteHandle;
            let childUrl = route.path || "";
            if (!child.index && child.path) {
              childUrl = child.path.startsWith("/")
                ? child.path
                : `${route.path}/${child.path}`.replace("//", "/");
            }

            return {
              title: childHandle.title,
              url: childUrl,
            };
          });

        return {
          title: handle.title,
          url: route.path || "#",
          icon: Icon,
          isActive: location.pathname.startsWith(route.path || ""),
          items: subItems && subItems.length > 0 ? subItems : undefined,
        };
      });
  }, [user, location.pathname, isRouteVisible]);

  const navSecondary = [
    { title: "Soporte", url: "#", icon: LifeBuoy },
    { title: "Feedback", url: "#", icon: Send },
  ];

  const userData = {
    name: user?.name || "Usuario",
    email: user?.email || "usuario@demo.com",
    avatar: user?.avatar || "",
  };

  return (
    <Sidebar collapsible="icon" variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link to="/dashboard">
                {/* Branding VetCare: Fondo Teal y Huella */}
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-teal-600 text-white shadow-md shadow-teal-600/20">
                  <PawPrint className="size-5" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-bold text-teal-950 dark:text-teal-50">
                    VetCare Pro
                  </span>
                  <span className="truncate text-xs text-muted-foreground">
                    Panel Clínico
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={navItems} />
        <NavSecondary items={navSecondary} className="mt-auto" />
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
    </Sidebar>
  );
}
