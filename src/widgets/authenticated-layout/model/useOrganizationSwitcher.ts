import type { UserOrganization } from "@entities/user";
import { useUserOrganization } from "@entities/user";
import { useToast } from "@shared/ui/toast";

export function useOrganizationSwitcher() {
  const { showToast } = useToast();
  const organizationContext = useUserOrganization();
  const activeOrganization = organizationContext?.activeOrganization ?? null;

  function switchOrganization(organization: UserOrganization) {
    if (organization.id === activeOrganization?.id) {
      return;
    }

    organizationContext?.selectOrganization(organization);
    showToast({
      message: `Switched to ${organization.name}.`,
      tone: "success"
    });
  }

  return {
    activeOrganization,
    switchOrganization
  };
}
