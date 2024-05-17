import {
   FormControl,
   FormDescription,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
} from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { UseFormReturn } from "react-hook-form";
import { FormSchema } from "./schema";

type Props = {
   form: UseFormReturn<FormSchema>;
   className?: string;
};

export const FormLanguage = ({ form, className }: Props) => {
   return (
      <FormField
         control={form.control}
         name="language"
         render={({ field }) => (
            <FormItem className={className}>
               <FormLabel>Language</FormLabel>
               <FormDescription>Audio Language.</FormDescription>
               <FormControl>
                  <RadioGroup value={field.value} onValueChange={(value) => field.onChange(value)}>
                     <div className="flex items-center space-x-2">
                        <RadioGroupItem value="en" id="en" />
                        <Label htmlFor="en">English</Label>
                     </div>
                     <div className="flex items-center space-x-2">
                        <RadioGroupItem value="es" id="es" />
                        <Label htmlFor="es">Spanish</Label>
                     </div>
                  </RadioGroup>
               </FormControl>
               <FormMessage />
            </FormItem>
         )}
      />
   );
};
