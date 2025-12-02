import type { User, UserRole } from "./auth.types";

export interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
  role: UserRole; 
}

export interface UpdateUserRequest {
  name?: string;
  email?: string;
  password?: string;
  role?: UserRole;
}

export interface UserDetail extends User {
  lastLogin?: string;
  isActive: boolean;
}