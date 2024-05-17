import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { SelectExtractor } from "@/schemas/database";
import { NavLink } from "@remix-run/react";
import {
   LayoutDashboardIcon,
   LogOutIcon,
   LucideIcon,
   PlusCircleIcon,
   WorkflowIcon,
} from "lucide-react";

const Item = ({
   label,
   end,
   to,
   Icon,
   iconClassName,
}: {
   label: string;
   end?: boolean;
   to: string;
   Icon: LucideIcon;
   iconClassName?: string;
}) => (
   <NavLink
      key={label}
      end={Boolean(end)}
      to={to}
      className={({ isActive }) =>
         cn(
            "mx-4 flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-accent-foreground transition-all hover:bg-accent/50",
            isActive && "bg-accent/50",
         )
      }
   >
      <Icon className={cn("size-4", iconClassName)} />
      {label}
   </NavLink>
);

export const Sidebar = ({
   className,
   extractors,
}: {
   className?: string;
   extractors: SelectExtractor[];
}) => (
   <div className={cn("h-full w-64 border-r py-2", className)}>
      <div>
         <h2 className="my-2 ml-8 font-bold">Audios</h2>
         <Item label="Uploaded Audios" to="/dashboard" Icon={LayoutDashboardIcon} />
         <Separator className="my-4" />
         <h2 className="my-2 ml-8 font-bold">Extractors</h2>
         {extractors.map((extractor) => (
            <Item
               key={extractor.id}
               label={extractor.name}
               to={`/dashboard/extractors/${extractor.id}`}
               Icon={WorkflowIcon}
            />
         ))}
         <Item
            label="New Extractor"
            to="/dashboard/new-extractor"
            Icon={PlusCircleIcon}
            iconClassName="text-success"
         />
         <Separator className="my-4" />
         <Item label="Logout" to="/logout" Icon={LogOutIcon} />
      </div>
   </div>
);
