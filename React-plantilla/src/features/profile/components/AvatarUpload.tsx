import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { profileApi } from "@/api/endpoints";
import { APP_CONSTANTS } from "@/config/constants";
import { useAuthStore } from "@/features/auth/store";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Upload } from "lucide-react";

interface AvatarUploadProps {
  currentAvatar?: string;
  userName: string;
}

export const AvatarUpload = ({
  currentAvatar,
  userName,
}: AvatarUploadProps) => {
  const [preview, setPreview] = useState<string | undefined>(currentAvatar);
  const queryClient = useQueryClient();
  const { updateUser } = useAuthStore();

  const { mutate: uploadAvatar, isPending } = useMutation({
    mutationFn: (file: File) => profileApi.uploadAvatar(file),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [APP_CONSTANTS.QUERY_KEYS.PROFILE],
      });
      updateUser({ avatar: data.url });
      setPreview(data.url);
      toast("Avatar actualizado", {
        description: "Tu foto de perfil ha sido actualizada.",
      });
    },
    onError: () => {
      toast.error("Error", {
        description: "No se pudo actualizar el avatar",
      });
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Upload
      uploadAvatar(file);
    }
  };

  return (
    <div className="flex items-center gap-4">
      <Avatar className="h-24 w-24">
        <AvatarImage src={preview} alt={userName} />
        <AvatarFallback className="text-2xl">
          {userName
            .split(" ")
            .map((n) => n[0])
            .join("")}
        </AvatarFallback>
      </Avatar>
      <div>
        <input
          type="file"
          id="avatar-upload"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
          disabled={isPending}
        />
        <Button
          type="button"
          variant="outline"
          onClick={() => document.getElementById("avatar-upload")?.click()}
          disabled={isPending}
        >
          <Upload className="h-4 w-4 mr-2" />
          {isPending ? "Subiendo..." : "Cambiar Avatar"}
        </Button>
        <p className="text-sm text-muted-foreground mt-2">
          JPG, PNG o GIF. Máximo 2MB.
        </p>
      </div>
    </div>
  );
};
