import { Outlet, useParams } from "@remix-run/react";

export default function Extractor() {
   const params = useParams();

   return (
      <div>
         <h1>Extractor</h1>
         <h1>{params["extractor_id"]}</h1>
         <Outlet />
      </div>
   );
}
