import { TableRowActions } from "@/components/table-row-actions";
import { UseTableColumn } from "@/lib/use-table";
import { useSubmit } from "@remix-run/react";
import { CheckCircleIcon, Disc3Icon, TrashIcon, XCircleIcon } from "lucide-react";
import { Row as TranscriptsRow } from "../columns";

export type Row = TranscriptsRow["extractor_jobs"][number];

const ActionsCell = ({ row }: { row: Row }) => {
   const submit = useSubmit();

   function handleDelete() {
      submit(null, {
         action: `/dashboard/extractor-jobs/${row.id}/delete`,
         method: "post",
         navigate: false,
      });
   }

   return (
      <TableRowActions
         disabled={!["completed", "failed"].includes(row.status)}
         actions={[
            {
               label: "Delete",
               Icon: TrashIcon,
               iconClassName: "text-destructive",
               callback: handleDelete,
            },
         ]}
      />
   );
};

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
      cell: ({ row }) => {
         let icon = <Disc3Icon className="animate-spin" size={20} />;
         switch (row.status) {
            case "failed":
               icon = <XCircleIcon className="text-destructive" size={20} />;
               break;
            case "completed":
               icon = <CheckCircleIcon className="text-success" size={20} />;
               break;
         }
         return (
            <div className="flex items-center gap-x-2">
               {icon}
               {row.status}
            </div>
         );
      },
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
      cell: ActionsCell,
   },
];
