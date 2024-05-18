import { Button } from "@/components/ui/button";
import { UseTable } from "@/lib/use-table";
import { cn } from "@/lib/utils";
import { ChevronRightIcon } from "lucide-react";
import { Row } from "./columns";

export const CellExpand = ({ row, table }: { row: Row; table: UseTable<Row> }) => {
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
};
