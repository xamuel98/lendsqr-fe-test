import { QueryProvider } from "@app/providers/query-provider";
import { AppRouterProvider } from "@app/providers/router-provider";
import { ToastProvider } from "@app/providers/toast-provider";

export function App() {
  return (
    <QueryProvider>
      <ToastProvider>
        <AppRouterProvider />
      </ToastProvider>
    </QueryProvider>
  );
}
