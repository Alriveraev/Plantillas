import { useState } from "react";
import { useAuth } from "@/features/auth/hooks/useAuth"; // 🔥 IMPORTAR EL HOOK
import { UserRole } from "@/api/types/auth.types"; // Importar el Enum para comparaciones

import {
  ProfileForm,
  AvatarUpload,
  ChangePasswordModal,
  TwoFactorSetupModal,
  CloseSessionsAlert,
  Disable2FAAlert,
  VerifyPasswordModal,
  ViewBackupCodesModal,
  SecurityGeneralCard,
  TwoFactorCard,
  ChangePasswordCard,
} from "../components";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User as UserIcon, Shield, Lock } from "lucide-react";
import { toast } from "sonner";

// Mock data para historial (esto lo dejamos mock por ahora o se crea un endpoint luego)
const mockLoginHistory = [
  {
    id: "1",
    date: "Hoy",
    time: "14:32",
    browser: "Chrome en Windows",
    location: "Madrid, ES",
  },
  {
    id: "2",
    date: "Ayer",
    time: "09:15",
    browser: "Safari en iOS",
    location: "Barcelona, ES",
  },
];

// Helper para mostrar nombres bonitos de roles
const ROLE_LABELS: Record<string, string> = {
  [UserRole.ADMIN]: "Administrador",
  [UserRole.MODERATOR]: "Moderador",
  [UserRole.USER]: "Usuario",
  [UserRole.GUEST]: "Invitado",
};

type VerifyAction = "change-method" | "change-device" | "view-backup-codes";

