// @/shared/components/LazyLoad.tsx
import { Suspense, type ReactNode } from "react";
import { LoadingScreen } from "@/shared/components";
interface LazyLoadProps {
  children: ReactNode;
}

export const LazyLoad = ({ children }: LazyLoadProps) => {
  return <Suspense fallback={<LoadingScreen />}>{children}</Suspense>;
};
