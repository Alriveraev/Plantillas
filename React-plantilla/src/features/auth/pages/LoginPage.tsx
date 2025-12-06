// features/auth/pages/LoginPage.tsx
import { LoginForm } from "../components/LoginForm";

export const LoginPage = () => {
  return (
    // Solo layout de alto nivel si es necesario, o fondo global
    <div className="min-h-screen flex items-center justify-center bg-gray-50 w-full">
      <div className="w-full h-full">
        <LoginForm />
      </div>
    </div>
  );
};