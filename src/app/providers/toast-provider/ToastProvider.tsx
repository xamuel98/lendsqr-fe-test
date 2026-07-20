import type { ReactNode } from "react";

import { ToastProvider as SharedToastProvider } from "@shared/ui/toast";

type AppToastProviderProps = {
  children: ReactNode;
};

export function ToastProvider({ children }: AppToastProviderProps) {
  return <SharedToastProvider>{children}</SharedToastProvider>;
}
