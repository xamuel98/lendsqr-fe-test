import { useState } from "react";

import type { DataTablePopoverMotionMode } from "@shared/ui/data-table";

import { columnToFilterField } from "./userFilterTypes";

export function useUsersTableFilterPopover() {
  const [activeFilterColumnId, setActiveFilterColumnId] = useState<string | null>(
    null
  );
  const [filterAnchor, setFilterAnchor] = useState<HTMLElement | null>(null);
  const [filterMotionMode, setFilterMotionMode] =
    useState<DataTablePopoverMotionMode>("default");
  const focusField = activeFilterColumnId
    ? columnToFilterField[
        activeFilterColumnId as keyof typeof columnToFilterField
      ]
    : undefined;

  function closeFilters() {
    setActiveFilterColumnId(null);
    setFilterAnchor(null);
  }

  function handleFilterColumnChange(
    columnId: string | null,
    triggerElement?: HTMLElement,
    motionMode: DataTablePopoverMotionMode = "default"
  ) {
    setActiveFilterColumnId(columnId);
    setFilterAnchor(columnId ? (triggerElement ?? null) : null);
    setFilterMotionMode(motionMode);
  }

  return {
    activeFilterColumnId,
    closeFilters,
    filterAnchor,
    filterMotionMode,
    focusField,
    handleFilterColumnChange
  };
}
