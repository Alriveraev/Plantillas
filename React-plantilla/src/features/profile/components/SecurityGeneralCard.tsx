import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Shield,
  Globe,
  Clock,
  MapPin,
  LogOut,
  Laptop,
  History,
  AlertCircle,
} from "lucide-react";
import type { SessionDevice } from "@/features/profile/services/profile.service";

interface SecurityGeneralCardProps {
  sessions?: SessionDevice[]; // Marcado como opcional para evitar conflictos de tipado
  isLoading: boolean;
  onCloseAllSessions: () => void;
}

export const SecurityGeneralCard = ({
  sessions = [], // <--- CORRECCIÓN 1: Valor por defecto para evitar undefined
  isLoading,
  onCloseAllSessions,
}: SecurityGeneralCardProps) => {
  // CORRECCIÓN 2: Si está cargando, retornamos el Skeleton ANTES de intentar procesar datos
  if (isLoading) {
    return <SessionsSkeleton />;
  }

  // Ahora es seguro usar .find() y .filter() porque isLoading es false y sessions tiene [] por defecto
  const currentSession = sessions?.find((s) => s.is_current_device);
  const otherSessions = sessions?.filter((s) => !s.is_current_device) || [];

  return (
    <Card className="border-stone-200 shadow-sm dark:border-stone-800 overflow-hidden">
      <CardHeader className="border-b border-stone-200 bg-stone-50/30 pb-4 dark:border-stone-800 dark:bg-stone-900/20">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400">
            <Shield className="h-5 w-5" />
          </div>
          <div>
            <CardTitle className="text-lg font-semibold text-stone-900 dark:text-stone-50">
              Resumen de Seguridad
            </CardTitle>
            <CardDescription className="text-stone-500 dark:text-stone-400 text-sm mt-0.5">
              Monitorea la actividad reciente de tu cuenta.
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {/* Sección: Sesión Actual */}
        {currentSession && (
          <div className="p-6 pt-0 border-b border-stone-200 dark:border-stone-800 ">
            <h4 className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-3 flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
              Sesión Actual
            </h4>
            <div className="flex items-center justify-between rounded-xl bg-emerald-50/50 border border-emerald-100 p-4 transition-all dark:bg-emerald-900/10 dark:border-emerald-900/30">
              <div className="flex items-start gap-3">
                <div className="p-2.5 bg-white rounded-lg border border-emerald-100 shadow-sm text-emerald-600 dark:bg-emerald-950 dark:border-emerald-900 dark:text-emerald-400">
                  <Laptop className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-emerald-950 dark:text-emerald-50">
                    {currentSession.agent.string}
                  </p>
                  <p className="text-xs text-emerald-700/80 dark:text-emerald-300/70 mt-0.5 font-medium flex items-center gap-1">
                    <MapPin className="h-3 w-3" /> {currentSession.ip_address}
                  </p>
                </div>
              </div>
              <Badge
                variant="outline"
                className="bg-white border-emerald-200 text-emerald-700 shadow-sm font-medium dark:bg-emerald-950 dark:border-emerald-800 dark:text-emerald-300"
              >
                En línea
              </Badge>
            </div>
          </div>
        )}

        {/* Sección: Historial de otras sesiones */}
        <div className="p-6">
          <h4 className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-4 flex items-center gap-2">
            <History className="h-3.5 w-3.5" />
            Otros dispositivos ({otherSessions.length})
          </h4>

          {otherSessions.length === 0 ? (
            <div className="text-center py-6 text-sm text-stone-500 dark:text-stone-400 bg-stone-50/50 rounded-lg border border-dashed border-stone-200 dark:bg-stone-900/20 dark:border-stone-800">
              <Shield className="h-8 w-8 mx-auto text-stone-300 mb-2" />
              No hay otras sesiones activas. Tu cuenta está segura.
            </div>
          ) : (
            <div className="space-y-1">
              {otherSessions.map((session, index) => (
                <div
                  key={`${session.ip_address}-${index}`}
                  className="flex items-center justify-between group p-3 -mx-3 rounded-xl hover:bg-stone-50 border border-transparent hover:border-stone-100 transition-all dark:hover:bg-stone-900 dark:hover:border-stone-800"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-stone-100 flex items-center justify-center text-stone-500 group-hover:bg-white group-hover:shadow-sm group-hover:text-teal-600 transition-all dark:bg-stone-800 dark:text-stone-400 dark:group-hover:bg-stone-950">
                      <Globe className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-stone-700 group-hover:text-stone-900 dark:text-stone-300 dark:group-hover:text-stone-100">
                        {session.agent.string}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-stone-400 mt-0.5">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" /> {session.ip_address}
                        </span>
                        <span className="text-stone-300">•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" /> {session.last_active}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer: Acción Global */}
        {otherSessions.length > 0 && (
          <div className="bg-stone-50 border-t border-stone-100 p-4 dark:bg-stone-900/30 dark:border-stone-800">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400">
                <AlertCircle className="h-4 w-4 text-amber-500" />
                <span>
                  Se recomienda cerrar las sesiones que no reconozcas.
                </span>
              </div>

              <Button
                variant="destructive"
                size="sm"
                className="w-full sm:w-auto h-9 text-xs font-medium bg-white text-red-600 border border-stone-200 hover:bg-red-50 hover:text-red-700 hover:border-red-200 shadow-sm transition-all dark:bg-stone-950 dark:border-stone-700 dark:hover:bg-red-900/20 dark:hover:border-red-900 dark:text-red-400"
                onClick={onCloseAllSessions}
              >
                <LogOut className="mr-2 h-3.5 w-3.5" />
                Cerrar otras sesiones
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Componente Skeleton (sin cambios)
const SessionsSkeleton = () => (
  <Card className="border-stone-200 shadow-sm">
    <CardHeader className="border-b pb-4 space-y-2">
      <Skeleton className="h-6 w-1/3" />
      <Skeleton className="h-4 w-1/4" />
    </CardHeader>
    <CardContent className="p-6 space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-20 w-full rounded-xl" />
      </div>
      <div className="space-y-3">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    </CardContent>
  </Card>
);
