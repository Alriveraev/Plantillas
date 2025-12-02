import { api } from "@/api/client/axios.client";
import type { User } from "@/api/types/auth.types";

export interface UpdatePasswordData {
  current_password: string;
  password: string;
  password_confirmation: string;
}

export const profileService = {
  /**
   * Actualizar Avatar (y resto de datos requeridos por validación)
   * Enviamos todos los datos del perfil existente para pasar las reglas 'required' del backend.
   */
  updateAvatar: async (file: File, currentUser: User) => {
    const formData = new FormData();

    // 1. Datos obligatorios (Users Table)
    formData.append("email", currentUser.email);

    // 2. Datos del Perfil (Profile Table)
    // Mapeamos los datos existentes o usamos fallbacks seguros
    const p = (currentUser.profile as any) || {}; // Cast a any para flexibilidad si los tipos no están 100% sincro

    formData.append(
      "first_name",
      p.first_name || currentUser.name.split(" ")[0]
    );
    formData.append("second_name", p.second_name || "");
    formData.append("third_name", p.third_name || "");
    formData.append(
      "first_surname",
      p.first_surname || p.last_name || "Apellido"
    ); // Fallback para evitar error 422
    formData.append("second_surname", p.second_surname || "");
    formData.append("third_surname", p.third_surname || "");
    formData.append("phone", p.phone || "");

    if (p.gender_id) {
      formData.append("gender_id", p.gender_id);
    }

    // 3. El archivo
    formData.append("avatar", file);

    // 4. Método
    // Tu ruta es POST /user/profile/info, así que enviamos POST nativo.
    // Si usaras PUT en el backend para archivos, necesitarías formData.append("_method", "PUT");
    // pero con Route::post no es necesario.

    const { data } = await api.post<{ user: User; message: string }>(
      "/user/profile/info",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );

    return data;
  },

  /**
   * Actualizar Información de Texto
   * Ruta: POST /api/user/profile/info
   */
  updateInfo: async (data: Partial<User> & any) => {
    const { data: response } = await api.post<{ user: User; message: string }>(
      "/user/profile/info",
      data
    );
    return response;
  },

  /**
   * Actualizar Contraseña
   * Ruta: PUT /api/user/profile/password
   */
  updatePassword: async (data: UpdatePasswordData) => {
    const { data: response } = await api.put<{ message: string }>(
      "/user/profile/password",
      data
    );
    return response;
  },
};
