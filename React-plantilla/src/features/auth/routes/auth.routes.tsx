import { type RouteObject } from "react-router";
import { lazyImport } from "@/routes/utils/lazyImport";
import { ROUTE_PATHS } from "@/routes/paths";

// Lazy Loading
const LoginPage = lazyImport(() => import("../pages/LoginPage"), "LoginPage");
const RegisterPage = lazyImport(
  () => import("../pages/RegisterPage"),
  "RegisterPage"
);
const ForgotPasswordPage = lazyImport(
  () => import("../pages/ForgotPasswordPage"),
  "ForgotPasswordPage"
); 
const ResetPasswordPage = lazyImport(
  () => import("../pages/ResetPasswordPage"),
  "ResetPasswordPage"
); 

export const authRoutes: RouteObject[] = [
  {
    path: ROUTE_PATHS.LOGIN,
    element: <LoginPage />,
    handle: {
      title: "Iniciar Sesión",
      description: "Ingresa a tu cuenta",
      hideBreadcrumb: true,
      layout: "minimal",
    },
  },
  {
    path: ROUTE_PATHS.REGISTER,
    element: <RegisterPage />,
    handle: {
      title: "Registrarse",
      description: "Crea una nueva cuenta",
      hideBreadcrumb: true,
      layout: "minimal",
    },
  },
  {
    path: "forgot-password", // O usa una constante ROUTE_PATHS.FORGOT_PASSWORD
    element: <ForgotPasswordPage />,
    handle: {
      title: "Recuperar Contraseña",
      hideBreadcrumb: true,
      layout: "minimal",
    },
  },
  {
    path: "reset-password", // O usa una constante ROUTE_PATHS.RESET_PASSWORD
    element: <ResetPasswordPage />,
    handle: {
      title: "Restablecer Contraseña",
      hideBreadcrumb: true,
      layout: "minimal",
    },
  },
];
