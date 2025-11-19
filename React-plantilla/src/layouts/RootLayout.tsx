import { Outlet } from "react-router";

export const RootLayout = () => {
  return (
    <div className="min-h-screen bg-background w-full">
      <Outlet />
    </div>
  );
};
