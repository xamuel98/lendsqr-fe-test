import { useLocation, useNavigate } from "react-router-dom";

import type { User } from "@entities/user";
import { getUserStatusAction, useUserAccountStatus, useUserStatusAction } from "@features/user";
import { IEye, IThreeDots, IUserActivate, IUserDelete } from "@shared/assets/icons";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@shared/ui/dropdown-menu";

type UserRowActionsProps = {
  user: User;
};

export function UserRowActions({ user }: UserRowActionsProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { status } = useUserAccountStatus(user);
  const { requestUserStatusAction } = useUserStatusAction();
  const availableAction = status ? getUserStatusAction(status) : null;

  return (
    <DropdownMenu
      align="end"
      ariaLabel={`Actions for ${user.username}`}
      trigger={
        <DropdownMenuTrigger aria-label={`Open actions for ${user.username}`}>
          <IThreeDots aria-hidden="true" />
        </DropdownMenuTrigger>
      }
    >
      <DropdownMenuItem
        icon={<IEye />}
        onClick={() => {
          void navigate({
            pathname: `/users/${encodeURIComponent(user.id)}`,
            search: location.search
          });
        }}
      >
        View details
      </DropdownMenuItem>
      {availableAction === "blacklist" ? (
        <DropdownMenuItem
          icon={<IUserDelete />}
          onClick={() => {
            requestUserStatusAction({
              id: user.id,
              name: user.username,
              status: status ?? user.status
            });
          }}
        >
          Blacklist User
        </DropdownMenuItem>
      ) : null}
      {availableAction === "activate" ? (
        <DropdownMenuItem
          icon={<IUserActivate />}
          onClick={() => {
            requestUserStatusAction({
              id: user.id,
              name: user.username,
              status: status ?? user.status
            });
          }}
        >
          Activate User
        </DropdownMenuItem>
      ) : null}
    </DropdownMenu>
  );
}
