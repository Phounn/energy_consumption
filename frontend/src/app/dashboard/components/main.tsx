"use client";
import {
  getCoreRowModel,
  PaginationState,
  useReactTable,
} from "@tanstack/react-table";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useState } from "react";
import { type DateRange } from "react-day-picker";
import { getEnergy } from "../api";
import { EnergyTable, EnergyTableColumn } from "./table";
import { CardSections, CardSectionsSSE } from "./card-section";
export const Main = () => {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from:
      new Date(new Date().getFullYear(), new Date().getMonth(), 1) || undefined,
    to:
      new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0) ||
      undefined,
  });
  const result = useQuery({
    queryKey: [
      "pagination",
      pagination.pageIndex,
      pagination.pageSize,
      "date",
      dateRange?.from,
      dateRange?.to,
    ],
    queryFn: () =>
      getEnergy({
        date: {
          startDate: dateRange?.from,
          endDate: dateRange?.to,
        },
        pagination: {
          pageIndex: pagination.pageIndex,
          pageSize: pagination.pageSize,
        },
      }),
    placeholderData: keepPreviousData,
  });

  const table = useReactTable({
    data: result.data?.rows ?? [],
    rowCount: result.data?.totalRow ?? 0,
    columns: EnergyTableColumn,
    manualPagination: true,
    state: { pagination },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
  });
  if (result.isLoading) return <p>Loading...</p>;

  if (result.error) return <p>Failed to load data</p>;
  return (
    <>
    <CardSectionsSSE></CardSectionsSSE>
      <CardSections
        dateRange={dateRange}
        setDateRage={setDateRange}
      ></CardSections>
      <div className="mb-10">
        <EnergyTable
          pagination={pagination}
          onPaginationChange={setPagination}
          tableOption={table}
        ></EnergyTable>
      </div>
    </>
  );
};
