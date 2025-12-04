import { useState } from "react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { UserRole } from "@/api/types/auth.types";

// Components
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

// UI Components
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// Icons
import { User, Shield, Fingerprint, Activity, Lock } from "lucide-react";

// --- HELPERS ---
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

const ROLE_LABELS: Record<string, string> = {
  [UserRole.ADMIN]: "Administrador",
  [UserRole.MODERATOR]: "Moderador",
  [UserRole.USER]: "Usuario",
  [UserRole.GUEST]: "Invitado",
};

type VerifyAction = "change-method" | "change-device" | "view-backup-codes";

export const ProfilePage = () => {
  const { user } = useAuth();

  // --- States ---
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

  const [pendingAction, setPendingAction] = useState<VerifyAction | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isDisabling2FA, setIsDisabling2FA] = useState(false);

  // --- Handlers ---
  const requestPasswordVerification = (action: VerifyAction) => {
    setPendingAction(action);
    setIsVerifyPasswordModalOpen(true);
  };

  const handlePasswordVerified = async () => {
    setIsVerifying(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsVerifying(false);
    setIsVerifyPasswordModalOpen(false);
    switch (pendingAction) {
      case "change-method":
      case "change-device":
        setIsTwoFactorModalOpen(true);
        toast.success("Identidad verificada");
        break;
      case "view-backup-codes":
        setIsViewBackupCodesModalOpen(true);
        break;
    }
    setPendingAction(null);
  };

  const handle2FASuccess = () => {
    toast.success("Doble factor activado correctamente");
    setIsTwoFactorModalOpen(false);
  };

  const handle2FADisable = async () => {
    setIsDisabling2FA(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsDisabling2FA(false);
    setIsDisable2FAAlertOpen(false);
    toast.success("2FA Desactivado");
  };

  if (!user) return null;

  return (
    <div className="space-y-6 p-4 pb-16 md:pb-16 animate-in fade-in duration-500 w-full mx-auto">
      {/* Header */}
      <div className="space-y-0.5">
        <h2 className="text-xl md:text-2xl font-bold tracking-tight text-stone-900 dark:text-stone-50">
          Configuración
        </h2>
        <p className="text-sm md:text-base text-muted-foreground">
          Administra la configuración de tu cuenta y seguridad.
        </p>
      </div>

      <Separator className="my-6" />

      {/* Main Layout */}
      <Tabs
        defaultValue="general"
        className="flex flex-col lg:flex-row lg:space-x-12 lg:space-y-0 space-y-8"
      >
        {/* Sidebar Nav */}
        <aside className="overflow-x-auto pb-2 lg:pb-0">
          <TabsList className="flex lg:flex-col w-full h-auto bg-transparent p-0 justify-start space-x-2 lg:space-x-0 lg:space-y-1 items-start">
            <TabsTrigger
              value="general"
              className={cn(
                "flex-1 lg:flex-none justify-center lg:justify-start px-4 py-2 text-left font-medium rounded-md transition-colors",
                "hover:bg-stone-100 hover:text-stone-900 dark:hover:bg-stone-800 dark:hover:text-stone-50",
                "data-[state=active]:bg-stone-100 data-[state=active]:text-teal-700 dark:data-[state=active]:bg-stone-800 dark:data-[state=active]:text-teal-400",
                "data-[state=active]:shadow-none border border-transparent data-[state=active]:border-stone-200 dark:data-[state=active]:border-stone-700 lg:border-none"
              )}
            >
              <User className="mr-2 h-4 w-4" />
              General
            </TabsTrigger>
            <TabsTrigger
              value="security"
              className={cn(
                "flex-1 lg:flex-none justify-center lg:justify-start px-4 py-2 text-left font-medium rounded-md transition-colors",
                "hover:bg-stone-100 hover:text-stone-900 dark:hover:bg-stone-800 dark:hover:text-stone-50",
                "data-[state=active]:bg-stone-100 data-[state=active]:text-teal-700 dark:data-[state=active]:bg-stone-800 dark:data-[state=active]:text-teal-400",
                "data-[state=active]:shadow-none border border-transparent data-[state=active]:border-stone-200 dark:data-[state=active]:border-stone-700 lg:border-none"
              )}
            >
              <Shield className="mr-2 h-4 w-4" />
              Seguridad
            </TabsTrigger>
          </TabsList>
        </aside>

        {/* Content Area */}
        <div className="flex-1 ">
          {" "}
          {/* Ancho máximo aumentado para este layout */}
          {/* === TAB GENERAL === */}
          <TabsContent value="general" className="space-y-6 mt-0">
            {/* ... (Sin cambios aquí, mantienes tu diseño de perfil actual) ... */}
            <div className="hidden md:block">
              <h3 className="text-lg font-medium">Perfil</h3>
              <p className="text-sm text-muted-foreground">
                Así es como te verán otros usuarios en la plataforma.
              </p>
              <Separator className="my-4" />
            </div>
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 py-4">
              <AvatarUpload currentAvatar={user.avatar} userName={user.name} />
              <div className="space-y-1 text-center sm:text-left">
                <div className="flex flex-col sm:flex-row items-center gap-2">
                  <h4 className="font-medium text-stone-900 dark:text-stone-100 text-lg sm:text-base">
                    {user.name}
                  </h4>
                  <Badge
                    variant="secondary"
                    className="text-xs font-normal bg-teal-50 text-teal-700 border-teal-200"
                  >
                    {ROLE_LABELS[user.role] || user.role}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground max-w-[250px] sm:max-w-none mx-auto sm:mx-0">
                  JPG, PNG o WEBP. Máximo 2MB.
                </p>
              </div>
            </div>
            <Separator className="md:hidden mb-6" />
            <ProfileForm user={user} />
          </TabsContent>
          {/* === TAB SEGURIDAD (NUEVO DISEÑO ASIMÉTRICO) === */}
          <TabsContent value="security" className="mt-0 space-y-6 ">
            <div className="hidden md:block">
              <h3 className="text-lg font-medium">Seguridad</h3>
              <p className="text-sm text-muted-foreground">
                Supervisa tus sesiones y refuerza la protección de tu cuenta.
              </p>
              <Separator className="my-4" />
            </div>

            {/* GRID PRINCIPAL: 2 Columnas Asimétricas (2/3 + 1/3) */}
            <div className="grid gap-6 xl:grid-cols-2">
              {/* COLUMNA IZQUIERDA (Principal - Actividad) */}
              <div className="lg:col-span-1 space-y-6 w-full">
                <div className="flex items-center gap-2 text-stone-500 ">
                  <Activity className="h-4 w-4" />
                  <h4 className="text-sm font-medium uppercase tracking-wider">
                    Monitor de Actividad
                  </h4>
                </div>
                {/* Nota informativa extra (Opcional) */}
                <div className="rounded-md bg-blue-50 p-4 text-sm text-blue-700 dark:bg-blue-900/20 dark:text-blue-300">
                  <p className="flex items-center gap-2 font-semibold">
                    <Shield className="h-4 w-4" />
                    ¿No reconoces una actividad?
                  </p>
                  <p className="mt-1 ml-6">
                    Cierra todas las sesiones inmediatamente y cambia tu
                    contraseña desde el panel lateral.
                  </p>
                </div>
                {/* Tarjeta de Actividad (Grande) */}
                <SecurityGeneralCard
                  lastLogin={user.updatedAt || "Reciente"}
                  loginHistory={mockLoginHistory}
                  sessionCount={1}
                  onCloseAllSessions={() => setIsCloseSessionsAlertOpen(true)}
                />
              </div>

              {/* COLUMNA DERECHA (Lateral - Credenciales) */}
              <div className="space-y-6 w-full lg:col-span-1">
                <div className="flex items-center gap-2 text-stone-500 ">
                  <Lock className="h-4 w-4" />
                  <h4 className="text-sm font-medium uppercase tracking-wider">
                    Credenciales
                  </h4>
                </div>

                {/* Stack de Acciones Vertical */}
                <div className="flex flex-col gap-4 ">
                  <ChangePasswordCard
                    lastChanged="Desconocido"
                    onChangePassword={() => setIsChangePasswordModalOpen(true)}
                  />

                  <div className="flex items-center gap-2 text-stone-500">
                    <Fingerprint className="h-4 w-4" />
                    <h4 className="text-sm font-medium uppercase tracking-wider">
                      Verificación en dos pasos
                    </h4>
                  </div>

                  <TwoFactorCard
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
            </div>
          </TabsContent>
        </div>
      </Tabs>

      {/* Modals */}
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
