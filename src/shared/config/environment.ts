type EnvironmentInput = {
  mockarooApiKey?: string;
  mockarooBaseUrl?: string;
};

function getRequiredValue(value: string | undefined, name: string) {
  const trimmedValue = value?.trim();

  if (!trimmedValue) {
    throw new Error(`Missing ${name} environment variable.`);
  }

  return trimmedValue;
}

export function createEnvironment({
  mockarooApiKey,
  mockarooBaseUrl
}: EnvironmentInput) {
  return {
    mockarooApiKey: getRequiredValue(
      mockarooApiKey,
      "VITE_MOCKAROO_API_KEY"
    ),
    mockarooBaseUrl: getRequiredValue(
      mockarooBaseUrl,
      "VITE_MOCKAROO_BASE_URL"
    ).replace(/\/+$/, "")
  } as const;
}

const configuredEnvironment = createEnvironment({
  mockarooApiKey: import.meta.env.VITE_MOCKAROO_API_KEY,
  mockarooBaseUrl: import.meta.env.VITE_MOCKAROO_BASE_URL
});

export const environment = {
  mockarooBaseUrl: configuredEnvironment.mockarooBaseUrl
} as const;

export function getMockarooApiKey() {
  return configuredEnvironment.mockarooApiKey;
}
