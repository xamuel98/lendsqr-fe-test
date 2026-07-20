import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { getUserDetails } from "./getUserDetails";

const userDetailsResponse = {
  accountNumber: 1,
  bankName: "Kuda Bank",
  bvn: "0706700004",
  children: "None",
  dateJoined: "2023-04-04",
  educationLevel: "B.Sc",
  email: "tosin004@lendora.com",
  employmentDuration: "2 years",
  employmentSector: "Health",
  employmentStatus: "Self-employed",
  fullName: "Tosin Dokunmu",
  gender: "Male",
  guarantors: {
    email: "debby@gmail.com",
    fullName: "Debby Ogana",
    id: "guarantor-4-1",
    phoneNumber: "07060780922",
    relationship: "Sister"
  },
  id: "user-0004",
  loanRepayment: 40000,
  maritalStatus: "Married",
  monthlyIncome: "N400,000.00 - N600,000.00",
  officeEmail: "tosin004@lendora.com",
  organization: "Lendora",
  phoneNumber: "07000000003",
  residenceType: "Parent's Apartment",
  social: {
    facebook: "https://facebook.com/tosin.dokunmu",
    instagram: "https://instagram.com/tosin_dokunmu",
    twitter: "https://twitter.com/tosin_dokunmu"
  },
  status: "active",
  tier: 1,
  userCode: "LSQF587004",
  username: "tosin004"
};

describe("getUserDetails", () => {
  const fetchMock = vi.fn();

  beforeEach(() => {
    vi.stubGlobal("fetch", fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    fetchMock.mockReset();
  });

  it("fetches the user detail endpoint and maps its response to the view model", async () => {
    fetchMock.mockResolvedValue(
      new Response(JSON.stringify(userDetailsResponse), { status: 200 })
    );
    const controller = new AbortController();

    await expect(
      getUserDetails({ signal: controller.signal, userId: "user-0004" })
    ).resolves.toMatchObject({
      accountNumber: "1",
      fullName: "Tosin Dokunmu",
      guarantors: [userDetailsResponse.guarantors],
      id: "user-0004",
      status: "active"
    });

    const requestUrl = fetchMock.mock.calls[0]?.[0] as URL | undefined;
    const requestOptions = fetchMock.mock.calls[0]?.[1] as RequestInit | undefined;
    const headers = new Headers(requestOptions?.headers);

    expect(requestUrl?.pathname).toBe("/users/user-0004.json");
    expect(requestUrl?.search).toBe("");
    expect(headers.get("X-API-Key")).toBeTruthy();
    expect(headers.get("Accept")).toBe("application/json");
    expect(requestOptions?.signal).toBe(controller.signal);
  });
});
