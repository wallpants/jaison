import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { useTable } from "@/lib/use-table";
import { SerializeFrom } from "@remix-run/node";
import { useRouteLoaderData } from "@remix-run/react";
import { loader } from "../../route";
import { Row, columns } from "./columns";

export const ExtractorJobsTable = ({ transcriptId }: { transcriptId: number }) => {
   const loaderData = useRouteLoaderData<SerializeFrom<typeof loader>>("routes/dashboard");
   const transcript = loaderData?.transcripts.find((t) => t.id === transcriptId);

   const table = useTable<Row>({
      rows: transcript?.extractor_jobs ?? [],
      columns,
   });

   return (
      <Table className="table-fixed">
         <TableBody>
            {table.rows.map((row) => (
               <TableRow key={row.id} className="group">
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
            ))}
         </TableBody>
      </Table>
   );
};
