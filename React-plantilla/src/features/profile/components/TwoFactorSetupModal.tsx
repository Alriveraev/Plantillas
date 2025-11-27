import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
// Reemplazamos el Input normal por los componentes de OTP
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { REGEXP_ONLY_DIGITS } from "input-otp";

import { 
  AlertCircle, 
  Check, 
  Copy, 
  QrCode, 
  ShieldCheck, 
  Smartphone, 
  KeyRound, 
  ArrowRight,
  ArrowLeft,
  Download
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type Step = "qr" | "verify" | "backup";

interface TwoFactorSetupModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export const TwoFactorSetupModal = ({
  open,
  onOpenChange,
  onSuccess,
}: TwoFactorSetupModalProps) => {
  const [step, setStep] = useState<Step>("qr");
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasCopiedCodes, setHasCopiedCodes] = useState(false);

  // Mock data
  const secretKey = "JBSWY3DPEBLW64TMMQ======";
  const backupCodes = [
    "A1B2-C3D4-E5F6",
    "G7H8-I9J0-K1L2",
    "M3N4-O5P6-Q7R8",
    "S9T0-U1V2-W3X4",
    "Y5Z6-A7B8-C9D0",
  ];

  const handleVerify = async () => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsLoading(false);
    setStep("backup");
    toast.success("Código verificado correctamente");
  };

  const handleComplete = async () => {
    if (!hasCopiedCodes) {
        toast.warning("Por favor guarda tus códigos antes de continuar");
        return;
    }
    
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);
    onSuccess();
    handleClose();
    toast.success("Autenticación de dos factores activada");
  };

  const handleClose = () => {
    setStep("qr");
    setCode("");
    setHasCopiedCodes(false);
    onOpenChange(false);
  };

  const copyToClipboard = (text: string, message: string) => {
    navigator.clipboard.writeText(text);
    toast.success(message);
  };

  const copyBackupCodes = () => {
    copyToClipboard(backupCodes.join("\n"), "Códigos copiados al portapapeles");
    setHasCopiedCodes(true);
  };

  const downloadBackupCodes = () => {
    const element = document.createElement("a");
    const file = new Blob([backupCodes.join("\n")], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = "vetcare-backup-codes.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    setHasCopiedCodes(true);
    toast.success("Archivo descargado correctamente");
  };

  // --- CONFIGURACIÓN DEL STEPPER ---
  const steps = [
    { id: "qr", label: "Escanear", icon: QrCode },
    { id: "verify", label: "Verificar", icon: Smartphone },
    { id: "backup", label: "Respaldo", icon: KeyRound },
  ];

  const currentStepIndex = steps.findIndex(s => s.id === step);

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent 
        className="sm:max-w-[500px] p-0 overflow-hidden gap-0 max-h-[90vh] flex flex-col rounded-xl"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader className="space-y-4 pt-6 px-6">
          <div className="flex items-center gap-3">
             <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-teal-50 text-teal-600 dark:bg-teal-900/30 dark:text-teal-400">
                <ShieldCheck className="h-5 w-5" />
             </div>
             <div>
                <DialogTitle className="text-xl font-semibold text-stone-900 dark:text-stone-50">
                    Configurar 2FA
                </DialogTitle>
                <DialogDescription className="text-stone-500 dark:text-stone-400 text-sm mt-1">
                    Protege tu cuenta en 3 pasos sencillos.
                </DialogDescription>
             </div>
          </div>

          {/* --- STEPPER INTEGRADO --- */}
          <div className="pt-2 px-2 pb-4">
            <div className="relative flex justify-between items-start w-full max-w-[320px] mx-auto">
                <div className="absolute top-3.5 left-10 right-10 h-0.5 bg-stone-100 dark:bg-stone-800 z-0 rounded-full overflow-hidden">
                    <div 
                        className="h-full bg-teal-500 transition-all duration-500 ease-in-out"
                        style={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }} 
                    />
                </div>
                
                {steps.map((s, index) => {
                    const isActive = index === currentStepIndex;
                    const isCompleted = index < currentStepIndex;
                    
                    return (
                        <div key={s.id} className="flex flex-col items-center gap-2 relative z-10 w-20">
                            <div className={cn(
                                "h-7 w-7 rounded-full flex items-center justify-center border transition-all duration-300",
                                "bg-white dark:bg-stone-950",
                                isActive 
                                    ? "border-teal-500 text-teal-600 shadow-sm ring-4 ring-teal-50 dark:ring-teal-900/20" 
                                    : isCompleted 
                                        ? "border-teal-500 bg-teal-500 text-white" 
                                        : "border-stone-200 text-stone-300 dark:border-stone-800 dark:text-stone-600"
                            )}>
                                {isCompleted ? <Check className="h-3.5 w-3.5" /> : <s.icon className="h-3.5 w-3.5" />}
                            </div>
                            <span className={cn(
                                "text-[10px] font-medium transition-colors text-center uppercase tracking-wide",
                                isActive ? "text-teal-700 dark:text-teal-400 font-bold" : "text-stone-400"
                            )}>
                                {s.label}
                            </span>
                        </div>
                    );
                })}
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto bg-stone-50 dark:bg-stone-900/50">
          <div className="p-6">
            {/* Paso 1: QR Code */}
            {step === "qr" && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                    <div className="text-center space-y-4">
                        <div className="p-4 bg-white rounded-xl border border-stone-100 shadow-sm inline-block mx-auto dark:bg-stone-900 dark:border-stone-800">
                            <QrCode className="h-32 w-32 text-stone-800 dark:text-stone-200" />
                        </div>
                        <p className="text-sm text-stone-600 dark:text-stone-400 max-w-[280px] mx-auto leading-relaxed">
                            Escanea el código QR con tu aplicación autenticadora (Google Authenticator, Authy).
                        </p>
                    </div>

                    <div className="bg-stone-100/50 p-3 rounded-lg border border-stone-200/50 flex flex-col items-center gap-2 dark:bg-stone-900 dark:border-stone-800 text-center">
                         <span className="text-[10px] text-stone-400 font-medium uppercase tracking-wider">¿No puedes escanear?</span>
                         <code className="text-sm font-mono text-stone-700 font-bold break-all dark:text-stone-300 select-all px-2">
                            {secretKey}
                         </code>
                         <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-7 text-xs text-teal-600 hover:text-teal-700 hover:bg-teal-50 w-full"
                            onClick={() => copyToClipboard(secretKey, "Clave secreta copiada")}
                        >
                            <Copy className="h-3 w-3 mr-1.5" /> Copiar clave manual
                        </Button>
                    </div>
                </div>
            )}

            {/* Paso 2: Verificar con InputOTP */}
            {step === "verify" && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300 pt-4">
                    <div className="text-center">
                        <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-stone-100 mb-4 dark:bg-stone-800">
                            <Smartphone className="h-6 w-6 text-stone-500" />
                        </div>
                        <h4 className="text-stone-900 font-semibold mb-2 dark:text-stone-50">Confirma la vinculación</h4>
                        <p className="text-sm text-stone-500 mb-6 max-w-xs mx-auto">
                            Ingresa el código de 6 dígitos que muestra tu aplicación para finalizar.
                        </p>
                        
                        <div className="flex justify-center mb-2">
                            <InputOTP
                                maxLength={6}
                                value={code}
                                onChange={(value) => setCode(value)}
                                disabled={isLoading}
                                pattern={REGEXP_ONLY_DIGITS}
                            >
                                <InputOTPGroup>
                                    <InputOTPSlot index={0} className="h-12 w-10 sm:h-14 sm:w-12 text-lg border-stone-200" />
                                    <InputOTPSlot index={1} className="h-12 w-10 sm:h-14 sm:w-12 text-lg border-stone-200" />
                                    <InputOTPSlot index={2} className="h-12 w-10 sm:h-14 sm:w-12 text-lg border-stone-200" />
                                </InputOTPGroup>
                                <InputOTPSeparator />
                                <InputOTPGroup>
                                    <InputOTPSlot index={3} className="h-12 w-10 sm:h-14 sm:w-12 text-lg border-stone-200" />
                                    <InputOTPSlot index={4} className="h-12 w-10 sm:h-14 sm:w-12 text-lg border-stone-200" />
                                    <InputOTPSlot index={5} className="h-12 w-10 sm:h-14 sm:w-12 text-lg border-stone-200" />
                                </InputOTPGroup>
                            </InputOTP>
                        </div>
                    </div>
                </div>
            )}

            {/* Paso 3: Respaldo */}
            {step === "backup" && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                    <div className="rounded-lg bg-amber-50 border border-amber-100 p-4 flex gap-3 dark:bg-amber-900/10 dark:border-amber-900/20">
                        <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                        <div className="text-sm text-amber-800 dark:text-amber-200">
                            <p className="font-semibold mb-1">Códigos de recuperación</p>
                            Guárdalos en un lugar seguro. Si pierdes tu dispositivo, serán la única forma de acceder a tu cuenta.
                        </div>
                    </div>

                    <div className="bg-stone-100/50 border border-stone-200/50 rounded-xl p-4 dark:bg-stone-900 dark:border-stone-800">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-center">
                            {backupCodes.map((code, i) => (
                                <div key={i} className="bg-white p-1.5 rounded-md font-mono text-sm text-stone-600 font-medium tracking-wide border border-stone-200 select-all dark:bg-stone-950 dark:text-stone-400 dark:border-stone-800">
                                    {code}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex gap-3">
                         <Button 
                            variant="outline" 
                            className="flex-1 h-9 text-xs border-stone-200 hover:bg-white text-stone-600"
                            onClick={downloadBackupCodes}
                        >
                             <Download className="mr-2 h-3.5 w-3.5" /> Descargar .txt
                        </Button>
                        <Button 
                            variant="outline" 
                            className="flex-1 h-9 text-xs border-stone-200 hover:bg-white text-stone-600" 
                            onClick={copyBackupCodes}
                        >
                            {hasCopiedCodes ? (
                                <> <Check className="mr-2 h-3.5 w-3.5" /> Copiado </>
                            ) : (
                                <> <Copy className="mr-2 h-3.5 w-3.5" /> Copiar </>
                            )}
                        </Button>
                    </div>
                </div>
            )}
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="p-6 pt-0 bg-stone-50 dark:bg-stone-900/50">
            {step === "qr" && (
                 <div className="flex flex-col-reverse sm:flex-row gap-3">
                    <Button 
                        variant="outline" 
                        onClick={handleClose} 
                        className="flex-1 border-stone-200 text-stone-700 hover:bg-stone-100 hover:text-stone-900 dark:border-stone-700 dark:text-stone-300 dark:hover:bg-stone-800"
                    >
                        Cancelar
                    </Button>
                    <Button 
                        className="flex-1 bg-teal-600 hover:bg-teal-700 text-white" 
                        onClick={() => setStep("verify")}
                    >
                        Siguiente <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                 </div>
            )}

            {step === "verify" && (
                <div className="flex flex-col-reverse sm:flex-row gap-3">
                    <Button 
                        variant="ghost" 
                        onClick={() => setStep("qr")} 
                        disabled={isLoading} 
                        className="flex-1 text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-200"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" /> Atrás
                    </Button>
                    <Button 
                        className="flex-1 bg-teal-600 hover:bg-teal-700 text-white min-w-[120px]" 
                        onClick={handleVerify}
                        disabled={code.length !== 6 || isLoading}
                    >
                        {isLoading ? (
                            <span className="flex items-center gap-2">
                                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                                Verificando...
                            </span>
                        ) : (
                            "Verificar"
                        )}
                    </Button>
                </div>
            )}

            {step === "backup" && (
                <Button 
                    className="w-full bg-teal-600 hover:bg-teal-700 text-white shadow-lg shadow-teal-600/20"
                    onClick={handleComplete}
                    disabled={isLoading}
                >
                    {isLoading ? "Activando..." : "He guardado los códigos y activar"}
                </Button>
            )}
        </div>
      </DialogContent>
    </Dialog>
  );
};