import { routePaths } from "@app/router/routePaths";

import type { NavigationSection } from "./types";

export const navigationSections: NavigationSection[] = [
  {
    id: "customers",
    items: [
      {
        href: routePaths.users,
        icon: "users",
        label: "Users"
      },
      {
        href: routePaths.guarantors,
        icon: "guarantors",
        label: "Guarantors"
      },
      {
        href: routePaths.loans,
        icon: "loans",
        label: "Loans"
      },
      {
        href: routePaths.decisionModels,
        icon: "decision-models",
        label: "Decision Models"
      },
      {
        href: routePaths.savings,
        icon: "savings",
        label: "Savings"
      },
      {
        href: routePaths.loanRequests,
        icon: "loan-requests",
        label: "Loan Requests"
      },
      {
        href: routePaths.whitelist,
        icon: "whitelist",
        label: "Whitelist"
      },
      {
        href: routePaths.karma,
        icon: "karma",
        label: "Karma"
      }
    ],
    title: "Customers"
  },
  {
    id: "businesses",
    items: [
      {
        href: routePaths.organization,
        icon: "organization",
        label: "Organization"
      },
      {
        href: routePaths.loanProducts,
        icon: "loan-products",
        label: "Loan Products"
      },
      {
        href: routePaths.savingsProducts,
        icon: "savings-products",
        label: "Savings Products"
      },
      {
        href: routePaths.feesCharges,
        icon: "fees-charges",
        label: "Fees and Charges"
      },
      {
        href: routePaths.transactions,
        icon: "transactions",
        label: "Transactions"
      },
      {
        href: routePaths.services,
        icon: "services",
        label: "Services"
      },
      {
        href: routePaths.serviceAccount,
        icon: "service-account",
        label: "Service Account"
      },
      {
        href: routePaths.settlements,
        icon: "settlements",
        label: "Settlements"
      },
      {
        href: routePaths.reports,
        icon: "reports",
        label: "Reports"
      }
    ],
    title: "Businesses"
  },
  {
    id: "settings",
    items: [
      {
        href: routePaths.preferences,
        icon: "preferences",
        label: "Preferences"
      },
      {
        href: routePaths.feesPricing,
        icon: "fees-pricing",
        label: "Fees and Pricing"
      },
      {
        href: routePaths.auditLogs,
        icon: "audit-logs",
        label: "Audit Logs"
      },
      {
        href: routePaths.systemMessages,
        icon: "system-messages",
        label: "Systems Messages"
      }
    ],
    title: "Settings"
  }
];

export const dashboardNavigationItem = {
  end: true,
  href: routePaths.dashboard,
  icon: "dashboard" as const,
  label: "Dashboard"
};

export const organizationSwitcherItem = {
  href: routePaths.organization,
  icon: "switch-organization" as const,
  label: "Switch Organization"
};

export const logoutNavigationItem = {
  href: routePaths.login,
  icon: "logout" as const,
  label: "Logout"
};
