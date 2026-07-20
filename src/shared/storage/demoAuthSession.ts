import { readLocalStorage, removeLocalStorage, writeLocalStorage } from "./localStorage";

export const demoAccountEmail = "demo@lendsqr.com";
export const defaultDemoOrganization = {
  id: "lendsqr",
  name: "Lendsqr"
} as const;

const demoAuthSessionKey = "lendsqr.demo-auth-session";

export type DemoOrganization = {
  id: string;
  name: string;
};

export type DemoAuthSession = {
  authenticated: true;
  email: typeof demoAccountEmail;
  organization: DemoOrganization;
};

type StoredDemoAuthSession = Omit<DemoAuthSession, "organization"> & {
  organization?: DemoOrganization | undefined;
};

function isDemoOrganization(value: unknown): value is DemoOrganization {
  return (
    typeof value === "object" &&
    value !== null &&
    "id" in value &&
    "name" in value &&
    typeof value.id === "string" &&
    value.id.trim().length > 0 &&
    typeof value.name === "string" &&
    value.name.trim().length > 0
  );
}

function isStoredDemoAuthSession(value: unknown): value is StoredDemoAuthSession {
  return (
    typeof value === "object" &&
    value !== null &&
    "authenticated" in value &&
    "email" in value &&
    value.authenticated === true &&
    value.email === demoAccountEmail
  );
}

export function createDemoAuthSession({
  organization = defaultDemoOrganization
}: {
  organization?: DemoOrganization | undefined;
} = {}) {
  writeLocalStorage<DemoAuthSession>(demoAuthSessionKey, {
    authenticated: true,
    email: demoAccountEmail,
    organization
  });
}

export function getDemoAuthSession() {
  const session = readLocalStorage<unknown>(demoAuthSessionKey);

  if (!isStoredDemoAuthSession(session)) {
    return undefined;
  }

  return {
    ...session,
    organization: isDemoOrganization(session.organization)
      ? session.organization
      : defaultDemoOrganization
  };
}

export function hasDemoAuthSession() {
  return Boolean(getDemoAuthSession());
}

export function clearDemoAuthSession() {
  removeLocalStorage(demoAuthSessionKey);
}

export function setDemoAuthSessionOrganization(organization: DemoOrganization) {
  const session = getDemoAuthSession();

  if (!session || !isDemoOrganization(organization)) {
    return;
  }

  writeLocalStorage<DemoAuthSession>(demoAuthSessionKey, {
    ...session,
    organization
  });
}
