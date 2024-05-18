import { Button } from "@/components/ui/button";
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { EllipsisIcon, LucideIcon } from "lucide-react";

interface Props {
   disabled?: boolean;
   actions: {
      label: string;
      Icon: LucideIcon;
      iconClassName?: string;
      callback: () => void | Promise<void>;
   }[];
}

export const TableRowActions = ({ disabled, actions }: Props) => {
   return (
      <div className="flex justify-center">
         <DropdownMenu>
            <DropdownMenuTrigger asChild>
               <Button
                  variant="ghost"
                  className="size-8 shrink-0 p-0 group-hover:border-primary group-hover:enabled:border data-[state=open]:bg-muted"
                  disabled={disabled}
               >
                  <EllipsisIcon className="size-4" />
                  <span className="sr-only">Open menu</span>
               </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[160px]">
               {actions.map((action, idx) => {
                  return (
                     <DropdownMenuItem key={idx} onSelect={action.callback}>
                        <action.Icon className={cn("mr-2 size-4", action.iconClassName)} />
                        {action.label}
                     </DropdownMenuItem>
                  );
               })}
            </DropdownMenuContent>
         </DropdownMenu>
      </div>
   );
};
