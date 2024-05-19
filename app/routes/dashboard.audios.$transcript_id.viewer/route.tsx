import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useNavigate } from "@remix-run/react";
import { useEffect, useState } from "react";

export function loader() {
   return null;
}

export default function TranscriptDialog() {
   const navigate = useNavigate();
   const [open, setOpen] = useState(true);

   useEffect(() => {
      if (!open) setTimeout(() => navigate(".."), 100);
   }, [navigate, open]);

   return (
      <Dialog open={open} onOpenChange={setOpen}>
         <DialogContent className="w-[800px] max-w-[800px]">
            <DialogHeader>
               <DialogTitle className="px-2">
                  <span className="text-muted-foreground">Audio: </span>
                  <span>Transcript Name</span>
               </DialogTitle>
            </DialogHeader>
            <p>Hello World</p>
         </DialogContent>
      </Dialog>
   );
}
