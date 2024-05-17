"use client";

import { Button } from "@/components/ui/button";
import {
   Command,
   CommandEmpty,
   CommandGroup,
   CommandInput,
   CommandItem,
} from "@/components/ui/command";
import {
   FormControl,
   FormDescription,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
} from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CheckIcon, ChevronsUpDownIcon } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { FormSchema } from "./schema";

const languages = [
   { label: "English", value: "en" },
   { label: "French", value: "fr" },
   { label: "German", value: "de" },
   { label: "Spanish", value: "es" },
   { label: "Portuguese", value: "pt" },
   { label: "Russian", value: "ru" },
   { label: "Japanese", value: "ja" },
   { label: "Korean", value: "ko" },
   { label: "Chinese", value: "zh" },
] as const;

type Props = {
   form: UseFormReturn<FormSchema>;
};

export function FormExtractor({ form }: Props) {
   return (
      <div className="space-y-6">
         <FormField
            control={form.control}
            name="language"
            render={({ field }) => (
               <FormItem className="flex flex-col">
                  <FormLabel>Language</FormLabel>
                  <Popover>
                     <PopoverTrigger asChild>
                        <FormControl>
                           <Button
                              variant="outline"
                              role="combobox"
                              className={cn(
                                 "w-[200px] justify-between",
                                 !field.value && "text-muted-foreground",
                              )}
                           >
                              {field.value
                                 ? languages.find((language) => language.value === field.value)
                                      ?.label
                                 : "Select language"}
                              <ChevronsUpDownIcon className="ml-2 size-4 shrink-0 opacity-50" />
                           </Button>
                        </FormControl>
                     </PopoverTrigger>
                     <PopoverContent className="w-[200px] p-0">
                        <Command>
                           <CommandInput placeholder="Search framework..." className="h-9" />
                           <CommandEmpty>No framework found.</CommandEmpty>
                           <CommandGroup>
                              {languages.map((language) => (
                                 <CommandItem
                                    value={language.label}
                                    key={language.value}
                                    onSelect={() => {
                                       form.setValue("language", language.value);
                                    }}
                                 >
                                    {language.label}
                                    <CheckIcon
                                       className={cn(
                                          "ml-auto size-4",
                                          language.value === field.value
                                             ? "opacity-100"
                                             : "opacity-0",
                                       )}
                                    />
                                 </CommandItem>
                              ))}
                           </CommandGroup>
                        </Command>
                     </PopoverContent>
                  </Popover>
                  <FormDescription>
                     This is the language that will be used in the dashboard.
                  </FormDescription>
                  <FormMessage />
               </FormItem>
            )}
         />
         <Button type="submit">Submit</Button>
      </div>
   );
}
