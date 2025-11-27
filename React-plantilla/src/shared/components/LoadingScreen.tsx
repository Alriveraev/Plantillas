import { Loader2 } from "lucide-react";

export const LoadingScreen = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
        <p className="mt-4 text-sm text-muted-foreground">Cargando...</p>
      </div>
    </div>
  );
};
