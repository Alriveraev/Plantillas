import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Shield,
  Smartphone,
  RefreshCw,
  KeyRound,
  LogOut,
  ShieldCheck,
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
    <Card className="border-stone-200 shadow-sm dark:border-stone-800 overflow-hidden flex flex-col ">
      <CardHeader className="">
        <div className="flex items-start justify-between gap-4">
          <div className="flex gap-4">
            <div
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-colors ${
                isEnabled
                  ? "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400"
                  : "bg-stone-100 text-stone-500 dark:bg-stone-800"
              }`}
            >
              {isEnabled ? (
                <ShieldCheck className="h-6 w-6" />
              ) : (
                <Shield className="h-6 w-6" />
              )}
            </div>
            <div className="space-y-1">
              <CardTitle className="text-lg font-semibold text-stone-900 dark:text-stone-50">
                Autenticación en dos pasos
              </CardTitle>
              <CardDescription className="text-stone-500 dark:text-stone-400 text-sm max-w-[280px] leading-snug">
                Añade una capa extra de seguridad requiriendo un código al
                iniciar sesión.
              </CardDescription>
            </div>
          </div>

          <Badge
            variant="outline"
            className={`ml-auto shrink-0 whitespace-nowrap ${
              isEnabled
                ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-800 dark:text-emerald-400"
                : "bg-stone-100 text-stone-500 border-stone-200 dark:bg-stone-800 dark:border-stone-700 dark:text-stone-400"
            }`}
          >
            {isEnabled ? "Activado" : "Inactivo"}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className=" flex flex-col justify-end ">
        {isEnabled ? (
          <div className="space-y-6">
            {/* Indicador de Estado */}
            <div className="rounded-lg border border-teal-100 bg-teal-50/30 p-3 flex items-start gap-3 dark:bg-teal-900/10 dark:border-teal-900/30">
              <div className="mt-1.5 h-2 w-2 rounded-full bg-teal-500 shadow-[0_0_4px_rgba(20,184,166,0.5)] shrink-0" />
              <div className="text-sm text-stone-600 dark:text-stone-300">
                <p className="font-medium text-teal-900 dark:text-teal-100 leading-none mb-1">
                  Tu cuenta está protegida
                </p>
                <p className="text-xs opacity-90 leading-relaxed">
                  Se solicitará un código de seguridad cada vez que inicies
                  sesión en un nuevo dispositivo.
                </p>
              </div>
            </div>

            {/* Grilla de Acciones */}
            <div className="space-y-3">
              <p className="text-xs font-semibold text-stone-400 uppercase tracking-wider pl-1">
                Configuración
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  className="justify-start border-stone-200 hover:bg-stone-50 dark:border-stone-700 dark:hover:bg-stone-800 h-auto py-3 px-4"
                  onClick={onChangeMethod}
                >
                  <RefreshCw className="mr-3 h-4 w-4 text-stone-500" />
                  <div className="text-left">
                    <div className="text-sm font-medium text-stone-700 dark:text-stone-200">
                      Cambiar método
                    </div>
                  </div>
                </Button>

                <Button
                  variant="outline"
                  className="justify-start border-stone-200 hover:bg-stone-50 dark:border-stone-700 dark:hover:bg-stone-800 h-auto py-3 px-4"
                  onClick={onChangeDevice}
                >
                  <Smartphone className="mr-3 h-4 w-4 text-stone-500" />
                  <div className="text-left">
                    <div className="text-sm font-medium text-stone-700 dark:text-stone-200">
                      Cambiar dispositivo
                    </div>
                  </div>
                </Button>

                <Button
                  variant="outline"
                  className="justify-start border-stone-200 hover:bg-stone-50 dark:border-stone-700 dark:hover:bg-stone-800 h-auto py-3 px-4"
                  onClick={onViewBackupCodes}
                >
                  <KeyRound className="mr-3 h-4 w-4 text-stone-500" />
                  <div className="text-left">
                    <div className="text-sm font-medium text-stone-700 dark:text-stone-200">
                      Ver códigos
                    </div>
                  </div>
                </Button>

                <Button
                  variant="outline"
                  className="justify-start border-red-200 bg-red-50/50 hover:bg-red-50 hover:border-red-300 text-red-700 dark:border-red-900/50 dark:bg-red-900/10 dark:hover:bg-red-900/20 dark:text-red-400 h-auto py-3 px-4"
                  onClick={onDisable}
                  disabled={isLoading}
                >
                  <LogOut className="mr-3 h-4 w-4 text-red-500" />
                  <div className="text-left">
                    <div className="text-sm font-medium">Desactivar 2FA</div>
                  </div>
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-2">
            <Button
              className="w-full bg-stone-900 hover:bg-stone-800 text-white dark:bg-stone-100 dark:text-stone-900 shadow-sm h-11"
              onClick={onEnable}
            >
              Activar autenticación de dos factores
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
