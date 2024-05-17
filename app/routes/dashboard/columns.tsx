import { ColumnDef } from "@/lib/use-table";
import { type SerializeFrom } from "@remix-run/node";
import { type loader } from "./route";

export type Row = SerializeFrom<typeof loader>["transcripts"][number];

export const columns: ColumnDef<Row>[] = [
   {
      id: "id",
      headerStyle: {
         width: 100,
      },
      cell: () => "something",
      cellStyle: {
         paddingTop: 10,
         paddingBottom: 10,
      },
   },
   {
      id: "name",
      header: "Name",
      headerStyle: {
         width: 120,
      },
      cell: ({ row }) => row.name,
   },
   {
      id: "status",
      header: "Status",
      headerStyle: {
         width: 120,
      },
      cell: ({ row }) => row.status,
   },
];
