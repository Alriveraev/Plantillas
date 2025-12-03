import { useState, useCallback, useEffect } from "react";
import { useFormik } from "formik";
import { useSearchParams, useNavigate, Link } from "react-router";
import { toFormikValidationSchema } from "@/shared/utils/formik-zod";
import {
  Loader2,
  AlertCircle,
  Lock,
  PawPrint,
  ArrowLeft,
  ShieldCheck,
  Sparkles,
  Check,
} from "lucide-react";
import { toast } from "sonner";
import { resetPasswordSchema } from "../schemas";
import { authService } from "@/features/auth/services/auth.service";

// UI Components
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/password-input";
import { FormError } from "@/shared/components/forms";
import { cn } from "@/lib/utils";

export const ResetPasswordForm = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Estados para la carga y validación inicial del token
  const [isVerifying, setIsVerifying] = useState(true);
  const [isTokenValid, setIsTokenValid] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

  // Capturamos token y email de la URL
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  // --- EFECTO: Verificar Token al montar ---
  useEffect(() => {
    // Si no hay params básicos, fallamos rápido sin llamar a la API
    if (!token || !email) {
      setIsVerifying(false);
      setIsTokenValid(false);
      return;
    }

    const verifyToken = async () => {
      try {
        // Llamada al endpoint de verificación del backend
        // Asegúrate de tener este método en tu authService
        await authService.verifyResetToken(token, email);
        setIsTokenValid(true);
      } catch {
        // Si el backend dice que es inválido (404/400) o expiró
        setIsTokenValid(false);
      } finally {
        setIsVerifying(false);
      }
    };

    verifyToken();
  }, [token, email]);

  const formik = useFormik({
    initialValues: {
      password: "",
      password_confirmation: "",
    },
    validate: toFormikValidationSchema(resetPasswordSchema),
    validateOnBlur: true,
    validateOnChange: true,
    onSubmit: async (values, { setSubmitting }) => {
      if (!isTokenValid) return;

      setServerError(null);
      try {
        await authService.resetPassword({
          token: token!,
          email: email!,
          password: values.password,
          password_confirmation: values.password_confirmation,
        });
        toast.success(
          "¡Contraseña actualizada! Inicia sesión con tus nuevas credenciales."
        );
        navigate("/login", {
          replace: true,
          state: {
            success:
              "¡Contraseña actualizada! Inicia sesión con tus nuevas credenciales.",
          },
        });
      } catch {
        // En caso raro de que fallara el reset final aunque la verificación previa pasara
        setServerError(
          "Ocurrió un error al restablecer la contraseña. Intenta nuevamente."
        );
      } finally {
        setSubmitting(false);
      }
    },
  });

  // --- LÓGICA DE GENERADOR DE CONTRASEÑA ---
  const generateSecurePassword = useCallback(() => {
    const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lowercase = "abcdefghijklmnopqrstuvwxyz";
    const numbers = "0123456789";
    const symbols = "!@#$%^&*()_+-=[]{}|;:,.<>?";

    let password = "";
    password += uppercase[Math.floor(Math.random() * uppercase.length)];
    password += lowercase[Math.floor(Math.random() * lowercase.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];
    password += symbols[Math.floor(Math.random() * symbols.length)];

    const allChars = uppercase + lowercase + numbers + symbols;
    for (let i = password.length; i < 16; i++) {
      password += allChars[Math.floor(Math.random() * allChars.length)];
    }

    password = password
      .split("")
      .sort(() => Math.random() - 0.5)
      .join("");

    formik.setFieldValue("password", password, true);
    formik.setFieldValue("password_confirmation", password, true);
    formik.touched.password = false;
    formik.touched.password_confirmation = false;
    formik.isSubmitting = true
    navigator.clipboard.writeText(password);
    toast.success("Contraseña generada y copiada al portapapeles");
    setShowPassword(true);
    setShowPasswordConfirm(true);
  }, [formik]);

  // --- VALIDACIONES VISUALES ---
  const checkRequirement = (regex: RegExp) =>
    regex.test(formik.values.password);
  const isLengthValid = formik.values.password.length >= 8;

  return (
    <div className="relative min-h-screen w-full flex flex-col lg:grid lg:grid-cols-2">
      {/* --- SECCIÓN 1: BRANDING --- */}
      <div className="relative flex h-40 flex-col justify-center bg-teal-900 p-8 text-white lg:h-full lg:justify-between lg:p-10">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-teal-900 to-teal-950 pointer-events-none" />

        <div className="relative z-10 flex items-center gap-2 text-xl font-bold tracking-tight justify-center lg:justify-start">
          <PawPrint className="h-7 w-7" />
          <span>VetCare Pro</span>
        </div>

        <div className="relative z-10 hidden max-w-md lg:block">
          <blockquote className="space-y-2">
            <p className="text-2xl font-medium leading-relaxed">
              "Tu seguridad es lo primero. Crea una nueva clave robusta y vuelve
              a gestionar tu clínica."
            </p>
          </blockquote>
        </div>

        <div className="relative z-10 hidden text-xs text-teal-400 lg:block">
          © 2025 VetCare System Inc.
        </div>
      </div>

      {/* --- SECCIÓN 2: FORMULARIO --- */}
      <div className="flex flex-1 items-center justify-center bg-teal-900 px-4 pb-12 pt-4 lg:bg-white lg:p-8 lg:pb-8 lg:pt-8">
        <div className="w-full max-w-[400px] rounded-xl bg-white p-6 shadow-2xl ring-1 ring-gray-900/5 lg:bg-transparent lg:p-0 lg:shadow-none lg:ring-0 min-h-[400px] flex flex-col justify-center">
          {/* ESTADO 1: VERIFICANDO (LOADING) */}
          {isVerifying ? (
            <div className="flex flex-col items-center justify-center space-y-4 animate-in fade-in">
              <Loader2 className="h-10 w-10 animate-spin text-teal-600" />
              <p className="text-sm font-medium text-muted-foreground">
                Verificando enlace...
              </p>
            </div>
          ) : !isTokenValid ? (
            /* ESTADO 2: TOKEN INVÁLIDO O EXPIRADO */
            <div className="text-center space-y-6 animate-in fade-in zoom-in-95">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                <AlertCircle className="h-8 w-8 text-red-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Enlace inválido
                </h1>
                <p className="mt-2 text-sm text-muted-foreground">
                  Este enlace de recuperación es incorrecto, ya fue utilizado o
                  ha expirado.
                </p>
              </div>
              <Button asChild className="w-full bg-teal-600 hover:bg-teal-700">
                <Link to="/forgot-password">Solicitar nuevo enlace</Link>
              </Button>
              <Button variant="ghost" asChild className="w-full">
                <Link to="/login">Volver al inicio</Link>
              </Button>
            </div>
          ) : (
            /* ESTADO 3: FORMULARIO VÁLIDO */
            <div className="animate-in fade-in slide-in-from-bottom-2">
              <div className="mb-6 flex flex-col space-y-2 text-center lg:text-left">
                <div className="mb-2 flex justify-center lg:justify-start">
                  <div className="rounded-lg bg-teal-50 p-2 text-teal-600 ring-1 ring-teal-100">
                    <ShieldCheck className="h-6 w-6" />
                  </div>
                </div>
                <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                  Restablecer contraseña
                </h1>
                <p className="text-sm text-muted-foreground">
                  Crea una contraseña única para proteger tu cuenta.
                </p>
              </div>

              <form onSubmit={formik.handleSubmit} className="space-y-5">
                {serverError && (
                  <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-3 text-red-800 animate-in fade-in slide-in-from-top-1">
                    <AlertCircle className="h-5 w-5 shrink-0 text-red-600 mt-0.5" />
                    <div className="text-sm font-medium">{serverError}</div>
                  </div>
                )}

                {/* Nueva Contraseña */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Nueva contraseña</Label>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-auto p-0 text-xs font-medium text-teal-600 hover:text-teal-700 hover:bg-transparent cursor-pointer"
                      onClick={generateSecurePassword}
                      disabled={formik.isSubmitting}
                    >
                      <Sparkles className="h-3 w-3 mr-1.5" />
                      Generar contraseña segura
                    </Button>
                  </div>

                  <div className="relative">
                    <div className="absolute left-3 top-3 text-muted-foreground z-10">
                      <Lock className="h-4 w-4" />
                    </div>
                    <PasswordInput
                      id="password"
                      placeholder="••••••••"
                      disabled={formik.isSubmitting}
                      showPassword={showPassword}
                      onTogglePassword={setShowPassword}
                      {...formik.getFieldProps("password")}
                      className={`pl-9 ${
                        formik.touched.password && formik.errors.password
                          ? "border-red-500 bg-red-50"
                          : ""
                      }`}
                    />
                  </div>
                  <FormError name="password" formik={formik} />
                </div>

                {/* Requisitos Visuales */}
                <div className="rounded-lg border bg-gray-50/50 p-3 space-y-2">
                  <div className="text-xs font-medium text-muted-foreground mb-2">
                    La contraseña debe contener:
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <RequirementItem
                      isValid={isLengthValid}
                      text="Mínimo 8 car."
                    />
                    <RequirementItem
                      isValid={checkRequirement(/[A-Z]/)}
                      text="Una mayúscula"
                    />
                    <RequirementItem
                      isValid={checkRequirement(/[a-z]/)}
                      text="Una minúscula"
                    />
                    <RequirementItem
                      isValid={checkRequirement(/\d/)}
                      text="Un número"
                    />
                  </div>
                </div>

                {/* Confirmar Contraseña */}
                <div className="space-y-2">
                  <Label htmlFor="password_confirmation">
                    Confirmar contraseña
                  </Label>
                  <div className="relative">
                    <div className="absolute left-3 top-3 text-muted-foreground z-10">
                      <Lock className="h-4 w-4" />
                    </div>
                    <PasswordInput
                      id="password_confirmation"
                      placeholder="••••••••"
                      disabled={formik.isSubmitting}
                      showPassword={showPasswordConfirm}
                      {...formik.getFieldProps("password_confirmation")}
                      className={`pl-9 ${
                        formik.touched.password_confirmation &&
                        formik.errors.password_confirmation
                          ? "border-red-500 bg-red-50"
                          : ""
                      }`}
                    />
                  </div>
                  <FormError name="password_confirmation" formik={formik} />
                </div>

                <Button
                  type="submit"
                  className="w-full h-11 bg-teal-600 hover:bg-teal-700 text-white shadow-sm mt-2"
                  disabled={formik.isSubmitting}
                >
                  {formik.isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Guardando cambios...
                    </>
                  ) : (
                    "Cambiar contraseña"
                  )}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <Link
                  to="/login"
                  className="flex items-center justify-center text-sm font-medium text-muted-foreground hover:text-teal-600 transition-colors"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" /> Cancelar
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Subcomponente local para los requisitos
const RequirementItem = ({
  isValid,
  text,
}: {
  isValid: boolean;
  text: string;
}) => (
  <div
    className={cn(
      "flex items-center text-xs transition-colors duration-200",
      isValid ? "text-emerald-600 font-medium" : "text-muted-foreground/70"
    )}
  >
    {isValid ? (
      <Check className="mr-1.5 h-3.5 w-3.5" />
    ) : (
      <div className="mr-1.5 h-3.5 w-3.5 rounded-full border border-muted-foreground/30" />
    )}
    {text}
  </div>
);
