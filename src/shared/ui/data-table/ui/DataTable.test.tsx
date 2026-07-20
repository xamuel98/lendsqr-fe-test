import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { DataTable } from "./DataTable";
import { DataTablePagination } from "./DataTablePagination";

type TestRecord = {
  id: number;
  name: string;
  score: number;
};

const records: TestRecord[] = [
  { id: 1, name: "Ada", score: 10 },
  { id: 2, name: "Tosin", score: 20 }
];
const noRecords: TestRecord[] = [];

describe("DataTable", () => {
  it("renders arbitrary records with accessor and custom cells", () => {
    render(
      <DataTable
        columns={[
          { accessor: "name", header: "Name", id: "name" },
          {
            cell: (record) => `${record.score} points`,
            header: "Score",
            id: "score"
          }
        ]}
        getRowId={(record) => record.id}
        records={records}
      />
    );

    expect(screen.getByRole("table")).toBeInTheDocument();
    expect(screen.getByText("Ada")).toBeInTheDocument();
    expect(screen.getByText("20 points")).toBeInTheDocument();
  });

  it("renders optional action cells and loading rows", () => {
    const { container, rerender } = render(
      <DataTable
        columns={[{ accessor: "name", header: "Name", id: "name" }]}
        getRowId={(record) => record.id}
        records={records}
        renderRowActions={(record) => <button type="button">Open {record.name}</button>}
      />
    );

    expect(screen.getByRole("button", { name: "Open Ada" })).toBeInTheDocument();

    rerender(
      <DataTable
        columns={[{ accessor: "name", header: "Name", id: "name" }]}
        getRowId={(record) => record.id}
        isLoading
        loadingRowCount={2}
        records={noRecords}
      />
    );

    expect(container.querySelectorAll("span[class*='skeleton']")).toHaveLength(2);
  });

  it("renders the matching empty-state illustration", () => {
    const { container, rerender } = render(
      <DataTable
        columns={[{ accessor: "name", header: "Name", id: "name" }]}
        getRowId={(record) => record.id}
        records={noRecords}
      />
    );

    expect(container.querySelector('img[src*="empty-record"]')).toBeInTheDocument();
    expect(
      container.querySelectorAll("[data-empty-state-skeleton-row='true']")
    ).toHaveLength(10);

    rerender(
      <DataTable
        columns={[{ accessor: "name", header: "Name", id: "name" }]}
        getRowId={(record) => record.id}
        hasActiveFilters
        records={noRecords}
      />
    );

    expect(container.querySelector('img[src*="empty-search"]')).toBeInTheDocument();
  });

  it("renders a reset action when filters return no records", async () => {
    const user = userEvent.setup();
    const resetFilters = vi.fn();

    render(
      <DataTable
        columns={[{ accessor: "name", header: "Name", id: "name" }]}
        getRowId={(record) => record.id}
        hasActiveFilters
        noResultsAction={
          <button type="button" onClick={resetFilters}>
            Reset filters
          </button>
        }
        records={noRecords}
      />
    );

    await user.click(screen.getByRole("button", { name: "Reset filters" }));

    expect(resetFilters).toHaveBeenCalledOnce();
  });

  it("hides pagination when there are no records to render", () => {
    render(
      <DataTable
        columns={[{ accessor: "name", header: "Name", id: "name" }]}
        getRowId={(record) => record.id}
        pagination={{
          onPageChange: vi.fn(),
          onPageSizeChange: vi.fn(),
          page: 1,
          pageSize: 10,
          totalRecords: 0
        }}
        records={noRecords}
      />
    );

    expect(screen.queryByLabelText("Records per page")).not.toBeInTheDocument();
  });

  it("renders a retry action for request failures", async () => {
    const user = userEvent.setup();
    const onRetry = vi.fn();

    render(
      <DataTable
        columns={[{ accessor: "name", header: "Name", id: "name" }]}
        errorState="Unable to load records."
        getRowId={(record) => record.id}
        isError
        onRetry={onRetry}
        records={noRecords}
      />
    );

    await user.click(screen.getByRole("button", { name: "Try again" }));

    expect(onRetry).toHaveBeenCalledOnce();
  });

  it("hides column headers when request failures are shown", () => {
    render(
      <DataTable
        columns={[
          {
            accessor: "name",
            filterLabel: "Name",
            header: "Name",
            id: "name",
            isFilterable: true
          }
        ]}
        errorState="Unable to load records."
        getRowId={(record) => record.id}
        isError
        records={noRecords}
      />
    );

    expect(screen.queryByRole("columnheader", { name: /name/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Filter by Name" })).not.toBeInTheDocument();
    expect(screen.getByText("Unable to load records.")).toBeInTheDocument();
  });

  it("renders filterable headers as buttons", async () => {
    const user = userEvent.setup();
    const onFilterColumnChange = vi.fn();

    render(
      <DataTable
        columns={[
          {
            accessor: "name",
            filterLabel: "Name",
            header: "Name",
            id: "name",
            isFilterable: true
          }
        ]}
        getRowId={(record) => record.id}
        records={records}
        onFilterColumnChange={onFilterColumnChange}
      />
    );

    await user.click(screen.getByRole("button", { name: "Filter by Name" }));

    expect(onFilterColumnChange).toHaveBeenCalledWith(
      "name",
      expect.any(HTMLButtonElement),
      "default"
    );
  });

  it("marks keyboard-triggered filter popovers as instant", async () => {
    const user = userEvent.setup();
    const onFilterColumnChange = vi.fn();

    render(
      <DataTable
        columns={[
          {
            accessor: "name",
            filterLabel: "Name",
            header: "Name",
            id: "name",
            isFilterable: true
          }
        ]}
        getRowId={(record) => record.id}
        records={records}
        onFilterColumnChange={onFilterColumnChange}
      />
    );

    screen.getByRole("button", { name: "Filter by Name" }).focus();
    await user.keyboard("{Enter}");

    expect(onFilterColumnChange).toHaveBeenCalledWith(
      "name",
      expect.any(HTMLButtonElement),
      "instant"
    );
  });

});

describe("DataTablePagination", () => {
  it("disables previous on the first page and changes the page size", async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();
    const onPageSizeChange = vi.fn();

    render(
      <DataTablePagination
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
        page={1}
        pageSize={10}
        totalRecords={50}
      />
    );

    expect(screen.getByRole("button", { name: "Go to previous page" })).toBeDisabled();

    await user.selectOptions(screen.getByLabelText("Records per page"), "25");
    await user.click(screen.getByRole("button", { name: "Go to next page" }));

    expect(onPageSizeChange).toHaveBeenCalledWith(25);
    expect(onPageChange).toHaveBeenCalledWith(2);
    expect(screen.getByRole("button", { current: "page", name: "1" })).toBeInTheDocument();
  });
});
