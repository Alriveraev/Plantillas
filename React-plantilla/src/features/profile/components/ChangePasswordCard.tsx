import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LockKeyhole, History, ShieldCheck } from "lucide-react";

interface ChangePasswordCardProps {
  lastChanged: string;
  onChangePassword: () => void;
}

export const ChangePasswordCard = ({
  lastChanged,
  onChangePassword,
}: ChangePasswordCardProps) => {
  return (
    <Card className="border-stone-200 shadow-sm dark:border-stone-800 overflow-hidden group hover:shadow-md transition-all duration-300">
      <CardContent className="p-0">
        <div className="flex flex-col sm:flex-row items-center p-5 gap-5">
          {/* Icono de Seguridad con Estado */}
          <div className="relative shrink-0">
            <div className="h-12 w-12 rounded-xl bg-stone-100 flex items-center justify-center dark:bg-stone-800 text-stone-500 group-hover:text-teal-600 transition-colors">
              <LockKeyhole className="h-6 w-6" />
            </div>
            {/* Indicador de estado */}
            <div className="absolute -bottom-1 -right-1 h-5 w-5 bg-white rounded-full flex items-center justify-center shadow-sm border border-stone-100 dark:bg-stone-900 dark:border-stone-800">
              <ShieldCheck className="h-3 w-3 text-emerald-500" />
            </div>
          </div>

          {/* Información Principal */}
          <div className="flex-1 text-center sm:text-left space-y-1">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <h3 className="font-semibold text-stone-900 dark:text-stone-50">
                Contraseña
              </h3>
              <span className="inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-sm">
              <span className="font-mono text-lg tracking-widest text-stone-300 leading-none mt-0.5">
                ••••••••••
              </span>
              <span className="hidden sm:inline text-stone-200 dark:text-stone-700">
                |
              </span>
              <span className="text-stone-500 dark:text-stone-400 text-xs flex items-center justify-center sm:justify-start gap-1.5">
                <History className="h-3 w-3" />
                {lastChanged}
              </span>
            </div>
          </div>

          {/* Acción */}
          <Button
            variant="secondary"
            className="shrink-0 w-full sm:w-auto bg-stone-50 hover:bg-teal-50 text-stone-600 hover:text-teal-700 border border-stone-200 hover:border-teal-200 dark:bg-stone-900 dark:border-stone-800 dark:text-stone-300 dark:hover:bg-stone-800 transition-all shadow-sm"
            onClick={onChangePassword}
          >
            Actualizar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
