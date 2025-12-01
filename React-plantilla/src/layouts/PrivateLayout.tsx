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

  // Efecto para detectar scroll con threshold más suave
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    // Throttle para mejor performance
    let ticking = false;
    const scrollListener = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };
    
    window.addEventListener("scroll", scrollListener, { passive: true });
    return () => window.removeEventListener("scroll", scrollListener);
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
      {/* Fondo base del layout */}
      <SidebarInset className="bg-stone-100/60 dark:bg-stone-950 transition-colors flex flex-col">
        <header
          className={cn(
            "h-16 sticky top-0 z-50 flex shrink-0 items-center gap-2 px-4 border-b",
            "transition-all duration-300 ease-out",
            isScrolled
              ? " bg-background/40 backdrop-blur-md  shadow-sm border-stone-200 dark:bg-stone-900/95 dark:border-stone-800"
              : "bg-transparent backdrop-blur-none shadow-none border-transparent"
          )}
        >
          <div className="flex w-full items-center gap-2">
            <SidebarTrigger className="-ml-1 hover:bg-stone-200/50 dark:hover:bg-stone-800 transition-colors duration-200" />
            <Separator
              orientation="vertical"
              className={cn(
                "mr-2 h-4 transition-colors duration-300",
                isScrolled 
                  ? "bg-stone-300 dark:bg-stone-700" 
                  : "bg-stone-200 dark:bg-stone-800"
              )}
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
                          <BreadcrumbPage className="font-semibold text-teal-900 dark:text-teal-100 transition-colors duration-200">
                            {crumb.title}
                          </BreadcrumbPage>
                        ) : (
                          <BreadcrumbLink asChild>
                            <Link
                              to={crumb.path}
                              className="hover:text-teal-600 transition-colors duration-200 text-stone-500 dark:text-stone-400"
                            >
                              {crumb.title}
                            </Link>
                          </BreadcrumbLink>
                        )}
                      </BreadcrumbItem>
                      {!isLast && (
                        <BreadcrumbSeparator className="hidden md:block mx-2 text-stone-400 dark:text-stone-600" />
                      )}
                    </div>
                  );
                })}
              </BreadcrumbList>
            </Breadcrumb>
            {/* ------------------- */}

            <div className="ml-auto flex items-center gap-2">
              <button className="rounded-full p-2 hover:bg-stone-200/50 dark:hover:bg-stone-800 transition-all duration-200 text-stone-500 dark:text-stone-400">
                <Bell className="h-5 w-5" />
              </button>
              <ModeToggle />
            </div>
          </div>
        </header>

        {/* --- CONTENEDOR PRINCIPAL CON BORDE VISIBLE --- */}
        <div className="flex-1 p-4 pt-0 overflow-hidden">
          <div className="h-full rounded-2xl border border-stone-200 bg-white shadow-sm overflow-auto dark:border-stone-800 dark:bg-stone-900 transition-colors duration-200">
            <div className="p-6 md:p-8 min-h-full">
              <LazyLoad>
                <Outlet />
              </LazyLoad>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};