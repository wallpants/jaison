import { type UseTable } from "../lib/use-table";
import { cn } from "../lib/utils";
import { DataTableColumnHeader } from "./data-table-column-header";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";

type Props<T extends { id: number }> = {
   table: UseTable<T>;
   containerClassName?: string;
   tableClassName?: string;
};

export const DataTable = <T extends { id: number }>({
   table,
   containerClassName,
   tableClassName,
}: Props<T>) => (
   <div className={cn("overflow-auto rounded-md border", containerClassName)}>
      <Table className={cn("table-fixed", tableClassName)}>
         <TableHeader>
            <TableRow>
               {table.columns.map((column) => (
                  <TableHead
                     key={column.id}
                     style={column.headerStyle}
                     className={column.headerClassName}
                  >
                     {column.header ? (
                        <DataTableColumnHeader
                           title={column.header}
                           columns={table.columns}
                           columnId={column.id}
                           sort={table.sort}
                           setSort={table.setSort}
                        />
                     ) : null}
                  </TableHead>
               ))}
            </TableRow>
         </TableHeader>
         <TableBody>
            {table.rows.length ? (
               table.rows.map((row) => (
                  <TableRow key={row.id}>
                     {table.columns.map((column) => (
                        <TableCell
                           key={column.id}
                           style={column.cellStyle}
                           className={column.cellClassName}
                        >
                           <column.cell row={row} table={table} />
                        </TableCell>
                     ))}
                  </TableRow>
               ))
            ) : (
               <TableRow>
                  <TableCell colSpan={table.columns.length} className="h-24 text-center">
                     No results.
                  </TableCell>
               </TableRow>
            )}
         </TableBody>
      </Table>
   </div>
);
