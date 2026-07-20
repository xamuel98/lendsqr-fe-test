export type NavigationIconKey =
  | "dashboard"
  | "users"
  | "guarantors"
  | "loans"
  | "decision-models"
  | "savings"
  | "loan-requests"
  | "whitelist"
  | "karma"
  | "organization"
  | "loan-products"
  | "savings-products"
  | "fees-charges"
  | "transactions"
  | "services"
  | "service-account"
  | "settlements"
  | "reports"
  | "preferences"
  | "fees-pricing"
  | "audit-logs"
  | "system-messages"
  | "switch-organization"
  | "logout";

export type NavigationItem = {
  end?: boolean | undefined;
  href: string;
  icon: NavigationIconKey;
  label: string;
};

export type NavigationSection = {
  id: string;
  items: NavigationItem[];
  title: string;
};
