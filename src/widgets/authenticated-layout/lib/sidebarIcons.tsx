import {
  IBadgePercent,
  IBank,
  IBriefcase,
  IChartBar,
  IClipboardList,
  ICoins,
  IGalaxy,
  IHandshake,
  IHome,
  ILoanRequests,
  IMoneySack,
  IPiggyBank,
  IScroll,
  ISignOut,
  ISlidersH,
  ITire,
  ITransactions,
  IUserCheck,
  IUserCog,
  IUserFriends,
  IUserGroup,
  IUserTimes
} from "@shared/assets/icons";
import type { NavigationIconKey } from "@widgets/authenticated-layout/model/types";

export function SidebarIcon({ icon }: { icon: NavigationIconKey }) {
  switch (icon) {
    case "switch-organization":
    case "organization":
      return <IBriefcase />;
    case "dashboard":
      return <IHome />;
    case "users":
      return <IUserFriends />;
    case "guarantors":
      return <IUserGroup />;
    case "whitelist":
      return <IUserCheck />;
    case "karma":
      return <IUserTimes />;
    case "service-account":
      return <IUserCog />;
    case "loans":
      return <IMoneySack />;
    case "loan-requests":
    case "loan-products":
      return <ILoanRequests />;
    case "decision-models":
      return <IHandshake />;
    case "preferences":
      return <ISlidersH />;
    case "fees-pricing":
      return <IBadgePercent />;
    case "system-messages":
      return <ITire />;
    case "savings":
      return <IPiggyBank />;
    case "savings-products":
      return <IBank />;
    case "fees-charges":
      return <ICoins />;
    case "transactions":
      return <ITransactions />;
    case "services":
      return <IGalaxy />;
    case "settlements":
      return <IScroll />;
    case "reports":
      return <IChartBar />;
    case "audit-logs":
      return <IClipboardList />;
    case "logout":
      return <ISignOut />;
    default:
      return <IUserFriends />;
  }
}
