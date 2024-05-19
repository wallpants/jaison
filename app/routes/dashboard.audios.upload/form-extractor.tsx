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
import { useNavigate, useSearchParams } from "@remix-run/react";
import { PlusCircleIcon } from "lucide-react";
import { useEffect, useMemo } from "react";
import { UseFormReturn } from "react-hook-form";

type Props<T extends { extractorId: number }> = {
   form: UseFormReturn<T>;
   extractors: SelectExtractor[];
   className?: string;
};

export function FormExtractor<T extends { extractorId: number }>({
   form,
   extractors,
   className,
}: Props<T>) {
   const navigate = useNavigate();
   const [searchParams] = useSearchParams();

   const options: ComboboxOption[] = useMemo(
      () =>
         extractors.map((e) => ({
            label: e.name,
            value: String(e.id),
         })),
      [extractors],
   );

   useEffect(() => {
      const extractorId = searchParams.get("extractor_id");
      // @ts-expect-error extractorId is valid
      if (extractorId) form.setValue("extractorId", Number(extractorId));
   }, [form, searchParams]);

   return (
      <FormField
         // @ts-expect-error extractorId is valid
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
                     lastOption={{
                        label: "New Extractor",
                        onClick: () => navigate("new-extractor"),
                        Icon: PlusCircleIcon,
                        iconClassName: "text-success",
                     }}
                  />
               </FormControl>
               <FormMessage />
            </FormItem>
         )}
      />
   );
}
