import { demoAccountEmail, defaultDemoOrganization } from "@shared/storage";

export const demoLoginUser = {
  email: demoAccountEmail,
  name: "Adedeji",
  organization: defaultDemoOrganization
} as const;
