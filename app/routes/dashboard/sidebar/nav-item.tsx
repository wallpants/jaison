import { cn } from "@/lib/utils";
import { NavLink } from "@remix-run/react";
import { LucideIcon } from "lucide-react";

export const NavItem = ({
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
   iconClassName?: string | undefined;
}) => (
   <NavLink
      key={label}
      end={Boolean(end)}
      to={to}
      className={({ isActive }) =>
         cn(
            "mx-4 mb-1 flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-accent-foreground transition-all hover:bg-accent/50",
            isActive && "bg-accent/50",
         )
      }
   >
      <Icon className={cn("size-4", iconClassName)} />
      {label}
   </NavLink>
);
