import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useEffect, type Dispatch, type SetStateAction } from "react";
import { type MonologueSpans } from "./utils";

type Props = {
   monologueSpans: MonologueSpans;
   passagesNodeList?: NodeListOf<Element> | undefined;
   setPassagesNodeList: Dispatch<SetStateAction<NodeListOf<Element> | undefined>>;
   setAudioTime: (timestamp: string) => void;
};

export const Transcript = ({
   monologueSpans,
   passagesNodeList,
   setPassagesNodeList,
   setAudioTime,
}: Props & { className?: string }) => {
   // eslint-disable-next-line react-hooks/exhaustive-deps
   useEffect(() => {
      const documentElements = document.querySelectorAll("[data-is-answer=true]");
      if (!documentElements.length) return;
      if (passagesNodeList === undefined) {
         setPassagesNodeList(documentElements);
      }
   }, [monologueSpans, passagesNodeList, setPassagesNodeList]);

   return (
      <div className="flex flex-col gap-y-5 bg-muted p-4">
         {monologueSpans.map(({ timestamp, speaker, spans }) => {
            return (
               <div key={timestamp}>
                  <div className="flex items-center">
                     <p className="font-bold">{`${speaker} -`}</p>
                     <Button
                        variant="link"
                        className="pl-1"
                        onClick={() => setAudioTime(timestamp)}
                     >
                        {timestamp}
                     </Button>
                  </div>
                  <p>
                     {spans.map(({ isAnswer, text }, idx) => (
                        <span
                           key={idx}
                           data-is-answer={isAnswer}
                           className={cn(isAnswer && "bg-accent text-accent-foreground")}
                        >
                           {text}
                        </span>
                     ))}
                  </p>
               </div>
            );
         })}
      </div>
   );
};
