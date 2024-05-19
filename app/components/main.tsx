import { ReactNode } from "react";

export const Main = ({ children, title }: { children: ReactNode; title: string }) => (
   <div className="mx-auto w-[95%] max-w-[1100px] overflow-auto p-6">
      <h1 className="mb-4 text-2xl font-bold">{title}</h1>
      {children}
   </div>
);
