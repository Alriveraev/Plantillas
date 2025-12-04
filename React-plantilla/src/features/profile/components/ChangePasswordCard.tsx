import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { KeyRound, ShieldCheck } from "lucide-react";

interface ChangePasswordCardProps {
  lastChanged: string;
  onChangePassword: () => void;
}

export const ChangePasswordCard = ({
  lastChanged,
  onChangePassword,
}: ChangePasswordCardProps) => {
  return (
    <Card className="border-stone-200 shadow-sm dark:border-stone-800">
      {/* Header simplificado y limpio */}
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-stone-500 uppercase tracking-wider flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            Contraseña
          </CardTitle>
          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800">
            Segura
          </span>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Contenedor que simula un input de contraseña */}
        <div className="flex items-center justify-between rounded-md border border-stone-200 bg-stone-50/50 p-1 pl-3 dark:border-stone-800 dark:bg-stone-900/40">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-white border border-stone-100 shadow-sm dark:bg-stone-800 dark:border-stone-700">
              <KeyRound className="h-4 w-4 text-stone-500" />
            </div>

            {/* Dots de contraseña simulados */}
            <div className="flex flex-col justify-center">
              <span className="text-xl font-bold text-stone-700 leading-none tracking-widest dark:text-stone-300">
                ••••••••••••
              </span>
            </div>
          </div>

          {/* Botón integrado */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onChangePassword}
            className="h-9 px-4 font-medium text-stone-600 hover:text-stone-900 hover:bg-white hover:shadow-sm transition-all dark:text-stone-400 dark:hover:text-stone-100 dark:hover:bg-stone-800"
          >
            Modificar
          </Button>
        </div>

        {/* Footer informativo sutil */}
        <p className="text-[11px] text-stone-400 pl-1">
          Última actualización:{" "}
          <span className="text-stone-500 font-medium dark:text-stone-300">
            {lastChanged || "Desconocida"}
          </span>
        </p>
      </CardContent>
    </Card>
  );
};
