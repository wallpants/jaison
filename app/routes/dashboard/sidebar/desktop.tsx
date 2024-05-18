import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Fragment } from "react/jsx-runtime";
import { NavItemGroup } from ".";
import { NavItem } from "./nav-item";

type Props = {
   className?: string;
   navItemGroups: NavItemGroup[];
};

export const DesktopSidebar = ({ className, navItemGroups }: Props) => (
   <div className={cn("h-full w-64 shrink-0 border-r py-2", className)}>
      {navItemGroups.map((group) => (
         <Fragment key={group.label}>
            {group.label && <h2 className="my-2 ml-8 font-bold">{group.label}</h2>}
            {group.items.map((item) => (
               <NavItem
                  key={item.to}
                  label={item.label}
                  to={item.to}
                  Icon={item.Icon}
                  iconClassName={item.iconClassName}
               />
            ))}
            <Separator className="my-4" />
         </Fragment>
      ))}
   </div>
);
