import { type ColumnDef, type UseTable } from "../lib/use-table";
import { cn } from "../lib/utils";
import { DataTableColumnHeader } from "./data-table-column-header";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";

type Props<T extends { id: number }> = {
   tableColumns: ColumnDef<T>[];
   tableRows: T[];
   tableSort: UseTable<T>["sort"];
   tableSetSort: UseTable<T>["setSort"];
   containerClassName?: string;
   tableClassName?: string;
};

export const DataTable = <T extends { id: number }>({
   tableColumns,
   tableRows,
   tableSort,
   tableSetSort,
   containerClassName,
   tableClassName,
}: Props<T>) => (
   <div className={cn("overflow-auto rounded-md border", containerClassName)}>
      <Table className={cn("table-fixed", tableClassName)}>
         <TableHeader>
            <TableRow>
               {tableColumns.map((column) => (
                  <TableHead
                     key={column.id}
                     style={column.headerStyle}
                     className={column.headerClassName}
                  >
                     {column.header ? (
                        <DataTableColumnHeader
                           title={column.header}
                           columns={tableColumns}
                           columnId={column.id}
                           sort={tableSort}
                           setSort={tableSetSort}
                        />
                     ) : null}
                  </TableHead>
               ))}
            </TableRow>
         </TableHeader>
         <TableBody>
            {tableRows.length ? (
               tableRows.map((row) => (
                  <TableRow key={row.id}>
                     {tableColumns.map((column) => (
                        <TableCell
                           key={column.id}
                           style={column.cellStyle}
                           className={column.cellClassName}
                        >
                           <column.cell row={row} />
                        </TableCell>
                     ))}
                  </TableRow>
               ))
            ) : (
               <TableRow>
                  <TableCell colSpan={tableColumns.length} className="h-24 text-center">
                     No results.
                  </TableCell>
               </TableRow>
            )}
         </TableBody>
      </Table>
   </div>
);
