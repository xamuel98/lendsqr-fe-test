import type { User } from "./user.types";

export type UserDetailField = {
  href?: string;
  id: string;
  label: string;
  value: string;
};

export type UserDetailSection = {
  fields: UserDetailField[];
  id: string;
  title: string;
};

export type UserDetailTab = {
  id: string;
  label: string;
};

export type UserGuarantor = {
  email: string;
  fullName: string;
  id: string;
  phoneNumber: string;
  relationship: string;
};

export interface UserDetails extends User {
  accountNumber: string;
  bankName: string;
  fullName: string;
  generalDetails: UserDetailSection[];
  guarantors: UserGuarantor[];
  tier: 1 | 2 | 3;
  userCode: string;
}
