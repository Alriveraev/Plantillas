export const APP_CONSTANTS = {
  TOKEN_KEY: "auth_token",
  USER_KEY: "user_data",
  REMEMBER_ME_KEY: "remember_me",
  THEME_KEY: "theme",

  // Pagination
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100],

  // Timeouts
  REQUEST_TIMEOUT: 30000, // 30 seconds
  DEBOUNCE_DELAY: 300, // 300ms

  // Query keys
  QUERY_KEYS: {
    AUTH: "auth",
    USERS: "users",
    USER: "user",
    PROFILE: "profile",
    DASHBOARD: "dashboard",
  },
} as const;

export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  DASHBOARD: "/dashboard",
  USERS: "/users",
  USER_DETAIL: "/users/:id",
  PROFILE: "/profile",
  NOT_FOUND: "*",
} as const;
