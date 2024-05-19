import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { Link } from "@remix-run/react";

type Props = {
   userEmail: string | undefined;
};

export const TopBar = ({ userEmail }: Props) => (
   <div className="flex h-12 shrink-0 items-center justify-between border-b-2 px-4 py-2">
      <Link to={userEmail ? "/dashboard" : "/"}>
         <h2 className="ml-10 text-xl font-bold md:ml-0">
            J<span className="text-primary">ai</span>son
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
