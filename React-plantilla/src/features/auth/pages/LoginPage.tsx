import { Link } from "react-router";
import { LoginForm } from "../components";

export const LoginPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 w-full">
      <div className="w-full max-w-md space-y-4">
        <LoginForm />
        <p className="text-center text-sm text-gray-600">
          ¿No tienes una cuenta?{" "}
          <Link
            to="/register"
            className="text-primary font-medium hover:underline"
          >
            Regístrate aquí
          </Link>
        </p>
      </div>
    </div>
  );
};

