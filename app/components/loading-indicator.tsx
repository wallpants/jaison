import { Disc3Icon } from "lucide-react";
import { cn } from "../lib/utils";

export const LoadingIndicator = ({
   className,
   size = 24,
}: {
   className?: string;
   size?: number;
}) => <Disc3Icon size={size} className={cn("animate-spin", className)} />;
