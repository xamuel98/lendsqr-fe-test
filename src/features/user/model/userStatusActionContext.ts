import { createContext } from "react";

import type { UserStatusActionSubject } from "./userStatusAction.types";

export type UserStatusActionContextValue = {
  requestUserStatusAction: (subject: UserStatusActionSubject) => void;
  statusRevision: number;
};

export const UserStatusActionContext =
  createContext<UserStatusActionContextValue | null>(null);
