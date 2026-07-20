import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes, useLocation } from "react-router-dom";
import { afterEach, beforeEach, vi } from "vitest";

import { UserOrganizationContext } from "@entities/user";
import { UserStatusActionProvider } from "@app/providers";
import { ToastProvider } from "@shared/ui/toast";

import { ViewUserPage } from "./ViewUserPage";

type UserDetailResponse = {
  accountNumber: number | string;
  bankName: string;
  bvn: string;
  children: string;
  dateJoined: string;
  educationLevel: string;
  email: string;
  employmentDuration: string;
  employmentSector: string;
  employmentStatus: string;
  fullName: string;
  gender: string;
  guarantors: {
    email: string;
    fullName: string;
    id: string;
    phoneNumber: string;
    relationship: string;
  };
  id: string;
  loanRepayment: number;
  maritalStatus: string;
  monthlyIncome: string;
  officeEmail: string;
  organization: string;
  phoneNumber: string;
  residenceType: string;
  social: {
    facebook: string;
    instagram: string;
    twitter: string;
  };
  status: "active" | "blacklisted";
  tier: 1 | 2 | 3;
  userCode: string;
  username: string;
};

function createUserDetailsResponse(
  overrides: Partial<UserDetailResponse> = {}
): UserDetailResponse {
  return {
    accountNumber: "9912345678",
    bankName: "Providus Bank",
    bvn: "07060780922",
    children: "None",
    dateJoined: "2022-03-03",
    educationLevel: "B.Sc",
    email: "grace@lendsqr.com",
    employmentDuration: "2 years",
    employmentSector: "FinTech",
    employmentStatus: "Employed",
    fullName: "Grace Effiom",
    gender: "Female",
    guarantors: {
      email: "debby@gmail.com",
      fullName: "Debby Ogana",
      id: "guarantor-3-1",
      phoneNumber: "07060780922",
      relationship: "Sister"
    },
    id: "user-0003",
    loanRepayment: 40000,
    maritalStatus: "Single",
    monthlyIncome: "N200,000.00 - N400,000.00",
    officeEmail: "grace@lendsqr.com",
    organization: "Lendstar",
    phoneNumber: "07060780922",
    residenceType: "Parent's Apartment",
    social: {
      facebook: "https://facebook.com/grace.effiom",
      instagram: "https://instagram.com/grace_effiom",
      twitter: "https://twitter.com/grace_effiom"
    },
    status: "blacklisted",
    tier: 1,
    userCode: "LSQF587g90",
    username: "grace003",
    ...overrides
  };
}

const tosinDetails = createUserDetailsResponse({
  accountNumber: 1,
  bankName: "Kuda Bank",
  email: "tosin004@lendora.com",
  fullName: "Tosin Dokunmu",
  id: "user-0004",
  officeEmail: "tosin004@lendora.com",
  organization: "Lendora",
  phoneNumber: "07000000003",
  social: {
    facebook: "https://facebook.com/tosin.dokunmu",
    instagram: "https://instagram.com/tosin_dokunmu",
    twitter: "https://twitter.com/tosin_dokunmu"
  },
  status: "active",
  userCode: "LSQF587004",
  username: "tosin004"
});

function LocationProbe() {
  const location = useLocation();

  return <div data-location-probe>{location.search}</div>;
}

function renderPage(initialEntry = "/users/user-0003") {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false }
    }
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <UserOrganizationContext.Provider
        value={{
          activeOrganization: { id: "lendsqr", name: "Lendsqr" },
          selectOrganization: () => {}
        }}
      >
        <ToastProvider>
          <UserStatusActionProvider>
            <MemoryRouter initialEntries={[initialEntry]}>
              <Routes>
                <Route path="/users/:userId" element={<ViewUserPage />} />
                <Route path="/users" element={<p>Users route</p>} />
              </Routes>
              <LocationProbe />
            </MemoryRouter>
          </UserStatusActionProvider>
        </ToastProvider>
      </UserOrganizationContext.Provider>
    </QueryClientProvider>
  );
}

