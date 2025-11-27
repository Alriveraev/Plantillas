// --- ENUMS & TYPES ---

export enum UserRole {
  ADMIN = "admin",
  USER = "user",
  MODERATOR = "moderator",
  GUEST = "guest",
}

// 🔥 Al ser dinámico, Permission es simplemente un string.
export type Permission = string;

// --- INTERFACES DE DOMINIO ---

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: UserRole;
  
  // El backend envía un array de strings, ej: ["users.view", "reports.create"]
  permissions: Permission[]; 

  createdAt: string;
  updatedAt: string;
}

// --- INTERFACES DE AUTH ---

export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  passwordConfirmation: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}