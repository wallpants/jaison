import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Column, useTable } from "@/lib/use-table";
import { Row as TranscriptsRow } from "../columns";

type Row = TranscriptsRow["extractor_jobs"][number];

const columns: Column<Row>[] = [
   {
      id: "id",
      cell: () => "id",
   },
];

export const ExtractorJobsTable = ({ extractorJobs }: { extractorJobs: Row[] }) => {
   const table = useTable<Row>({
      rows: extractorJobs,
      columns,
   });

   console.log("table: ", table);

   return (
      <Table>
         <TableBody>
            <TableRow>
               <TableCell>Hello world</TableCell>
            </TableRow>
         </TableBody>
      </Table>
   );
};