export const ProfilePage = () => {
  // 🔥 OBTENER USUARIO REAL DEL STORE
  const { user } = useAuth();

  // --- States (Modales y Alertas) ---
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);
  const [isTwoFactorModalOpen, setIsTwoFactorModalOpen] = useState(false);
  const [isCloseSessionsAlertOpen, setIsCloseSessionsAlertOpen] = useState(false);
  const [isDisable2FAAlertOpen, setIsDisable2FAAlertOpen] = useState(false);
  const [isVerifyPasswordModalOpen, setIsVerifyPasswordModalOpen] = useState(false);
  const [isViewBackupCodesModalOpen, setIsViewBackupCodesModalOpen] = useState(false);

  // --- States (Lógica de Verificación) ---
  const [pendingAction, setPendingAction] = useState<VerifyAction | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  // --- States (Datos 2FA) ---
  const [isDisabling2FA, setIsDisabling2FA] = useState(false);

  // --- Handlers ---

  const requestPasswordVerification = (action: VerifyAction) => {
    setPendingAction(action);
    setIsVerifyPasswordModalOpen(true);
  };

  const handlePasswordVerified = async () => {
    setIsVerifying(true);
    // Aquí llamarías a un endpoint real para verificar password
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsVerifying(false);
    setIsVerifyPasswordModalOpen(false);

    switch (pendingAction) {
      case "change-method":
      case "change-device":
        setIsTwoFactorModalOpen(true);
        toast.success("Identidad verificada", {
          description: "Ahora puedes reconfigurar tu seguridad.",
        });
        break;
      case "view-backup-codes":
        setIsViewBackupCodesModalOpen(true);
        break;
    }
    setPendingAction(null);
  };

  // Se ejecuta cuando el modal de setup termina exitosamente
  const handle2FASuccess = () => {
    // Aquí deberías invalidar la query 'user' para refrescar el dato two_factor_enabled
    // queryClient.invalidateQueries({ queryKey: ['auth', 'user'] });
    toast.success("Doble factor activado correctamente");
    setIsTwoFactorModalOpen(false);
  };

  const handle2FADisable = async () => {
    setIsDisabling2FA(true);
    // Aquí llamarías a useDisable2FA() hook
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsDisabling2FA(false);
    setIsDisable2FAAlertOpen(false);
    
    // queryClient.invalidateQueries(...)
    toast.success("2FA Desactivado", {
      description: "Se ha eliminado la capa de seguridad extra.",
    });
  };

  // Si no hay usuario (caso raro porque es ruta protegida), no renderizamos o mostramos loader
  if (!user) return null;

  return (
    <div className="container w-full py-8 pt-0 space-y-8 animate-in fade-in duration-500">
      {/* --- Page Header --- */}
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight text-stone-900 dark:text-stone-50">
          Cuenta y Configuración
        </h1>
        <p className="text-stone-500 dark:text-stone-400">
          Gestiona tu información personal y protege tu cuenta.
        </p>
      </div>

      <Tabs defaultValue="general" className="space-y-8">
        {/* --- Navigation Tabs --- */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <TabsList className="h-auto p-1.5 bg-stone-100 rounded-xl border border-stone-200 dark:bg-stone-900 dark:border-stone-800 w-full sm:w-auto grid grid-cols-2 sm:flex">
            <TabsTrigger
              value="general"
              className="flex-1 sm:flex-none px-6 py-2.5 rounded-lg text-sm font-medium text-stone-500 transition-all data-[state=active]:bg-white data-[state=active]:text-teal-700 data-[state=active]:shadow-sm hover:text-stone-700 dark:text-stone-400 dark:data-[state=active]:bg-stone-800 dark:data-[state=active]:text-teal-400 dark:hover:text-stone-200"
            >
              <div className="flex items-center justify-center gap-2.5">
                <UserIcon className="h-4 w-4" />
                General
              </div>
            </TabsTrigger>
            <TabsTrigger
              value="security"
              className="flex-1 sm:flex-none px-6 py-2.5 rounded-lg text-sm font-medium text-stone-500 transition-all data-[state=active]:bg-white data-[state=active]:text-teal-700 data-[state=active]:shadow-sm hover:text-stone-700 dark:text-stone-400 dark:data-[state=active]:bg-stone-800 dark:data-[state=active]:text-teal-400 dark:hover:text-stone-200"
            >
              <div className="flex items-center justify-center gap-2.5">
                <Shield className="h-4 w-4" />
                Seguridad
              </div>
            </TabsTrigger>
          </TabsList>
        </div>

        {/* --- Tab Content: GENERAL --- */}
        <TabsContent
          value="general"
          className="space-y-6 focus-visible:outline-none animate-in fade-in slide-in-from-left-4 duration-300"
        >
          <div className="grid gap-8 lg:grid-cols-12">
            {/* Columna Izquierda (Avatar) - 4 cols */}
            <div className="lg:col-span-4 space-y-6">
              {/* Pasamos el avatar real del usuario */}
              <AvatarUpload currentAvatar={user.avatar} userName={user.name} />

              {/* Info Card Rol */}
              <Card className="border-stone-200 shadow-sm bg-stone-50/50 dark:border-stone-800 dark:bg-stone-900/20">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-stone-500 uppercase tracking-wider">
                    Rol de usuario
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-teal-500" />
                    <span className="font-semibold text-stone-900 dark:text-stone-100">
                      {/* Usamos el mapa para mostrar "Administrador" en vez de "admin" */}
                      {ROLE_LABELS[user.role] || user.role}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Columna Derecha (Formulario) - 8 cols */}
            <div className="lg:col-span-8">
              <Card className="border-stone-200 shadow-sm dark:border-stone-800">
                <CardHeader className="border-b border-stone-100 dark:border-stone-800 pb-4">
                  <CardTitle className="text-xl">Información Personal</CardTitle>
                  <CardDescription>
                    Esta información será visible para otros miembros del equipo.
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  {/* Pasamos el objeto User real */}
                  <ProfileForm user={user} />
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* --- Tab Content: SECURITY --- */}
        <TabsContent
          value="security"
          className="space-y-6 focus-visible:outline-none animate-in fade-in slide-in-from-right-4 duration-300"
        >
          <div className="grid gap-8 lg:grid-cols-12 items-start">
            <div className="lg:col-span-7 space-y-6">
              <SecurityGeneralCard
                lastLogin={user.updatedAt || "Reciente"} // Usamos datos reales o fallback
                loginHistory={mockLoginHistory}
                sessionCount={1} // Podrías traer esto de un endpoint si quisieras
                onCloseAllSessions={() => setIsCloseSessionsAlertOpen(true)}
              />

              <div className="rounded-lg border border-blue-100 bg-blue-50/50 p-4 flex gap-3 dark:bg-blue-900/10 dark:border-blue-900/30">
                <Lock className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                <div className="text-sm text-stone-600 dark:text-stone-300">
                  <p className="font-semibold text-blue-800 dark:text-blue-200 mb-1">
                    Recomendación de seguridad
                  </p>
                  <p>
                    Si notas actividad sospechosa, cambia tu contraseña
                    inmediatamente y cierra todas las sesiones activas.
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 flex flex-col gap-6">
              <ChangePasswordCard
                lastChanged="Desconocido"
                onChangePassword={() => setIsChangePasswordModalOpen(true)}
              />

              <TwoFactorCard
                // 🔥 CONECTADO AL ESTADO REAL DEL USUARIO
                isEnabled={!!user.two_factor_enabled}
                onEnable={() => setIsTwoFactorModalOpen(true)}
                onDisable={() => setIsDisable2FAAlertOpen(true)}
                onChangeMethod={() =>
                  requestPasswordVerification("change-method")
                }
                onChangeDevice={() =>
                  requestPasswordVerification("change-device")
                }
                onViewBackupCodes={() =>
                  requestPasswordVerification("view-backup-codes")
                }
              />
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* --- Modals & Global Alerts --- */}
      <ChangePasswordModal
        open={isChangePasswordModalOpen}
        onOpenChange={setIsChangePasswordModalOpen}
      />

      <TwoFactorSetupModal
        open={isTwoFactorModalOpen}
        onOpenChange={setIsTwoFactorModalOpen}
        onSuccess={handle2FASuccess}
      />

      <CloseSessionsAlert
        open={isCloseSessionsAlertOpen}
        onOpenChange={setIsCloseSessionsAlertOpen}
        sessionCount={1}
      />

      <Disable2FAAlert
        open={isDisable2FAAlertOpen}
        onOpenChange={setIsDisable2FAAlertOpen}
        onConfirm={handle2FADisable}
        isLoading={isDisabling2FA}
      />

      <VerifyPasswordModal
        open={isVerifyPasswordModalOpen}
        onOpenChange={setIsVerifyPasswordModalOpen}
        onVerified={handlePasswordVerified}
        actionType={pendingAction || "view-backup-codes"}
        isLoading={isVerifying}
      />

      <ViewBackupCodesModal
        open={isViewBackupCodesModalOpen}
        onOpenChange={setIsViewBackupCodesModalOpen}
      />
    </div>
  );
};