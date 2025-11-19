import type { User } from "./auth.types";

export interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
  role: "admin" | "user";
}

export interface UpdateUserRequest {
  name?: string;
  email?: string;
  password?: string;
  role?: "admin" | "user";
}

export interface UserDetail extends User {
  lastLogin?: string;
  isActive: boolean;
}
