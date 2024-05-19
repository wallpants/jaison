import { TableRowActions } from "@/components/table-row-actions";
import { UseTableColumn } from "@/lib/use-table";
import { SelectExtractor } from "@/schemas/database";
import { SerializeFrom } from "@remix-run/node";
import { useSubmit } from "@remix-run/react";
import { TrashIcon } from "lucide-react";
import { loader } from "./route";

export type Row = SerializeFrom<typeof loader>["extractorJobs"][number];

const ActionsCell = ({ row }: { row: Row }) => {
   const submit = useSubmit();

   function handleDelete() {
      submit(null, {
         action: `${row.id}/delete`,
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

export const generateColumns = (extractor: SelectExtractor): UseTableColumn<Row>[] => [
   {
      id: "transcript",
      header: "Audio",
      cell: ({ row }) => row.transcript.name,
   },
   ...extractor.questions.map(
      (question) =>
         ({
            id: question.tag,
            header: question.tag,
            cell: ({ row }) => row.answers?.data.find((ans) => ans.tag === question.tag)?.answer,
         }) satisfies UseTableColumn<Row>,
   ),
   {
      id: "actions",
      cellClassName: "py-0",
      cell: ActionsCell,
   },
];
