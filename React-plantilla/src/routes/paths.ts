export const PATHS = {
  // Public
  LOGIN: "/login",
  REGISTER: "/register",

  // Private
  DASHBOARD: "/dashboard",
  USERS: "/users",
  USER_DETAIL: (id: string) => `/users/${id}`,
  PROFILE: "/profile",

  // Catch all
  NOT_FOUND: "*",
} as const;
