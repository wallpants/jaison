import { TableRowActions } from "@/components/table-row-actions";
import { Button } from "@/components/ui/button";
import { UseTableColumn } from "@/lib/use-table";
import { cn } from "@/lib/utils";
import { type SerializeFrom } from "@remix-run/node";
import { useNavigate } from "@remix-run/react";
import {
   CheckCircleIcon,
   ChevronRightIcon,
   Disc3Icon,
   PlusCircleIcon,
   TrashIcon,
   XCircleIcon,
} from "lucide-react";
import { type loader } from "../route";

export type Row = SerializeFrom<typeof loader>["transcripts"][number];

const ActionsCell = ({ row }: { row: Row }) => {
   const navigate = useNavigate();

   return (
      <TableRowActions
         disabled={!["completed", "failed"].includes(row.status)}
         actions={[
            {
               label: "Extractor Job",
               Icon: PlusCircleIcon,
               iconClassName: "text-success",
               callback: () => navigate(`new-extractor-job/${row.id}`),
            },
            {
               label: "Delete",
               Icon: TrashIcon,
               iconClassName: "text-destructive",
               callback: () => console.log("delete: ", row.id),
            },
         ]}
      />
   );
};

export const columns: UseTableColumn<Row>[] = [
   {
      id: "expand",
      headerStyle: { width: 60 },
      cell: ({ row, table }) => {
         const isExpanded = table.getIsExpanded(row.id);
         return (
            <Button
               variant="ghost"
               className="size-8 p-0 group-hover:border-primary group-hover:enabled:border"
               onClick={() => table.setIsExpanded(row.id, (expanded) => !expanded)}
            >
               <ChevronRightIcon
                  className={cn("size-4 transition-transform", isExpanded && "rotate-90")}
               />
               <span className="sr-only">{isExpanded ? "Collapse" : "Expand"}</span>
            </Button>
         );
      },
      cellClassName: "py-0",
   },
   {
      id: "name",
      header: "Name",
      headerStyle: { width: 200 },
      cell: ({ row }) => row.name,
   },
   {
      id: "status",
      header: "Status",
      headerStyle: { width: 150 },
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
      headerStyle: { width: 100 },
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
      headerStyle: { width: 100 },
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
      headerStyle: { width: 50 },
      cellClassName: "py-0",
      cell: ActionsCell,
   },
];
