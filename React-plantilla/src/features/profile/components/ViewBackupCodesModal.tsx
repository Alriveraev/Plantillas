import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Check,
  Copy,
  Download,
  RefreshCw,
  Shield,
  Info,
  AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface ViewBackupCodesModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ViewBackupCodesModal = ({
  open,
  onOpenChange,
}: ViewBackupCodesModalProps) => {
  const [copied, setCopied] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  // Estado para manejar la vista de confirmación interna
  const [showConfirmRegenerate, setShowConfirmRegenerate] = useState(false);

  // Mock data - en producción vendría del backend
  const backupCodes = [
    "A1B2-C3D4-E5F6",
    "G7H8-I9J0-K1L2",
    "M3N4-O5P6-Q7R8",
    "S9T0-U1V2-W3X4",
    "Y5Z6-A7B8-C9D0",
    "Z1X2-C3V4-B5N6",
  ];

  // Simular códigos usados
  const usedCodes = ["G7H8-I9J0-K1L2"];

  const availableCodesCount = backupCodes.filter(
    (code) => !usedCodes.includes(code)
  ).length;
  const isLowCodes = availableCodesCount <= 3;

  const copyBackupCodes = () => {
    const availableCodes = backupCodes.filter(
      (code) => !usedCodes.includes(code)
    );
    navigator.clipboard.writeText(availableCodes.join("\n"));
    setCopied(true);
    toast.success("Códigos copiados", {
      description: "Solo se copiaron los códigos válidos.",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadBackupCodes = () => {
    const availableCodes = backupCodes.filter(
      (code) => !usedCodes.includes(code)
    );
    const content = `Códigos de respaldo - VetCare Pro\n\nGuarda estos códigos en un lugar seguro.\nCada código solo puede usarse una vez.\n\n${availableCodes.join(
      "\n"
    )}\n\nGenerados el: ${new Date().toLocaleDateString()}`;

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "vetcare-backup-codes.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Archivo descargado");
  };

  const handleRegenerate = async () => {
    setIsRegenerating(true);
    // Simular llamada al API
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsRegenerating(false);
    setShowConfirmRegenerate(false); // Volver a la vista de lista
    toast.success("Nuevos códigos generados", {
      description: "Los códigos anteriores han sido invalidados.",
    });
  };

  const handleClose = () => {
    setCopied(false);
    setShowConfirmRegenerate(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent
        className="sm:max-w-[500px] p-6 gap-6 rounded-xl border-stone-200 dark:border-stone-800"
        onInteractOutside={(e) => e.preventDefault()}
      >
        {/* --- VISTA DE CONFIRMACIÓN (REEMPLAZO DEL ALERT) --- */}
        {showConfirmRegenerate ? (
          <div className="animate-in fade-in zoom-in-95 duration-200 space-y-6">
            <DialogHeader className="space-y-3">
              <div className="flex items-center justify-center mb-2">
                <div className="h-14 w-14 rounded-full bg-red-100 flex items-center justify-center dark:bg-red-900/20">
                  <AlertTriangle className="h-7 w-7 text-red-600 dark:text-red-400" />
                </div>
              </div>
              <div className="text-center space-y-2">
                <DialogTitle className="text-xl font-semibold text-stone-900 dark:text-stone-50">
                  ¿Generar nuevos códigos?
                </DialogTitle>
                <DialogDescription className="text-stone-500 dark:text-stone-400 max-w-sm mx-auto">
                  Esta acción <strong>invalidará inmediatamente</strong> todos
                  tus códigos de respaldo actuales. Asegúrate de guardar los
                  nuevos.
                </DialogDescription>
              </div>
            </DialogHeader>

            <div className="flex flex-col gap-3 pt-2">
              <Button
                variant="destructive"
                className="w-full h-11 bg-red-600 hover:bg-red-700 text-white shadow-sm"
                onClick={handleRegenerate}
                disabled={isRegenerating}
              >
                {isRegenerating ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white mr-2" />
                    Generando...
                  </>
                ) : (
                  "Sí, invalidar y generar nuevos"
                )}
              </Button>
              <Button
                variant="outline"
                className="w-full h-11 border-stone-200 hover:bg-stone-50 text-stone-700"
                onClick={() => setShowConfirmRegenerate(false)}
                disabled={isRegenerating}
              >
                Cancelar
              </Button>
            </div>
          </div>
        ) : (
          /* --- VISTA PRINCIPAL (LISTA DE CÓDIGOS) --- */
          <>
            <DialogHeader className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-teal-50 text-teal-600 dark:bg-teal-900/30 dark:text-teal-400">
                  <Shield className="h-5 w-5" />
                </div>
                <div>
                  <DialogTitle className="text-xl font-semibold text-stone-900 dark:text-stone-50">
                    Códigos de Respaldo
                  </DialogTitle>
                  <DialogDescription className="text-stone-500 dark:text-stone-400 text-sm mt-1 leading-relaxed">
                    Usa estos códigos para acceder a tu cuenta si pierdes acceso
                    a tu aplicación autenticadora.
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <div className="space-y-5">
              {/* Status Bar */}
              <div className="flex items-center justify-between px-1">
                <span className="text-sm font-medium text-stone-600 dark:text-stone-300">
                  Estado de códigos
                </span>
                <span
                  className={cn(
                    "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                    isLowCodes
                      ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
                      : "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400"
                  )}
                >
                  {availableCodesCount} disponibles
                </span>
              </div>

              {/* Codes Grid */}
              <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 dark:bg-stone-900 dark:border-stone-800">
                <div className="grid grid-cols-2 gap-3">
                  {backupCodes.map((code, index) => {
                    const isUsed = usedCodes.includes(code);
                    return (
                      <div
                        key={index}
                        className={cn(
                          "relative p-2.5 rounded-md text-center font-mono text-sm tracking-wider border transition-all",
                          isUsed
                            ? "bg-stone-100 text-stone-400 border-transparent line-through decoration-stone-400/50 dark:bg-stone-800 dark:text-stone-600"
                            : "bg-white text-stone-700 border-stone-200 shadow-sm dark:bg-stone-950 dark:text-stone-300 dark:border-stone-700"
                        )}
                      >
                        {code}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Important Info Box */}
              <div className="rounded-lg border border-stone-100 bg-stone-50/50 p-3 flex gap-3 dark:bg-stone-900 dark:border-stone-800">
                <Info className="h-5 w-5 text-teal-600 shrink-0 mt-0.5" />
                <div className="text-sm text-stone-600 dark:text-stone-300">
                  <p className="font-semibold text-stone-800 dark:text-stone-100 mb-1">
                    Importante
                  </p>
                  <ul className="list-disc list-outside ml-4 space-y-0.5 text-xs text-stone-500 dark:text-stone-400">
                    <li>Cada código solo puede usarse una vez.</li>
                    <li>Guárdalos en un lugar seguro.</li>
                    <li>No los compartas con nadie.</li>
                  </ul>
                </div>
              </div>

              {/* Primary Actions */}
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1 border-stone-200 text-stone-700 hover:bg-stone-50 dark:border-stone-700 dark:text-stone-300 dark:hover:bg-stone-800"
                  onClick={copyBackupCodes}
                >
                  {copied ? (
                    <>
                      {" "}
                      <Check className="mr-2 h-4 w-4 text-emerald-600" />{" "}
                      Copiado{" "}
                    </>
                  ) : (
                    <>
                      {" "}
                      <Copy className="mr-2 h-4 w-4" /> Copiar{" "}
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 border-stone-200 text-stone-700 hover:bg-stone-50 dark:border-stone-700 dark:text-stone-300 dark:hover:bg-stone-800"
                  onClick={downloadBackupCodes}
                >
                  <Download className="mr-2 h-4 w-4" /> Descargar
                </Button>
              </div>

              {/* Secondary Action (Regenerar) */}
              <div className="flex justify-center">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-stone-400 hover:text-red-600 hover:bg-red-50 text-xs px-3 transition-colors dark:text-stone-500 dark:hover:text-red-400 dark:hover:bg-red-950/30"
                  onClick={() => setShowConfirmRegenerate(true)}
                >
                  <RefreshCw className="mr-1.5 h-3.5 w-3.5" /> Invalidar y
                  generar nuevos códigos
                </Button>
              </div>
            </div>

            {/* Footer Full Width */}
            <DialogFooter className="sm:justify-center pt-2">
              <Button
                onClick={handleClose}
                className="w-full sm:w-auto bg-stone-900 text-white hover:bg-stone-800 dark:bg-stone-100 dark:text-stone-900 h-11 text-base shadow-sm px-8"
              >
                Entendido, cerrar
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