describe("ViewUserPage", () => {
  const fetchMock = vi.fn();

  beforeEach(() => {
    window.localStorage.clear();
    fetchMock.mockImplementation((input: URL | RequestInfo) => {
      const url =
        input instanceof URL
          ? input
          : typeof input === "string"
            ? new URL(input)
            : new URL(input.url);

      if (url.pathname === "/users/unknown-user.json") {
        return Promise.resolve(new Response(null, { status: 404 }));
      }

      return Promise.resolve(
        new Response(
          JSON.stringify(
            url.pathname === "/users/user-0004.json"
              ? tosinDetails
              : createUserDetailsResponse()
          ),
          { status: 200 }
        )
      );
    });
    vi.stubGlobal("fetch", fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    fetchMock.mockReset();
  });

  it("loads and renders the selected user's general details", async () => {
    renderPage();

    expect(screen.getByRole("status")).toHaveTextContent("Loading user details...");
    expect(document.querySelector("[data-view-user-skeleton='true']")).toBeInTheDocument();
    expect(await screen.findByRole("heading", { name: "Grace Effiom" })).toBeInTheDocument();
    expect(screen.getByText("Personal Information")).toBeInTheDocument();
    expect(screen.getByText("Education and Employment")).toBeInTheDocument();
    expect(screen.getAllByText("Debby Ogana").length).toBeGreaterThan(0);
    expect(fetchMock.mock.calls[0]?.[0]).toMatchObject({
      pathname: "/users/user-0003.json"
    });
  });

  it("maps social profiles to links that open in a new tab", async () => {
    renderPage();

    const twitterLink = await screen.findByRole("link", {
      name: "Twitter: @grace_effiom"
    });

    expect(twitterLink).toHaveAttribute(
      "href",
      "https://twitter.com/grace_effiom"
    );
    expect(twitterLink).toHaveAttribute("target", "_blank");
    expect(twitterLink).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("sets the active detail tab in the query string and uses the empty state", async () => {
    const user = userEvent.setup();
    renderPage("/users/user-0003?tab=documents");

    expect(await screen.findByRole("tab", { name: "Documents" })).toHaveAttribute(
      "aria-selected",
      "true"
    );
    expect(screen.getByRole("tabpanel")).toHaveTextContent(
      "No information is available for Documents."
    );

    await user.click(screen.getByRole("tab", { name: "Bank Details" }));

    expect(screen.getByRole("tab", { name: "Bank Details" })).toHaveAttribute(
      "aria-selected",
      "true"
    );
    expect(screen.getByRole("tabpanel")).toHaveTextContent(
      "No information is available for Bank Details."
    );
    expect(screen.getByText("?tab=bank")).toBeInTheDocument();
  });

  it("announces user actions", async () => {
    const user = userEvent.setup();
    renderPage();

    await user.click(await screen.findByRole("button", { name: "Activate User" }));
    const dialog = screen.getByRole("dialog", {
      name: "Activate Grace Effiom?"
    });

    expect(dialog).toHaveTextContent("This will restore access for Grace Effiom.");
    expect(within(dialog).getByText("Grace Effiom", { selector: "strong" })).toBeInTheDocument();
    const confirmButton = within(dialog).getByRole("button", {
      name: "Activate User"
    });

    await user.click(confirmButton);

    expect(confirmButton).toBeDisabled();
    expect(confirmButton).toHaveAttribute("aria-busy", "true");
    expect(await screen.findByText("Grace Effiom has been activated.")).toBeInTheDocument();
  });

  it("persists a confirmed account action and swaps the available action", async () => {
    const user = userEvent.setup();
    const page = renderPage("/users/user-0004");

    expect(await screen.findByRole("button", { name: "Blacklist User" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Activate User" })).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Blacklist User" }));
    const dialog = screen.getByRole("dialog", {
      name: "Blacklist Tosin Dokunmu?"
    });
    await user.click(within(dialog).getByRole("button", { name: "Blacklist User" }));

    expect(await screen.findByText("Tosin Dokunmu has been blacklisted.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Activate User" })).toBeInTheDocument();

    page.unmount();
    renderPage("/users/user-0004");

    expect(await screen.findByRole("button", { name: "Activate User" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Blacklist User" })).not.toBeInTheDocument();
  });

  it("offers a retry when the detail request fails", async () => {
    fetchMock
      .mockResolvedValueOnce(new Response(null, { status: 500 }))
      .mockResolvedValueOnce(
        new Response(JSON.stringify(createUserDetailsResponse()), { status: 200 })
      );
    const user = userEvent.setup();
    renderPage();

    expect(
      await screen.findByText("Unable to load data right now.")
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Try again" }));

    expect(await screen.findByRole("heading", { name: "Grace Effiom" })).toBeInTheDocument();
  });

  it("renders a helpful state for an unknown user", async () => {
    renderPage("/users/unknown-user");

    expect(
      await screen.findByText("The requested user could not be found.")
    ).toBeInTheDocument();
  });
});
