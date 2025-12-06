// features/auth/components/LoginForm.tsx
import { Link } from "react-router";
import {
  Loader2,
  Mail,
  Lock,
  PawPrint,
  ArrowLeft,
  ShieldCheck,
} from "lucide-react";

// UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { FormError } from "@/shared/components/forms";
import { PasswordInput } from "@/components/password-input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { GoogleButton } from "./SocialButton";

// Hook de Lógica
import { useLoginForm } from "../hooks/useLoginForm";

export const LoginForm = () => {
  // 1. Consumimos la lógica (Clean Code: Separation of Concerns)
  const {
    showTwoFactor,
    otpCode,
    setOtpCode,
    isLoginPending,
    isVerifyingOtp,
    isCanceling,
    formik,
    handleVerifyOtp,
    handleCancelTwoFactor,
  } = useLoginForm();

  return (
    <div className="relative min-h-screen w-full flex flex-col lg:grid lg:grid-cols-2">
      {/* --- SECCIÓN BRANDING (Izquierda) --- */}
      <div className="relative flex h-40 flex-col justify-center bg-teal-900 p-8 text-white lg:h-full lg:justify-between lg:p-10">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-white via-teal-900 to-teal-950 pointer-events-none" />

        <div className="relative z-10 flex items-center gap-2 text-xl font-bold tracking-tight justify-center lg:justify-start">
          <PawPrint className="h-7 w-7" />
          <span>VetCare Pro</span>
        </div>

        <div className="relative z-10 hidden max-w-md lg:block">
          <blockquote className="space-y-2">
            <p className="text-2xl font-medium leading-relaxed">
              "Gestión clínica eficiente, pacientes más felices."
            </p>
          </blockquote>
        </div>

        <div className="relative z-10 hidden text-xs text-teal-400 lg:block">
          © 2025 VetCare System Inc.
        </div>
      </div>

      {/* --- SECCIÓN FORMULARIO (Derecha) --- */}
      <div className="flex flex-1 items-center justify-center bg-teal-900 px-4 pb-12 pt-4 lg:bg-white lg:p-8 lg:pb-8 lg:pt-8">
        <div className="w-full max-w-[400px] rounded-xl bg-white p-6 shadow-2xl ring-1 ring-gray-900/5 lg:bg-transparent lg:p-0 lg:shadow-none lg:ring-0">
          {!showTwoFactor ? (
            /* ================= VISTA LOGIN ================= */
            <>
              <div className="mb-6 flex flex-col space-y-2 text-center lg:text-left">
                <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                  Bienvenido
                </h1>
                <p className="text-sm text-muted-foreground">
                  Ingresa tus credenciales para acceder.
                </p>
              </div>

              <form onSubmit={formik.handleSubmit} className="space-y-4">
                <GoogleButton />

                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-gray-200" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-muted-foreground">
                      O usa tu email
                    </span>
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="sr-only">
                    Email
                  </Label>
                  <div className="relative">
                    <div className="absolute left-3 top-3 text-muted-foreground">
                      <Mail className="h-4 w-4" />
                    </div>
                    <Input
                      id="email"
                      type="email"
                      placeholder="nombre@ejemplo.com"
                      disabled={isLoginPending}
                      {...formik.getFieldProps("email")}
                      className={`pl-9 ${
                        formik.touched.email && formik.errors.email
                          ? "border-red-500 bg-red-50"
                          : ""
                      }`}
                    />
                  </div>
                  <FormError name="email" formik={formik} />
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <div className="relative">
                    <div className="absolute left-3 top-3 text-muted-foreground z-10">
                      <Lock className="h-4 w-4" />
                    </div>
                    <PasswordInput
                      id="password"
                      placeholder="Contraseña"
                      disabled={isLoginPending}
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

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="remember"
                      checked={formik.values.remember}
                      onCheckedChange={(c) =>
                        formik.setFieldValue("remember", c)
                      }
                      className="data-[state=checked]:bg-teal-600 border-gray-300"
                    />
                    <Label
                      htmlFor="remember"
                      className="text-sm font-normal cursor-pointer"
                    >
                      Recordarme
                    </Label>
                  </div>
                  <Link
                    to="/forgot-password"
                    className="text-sm font-medium text-teal-600 hover:underline"
                  >
                    ¿Olvidaste tu clave?
                  </Link>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-teal-600 hover:bg-teal-700 text-white"
                  disabled={isLoginPending}
                >
                  {isLoginPending ? (
                    <Loader2 className="animate-spin h-4 w-4" />
                  ) : (
                    "Iniciar Sesión"
                  )}
                </Button>
              </form>
            </>
          ) : (
            /* ================= VISTA 2FA ================= */
            <div className="animate-in fade-in slide-in-from-right-8 duration-300">
              <div className="mb-6 flex flex-col space-y-2 text-center items-center">
                <div className="h-12 w-12 rounded-full bg-teal-50 flex items-center justify-center text-teal-600 mb-2">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                  Verificación 2FA
                </h1>
                <p className="text-sm text-muted-foreground max-w-[280px]">
                  Introduce el código de 6 dígitos generado por tu aplicación.
                </p>
              </div>

              <form onSubmit={handleVerifyOtp} className="space-y-6">
                <div className="flex justify-center">
                  <InputOTP
                    maxLength={6}
                    value={otpCode}
                    onChange={(val) => setOtpCode(val)}
                    pattern={REGEXP_ONLY_DIGITS}
                    disabled={isVerifyingOtp || isCanceling}
                    autoFocus
                  >
                    <InputOTPGroup>
                      <InputOTPSlot index={0} className="h-12 w-10 text-lg" />
                      <InputOTPSlot index={1} className="h-12 w-10 text-lg" />
                      <InputOTPSlot index={2} className="h-12 w-10 text-lg" />
                    </InputOTPGroup>
                    <InputOTPSeparator />
                    <InputOTPGroup>
                      <InputOTPSlot index={3} className="h-12 w-10 text-lg" />
                      <InputOTPSlot index={4} className="h-12 w-10 text-lg" />
                      <InputOTPSlot index={5} className="h-12 w-10 text-lg" />
                    </InputOTPGroup>
                  </InputOTP>
                </div>

                <div className="space-y-3">
                  <Button
                    type="submit"
                    className="w-full bg-teal-600 hover:bg-teal-700 text-white"
                    disabled={
                      isVerifyingOtp || isCanceling || otpCode.length !== 6
                    }
                  >
                    {isVerifyingOtp ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="animate-spin h-4 w-4" />{" "}
                        Verificando...
                      </span>
                    ) : (
                      "Verificar"
                    )}
                  </Button>

                  <Button
                    type="button"
                    variant="ghost"
                    className="w-full text-stone-500 hover:text-stone-900"
                    onClick={handleCancelTwoFactor}
                    disabled={isVerifyingOtp || isCanceling}
                  >
                    {isCanceling ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="animate-spin h-4 w-4" />{" "}
                        Cancelando...
                      </span>
                    ) : (
                      <>
                        <ArrowLeft className="mr-2 h-4 w-4" /> Volver al Login
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
