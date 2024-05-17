import { LinksFunction } from "@remix-run/node";
import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "@remix-run/react";
import { ThemeProvider } from "next-themes";
import globalCss from "./global.css?url";

export const links: LinksFunction = () => [{ rel: "stylesheet", href: globalCss, as: "style" }];

export function Layout({ children }: { children: React.ReactNode }) {
   return (
      <html lang="en" suppressHydrationWarning>
         <head>
            <meta charSet="utf-8" />
            <meta
               name="viewport"
               content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"
            />
            <Meta />
            <Links />
         </head>
         <body>
            <ThemeProvider attribute="class">{children}</ThemeProvider>
            <ScrollRestoration />
            <Scripts />
         </body>
      </html>
   );
}

export default function App() {
   return (
      <div className="fixed inset-0 min-w-[1000px]">
         <Outlet />
      </div>
   );
}
