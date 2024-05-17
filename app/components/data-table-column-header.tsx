import { ArrowDownIcon, ArrowDownUpIcon, ArrowUpIcon } from "lucide-react";
import { type UseTable } from "../lib/use-table";
import { cn } from "../lib/utils";
import { Button } from "./ui/button";

type DataTableColumnHeaderProps<T extends { id: number }> = {
   columns: UseTable<T>["columns"];
   sort: UseTable<T>["sort"];
   setSort: UseTable<T>["setSort"];
   columnId: string;
   title: string;
} & React.HTMLAttributes<HTMLDivElement>;

export function DataTableColumnHeader<T extends { id: number }>({
   columns,
   sort,
   setSort,
   columnId,
   title,
   className,
}: DataTableColumnHeaderProps<T>) {
   const column = columns.find((col) => col.id === columnId);
   if (!column?.sortFn) {
      return <div className={cn(className)}>{title}</div>;
   }

   const sortedDir = sort?.key === columnId ? sort.dir : null;

   function cycleSort() {
      if (sortedDir === null) setSort({ key: columnId, dir: "asc" });
      if (sortedDir === "asc") setSort({ key: columnId, dir: "desc" });
      if (sortedDir === "desc") setSort(undefined);
   }

   return (
      <div className={cn("flex items-center space-x-2", className)}>
         <Button
            variant="ghost"
            size="sm"
            className="-ml-3 h-8 data-[state=open]:bg-accent"
            onClick={cycleSort}
         >
            <span>{title}</span>
            {sortedDir === "desc" ? (
               <ArrowDownIcon className="ml-2 size-4" />
            ) : sortedDir === "asc" ? (
               <ArrowUpIcon className="ml-2 size-4" />
            ) : (
               <ArrowDownUpIcon className="ml-2 size-4" />
            )}
         </Button>
      </div>
   );
}
