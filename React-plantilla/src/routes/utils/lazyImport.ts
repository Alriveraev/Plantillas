// @/router/utils/lazyImport.ts
import { lazy } from "react";
import type { ComponentType } from "react";

export function lazyImport<T extends ComponentType<unknown>>(
  factory: () => Promise<{ [key: string]: T }>,
  name: string
) {
  return lazy(() =>
    factory().then((module) => ({ default: module[name] as T }))
  );
}
