import { mockUsers } from "./mockUsers";
import type {
  UserDetailSection,
  UserDetails,
  UserGuarantor
} from "./userDetails.types";

const fullNames = [
  "Adedeji Akinyomiwa",
  "Debby Ogana",
  "Grace Effiom",
  "Tosin Dokunmu",
  "Chiamaka Okafor",
  "Emeka Nwosu",
  "Aisha Bello",
  "Tunde Adekunle"
] as const;

function getUserIndex(userId: string) {
  const userIndex = mockUsers.findIndex((user) => user.id === userId);

  return userIndex >= 0 ? userIndex : undefined;
}

function createGuarantors(fullName: string, phoneNumber: string): UserGuarantor[] {
  const firstName = fullName.split(" ")[0] ?? "User";

  return [
    {
      email: "debby@gmail.com",
      fullName: "Debby Ogana",
      id: "guarantor-debby-ogana",
      phoneNumber,
      relationship: "Sister"
    },
    {
      email: `${firstName.toLowerCase()}.guarantor@gmail.com`,
      fullName: "Tosin Dokunmu",
      id: "guarantor-tosin-dokunmu",
      phoneNumber: "07003309226",
      relationship: "Friend"
    }
  ];
}

function createGeneralDetails(fullName: string, phoneNumber: string): UserDetailSection[] {
  return [
    {
      fields: [
        { id: "full-name", label: "Full name", value: fullName },
        { id: "phone-number", label: "Phone number", value: phoneNumber },
        { id: "email-address", label: "Email address", value: "grace@gmail.com" },
        { id: "bvn", label: "BVN", value: "07060780922" },
        { id: "gender", label: "Gender", value: "Female" },
        { id: "marital-status", label: "Marital status", value: "Single" },
        { id: "children", label: "Children", value: "None" },
        {
          id: "residence",
          label: "Type of residence",
          value: "Parent's Apartment"
        }
      ],
      id: "personal-information",
      title: "Personal Information"
    },
    {
      fields: [
        { id: "education", label: "Level of education", value: "B.Sc" },
        { id: "employment", label: "Employment status", value: "Employed" },
        { id: "sector", label: "Sector of employment", value: "FinTech" },
        { id: "duration", label: "Duration of employment", value: "2 years" },
        { id: "office-email", label: "Office email", value: "grace@lendsqr.com" },
        {
          id: "monthly-income",
          label: "Monthly income",
          value: "N200,000.00 - N400,000.00"
        },
        { id: "loan-repayment", label: "Loan repayment", value: "40,000" }
      ],
      id: "education-employment",
      title: "Education and Employment"
    },
    {
      fields: [
        {
          href: "https://twitter.com/grace_effiom",
          id: "twitter",
          label: "Twitter",
          value: "@grace_effiom"
        },
        {
          href: "https://www.facebook.com/grace.effiom",
          id: "facebook",
          label: "Facebook",
          value: fullName
        },
        {
          href: "https://www.instagram.com/grace_effiom/",
          id: "instagram",
          label: "Instagram",
          value: "@grace_effiom"
        }
      ],
      id: "socials",
      title: "Socials"
    }
  ];
}

export function getMockUserDetails(userId: string | undefined): UserDetails | undefined {
  if (!userId) {
    return undefined;
  }

  const userIndex = getUserIndex(userId);

  if (userIndex === undefined) {
    return undefined;
  }

  const user = mockUsers[userIndex];

  if (!user) {
    return undefined;
  }

  const fullName = fullNames[userIndex % fullNames.length] ?? "Lendsqr User";

  return {
    ...user,
    accountNumber: "9912345678",
    bankName: "Providus Bank",
    fullName,
    generalDetails: createGeneralDetails(fullName, user.phoneNumber),
    guarantors: createGuarantors(fullName, user.phoneNumber),
    tier: 1,
    userCode: "LSQF587g90"
  };
}
