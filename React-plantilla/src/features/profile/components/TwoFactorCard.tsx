import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Smartphone,
  RefreshCw,
  KeyRound,
  ShieldCheck,
  ShieldAlert,
  Loader2,
  ChevronRight,
  Laptop,
} from "lucide-react";

interface TwoFactorCardProps {
  isEnabled: boolean;
  onEnable: () => void;
  onDisable: () => void;
  onChangeMethod: () => void;
  onChangeDevice: () => void;
  onViewBackupCodes: () => void;
  isLoading?: boolean;
}

export const TwoFactorCard = ({
  isEnabled,
  onEnable,
  onDisable,
  onChangeMethod,
  onChangeDevice,
  onViewBackupCodes,
  isLoading,
}: TwoFactorCardProps) => {
  return (
    <Card className="border-stone-200 shadow-sm dark:border-stone-800">
      <CardContent className="">
        {isEnabled ? (
          <div className="space-y-6">
            {/* 1. Cabecera de Estado (Responsive: Columna en móvil, Fila en desktop) */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-medium text-stone-900 dark:text-stone-100 text-sm sm:text-base">
                    Autenticación activa
                  </h4>
                  <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400">
                    Tu cuenta tiene una capa extra de seguridad.
                  </p>
                </div>
              </div>
              <Badge
                variant="outline"
                className="w-fit border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400"
              >
                Activado
              </Badge>
            </div>

            {/* 2. Tarjeta del Método Principal (Destacado) */}
            <div className="rounded-xl border border-stone-200 bg-stone-50 p-4 dark:border-stone-800 dark:bg-stone-900/50 flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
              <div className="h-12 w-12 rounded-lg bg-white border border-stone-100 flex items-center justify-center shadow-sm dark:bg-stone-800 dark:border-stone-700 shrink-0">
                <Smartphone className="h-6 w-6 text-stone-600 dark:text-stone-300" />
              </div>
              <div className="flex-1 space-y-0.5">
                <p className="font-medium text-stone-900 dark:text-stone-100 text-sm">
                  Aplicación Autenticadora
                </p>
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  Google Authenticator, Authy, etc.
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={onChangeMethod}
                className="w-full sm:w-auto bg-white dark:bg-stone-800 border-stone-200 hover:bg-stone-100"
              >
                <RefreshCw className="mr-2 h-3.5 w-3.5" />
                Cambiar
              </Button>
            </div>

            {/* 3. Acciones Secundarias (Grid: 1 col móvil, 2 cols desktop) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Button
                variant="outline"
                className="justify-between group h-auto py-3 border-stone-200 hover:bg-stone-50 dark:border-stone-800 dark:hover:bg-stone-800"
                onClick={onViewBackupCodes}
              >
                <span className="flex items-center gap-2.5">
                  <KeyRound className="h-4 w-4 text-stone-500" />
                  <span className="text-sm font-medium text-stone-700 dark:text-stone-300">
                    Códigos de recuperación
                  </span>
                </span>
                <ChevronRight className="h-4 w-4 text-stone-400 group-hover:translate-x-0.5 transition-transform" />
              </Button>

              <Button
                variant="outline"
                className="justify-between group h-auto py-3 border-stone-200 hover:bg-stone-50 dark:border-stone-800 dark:hover:bg-stone-800"
                onClick={onChangeDevice}
              >
                <span className="flex items-center gap-2.5">
                  <Laptop className="h-4 w-4 text-stone-500" />
                  <span className="text-sm font-medium text-stone-700 dark:text-stone-300">
                    Dispositivos de confianza
                  </span>
                </span>
                <ChevronRight className="h-4 w-4 text-stone-400 group-hover:translate-x-0.5 transition-transform" />
              </Button>
            </div>

            {/* 4. Acción Destructiva (Discreta) */}
            <div className="pt-2 flex justify-center sm:justify-start">
              <Button
                variant="ghost"
                className="h-auto p-0 text-xs text-red-500 hover:text-red-600 hover:bg-transparent"
                onClick={onDisable}
                disabled={isLoading}
              >
                {isLoading && <Loader2 className="mr-2 h-3 w-3 animate-spin" />}
                Desactivar autenticación de dos pasos
              </Button>
            </div>
          </div>
        ) : (
          /* Estado Inactivo (Responsive: Stack en móvil, Fila en desktop) */
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 py-2">
            <div className="h-12 w-12 shrink-0 rounded-full bg-amber-50 flex items-center justify-center dark:bg-amber-900/20">
              <ShieldAlert className="h-6 w-6 text-amber-600 dark:text-amber-500" />
            </div>
            <div className="flex-1 text-center sm:text-left space-y-1">
              <h4 className="font-medium text-stone-900 dark:text-stone-100 text-sm sm:text-base">
                Sin protección adicional
              </h4>
              <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 max-w-md">
                Protege tu cuenta contra accesos no autorizados solicitando un
                código al iniciar sesión.
              </p>
            </div>
            <Button
              onClick={onEnable}
              className="w-full sm:w-auto bg-stone-900 text-white hover:bg-stone-800 dark:bg-stone-100 dark:text-stone-900 shadow-sm whitespace-nowrap"
            >
              Activar ahora
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
