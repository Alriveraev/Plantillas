// @/shared/components/RouteErrorBoundary.tsx
import { useRouteError, useNavigate, isRouteErrorResponse } from "react-router";

export const RouteErrorBoundary = () => {
  const error = useRouteError();
  const navigate = useNavigate();

  let errorMessage: string;
  let errorStatus: number | undefined;

  if (isRouteErrorResponse(error)) {
    // Error de respuesta de ruta (404, 500, etc.)
    errorMessage =
      error.statusText || error.data?.message || "Error en la ruta";
    errorStatus = error.status;
  } else if (error instanceof Error) {
    // Error de JavaScript
    errorMessage = error.message;
  } else if (typeof error === "string") {
    errorMessage = error;
  } else {
    errorMessage = "Error desconocido";
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        {errorStatus && (
          <div className="text-6xl font-bold text-red-500 mb-4">
            {errorStatus}
          </div>
        )}
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          ¡Oops! Algo salió mal
        </h1>
        <p className="text-gray-600 mb-6">{errorMessage}</p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
          >
            Volver atrás
          </button>
          <button
            onClick={() => navigate("/")}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Ir al inicio
          </button>
        </div>
      </div>
    </div>
  );
};
