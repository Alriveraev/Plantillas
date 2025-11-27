import { RouterProvider } from "react-router";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { queryClient } from "./config/queryClient";
import { router } from "./routes/router";
import { Toaster } from "./components/ui/sonner";
import { ErrorBoundary } from "./shared/components/ErrorBoundary";
import { ThemeProvider } from "@/components/theme-provider";

export const App = () => {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
          <Toaster position="top-right"  />
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </ErrorBoundary>
    </ThemeProvider>
  );
};
