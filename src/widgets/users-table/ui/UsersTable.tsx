import type { User } from "@entities/user";
import { useUserStatusAction } from "@features/user";
import { Button } from "@shared/ui/button";
import { DataTable, DataTableFilterPopover } from "@shared/ui/data-table";

import {
  userColumns,
  useUsersTableFilterPopover,
  useUsersTableState
} from "../model";
import { UserRowActions } from "./UserRowActions";
import { UsersFilterForm } from "./UsersFilterForm";

const filterPopoverId = "users-table-filter";

export function UsersTable() {
  const { statusRevision } = useUserStatusAction();
  const {
    activeFilterColumnId,
    closeFilters,
    filterAnchor,
    filterMotionMode,
    focusField,
    handleFilterColumnChange
  } = useUsersTableFilterPopover();
  const {
    applyFilters,
    filters,
    hasActiveFilters,
    isError,
    isFetching,
    isLoading,
    isRetrying,
    organizations,
    page,
    pageSize,
    pageSizeOptions,
    records,
    resetFilters,
    retryUsers,
    setPage,
    setPageSize,
    totalRecords,
    error
  } = useUsersTableState();
  return (
    <div data-user-status-revision={statusRevision}>
      <DataTable<User>
        activeFilterColumnId={activeFilterColumnId}
        columns={userColumns}
        filterPopoverId={filterPopoverId}
        getRowId={(user) => user.id}
        hasActiveFilters={hasActiveFilters}
        isError={isError}
        isFetching={isFetching && !isLoading}
        isLoading={isLoading}
        isRetrying={isRetrying}
        noResultsAction={
          <Button color="secondary" variant="outline" onClick={resetFilters}>
            Reset filters
          </Button>
        }
        noResultsState="No users match the applied filters."
        onRetry={retryUsers}
        errorState={error?.message ?? "Unable to load users right now."}
        pagination={{
          onPageChange: setPage,
          onPageSizeChange: setPageSize,
          page,
          pageSize,
          pageSizeOptions,
          totalRecords
        }}
        records={records}
        renderRowActions={(user) => <UserRowActions user={user} />}
        tableLabel="Users"
        onFilterColumnChange={handleFilterColumnChange}
      />

      <DataTableFilterPopover
        anchorElement={filterAnchor}
        id={filterPopoverId}
        isOpen={Boolean(activeFilterColumnId)}
        motionMode={filterMotionMode}
        onClose={closeFilters}
      >
        <UsersFilterForm
          initialValues={filters}
          organizations={organizations}
          onApply={(nextFilters) => {
            applyFilters(nextFilters);
            closeFilters();
          }}
          onReset={() => {
            resetFilters();
            closeFilters();
          }}
          {...(focusField ? { initialFocusField: focusField } : {})}
        />
      </DataTableFilterPopover>
    </div>
  );
}
