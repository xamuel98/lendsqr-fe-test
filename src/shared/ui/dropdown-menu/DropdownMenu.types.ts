import type {
  ButtonHTMLAttributes,
  KeyboardEventHandler,
  MouseEventHandler,
  PointerEventHandler,
  ReactElement,
  ReactNode
} from "react";

export type DropdownMenuAlign = "start" | "end";
export type DropdownMenuItemTone = "default" | "danger";

export type DropdownMenuTriggerElementProps = {
  "aria-controls"?: string;
  "aria-expanded"?: boolean;
  "aria-haspopup"?: "menu";
  "data-state"?: "closed" | "open";
  onClick?: MouseEventHandler<HTMLElement>;
  onKeyDown?: KeyboardEventHandler<HTMLElement>;
  onPointerDown?: PointerEventHandler<HTMLElement>;
};

export type DropdownMenuTriggerProps = ButtonHTMLAttributes<HTMLButtonElement>;

export interface DropdownMenuProps {
  ariaLabel: string;
  children: ReactNode;
  className?: string | undefined;
  align?: DropdownMenuAlign;
  trigger: ReactElement<DropdownMenuTriggerElementProps>;
}

export interface DropdownMenuItemProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type"> {
  icon?: ReactNode;
  tone?: DropdownMenuItemTone;
}
