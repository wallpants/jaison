import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { useTable } from "@/lib/use-table";
import { SerializeFrom } from "@remix-run/node";
import { loader } from "../../route";
import { Row, columns } from "./columns";

export const ExtractorJobsTable = ({
   extractorJobs,
}: {
   extractorJobs: SerializeFrom<typeof loader>["transcripts"][number]["extractor_jobs"];
}) => {
   const table = useTable<Row>({
      rows: extractorJobs,
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
