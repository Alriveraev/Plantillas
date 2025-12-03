import { ResetPasswordForm } from "../components/ResetPasswordForm";

// Es vital que sea 'export const' con el mismo nombre que usaste en lazyImport
export const ResetPasswordPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 w-full">
      <div className="w-full  space-y-4">
        <ResetPasswordForm />
      </div>
    </div>
  );
};
