import type { ReactElement } from "react";

import {
  INpLoan,
  INpMoney,
  INpUsersOne,
  INpUsersTwo
} from "@shared/assets/icons";
import type { UserStatIconKey } from "@pages/users/model/userStats";

const userStatIcons: Record<UserStatIconKey, ReactElement> = {
  "active-users": <INpUsersTwo />,
  users: <INpUsersOne />,
  "users-with-loans": <INpLoan />,
  "users-with-savings": <INpMoney />
};

export function getUserStatIcon(icon: UserStatIconKey) {
  return userStatIcons[icon];
}
