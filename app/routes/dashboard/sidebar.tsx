import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { NavLink } from "@remix-run/react";
import { LayoutDashboardIcon, LogOutIcon, LucideIcon } from "lucide-react";

const Item = ({
   label,
   end,
   to,
   Icon,
}: {
   label: string;
   end?: boolean;
   to: string;
   Icon: LucideIcon;
}) => (
   <NavLink
      key={label}
      end={Boolean(end)}
      to={to}
      className={({ isActive }) =>
         cn(
            "mx-4 flex items-center gap-3 rounded-lg px-3 py-2 text-accent-foreground transition-all hover:bg-accent/50",
            isActive && "bg-accent",
         )
      }
   >
      <Icon className="size-4" />
      {label}
   </NavLink>
);

export const Sidebar = ({ className }: { className?: string }) => {
   return (
      <div className={cn("h-full w-64 border-r py-2", className)}>
         <div>
            <Item label="Dashboard" to="/dashboard" Icon={LayoutDashboardIcon} />
            <Separator className="my-2" />
            <Item label="Logout" to="/logout" Icon={LogOutIcon} />
         </div>
      </div>
   );
};
