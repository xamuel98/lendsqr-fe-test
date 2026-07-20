import { ApiError, apiClient } from "@shared/api";
import { environment, getMockarooApiKey } from "@shared/config";
import { formatNumber } from "@shared/lib/formatters";

import type { UserDetailSection, UserDetails } from "../model/userDetails.types";
import { userDetailsSchema, type UserDetailsDto } from "./schemas/user.schemas";
import type { GetUserDetailsParams } from "./userApi.types";

function getSocialHandle(url: string) {
  try {
    const profile = new URL(url).pathname.split("/").filter(Boolean).at(-1);

    return profile ? `@${profile}` : url;
  } catch {
    return url;
  }
}

function formatLoanRepayment(value: UserDetailsDto["loanRepayment"]) {
  return typeof value === "number" ? formatNumber(value) : value;
}

function createGeneralDetails(user: UserDetailsDto): UserDetailSection[] {
  return [
    {
      fields: [
        { id: "full-name", label: "Full name", value: user.fullName },
        { id: "phone-number", label: "Phone number", value: user.phoneNumber },
        { id: "email-address", label: "Email address", value: user.email },
        { id: "bvn", label: "BVN", value: user.bvn },
        { id: "gender", label: "Gender", value: user.gender },
        { id: "marital-status", label: "Marital status", value: user.maritalStatus },
        { id: "children", label: "Children", value: user.children },
        { id: "residence", label: "Type of residence", value: user.residenceType }
      ],
      id: "personal-information",
      title: "Personal Information"
    },
    {
      fields: [
        { id: "education", label: "Level of education", value: user.educationLevel },
        { id: "employment", label: "Employment status", value: user.employmentStatus },
        { id: "sector", label: "Sector of employment", value: user.employmentSector },
        { id: "duration", label: "Duration of employment", value: user.employmentDuration },
        { id: "office-email", label: "Office email", value: user.officeEmail },
        { id: "monthly-income", label: "Monthly income", value: user.monthlyIncome },
        {
          id: "loan-repayment",
          label: "Loan repayment",
          value: formatLoanRepayment(user.loanRepayment)
        }
      ],
      id: "education-employment",
      title: "Education and Employment"
    },
    {
      fields: [
        {
          href: user.social.twitter,
          id: "twitter",
          label: "Twitter",
          value: getSocialHandle(user.social.twitter)
        },
        {
          href: user.social.facebook,
          id: "facebook",
          label: "Facebook",
          value: user.fullName
        },
        {
          href: user.social.instagram,
          id: "instagram",
          label: "Instagram",
          value: getSocialHandle(user.social.instagram)
        }
      ],
      id: "socials",
      title: "Socials"
    }
  ];
}

function mapUserDetails(user: UserDetailsDto): UserDetails {
  return {
    accountNumber: user.accountNumber,
    bankName: user.bankName,
    dateJoined: user.dateJoined,
    email: user.email,
    fullName: user.fullName,
    generalDetails: createGeneralDetails(user),
    guarantors: [user.guarantors],
    id: user.id,
    organization: user.organization,
    phoneNumber: user.phoneNumber,
    status: user.status,
    tier: user.tier,
    userCode: user.userCode,
    username: user.username
  };
}

export async function getUserDetails({
  signal,
  userId
}: GetUserDetailsParams): Promise<UserDetails> {
  const normalizedUserId = userId.trim();

  if (!normalizedUserId) {
    throw new ApiError({
      kind: "not-found",
      message: "The requested user could not be found."
    });
  }

  const url = new URL(
    `/users/${encodeURIComponent(normalizedUserId)}.json`,
    environment.mockarooBaseUrl
  );
  const response = await apiClient.get<unknown>(url, {
    headers: {
      "X-API-Key": getMockarooApiKey()
    },
    ...(signal ? { signal } : {})
  });
  const result = userDetailsSchema.safeParse(response);

  if (!result.success) {
    throw new ApiError({
      kind: "response",
      message: "Unable to load this user's details right now."
    });
  }

  return mapUserDetails(result.data);
}
