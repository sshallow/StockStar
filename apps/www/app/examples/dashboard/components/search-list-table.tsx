"use client"

import { CaretSortIcon } from "@radix-ui/react-icons"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import Link from "next/link"
import * as React from "react"

import { Button } from "@/registry/new-york/ui/button"
import { Checkbox } from "@/registry/new-york/ui/checkbox"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/registry/new-york/ui/table"

export interface Stock {
  type?: string
  id: string
  sec_cd: string
  sec_nm: string
  x: string
  y: string
  open: string
  close: string
  high: string
  low: string
  first: string
  second: string
  third: string
}

interface TypeLabelAndStyleMap {
  [key: string]: { label: string; className: string };
}

const typeToLabelAndStyle: TypeLabelAndStyleMap = {
  hl_up: { label: "涨停", className: "bg-red-500 " },
  hl_low: { label: "跌停", className: "bg-green-500 " },
  // hl_zero: { label: "平盘", className: "bg-yellow-500 text-white" },
  hl_newHigh: { label: "新高", className: "bg-blue-500 " },
  hl_newLow: { label: "新低", className: "bg-yellow-500 " },
  hl_newStock: { label: "新股", className: "bg-purple-500 " },
};


export const columns: ColumnDef<Stock>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "type",
    header: "股票",
    cell: ({ row }) => {
      const type = row.getValue("type") as string;
      const { label, className } = typeToLabelAndStyle[type] || { label: type, className: "" };
      return <div className={`capitalize text-white text-center rounded p-1 text-sm font-bold w-10 ${className}`}>{label}</div>;
    },
  },
  {
    accessorKey: "sec_nm",
    header: "代码",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("sec_nm")}{row.getValue("sec_cd")}</div>
    ),
  },

  {
    accessorKey: "first",
    header: () => <div className="">涨幅</div>,
    cell: ({ row }) => {
      const first = parseFloat(row.getValue("first"))

      // Format the amount as a dollar amount
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(first)

      return <div className=" font-medium">{first}%</div>
    },
  },
  {
    accessorKey: "x",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="px-0"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          横轴-值
          <CaretSortIcon className="h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div className="lowercase">{row.getValue("x")}</div>,
  },
  {
    accessorKey: "y",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="px-0"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          纵轴-值
          <CaretSortIcon className="h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div className="lowercase">{row.getValue("y")}</div>,
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const payment = row.original

      return (
        <Button variant="link">
          {" "}
          <Link
            href="https://quote.eastmoney.com/sh600519.html"
            target="_blank"
          >
            行情
          </Link>
        </Button>
      )
    },
  },
]

// export function SearchListTable(data: Stock[]) {
export function SearchListTable({ data }: { data: Stock[] }) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  return (
    <div className="w-full">
      {/* <div className="flex items-center py-4">
        <Input
          placeholder="股票代码..."
          value={(table.getColumn("sec_cd")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("sec_cd")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
      </div> */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  无结果
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          已选中 {table.getFilteredSelectedRowModel().rows.length} 条/共 {table.getFilteredRowModel().rows.length} 条记录
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            前页
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            后页
          </Button>
        </div>
      </div>
    </div>
  )
}
