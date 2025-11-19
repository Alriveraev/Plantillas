import { createBrowserRouter, Navigate } from "react-router";
import { RootLayout, PublicLayout, PrivateLayout } from "@/layouts";
import { ProtectedRoute } from "./guards";
import { LoginPage, RegisterPage } from "@/features/auth";
import { DashboardPage } from "@/features/dashboard";
import { UsersPage, UserDetailPage } from "@/features/users";
import { ProfilePage } from "@/features/profile";
import { NotFound } from "@/shared/components";
import { PATHS } from "./paths";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />,
      },
      // Public routes
      {
        element: <PublicLayout />,
        children: [
          {
            path: PATHS.LOGIN,
            element: <LoginPage />,
          },
          {
            path: PATHS.REGISTER,
            element: <RegisterPage />,
          },
        ],
      },
      // Protected routes
      {
        element: <ProtectedRoute />,
        children: [
          {
            element: <PrivateLayout />,
            children: [
              {
                path: PATHS.DASHBOARD,
                element: <DashboardPage />,
              },
              {
                path: PATHS.USERS,
                element: <UsersPage />,
              },
              {
                path: "/users/:id",
                element: <UserDetailPage />,
              },
              {
                path: PATHS.PROFILE,
                element: <ProfilePage />,
              },
            ],
          },
        ],
      },
      // 404
      {
        path: PATHS.NOT_FOUND,
        element: <NotFound />,
      },
    ],
  },
]);
