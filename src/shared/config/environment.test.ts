import { describe, expect, it } from "vitest";

import { createEnvironment } from "./environment";

describe("createEnvironment", () => {
  it("removes trailing slashes from the Mockaroo base URL", () => {
    expect(
      createEnvironment({
        mockarooApiKey: "test-api-key",
        mockarooBaseUrl: "https://example.test///"
      })
    ).toEqual({
      mockarooApiKey: "test-api-key",
      mockarooBaseUrl: "https://example.test"
    });
  });

  it("fails clearly when required values are missing", () => {
    expect(() =>
      createEnvironment({ mockarooApiKey: "test-api-key" })
    ).toThrow("Missing VITE_MOCKAROO_BASE_URL environment variable.");
    expect(() =>
      createEnvironment({ mockarooBaseUrl: "https://example.test" })
    ).toThrow("Missing VITE_MOCKAROO_API_KEY environment variable.");
  });
});
