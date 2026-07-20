import { useContext } from "react";

import { UserStatusActionContext } from "./userStatusActionContext";

export function useUserStatusAction() {
  const context = useContext(UserStatusActionContext);

  if (!context) {
    throw new Error(
      "useUserStatusAction must be used inside UserStatusActionProvider."
    );
  }

  return context;
}
