import { createPortal } from "react-dom";
import type { ReactNode } from "react";

type DialogPortalProps = {
  children: ReactNode;
  container?: Element | DocumentFragment | null | undefined;
};

export function DialogPortal({
  children,
  container = document.body
}: DialogPortalProps) {
  if (!container) {
    return null;
  }

  return createPortal(children, container);
}
