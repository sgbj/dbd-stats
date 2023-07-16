"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "./data-table-column-header";
import { Stat, UserStats } from "@prisma/client";
import Link from "next/link";

export default function getColumns(stats: Stat[]) {
  const columns: ColumnDef<UserStats>[] = stats.map((stat) => ({
    accessorKey: stat.name,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={stat.name} />
    ),
    cell: ({ row }) => <div>{row.getValue(stat.name)}</div>,
  }));

  return [
    {
      accessorKey: "personaname",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Name" />
      ),
      cell: ({ row }) => {
        return (
          <div className="font-medium min-w-[200px]">
            <Link href={`/${row.original.steamid}`}>
              {row.getValue("personaname")}
            </Link>
          </div>
        );
      },
      enableHiding: false,
    },
    ...columns,
  ] as ColumnDef<UserStats>[];
}
