import { getStoredUserStatus, type User, type UserStatus } from "@entities/user";
import { formatDateTime } from "@shared/lib/formatters";
import { StatusBadge, type StatusBadgeTone } from "@shared/ui/status-badge";
import type { DataTableColumn } from "@shared/ui/data-table";

const userStatusToneByStatus: Record<UserStatus, StatusBadgeTone> = {
  active: "success",
  blacklisted: "danger",
  inactive: "neutral",
  pending: "warning"
};

function getStatusLabel(status: UserStatus) {
  return `${status.slice(0, 1).toUpperCase()}${status.slice(1)}`;
}

export const userColumns: DataTableColumn<User>[] = [
  {
    accessor: "organization",
    filterLabel: "Organization",
    header: "Organization",
    id: "organization",
    isFilterable: true,
    minWidth: "10rem"
  },
  {
    accessor: "username",
    filterLabel: "Username",
    header: "Username",
    id: "username",
    isFilterable: true,
    minWidth: "11rem"
  },
  {
    accessor: "email",
    filterLabel: "Email",
    header: "Email",
    id: "email",
    isFilterable: true,
    minWidth: "13rem"
  },
  {
    accessor: "phoneNumber",
    filterLabel: "Phone Number",
    header: "Phone Number",
    id: "phoneNumber",
    isFilterable: true,
    minWidth: "11rem"
  },
  {
    cell: (user) => formatDateTime(user.dateJoined),
    filterLabel: "Date Joined",
    header: "Date Joined",
    id: "dateJoined",
    isFilterable: true,
    minWidth: "13rem"
  },
  {
    cell: (user) => {
      const status = getStoredUserStatus(user.id, user.status);

      return (
        <StatusBadge tone={userStatusToneByStatus[status]}>
          {getStatusLabel(status)}
        </StatusBadge>
      );
    },
    filterLabel: "Status",
    header: "Status",
    id: "status",
    isFilterable: true,
    minWidth: "9rem"
  }
];
