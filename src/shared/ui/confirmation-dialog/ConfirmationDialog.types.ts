import type { ButtonColor } from "@shared/ui/button";
import type { ReactNode } from "react";

export interface ConfirmationDialogProps {
  confirmLabel: string;
  description: ReactNode;
  isConfirming?: boolean;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  tone?: Extract<ButtonColor, "danger" | "primary">;
}
