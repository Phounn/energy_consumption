import { 
  format 
} from 'date-fns'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  PaginationState,
  Table as Table_tan,
  useReactTable,
} from "@tanstack/react-table";
import { EnergyType } from "../../../../../backend/types/energy";

export const EnergyTableColumn: ColumnDef<EnergyType>[] = [
  {
    id: "id",
    accessorKey: "measureId",
    header: "measureId",
    cell: ({ row }) => `${row.original.measureId}`,
  },
  {
    id: "current",
    accessorKey: "current",
    header: "Current",
    cell: ({ row }) => `${row.original.current} A`,
  },
  {
    id: "power",
    accessorKey: "power",
    header: "Power",
    cell: ({ row }) => `${row.original.power} W`,
  },
  {
    id: "voltage",
    accessorKey: "voltage",
    header: "Voltage",
    cell: ({ row }) => `${row.original.voltage} V`,
  },
  {
    id: "createdTime",
    accessorKey: "createdTime",
    header: "CreatedTime",
    cell: ({ row }) => `${format(new Date(row.original.createdTime), "dd-MM-yyyy HH:mm")}`,
  },
];
export interface EnergySectionProps {
  tableOption: Table_tan<EnergyType>;
  pagination: PaginationState;
  onPaginationChange: (value: PaginationState) => void;
}

export const EnergyTable = (props: EnergySectionProps) => {
  return (
    <>

      <Table>
        <TableHeader>
          {props.tableOption.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="group/row">
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead
                    key={header.id}
                    colSpan={header.colSpan}
                    className={""}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>

        <TableBody>
          {props.tableOption.getRowModel().rows?.length ? (
            props.tableOption.getRowModel().rows.map((row) => (
              <TableRow key={row.id} className="group/row">
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className={""}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={EnergyTableColumn.length}
                className="h-24 text-center"
              >
                ບໍ່ມີຂໍ້ມູນ
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <Pagination>
        <PaginationContent className="flex justify-between w-full">
          <PaginationItem>
            <PaginationPrevious
              onClick={() => props.tableOption.previousPage()}
              aria-disabled={!props.tableOption.getCanPreviousPage()}
              className="cursor-pointer"
            />
          </PaginationItem>

          <PaginationItem>
            <PaginationLink isActive size={"sm"}>
              {props.pagination.pageIndex + 1}
            </PaginationLink>{" "}
            ຈາກທັງຫມົດ {props.tableOption.getPageCount()}
          </PaginationItem>

          <PaginationItem>
            <PaginationNext
              onClick={() => props.tableOption.nextPage()}
              aria-disabled={!props.tableOption.getCanNextPage()}
              className="cursor-pointer"
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </>
  );
};
