import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "..";
import { Data, Column } from "../../types";

interface ordersProps<T extends Data> {
  data: T[];
  columns: Column<T>[];
}

export function DataTable<T extends Data>({ data, columns }: ordersProps<T>) {
  return (
    <Table>
      <TableHeader className="bg-gray-100">
        <TableRow className="border-b border-gray-200">
          {columns.map((column) => {
            return (
              <TableHead key={column.key} className={column.headClass}>
                {column.header}
              </TableHead>
            );
          })}
        </TableRow>
      </TableHeader>

      <TableBody className="w-full">
        {data.map((row) => {
          return (
            <TableRow
              key={row.id}
              className="border-b border-gray-100 hover:bg-gray-50"
            >
              {columns.map((column) => {
                return (
                  <TableCell key={column.key} className={column.cellClass}>
                    {column.render(row)}
                  </TableCell>
                );
              })}
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
