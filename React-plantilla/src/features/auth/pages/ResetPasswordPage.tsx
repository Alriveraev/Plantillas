import { ResetPasswordForm } from "../components/ResetPasswordForm";

// Es vital que sea 'export const' con el mismo nombre que usaste en lazyImport
export const ResetPasswordPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 w-full">
      <div className="w-full max-w-md space-y-4">
        <ResetPasswordForm />
      </div>
    </div>
  );
};
