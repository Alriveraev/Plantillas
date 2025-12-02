import { ForgotPasswordForm } from "../components/ForgotPasswordForm";

export const ForgotPasswordPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 w-full">
      <div className="w-full max-w-md space-y-4">
        <ForgotPasswordForm />
      </div>
    </div>
  );
};
