import { useMemo, useState, type HTMLAttributes, type ReactNode } from "react";

type Filters<T> = Partial<Record<keyof T, string> & { _global: string }>;
type SortDir = "asc" | "desc";
export type Sort = { key: string; dir: SortDir };

export type ColumnDef<T extends { id: number }> = {
   id: string;
   header?: string;
   cell: (props: { row: T }) => ReactNode;
   sortFn?: (a: T, b: T) => number;
   filterFn?: (row: T, filters: Filters<T>) => boolean;
   headerStyle?: HTMLAttributes<HTMLTableCellElement>["style"];
   headerClassName?: string;
   cellStyle?: HTMLAttributes<HTMLTableCellElement>["style"];
   cellClassName?: string;
   hidden?: boolean;
};

type Props<T extends { id: number }> = {
   /** Should be wrapped in `React.useMemo` if declared within React Component. */
   columns: ColumnDef<T>[];
   rows: T[];
   initialFilters?: Filters<T>;
   initialSort?: Sort;
};

export type UseTable<T extends { id: number }> = ReturnType<typeof useTable<T>>;

export function useTable<T extends { id: number }>({
   columns,
   rows,
   initialFilters = {},
   initialSort,
}: Props<T>) {
   const [filters, setFilters] = useState(initialFilters);
   const [sort, setSort] = useState(initialSort);

   const filteredAndSortedRows = useMemo(() => {
      let newRows = [...rows];

      // Filtering
      if (Object.values(filters).some(Boolean)) {
         newRows = newRows.filter((row) => {
            // eslint-disable-next-line
            for (let i = 0; i < columns.length; i += 1) {
               const filterFn = columns[i]?.filterFn;
               if (!filterFn) continue;
               if (!filterFn(row, filters)) return false;
            }
            return true;
         });
      }

      // Sorting
      const sortFn = sort && columns.find((col) => col.id === sort.key)?.sortFn;
      if (sortFn) {
         newRows.sort(sortFn);
         if (sort.dir === "desc") newRows.reverse();
      }

      return newRows;
   }, [columns, filters, rows, sort]);

   const visibleColumns = useMemo(() => columns.filter((column) => !column.hidden), [columns]);

   return {
      allRows: rows,
      filters,
      setFilters,
      sort,
      setSort,
      rows: filteredAndSortedRows,
      columns: visibleColumns,
   };
}
