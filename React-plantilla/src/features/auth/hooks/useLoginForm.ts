import { useState, useEffect } from "react";
import { useFormik } from "formik";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { toFormikValidationSchema } from "@/shared/utils/formik-zod";

// Imports de dominio
import { loginSchema, type LoginCredentials } from "../schemas";
import { useLogin } from "./useLogin";
import { useLogout } from "./useLogout";
import { authService } from "../services/auth.service";
import { useAuthStore } from "../store/authStore";

const TWO_FACTOR_FLAG = "auth_2fa_pending";

export const useLoginForm = () => {
  const navigate = useNavigate();
  const { setAuth, isAuthenticated } = useAuthStore(); // Traemos isAuthenticated

  // Hooks de API
  const { mutate: login, isPending: isLoginPending } = useLogin();
  const { mutateAsync: logout } = useLogout();

  // --- Estados Locales ---
  // Inicializamos leyendo localStorage para saber si recargó en el paso 2
  const [showTwoFactor, setShowTwoFactor] = useState(() => {
    return localStorage.getItem(TWO_FACTOR_FLAG) === "true";
  });

  const [otpCode, setOtpCode] = useState("");
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [isCanceling, setIsCanceling] = useState(false);

 
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, navigate]);


  // --- Manejador de Login (Paso 1) ---
  const formik = useFormik<LoginCredentials>({
    initialValues: {
      email: "",
      password: "",
      remember: false,
    },
    validate: toFormikValidationSchema(loginSchema),
    onSubmit: (values) => {
      login(
        { ...values, email: values.email.trim() },
        {
          onSuccess: (data: any) => {
            if (data.require_2fa) {
              localStorage.setItem(TWO_FACTOR_FLAG, "true");
              setShowTwoFactor(true);
              toast.info("Ingresa el código de tu autenticador.");
            }
            // Nota: Si el login es exitoso directo, el hook useLogin maneja la redirección
          },
          // Si el login falla por sesión sucia (419), el usuario simplemente
          // volverá a dar click y getCsrfCookie lo arreglará.
        }
      );
    },
  });

  // --- Manejador de OTP (Paso 2) ---
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode.length !== 6) return;

    setIsVerifyingOtp(true);
    try {
      const data: any = await authService.verify2FA({ code: otpCode });

      localStorage.removeItem(TWO_FACTOR_FLAG);
      toast.success("Verificación exitosa");

      if (data.user) setAuth(data.user);

      navigate("/dashboard");
    } catch (error: any) {
      const status = error.response?.status;
      const msg = error.response?.data?.message || "Código inválido";

      // Si la sesión expiró mientras escribía el código
      if (status === 401 || status === 419) {
        toast.error("Sesión expirada. Ingresa tus credenciales nuevamente.");
        handleForceReset(); // Resetea la vista
      } else {
        toast.error(msg);
        setOtpCode("");
      }
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  // --- Manejador de Cancelación (Botón "Volver") ---
  // AQUÍ SÍ hacemos logout, porque el usuario explícitamente quiere salir del flujo 2FA
  const handleCancelTwoFactor = async () => {
    setIsCanceling(true);
    try {
      await logout();
    } catch (error) {
      console.error(error);
    } finally {
      handleForceReset();
      setIsCanceling(false);
    }
  };

  // Helper privado
  const handleForceReset = () => {
    localStorage.removeItem(TWO_FACTOR_FLAG);
    setShowTwoFactor(false);
    setOtpCode("");
    formik.setFieldValue("password", "");
  };

  return {
    showTwoFactor,
    otpCode,
    setOtpCode,
    isLoginPending,
    isVerifyingOtp,
    isCanceling,
    formik,
    handleVerifyOtp,
    handleCancelTwoFactor,
  };
};
