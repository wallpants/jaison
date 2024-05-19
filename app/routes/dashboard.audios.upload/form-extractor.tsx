import { Combobox, ComboboxOption } from "@/components/combobox";
import {
   FormControl,
   FormDescription,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
} from "@/components/ui/form";
import { SelectExtractor } from "@/schemas/database";
import { useMemo } from "react";
import { UseFormReturn } from "react-hook-form";
import { FormSchema } from "./schema";

type Props = {
   form: UseFormReturn<FormSchema>;
   extractors: SelectExtractor[];
   className?: string;
};

export function FormExtractor({ form, extractors, className }: Props) {
   const options: ComboboxOption[] = useMemo(
      () =>
         extractors.map((e) => ({
            label: e.name,
            value: String(e.id),
         })),
      [extractors],
   );

   return (
      <FormField
         name="extractorId"
         control={form.control}
         render={({ field }) => (
            <FormItem className={className}>
               <FormLabel>Extractor</FormLabel>
               <FormDescription>Select an Extractor to process your data.</FormDescription>
               <FormControl>
                  <Combobox
                     label="Select an extractor..."
                     inputLabel="Search..."
                     options={options}
                     className={className}
                     value={String(field.value)}
                     onValueChange={field.onChange}
                  />
               </FormControl>
               <FormMessage />
            </FormItem>
         )}
      />
   );
}
