import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "@remix-run/react";

type Props = {
   userEmail: string | undefined;
};

export const TopBar = ({ userEmail }: Props) => {
   const location = useLocation();

   return (
      <div className="flex h-12 shrink-0 items-center justify-between border-b-2 px-4 py-2">
         <Link to={location.pathname.startsWith("/dashboard") ? "/dashboard" : "/"}>
            <h2 className="text-xl font-bold">
               Star<span className="text-primary">ter</span>
            </h2>
         </Link>
         <div className="flex items-center">
            {userEmail ? (
               <Button variant="link" asChild>
                  <Link to="/dashboard">{userEmail}</Link>
               </Button>
            ) : (
               <Button variant="link" asChild>
                  <Link to="/login">Login</Link>
               </Button>
            )}
            <ModeToggle />
         </div>
      </div>
   );
};
