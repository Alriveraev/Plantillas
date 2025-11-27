import { useNavigate } from "react-router";

export const ForbiddenPage = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold text-red-600">403</h1>
      <p className="text-xl mt-2">No tienes permiso para ver esta página.</p>
      <button 
        onClick={() => navigate("/dashboard")}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
      >
        Volver al Dashboard
      </button>
    </div>
  );
};