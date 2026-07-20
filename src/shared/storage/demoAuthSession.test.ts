import { afterEach, describe, expect, it } from "vitest";

import {
  clearDemoAuthSession,
  createDemoAuthSession,
  getDemoAuthSession,
  hasDemoAuthSession,
  setDemoAuthSessionOrganization
} from "./demoAuthSession";
import { clearLocalStorage } from "./localStorage";

describe("demo auth session", () => {
  afterEach(() => {
    clearLocalStorage();
  });

  it("persists and clears the demo login session", () => {
    expect(hasDemoAuthSession()).toBe(false);

    createDemoAuthSession();

    expect(getDemoAuthSession()).toEqual({
      authenticated: true,
      email: "demo@lendsqr.com",
      organization: {
        id: "lendsqr",
        name: "Lendsqr"
      }
    });
    expect(hasDemoAuthSession()).toBe(true);

    clearDemoAuthSession();

    expect(hasDemoAuthSession()).toBe(false);
  });

  it("persists the organization selected after login", () => {
    createDemoAuthSession();

    setDemoAuthSessionOrganization({
      id: "irorun",
      name: "Irorun"
    });

    expect(getDemoAuthSession()?.organization).toEqual({
      id: "irorun",
      name: "Irorun"
    });
  });

  it("clears all persisted browser state", () => {
    createDemoAuthSession();
    window.localStorage.setItem("lendsqr.user-status-overrides", "{}");

    clearLocalStorage();

    expect(window.localStorage.length).toBe(0);
    expect(hasDemoAuthSession()).toBe(false);
  });
});
