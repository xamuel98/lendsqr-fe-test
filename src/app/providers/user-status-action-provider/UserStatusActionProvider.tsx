import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { Outlet } from "react-router-dom";

import {
  getStoredUserStatus,
  storeUserStatus,
  type UserStatus
} from "@entities/user";
import {
  getUserStatusAction,
  UserStatusActionContext,
  type UserStatusAction,
  type UserStatusActionSubject
} from "@features/user";
import { ConfirmationDialog } from "@shared/ui/confirmation-dialog";
import { useToast } from "@shared/ui/toast";

const confirmationDelayMs = 700;

type PendingUserStatusAction = {
  action: UserStatusAction;
  subject: UserStatusActionSubject;
};

type UserStatusActionProviderProps = {
  children?: ReactNode | undefined;
};

function getNextStatus(action: UserStatusAction): UserStatus {
  return action === "blacklist" ? "blacklisted" : "active";
}

export function UserStatusActionProvider({
  children
}: UserStatusActionProviderProps) {
  const { showToast } = useToast();
  const [pendingAction, setPendingAction] =
    useState<PendingUserStatusAction | null>(null);
  const [isConfirming, setIsConfirming] = useState(false);
  const [statusRevision, setStatusRevision] = useState(0);
  const confirmationTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (confirmationTimerRef.current !== null) {
        window.clearTimeout(confirmationTimerRef.current);
      }
    };
  }, []);

  function requestUserStatusAction(subject: UserStatusActionSubject) {
    const currentStatus = getStoredUserStatus(subject.id, subject.status);
    const action = getUserStatusAction(currentStatus);

    if (!action) {
      return;
    }

    setPendingAction({ action, subject: { ...subject, status: currentStatus } });
  }

  function closeConfirmation() {
    if (!isConfirming) {
      setPendingAction(null);
    }
  }

  function confirmUserStatusAction() {
    if (!pendingAction || isConfirming) {
      return;
    }

    const { action, subject } = pendingAction;
    const nextStatus = getNextStatus(action);

    setIsConfirming(true);
    confirmationTimerRef.current = window.setTimeout(() => {
      storeUserStatus(subject.id, nextStatus);
      setStatusRevision((revision) => revision + 1);
      showToast({
        message:
          action === "blacklist"
            ? `${subject.name} has been blacklisted.`
            : `${subject.name} has been activated.`,
        tone: action === "blacklist" ? "error" : "success"
      });
      confirmationTimerRef.current = null;
      setIsConfirming(false);
      setPendingAction(null);
    }, confirmationDelayMs);
  }

  const isBlacklistAction = pendingAction?.action === "blacklist";
  const userName = pendingAction?.subject.name ?? "this user";

  return (
    <UserStatusActionContext.Provider
      value={{ requestUserStatusAction, statusRevision }}
    >
      {children ?? <Outlet />}
      <ConfirmationDialog
        confirmLabel={isBlacklistAction ? "Blacklist User" : "Activate User"}
        description={
          isBlacklistAction ? (
            <>
              This will prevent <strong>{userName}</strong> from accessing their
              account.
            </>
          ) : (
            <>
              This will restore access for <strong>{userName}</strong>.
            </>
          )
        }
        isConfirming={isConfirming}
        isOpen={pendingAction !== null}
        title={
          isBlacklistAction
            ? `Blacklist ${userName}?`
            : `Activate ${userName}?`
        }
        tone={isBlacklistAction ? "danger" : "primary"}
        onClose={closeConfirmation}
        onConfirm={confirmUserStatusAction}
      />
    </UserStatusActionContext.Provider>
  );
}
