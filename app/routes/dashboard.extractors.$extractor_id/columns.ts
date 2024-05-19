import { UseTableColumn } from "@/lib/use-table";
import { SelectExtractor } from "@/schemas/database";
import { SerializeFrom } from "@remix-run/node";
import { loader } from "./route";

export type Row = SerializeFrom<typeof loader>["extractorJobs"][number];

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
];
