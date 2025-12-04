import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Shield,
  Globe,
  Clock,
  MapPin,
  LogOut,
  Laptop,
  History,
} from "lucide-react";

interface LoginHistory {
  id: string;
  date: string;
  time: string;
  browser: string;
  location: string;
}

interface SecurityGeneralCardProps {
  lastLogin: string;
  loginHistory: LoginHistory[];
  sessionCount: number;
  onCloseAllSessions: () => void;
}

export const SecurityGeneralCard = ({
  lastLogin,
  loginHistory,
  sessionCount,
  onCloseAllSessions,
}: SecurityGeneralCardProps) => {
  return (
    <Card className="border-stone-200 shadow-sm dark:border-stone-800 overflow-hidden">
      {/* Header Limpio */}
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
        {/* Sección: Sesión Actual (Destacada) */}
        <div className="p-6 pt-0 border-b border-stone-200 dark:border-stone-800">
          <h4 className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-3 flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
            Sesión Actual
          </h4>
          <div className="flex items-center justify-between rounded-xl bg-emerald-50/50 border border-emerald-100 p-4 transition-all hover:border-emerald-200 hover:shadow-sm dark:bg-emerald-900/10 dark:border-emerald-900/30">
            <div className="flex items-start gap-3">
              <div className="p-2.5 bg-white rounded-lg border border-emerald-100 shadow-sm text-emerald-600 dark:bg-emerald-950 dark:border-emerald-900 dark:text-emerald-400">
                <Laptop className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-emerald-950 dark:text-emerald-50">
                  Dispositivo Actual
                </p>
                <p className="text-xs text-emerald-700/80 dark:text-emerald-300/70 mt-0.5 font-medium">
                  {lastLogin}
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

        {/* Sección: Historial */}
        <div className="p-6">
          <h4 className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-4 flex items-center gap-2">
            <History className="h-3.5 w-3.5" />
            Accesos Recientes
          </h4>

          <div className="space-y-1">
            {loginHistory.map((entry) => (
              <div
                key={entry.id}
                className="flex items-center justify-between group p-3 -mx-3 rounded-xl hover:bg-stone-50 border border-transparent hover:border-stone-100 transition-all dark:hover:bg-stone-900 dark:hover:border-stone-800"
              >
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-stone-100 flex items-center justify-center text-stone-500 group-hover:bg-white group-hover:shadow-sm group-hover:text-teal-600 transition-all dark:bg-stone-800 dark:text-stone-400 dark:group-hover:bg-stone-950">
                    <Globe className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-stone-700 group-hover:text-stone-900 dark:text-stone-300 dark:group-hover:text-stone-100">
                      {entry.browser}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-stone-400 mt-0.5">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" /> {entry.location}
                      </span>
                      <span className="text-stone-300">•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" /> {entry.time}
                      </span>
                    </div>
                  </div>
                </div>
                <span className="text-xs text-stone-400 font-medium bg-stone-50 px-2.5 py-1 rounded-md border border-stone-100 dark:bg-stone-900 dark:border-stone-800">
                  {entry.date}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Sección: Gestión de Sesiones (Footer) */}
        <div className="bg-stone-50 border-t border-stone-100 p-4 dark:bg-stone-900/30 dark:border-stone-800">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
              </span>
              <span>
                <strong>{sessionCount}</strong> sesiones activas detectadas
              </span>
            </div>

            <Button
              variant="destructive"
              size="sm"
              className="w-full sm:w-auto h-9 text-xs font-medium text-destructive border-stone-200 bg-white hover:bg-red-50 hover:text-red-700 hover:border-red-200 shadow-sm transition-all dark:bg-stone-950 dark:border-stone-700 dark:hover:bg-red-900/20 dark:hover:border-red-900"
              onClick={onCloseAllSessions}
            >
              <LogOut className="mr-2 h-3.5 w-3.5" />
              Cerrar todas las sesiones
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
