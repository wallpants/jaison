import { LoadingIndicator } from "@/components/loading-indicator";
import { TableRowActions } from "@/components/table-row-actions";
import { Button } from "@/components/ui/button";
import { UseTableColumn } from "@/lib/use-table";
import { SelectExtractor } from "@/schemas/database";
import { SerializeFrom } from "@remix-run/node";
import { Link, useSubmit } from "@remix-run/react";
import { TrashIcon, XCircleIcon } from "lucide-react";
import { loader } from "./route";

export type Row = SerializeFrom<typeof loader>["extractorJobs"][number];

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

export const generateColumns = (extractor: SelectExtractor): UseTableColumn<Row>[] => [
   {
      id: "transcript",
      headerStyle: { width: 180 },
      header: "Audio",
      cell: ({ row: extractorJob }) => extractorJob.transcript.name,
   },
   ...extractor.questions.map(
      (question) =>
         ({
            id: question.tag,
            headerStyle: { width: 200 },
            header: question.tag,
            cellClassName: "py-0",
            cell: ({ row: extractorJob }) => {
               if (extractorJob.status === "failed")
                  return (
                     <span className="flex items-center gap-x-2">
                        <XCircleIcon size={18} className="text-destructive" />
                     </span>
                  );
               if (extractorJob.status !== "completed") {
                  return <LoadingIndicator size={18} />;
               }
               return (
                  <Button variant="link" className="h-fit text-wrap" asChild>
                     <Link
                        to={`transcript/${extractorJob.transcript_id}/${extractorJob.id}/${question.tag}`}
                     >
                        {extractorJob.answers?.data.find((ans) => ans.tag === question.tag)?.answer}
                     </Link>
                  </Button>
               );
            },
         }) satisfies UseTableColumn<Row>,
   ),
   {
      id: "actions",
      headerStyle: { width: 100 },
      cellClassName: "py-0",
      cell: ActionsCell,
   },
];
