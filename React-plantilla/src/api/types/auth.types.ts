export const UserRole = {
  ADMIN: "admin",
  USER: "user",
  MODERATOR: "moderator",
  GUEST: "guest",
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export type Permission = string;

// --- INTERFACES DE DOMINIO ---

export interface UserProfile {
  // Campos adicionales del perfil que definimos en el backend
  first_name?: string;
  last_name?: string;
  full_name?: string;
  first_surname?: string;
  phone?: string;
  gender?: string;
  avatar?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: UserRole;
  role_name?: string;
  permissions: Permission[];

  profile?: UserProfile;
  two_factor_enabled?: boolean; // Vital para la UI de seguridad

  createdAt: string;
  updatedAt: string;
}

// --- INTERFACES DE AUTH ---

export interface LoginRequest {
  email: string;
  password: string;
  remember?: boolean; // Laravel usa 'remember', no 'rememberMe' por defecto
}

export type LoginCredentials = LoginRequest;

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  password_confirmation: string; // Laravel usa snake_case por defecto para confirmación
}

export interface AuthResponse {
  user: User;
  token?: string; // Opcional en modo SPA (Cookie)
  message?: string;
  require_2fa?: boolean; // Para manejar el flujo de 2FA
}

export type LoginResponse = AuthResponse;

export interface Verify2FAPayload {
  code: string;
}

export interface ResetPasswordRequest {
  token: string;
  email: string;
  password: string;
  password_confirmation: string;
}
