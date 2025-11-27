import { Outlet, useMatches, Link } from "react-router";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Bell } from "lucide-react";

// Componentes propios
import { AppSidebar } from "@/components/app-sidebar";
import { ModeToggle } from "@/components/mode-toggle";
import { LazyLoad } from "@/shared/components/LazyLoad";

// Shadcn UI Components
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

// Tipos
import type { RouteHandle } from "@/routes/types";

export const PrivateLayout = () => {
  const matches = useMatches();
  const [isScrolled, setIsScrolled] = useState(false);

  // Efecto para detectar scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Generación de Breadcrumbs
  const breadcrumbs = matches
    .filter((match) =>
      Boolean(
        (match.handle as RouteHandle)?.title ||
          (match.handle as RouteHandle)?.breadcrumb
      )
    )
    .map((match) => {
      const handle = match.handle as RouteHandle;
      return {
        title: handle.breadcrumb || handle.title,
        path: match.pathname,
      };
    });

  return (
    <SidebarProvider>
      <AppSidebar />
      {/* Agregamos el fondo stone-50 para mantener consistencia con el AuthLayout */}
      <SidebarInset className="bg-stone-50/50 dark:bg-zinc-900 transition-colors">
        <header
          className={cn(
            "h-16 bg-background/40 sticky top-0 z-50 flex shrink-0 items-center gap-2 border-b backdrop-blur-md transition-[width,height] ease-linear md:rounded-tl-xl md:rounded-tr-xl",
            !isScrolled && "rounded-t-xl"
          )}
        >
          <div className="flex w-full items-center gap-1 px-4 lg:gap-2">
            <SidebarTrigger className="-ml-1 hover:bg-stone-200/50 dark:hover:bg-zinc-800" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4 bg-stone-300 dark:bg-zinc-700"
            />

            {/* --- Breadcrumbs --- */}
            <Breadcrumb>
              <BreadcrumbList>
                {breadcrumbs.map((crumb, index) => {
                  const isLast = index === breadcrumbs.length - 1;

                  return (
                    <div key={crumb.path} className="flex items-center">
                      <BreadcrumbItem className="hidden md:block">
                        {isLast ? (
                          <BreadcrumbPage className="font-medium text-teal-900 dark:text-teal-100">
                            {crumb.title}
                          </BreadcrumbPage>
                        ) : (
                          <BreadcrumbLink asChild>
                            <Link
                              to={crumb.path}
                              className="hover:text-teal-600 transition-colors"
                            >
                              {crumb.title}
                            </Link>
                          </BreadcrumbLink>
                        )}
                      </BreadcrumbItem>
                      {!isLast && (
                        <BreadcrumbSeparator className="hidden md:block mx-2" />
                      )}
                    </div>
                  );
                })}
              </BreadcrumbList>
            </Breadcrumb>
            {/* ------------------- */}

            <div className="ml-auto flex items-center gap-2 md:gap-4">
              <button className="rounded-full p-2 hover:bg-stone-200/50 dark:hover:bg-zinc-800 transition-colors">
                <Bell className="h-5 w-5 text-muted-foreground hover:text-teal-600" />
              </button>
              <ModeToggle />
            </div>
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-4 p-4 pt-4">
          <LazyLoad>
            <Outlet />
          </LazyLoad>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};
