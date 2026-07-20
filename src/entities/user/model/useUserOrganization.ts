import { useContext } from "react";

import { UserOrganizationContext } from "./userOrganizationContext";

export function useUserOrganization() {
  return useContext(UserOrganizationContext);
}
