import { z } from "zod";

import { userStatuses } from "../../model/user.types";
import { userStatIds } from "../../model/userStats.types";

export const userSchema = z.object({
  dateJoined: z.string(),
  email: z.string().email(),
  id: z.string().min(1),
  organization: z.string().min(1),
  phoneNumber: z.string().min(1),
  status: z.enum(userStatuses),
  username: z.string().min(1)
});

export const paginatedUsersSchema = z.object({
  data: z.array(userSchema),
  limit: z.number().int().positive(),
  page: z.number().int().positive(),
  total: z.number().int().nonnegative()
});

export const userStatsSchema = z.array(
  z.object({
    id: z.enum(userStatIds),
    title: z.string().trim().min(1),
    value: z.number().finite().nonnegative()
  })
);

export const userOrganizationsSchema = z.array(
  z.object({
    id: z.string().trim().min(1),
    name: z.string().trim().min(1)
  })
);

export const userDetailsSchema = z.object({
  accountNumber: z.union([z.string(), z.number()]).transform(String),
  bankName: z.string().trim().min(1),
  bvn: z.string().trim().min(1),
  children: z.string().trim().min(1),
  dateJoined: z.string().trim().min(1),
  educationLevel: z.string().trim().min(1),
  email: z.string().email(),
  employmentDuration: z.string().trim().min(1),
  employmentSector: z.string().trim().min(1),
  employmentStatus: z.string().trim().min(1),
  fullName: z.string().trim().min(1),
  gender: z.string().trim().min(1),
  guarantors: z.object({
    email: z.string().email(),
    fullName: z.string().trim().min(1),
    id: z.string().trim().min(1),
    phoneNumber: z.string().trim().min(1),
    relationship: z.string().trim().min(1)
  }),
  id: z.string().trim().min(1),
  loanRepayment: z.union([z.number().finite(), z.string().trim().min(1)]),
  maritalStatus: z.string().trim().min(1),
  monthlyIncome: z.string().trim().min(1),
  officeEmail: z.string().email(),
  organization: z.string().trim().min(1),
  phoneNumber: z.string().trim().min(1),
  residenceType: z.string().trim().min(1),
  social: z.object({
    facebook: z.string().url(),
    instagram: z.string().url(),
    twitter: z.string().url()
  }),
  status: z.enum(userStatuses),
  tier: z.union([z.literal(1), z.literal(2), z.literal(3)]),
  userCode: z.string().trim().min(1),
  username: z.string().trim().min(1)
});

export type UserDetailsDto = z.infer<typeof userDetailsSchema>;
