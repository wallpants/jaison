import { SelectExtractor } from "@/schemas/database";
import {
   LayoutDashboardIcon,
   LogOutIcon,
   LucideIcon,
   PlusCircleIcon,
   WorkflowIcon,
} from "lucide-react";
import { useMemo } from "react";
import { DesktopSidebar } from "./desktop";
import { MobileSidebar } from "./mobile";

export type NavItemGroup = {
   label: string;
   items: {
      label: string;
      to: string;
      Icon: LucideIcon;
      iconClassName?: string;
   }[];
};

export const Sidebar = ({ extractors }: { extractors: SelectExtractor[] }) => {
   const navItemGroups: NavItemGroup[] = useMemo(
      () => [
         {
            label: "Audios",
            items: [
               {
                  label: "Uploaded Audios",
                  to: "/dashboard",
                  Icon: LayoutDashboardIcon,
               },
            ],
         },
         {
            label: "Extractors",
            items: (
               extractors.map((extractor) => ({
                  label: extractor.name,
                  to: `/dashboard/extractors/${extractor.id}`,
                  Icon: WorkflowIcon,
               })) as NavItemGroup["items"]
            ).concat({
               label: "New Extractor",
               to: "/dashboard/new-extractor",
               Icon: PlusCircleIcon,
               iconClassName: "text-success",
            }),
         },
         {
            label: "User",
            items: [
               {
                  label: "Lougout",
                  to: "/logout",
                  Icon: LogOutIcon,
               },
            ],
         },
      ],
      [extractors],
   );
   return (
      <>
         <DesktopSidebar className="hidden md:block" navItemGroups={navItemGroups} />
         <MobileSidebar className="flex md:hidden" navItemGroups={navItemGroups} />
      </>
   );
};
