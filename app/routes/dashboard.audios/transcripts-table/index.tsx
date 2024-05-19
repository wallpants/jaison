import { DataTableColumnHeader } from "@/components/data-table-column-header";
import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
} from "@/components/ui/table";
import { UseTable } from "@/lib/use-table";
import { cn } from "@/lib/utils";
import { Fragment } from "react/jsx-runtime";
import { Row } from "./columns";
import { ExtractorJobsTable } from "./extractor-jobs-table";

type Props = {
   table: UseTable<Row>;
   containerClassName?: string;
   tableClassName?: string;
};

export const TranscriptsTable = ({ table, containerClassName, tableClassName }: Props) => {
   return (
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
                     <Fragment key={row.id}>
                        <TableRow className="group">
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

                        {table.getIsExpanded(row.id) && (
                           <TableRow className="bg-secondary/30">
                              <TableCell colSpan={table.columns.length} className="p-0">
                                 <ExtractorJobsTable extractorJobs={row.extractor_jobs} />
                              </TableCell>
                           </TableRow>
                        )}
                     </Fragment>
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
};
