import { useState, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { Upload, Loader2 } from "lucide-react";
import { toast } from "sonner";

// Imports internos
import { useAuthStore } from "@/features/auth/store/authStore";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { profileService } from "@/features/profile/services/profile.service";

// UI Components
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

interface AvatarUploadProps {
  currentAvatar?: string;
  userName: string;
}

export const AvatarUpload = ({ currentAvatar, userName }: AvatarUploadProps) => {
  const [preview, setPreview] = useState<string | undefined>(currentAvatar);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Obtenemos el usuario actual para reenviar sus datos
  const { user } = useAuth(); 
  const { setAuth } = useAuthStore();

  const { mutate: uploadAvatar, isPending } = useMutation({
    mutationFn: (file: File) => {
      if (!user) throw new Error("No user found");
      return profileService.updateAvatar(file, user);
    },
    onSuccess: (data) => {
      setAuth(data.user);
      toast.success("Imagen actualizada", {
        description: "Tu foto de perfil se ha guardado correctamente.",
      });
    },
    onError: (error: any) => {
      setPreview(currentAvatar);
      toast.error("Error al subir imagen", {
        description: error.response?.data?.message || "No se pudo actualizar el avatar.",
      });
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Archivo muy grande", { description: "El tamaño máximo es 2MB." });
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      uploadAvatar(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // 🔥 CORRECCIÓN: Validación de seguridad para obtener la inicial
  // Si userName es undefined o null, usamos un fallback "?" o string vacío.
  const displayInitial = (userName || "?").charAt(0).toUpperCase();

  return (
    <div className="flex flex-col sm:flex-row items-center gap-6">
      {/* Avatar Visual */}
      <div className="relative group">
        <Avatar className="h-24 w-24 border-2 border-stone-100 dark:border-stone-800 shadow-sm">
          <AvatarImage src={preview} alt={userName || "Usuario"} className="object-cover" />
          <AvatarFallback className="text-2xl bg-stone-100 dark:bg-stone-800 text-stone-500">
            {displayInitial}
          </AvatarFallback>
        </Avatar>
        
        {/* Overlay de carga */}
        {isPending && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-full backdrop-blur-[1px]">
            <Loader2 className="h-6 w-6 text-white animate-spin" />
          </div>
        )}
      </div>

      {/* Controles */}
      <div className="flex flex-col items-center sm:items-start gap-2 text-center sm:text-left">
        <div className="space-y-1">
          <h3 className="font-medium text-stone-900 dark:text-stone-100">Foto de Perfil</h3>
          <p className="text-sm text-stone-500 dark:text-stone-400">
            JPG, PNG o WEBP. Máximo 2MB.
          </p>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          id="avatar-upload"
          accept="image/png, image/jpeg, image/webp"
          className="hidden"
          onChange={handleFileChange}
          disabled={isPending}
        />

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={triggerFileInput}
          disabled={isPending}
          className="mt-2"
        >
          {isPending ? (
            <>
              <Loader2 className="h-3.5 w-3.5 mr-2 animate-spin" />
              Subiendo...
            </>
          ) : (
            <>
              <Upload className="h-3.5 w-3.5 mr-2" />
              Cambiar Foto
            </>
          )}
        </Button>
      </div>
    </div>
  );
};