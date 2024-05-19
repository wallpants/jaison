import { Button } from "@/components/ui/button";
import {
   Command,
   CommandEmpty,
   CommandGroup,
   CommandInput,
   CommandItem,
   CommandList,
   CommandSeparator,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown, LucideIcon } from "lucide-react";
import { useRef, useState } from "react";

export type ComboboxOption = {
   value: string;
   label: string;
};

type Props = {
   label: string;
   inputLabel: string;
   options: ComboboxOption[];
   className?: string | undefined;
   value: string;
   onValueChange: (value: string) => void;
   lastOption?: {
      label: string;
      Icon?: LucideIcon;
      iconClassName?: string;
      onClick: () => void;
   };
};

export const Combobox = ({
   label,
   inputLabel,
   options,
   className,
   value,
   onValueChange,
   lastOption,
}: Props) => {
   const buttonRef = useRef<HTMLButtonElement>(null);
   const [open, setOpen] = useState(false);

   return (
      <Popover open={open} onOpenChange={setOpen}>
         <PopoverTrigger asChild>
            <Button
               ref={buttonRef}
               variant="outline"
               role="combobox"
               aria-expanded={open}
               className={cn("w-full justify-between", className)}
            >
               {value ? options.find((option) => option.value === value)?.label : label}
               <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
            </Button>
         </PopoverTrigger>
         <PopoverContent
            className="w-[200px] p-0"
            style={{ width: buttonRef.current?.getBoundingClientRect().width }}
         >
            <Command>
               <CommandInput placeholder={inputLabel} />
               <CommandEmpty>No results found.</CommandEmpty>
               <CommandGroup>
                  <CommandList>
                     {options.map((option) => (
                        <CommandItem
                           key={option.value}
                           value={String(option.value)}
                           onSelect={(newValue) => {
                              onValueChange(newValue);
                              setOpen(false);
                           }}
                        >
                           <Check
                              className={cn(
                                 "mr-2 size-4",
                                 value === option.value ? "opacity-100" : "opacity-0",
                              )}
                           />
                           {option.label}
                        </CommandItem>
                     ))}
                  </CommandList>
               </CommandGroup>
               {lastOption && (
                  <>
                     <CommandSeparator />
                     <CommandGroup>
                        <CommandList>
                           <CommandItem
                              className="justify-center"
                              onSelect={() => {
                                 lastOption.onClick();
                                 setOpen(false);
                              }}
                           >
                              {lastOption.Icon && (
                                 <lastOption.Icon
                                    className={cn("mr-2 size-4", lastOption.iconClassName)}
                                 />
                              )}
                              {lastOption.label}
                           </CommandItem>
                        </CommandList>
                     </CommandGroup>
                  </>
               )}
            </Command>
         </PopoverContent>
      </Popover>
   );
};
