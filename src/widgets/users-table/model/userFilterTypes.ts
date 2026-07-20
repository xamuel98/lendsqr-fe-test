import { z } from "zod";

import { userStatuses, type UserStatus } from "@entities/user";

export interface UserFilterValues {
  organization: string;
  username: string;
  email: string;
  dateJoined: string;
  phoneNumber: string;
  status: UserStatus | "";
}

export const emptyUserFilterValues: UserFilterValues = {
  organization: "",
  username: "",
  email: "",
  dateJoined: "",
  phoneNumber: "",
  status: ""
};

export const userFilterSchema: z.ZodType<UserFilterValues> = z.object({
  organization: z.string(),
  username: z.string(),
  email: z.string(),
  dateJoined: z.string(),
  phoneNumber: z.string(),
  status: z.union([z.literal(""), z.enum(userStatuses)])
});

export const columnToFilterField = {
  organization: "organization",
  username: "username",
  email: "email",
  phoneNumber: "phoneNumber",
  dateJoined: "dateJoined",
  status: "status"
} as const;

export type UserFilterField = (typeof columnToFilterField)[keyof typeof columnToFilterField];
