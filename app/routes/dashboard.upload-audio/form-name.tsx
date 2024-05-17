import {
   FormControl,
   FormDescription,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { FormSchema } from "./schema";

type Props = {
   form: UseFormReturn<FormSchema>;
   className?: string;
};

export const FormName = ({ form, className }: Props) => {
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
