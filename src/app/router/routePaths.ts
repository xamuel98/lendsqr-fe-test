export const routePaths = {
  auditLogs: "/audit-logs",
  dashboard: "/dashboard",
  decisionModels: "/decision-models",
  feesCharges: "/fees-charges",
  feesPricing: "/fees-pricing",
  guarantors: "/guarantors",
  karma: "/karma",
  loanProducts: "/loan-products",
  loanRequests: "/loan-requests",
  loans: "/loans",
  login: "/login",
  organization: "/organization",
  preferences: "/preferences",
  reports: "/reports",
  savings: "/savings",
  savingsProducts: "/savings-products",
  serviceAccount: "/service-account",
  services: "/services",
  settlements: "/settlements",
  systemMessages: "/system-messages",
  transactions: "/transactions",
  users: "/users",
  userDetails: "/users/:userId",
  whitelist: "/whitelist"
} as const;

export const authenticatedPlaceholderPaths = [
  routePaths.dashboard,
  routePaths.guarantors,
  routePaths.loans,
  routePaths.decisionModels,
  routePaths.savings,
  routePaths.loanRequests,
  routePaths.whitelist,
  routePaths.karma,
  routePaths.organization,
  routePaths.loanProducts,
  routePaths.savingsProducts,
  routePaths.feesCharges,
  routePaths.transactions,
  routePaths.services,
  routePaths.serviceAccount,
  routePaths.settlements,
  routePaths.reports,
  routePaths.preferences,
  routePaths.feesPricing,
  routePaths.auditLogs,
  routePaths.systemMessages
] as const;

export function getUserDetailsPath(userId: string) {
  return `/users/${encodeURIComponent(userId)}`;
}
