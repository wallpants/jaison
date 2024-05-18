import {
   FormControl,
   FormDescription,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import { FormSchema } from "./schema";

type Props = {
   form: UseFormReturn<FormSchema>;
   className?: string;
};

export const FormName = ({ form, className }: Props) => {
   const audioFileName = form.watch("audioFile").name;

   useEffect(() => {
      // If we add a file and we have not set a name,
      // derive name from filename
      const name = form.getValues("name");
      if (!name && audioFileName) {
         let newName = audioFileName
            // remove file extension
            .split(".")
            .slice(0, -1)
            .join(" ")
            .replaceAll("-", " ");
         // Capitalize
         newName = newName.charAt(0).toUpperCase() + newName.slice(1);
         form.setValue("name", newName);
      }
   }, [audioFileName, form]);

   return (
      <FormField
         name="name"
         control={form.control}
         render={({ field }) => (
            <FormItem className={className}>
               <FormLabel>Name</FormLabel>
               <FormDescription>Name to identify your audio.</FormDescription>
               <FormControl>
                  <Input {...field} />
               </FormControl>
               <FormMessage />
            </FormItem>
         )}
      />
   );
};
