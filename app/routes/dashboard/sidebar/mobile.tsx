import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { PanelRightCloseIcon } from "lucide-react";
import { Fragment, useState } from "react";
import { NavItemGroup } from ".";
import { NavItem } from "./nav-item";

type Props = {
   className?: string;
   navItemGroups: NavItemGroup[];
};

export const MobileSidebar = ({ className, navItemGroups }: Props) => {
   const [open, setOpen] = useState(false);

   return (
      <Sheet open={open} onOpenChange={setOpen}>
         <SheetTrigger asChild>
            <Button variant="outline" size="icon" className={cn("fixed left-2 top-1.5", className)}>
               <PanelRightCloseIcon className="size-5" />
            </Button>
         </SheetTrigger>
         <SheetContent side="left" className="flex flex-col">
            <nav className="grid gap-2 text-lg font-medium">
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
            </nav>
         </SheetContent>
      </Sheet>
   );
};
