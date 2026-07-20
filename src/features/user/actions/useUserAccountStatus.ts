import { useState } from "react";

import {
  getStoredUserStatus,
  storeUserStatus,
  type User,
  type UserStatus
} from "@entities/user";

import { useUserStatusAction } from "./useUserStatusAction";

type UserStatusSubject = Pick<User, "id" | "status"> | undefined;

export function useUserAccountStatus(user: UserStatusSubject) {
  const { statusRevision } = useUserStatusAction();
  const [localRevision, setLocalRevision] = useState(0);
  const status = user ? getStoredUserStatus(user.id, user.status) : undefined;

  function updateStatus(nextStatus: UserStatus) {
    if (!user) {
      return;
    }

    storeUserStatus(user.id, nextStatus);
    setLocalRevision((revision) => revision + 1);
  }

  return { status, statusRevision: statusRevision + localRevision, updateStatus };
}
