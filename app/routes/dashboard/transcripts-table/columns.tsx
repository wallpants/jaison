import { Column } from "@/lib/use-table";
import { type SerializeFrom } from "@remix-run/node";
import { type loader } from "../route";
import { CellExpand } from "./cell-expand";

export type Row = SerializeFrom<typeof loader>["transcripts"][number];

export const columns: Column<Row>[] = [
   {
      id: "expand",
      headerStyle: { width: 60 },
      cell: CellExpand,
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
      cell: ({ row }) => row.status,
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
];
