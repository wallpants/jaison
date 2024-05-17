import { Disc3Icon } from "lucide-react";
import { cn } from "../lib/utils";

export const LoadingIndicator = ({ className }: { className?: string }) => (
   <Disc3Icon className={cn("animate-spin", className)} />
);
