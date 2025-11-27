import { useState } from "react";
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
import { User, Shield, Lock } from "lucide-react";
import { toast } from "sonner";

// Mock data - en producción vendría de la API
const mockLoginHistory = [
  {
    id: "1",
    date: "Hoy",
    time: "14:32",
    browser: "Safari en macOS",
    location: "Madrid, ES",
  },
  {
    id: "2",
    date: "Ayer",
    time: "09:15",
    browser: "Chrome en Windows",
    location: "Barcelona, ES",
  },
  {
    id: "3",
    date: "Hace 3 días",
    time: "16:45",
    browser: "Chrome en macOS",
    location: "Madrid, ES",
  },
];

type VerifyAction = "change-method" | "change-device" | "view-backup-codes";

export const ProfilePage = () => {
  // --- States (Modales y Alertas) ---
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] =
    useState(false);
  const [isTwoFactorModalOpen, setIsTwoFactorModalOpen] = useState(false);
  const [isCloseSessionsAlertOpen, setIsCloseSessionsAlertOpen] =
    useState(false);
  const [isDisable2FAAlertOpen, setIsDisable2FAAlertOpen] = useState(false);
  const [isVerifyPasswordModalOpen, setIsVerifyPasswordModalOpen] =
    useState(false);
  const [isViewBackupCodesModalOpen, setIsViewBackupCodesModalOpen] =
    useState(false);

  // --- States (Lógica de Verificación) ---
  const [pendingAction, setPendingAction] = useState<VerifyAction | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  // --- States (Datos de Usuario / 2FA) ---
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [isDisabling2FA, setIsDisabling2FA] = useState(false);

  // Mock user
  const user = {
    name: "Juan Pérez",
    email: "juanper@gmail.com",
    role: "Administrador",
    avatar: "https://i.pravatar.cc/150?img=7",
    createdAt: "2023-01-15T10:00:00Z",
  };

  // --- Handlers ---

  const requestPasswordVerification = (action: VerifyAction) => {
    setPendingAction(action);
    setIsVerifyPasswordModalOpen(true);
  };

  const handlePasswordVerified = async () => {
    setIsVerifying(true);
    // Simular verificación backend
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsVerifying(false);
    setIsVerifyPasswordModalOpen(false);

    // Ejecutar acción pendiente
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

  const handle2FASuccess = () => {
    setIs2FAEnabled(true);
  };

  const handle2FADisable = async () => {
    setIsDisabling2FA(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsDisabling2FA(false);
    setIs2FAEnabled(false);
    setIsDisable2FAAlertOpen(false);
    toast.success("2FA Desactivado", {
      description: "Se ha eliminado la capa de seguridad extra.",
    });
  };

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

      <Tabs defaultValue="security" className="space-y-8">
        {/* --- Navigation Tabs (NUEVO DISEÑO TIPO PÍLDORA) --- */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <TabsList className="h-auto p-1.5 bg-stone-100 rounded-xl border border-stone-200 dark:bg-stone-900 dark:border-stone-800 w-full sm:w-auto grid grid-cols-2 sm:flex">
            <TabsTrigger
              value="general"
              className="flex-1 sm:flex-none px-6 py-2.5 rounded-lg text-sm font-medium text-stone-500 transition-all data-[state=active]:bg-white data-[state=active]:text-teal-700 data-[state=active]:shadow-sm hover:text-stone-700 dark:text-stone-400 dark:data-[state=active]:bg-stone-800 dark:data-[state=active]:text-teal-400 dark:hover:text-stone-200"
            >
              <div className="flex items-center justify-center gap-2.5">
                <User className="h-4 w-4" />
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
              <AvatarUpload currentAvatar={user.avatar} userName={user.name} />

              {/* Info Card pequeña */}
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
                      {user.role}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Columna Derecha (Formulario) - 8 cols */}
            <div className="lg:col-span-8">
              <Card className="border-stone-200 shadow-sm dark:border-stone-800">
                <CardHeader className="border-b border-stone-100 dark:border-stone-800 pb-4">
                  <CardTitle className="text-xl">
                    Información Personal
                  </CardTitle>
                  <CardDescription>
                    Esta información será visible para otros miembros del
                    equipo.
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
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
            {/* Columna Principal (Historial) - 7 cols */}
            <div className="lg:col-span-7 space-y-6">
              <SecurityGeneralCard
                lastLogin="Hoy a las 14:32 desde Madrid, ES"
                loginHistory={mockLoginHistory}
                sessionCount={3}
                onCloseAllSessions={() => setIsCloseSessionsAlertOpen(true)}
              />

              {/* Tip de seguridad */}
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

            {/* Columna Lateral (Credenciales) - 5 cols */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              <ChangePasswordCard
                lastChanged="Hace 45 días"
                onChangePassword={() => setIsChangePasswordModalOpen(true)}
              />

              <TwoFactorCard
                isEnabled={is2FAEnabled}
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
        sessionCount={3}
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
