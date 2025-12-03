import { LoginForm } from "../components";

export const LoginPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 w-full">
      <div className="w-full  space-y-4">
        <LoginForm />
      </div>
    </div>
  );
};

