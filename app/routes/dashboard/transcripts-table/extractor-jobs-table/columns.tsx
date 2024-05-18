import { TableRowActions } from "@/components/table-row-actions";
import { UseTableColumn } from "@/lib/use-table";
import { TrashIcon } from "lucide-react";
import { Row as TranscriptsRow } from "../columns";

export type Row = TranscriptsRow["extractor_jobs"][number];

export const columns: UseTableColumn<Row>[] = [
   {
      id: "expand",
      cellStyle: { width: 60 },
      cell: () => "",
   },
   {
      id: "name",
      header: "Name",
      cellStyle: { width: 200 },
      cell: ({ row }) => row.extractor.name,
   },
   {
      id: "status",
      header: "Status",
      cellStyle: { width: 150 },
      cell: ({ row }) => row.status,
   },
   {
      id: "created_at_time",
      header: "Created",
      cellStyle: { width: 100 },
      cell: ({ row }) => {
         const formatter = new Intl.DateTimeFormat("en-US", {
            hour: "numeric",
            minute: "numeric",
            hour12: true,
         });
         return formatter.format(new Date(row.created_at));
      },
   },
   {
      id: "created_at_date",
      cellStyle: { width: 100 },
      cell: ({ row }) => {
         const formatter = new Intl.DateTimeFormat("en-US", {
            month: "short",
            day: "numeric",
         });
         return formatter.format(new Date(row.created_at));
      },
   },
   {
      id: "actions",
      cellStyle: { width: 50 },
      cellClassName: "py-0",
      cell: ({ row }) => (
         <TableRowActions
            actions={[
               {
                  label: "Delete",
                  Icon: TrashIcon,
                  iconClassName: "text-destructive",
                  callback: () => console.log("delete: ", row.id),
               },
            ]}
         />
      ),
   },
];
