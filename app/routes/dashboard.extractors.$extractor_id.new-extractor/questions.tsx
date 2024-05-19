import { Button } from "@/components/ui/button";
import {
   FormControl,
   FormDescription,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { TrashIcon } from "lucide-react";
import { Fragment, useEffect, useRef, useState } from "react";
import { useFieldArray, type UseFormReturn } from "react-hook-form";
import { FormSchema } from "./route";
import { genQuestion } from "./utils";

type Props = {
   form: UseFormReturn<FormSchema>;
   className?: string;
};

export const FormQuestions = ({ form, className }: Props) => {
   const scrollAreaRef = useRef<HTMLDivElement>(null);
   const [triggerScroll, setTriggerScroll] = useState(false);

   const formQuestions = useFieldArray({
      control: form.control,
      name: "questions",
      // we specify keyName, because default is "id",
      // and it overwrites the nanoid we assign
      keyName: "key",
   });

   useEffect(() => {
      if (triggerScroll && scrollAreaRef.current) {
         scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
         setTriggerScroll(false);
      }
   }, [triggerScroll]);

   useEffect(() => {
      const subscription = form.watch((_, { name, type }) => {
         if (name === "questions" && type === undefined && scrollAreaRef.current) {
            const isOverflowing =
               scrollAreaRef.current.clientHeight < scrollAreaRef.current.scrollHeight;
            if (isOverflowing) {
               scrollAreaRef.current.classList.add("bg-muted");
            } else {
               scrollAreaRef.current.classList.remove("bg-muted");
            }
         }
      });
      return () => {
         subscription.unsubscribe();
      };
   }, [form]);

   return (
      <div className={className}>
         <FormItem className="mb-2">
            <FormLabel
               className={cn(Boolean(form.formState.errors.questions) && "text-destructive")}
            >
               Questions
            </FormLabel>

            <FormDescription>
               Define the questions you want answered and assign a tag to identify them. Be as
               specific as possible to get better results.
               <br />
               <span className="underline">
                  <strong>Tags</strong> must be unique words with no spaces and no special
                  characters.
               </span>{" "}
               (e.g. customerName, maxAmount, callAgain)
            </FormDescription>

            <FormLabel className="ml-1 mr-4 inline-block w-[150px]">Tag</FormLabel>

            <FormLabel>Question</FormLabel>
            <FormMessage>{form.formState.errors.questions?.root?.message}</FormMessage>
         </FormItem>
         <div
            className="grid max-h-[350px] grid-cols-[150px_auto_120px] gap-4 overflow-y-scroll rounded p-1"
            ref={scrollAreaRef}
         >
            {formQuestions.fields.map((field, index, fields) => (
               <Fragment key={field.key}>
                  <FormField
                     control={form.control}
                     name={`questions.${index}.tag`}
                     render={({ field }) => (
                        <FormItem className="col-span-1 items-center">
                           <FormControl>
                              <Input {...field} spellCheck={false} />
                           </FormControl>
                           <FormMessage />
                        </FormItem>
                     )}
                  />
                  <FormField
                     control={form.control}
                     name={`questions.${index}.question`}
                     render={({ field }) => (
                        <FormItem className="col-span-1 items-center">
                           <FormControl>
                              <Input {...field} />
                           </FormControl>
                           <FormMessage />
                        </FormItem>
                     )}
                  />
                  <div className="col-span-1">
                     <Button
                        variant="ghost"
                        onClick={(event) => {
                           // event.preventDefault() so form isn't submitted
                           event.preventDefault();
                           if (fields.length === 1) {
                              formQuestions.update(index, genQuestion());
                              form.clearErrors(`questions.${index}`);
                           } else {
                              formQuestions.remove(index);
                           }
                        }}
                     >
                        <TrashIcon className="mr-2 size-4 text-destructive" />
                        Remove
                     </Button>
                  </div>
               </Fragment>
            ))}
            <Input
               onFocus={() => {
                  formQuestions.append(genQuestion(), {
                     shouldFocus: true,
                     focusName: `questions.${formQuestions.fields.length}.tag`,
                  });
                  // We trigger scrolling with state variable,
                  //  because we need the scrolling to happen
                  //  after a rerender
                  setTriggerScroll(true);
               }}
            />
            <Input
               onFocus={() => {
                  formQuestions.append(genQuestion(), {
                     shouldFocus: true,
                     focusName: `questions.${formQuestions.fields.length}.question`,
                  });
                  // We trigger scrolling with state variable,
                  //  because we need the scrolling to happen
                  //  after a rerender
                  setTriggerScroll(true);
               }}
            />
            <div />
         </div>
      </div>
   );
};
